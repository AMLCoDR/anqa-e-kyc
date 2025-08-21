package auth0

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	pb "github.com/anqaml/user/gen/proto/go/user/v1"
)

// AppMetadata is used to set tenantId in Auth0
type AppMetadata struct {
	TenantID string `json:"tenantId"`
}

// Identity is an Auth0 user identity
type Identity struct {
	Connection string `json:"connection"`
	UserID     string `json:"user_id"`
	Provider   string `json:"provider"`
	IsSocial   bool   `json:"isSocial"`
}

// CreateUser represents an Auth0 user
type CreateUser struct {
	UserID      string      `json:"user_id"`
	Email       string      `json:"email"`
	AppMetadata AppMetadata `json:"app_metadata"`
	// GivenName   string      `json:"given_name"`
	// FamilyName  string      `json:"family_name"`
	Name       string `json:"name"`
	Connection string `json:"connection"`
	Password   string `json:"password"`
	Blocked    bool   `json:"blocked"`
}

// GetUser is used to
type GetUser struct {
	CreateUser
	EmailVerified bool       `json:"email_verified"`
	Identities    []Identity `json:"identities"`
	LastLogin     string     `json:"last_login"`
	LoginsCount   int        `json:"logins_count"`
}

// AssignRole is used to assign users to an Auth0 role
type AssignRole struct {
	Users []string `json:"users"`
}

type token struct {
	AccessToken string        `json:"access_token"`
	Scope       string        `json:"scope"`
	ExpiresIn   time.Duration `json:"expires_in"`
	TokenType   string        `json:"token_type"`
}

// Auth0 is used to create a receiver for Auth0 methods
type Auth0 struct {
	// mtx *sync.RWMutex

	clientID string
	secret   string
	audience string
	tokenURL string
	token    token
}

// Role represents user roles
type Role string

const (
	// RoleOwner is the organisation owner
	RoleOwner Role = "owner"
)

// New creates a connection to Auth0
func New(clientID, secret, domain string) *Auth0 {

	a := &Auth0{
		// mtx:      &sync.RWMutex{},
		clientID: clientID,
		secret:   secret,
		audience: "https://" + domain + "/api/v2/",
		tokenURL: "https://" + domain + "/oauth/token",
	}

	if err := a.refreshToken(); err != nil {
		// kill service if cannot refresh
		log.Fatalf("Error refreshing Auth0 token: %v", err)
	}

	return a
}

// AddUser adds a new user to Auth0
func (a *Auth0) AddUser(tenant string, req *pb.SignUpRequest) (string, error) {

	// Auth0 requires these to have at least one character
	if len(req.Name) == 0 {
		req.Name = req.Email
	}

	u := CreateUser{
		Email: req.Email,
		Name:  req.Name,
		AppMetadata: AppMetadata{
			TenantID: tenant,
		},
		Connection: "Username-Password-Authentication",
		Password:   req.Password,
	}

	byt, err := json.Marshal(u)
	if err != nil {
		return "", err
	}

	areq, err := http.NewRequest(http.MethodPost, a.audience+"users", bytes.NewBuffer(byt))
	if err != nil {
		return "", err
	}
	areq.Header.Add("content-type", "application/json")
	areq.Header.Add("authorization", "Bearer "+a.token.AccessToken)

	res, err := http.DefaultClient.Do(areq)
	if err != nil {
		return "", err
	}

	defer res.Body.Close()
	byt, err = ioutil.ReadAll(res.Body)
	if err != nil {
		return "", err
	}

	if res.StatusCode != http.StatusCreated {
		return "", fmt.Errorf("an error occurred creating user: %s", string(byt))
	}

	// save Auth0 Id
	var rsp struct {
		UserID string `json:"user_id"`
	}

	if err = json.Unmarshal(byt, &rsp); err != nil {
		return "", err
	}

	return rsp.UserID, nil
}

// AssignRole assigns a user an Auth0 role
func (a *Auth0) GetRole(tenant string, roleName string) (string, error) {

	req, err := http.NewRequest(http.MethodGet, a.audience+"roles?name_filter="+roleName, nil)
	if err != nil {
		return "", err
	}
	req.Header.Add("content-type", "application/json")
	req.Header.Add("authorization", "Bearer "+a.token.AccessToken)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}

	defer res.Body.Close()
	byt, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return "", err
	}
	if res.StatusCode != http.StatusOK {
		return "", fmt.Errorf("unexpected response requesting role: %d, %s", res.StatusCode, string(byt))
	}

	var roles []struct {
		ID   string `json:"id"`
		Name string `json:"name"`
	}

	if err := json.Unmarshal(byt, &roles); err != nil {
		return "", err
	}
	if len(roles) == 0 || !strings.EqualFold(roleName, roles[0].Name) {
		return "", fmt.Errorf("no matches found for role: %s", roleName)
	}

	return roles[0].ID, nil
}

// AssignRole assigns a user an Auth0 role
func (a *Auth0) AssignRole(tenant string, role Role, auth0ID string) error {

	ar := AssignRole{
		Users: []string{auth0ID},
	}

	byt, err := json.Marshal(ar)
	if err != nil {
		return err
	}

	roleID, err := a.GetRole(tenant, string(role))
	if err != nil {
		return err
	}

	req, err := http.NewRequest(http.MethodPost, a.audience+"roles/"+roleID+"/users", bytes.NewBuffer(byt))
	if err != nil {
		return err
	}
	req.Header.Add("content-type", "application/json")
	req.Header.Add("authorization", "Bearer "+a.token.AccessToken)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}

	defer res.Body.Close()
	byt, err = ioutil.ReadAll(res.Body)
	if err != nil {
		return err
	}

	if res.StatusCode != http.StatusOK {
		return fmt.Errorf("an error occurred adding user %s to role %s: %s", auth0ID, roleID, string(byt))
	}

	return nil
}

// ListUsers adds a new user to Auth0
func (a *Auth0) ListUsers(tenant string) (*pb.QueryResponse, error) {

	// query for tenant users only
	query := url.QueryEscape("app_metadata.tenantId:" + tenant)

	req, err := http.NewRequest(http.MethodGet, a.audience+"users?q="+query, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Add("content-type", "application/json")
	req.Header.Add("authorization", "Bearer "+a.token.AccessToken)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	defer res.Body.Close()
	byt, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("an error occurred fetching users: %s", string(byt))
	}

	var users []GetUser

	if err = json.Unmarshal(byt, &users); err != nil {
		return nil, err
	}

	rsp := pb.QueryResponse{}

	for _, u := range users {
		user := pb.User{
			Auth0Id: u.UserID,
			Email:   u.Email,
			Name:    u.Name,
		}
		rsp.Users = append(rsp.Users, &user)
	}

	return &rsp, nil
}

// DeleteUser adds a new user to Auth0
func (a *Auth0) DeleteUser(tenant string, dr *pb.DeleteRequest) error {

	id := url.QueryEscape(dr.Auth0Id)

	req, err := http.NewRequest(http.MethodDelete, a.audience+"users/"+id, nil)
	if err != nil {
		return err
	}
	req.Header.Add("authorization", "Bearer "+a.token.AccessToken)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}

	if res.StatusCode != http.StatusNoContent {
		return fmt.Errorf("an error occurred deleting user: %s", dr.Auth0Id)
	}

	return nil
}

func (a *Auth0) refreshToken() error {

	var payload = struct {
		ClientID  string `json:"client_id"`
		Secret    string `json:"client_secret"`
		Audience  string `json:"audience"`
		GrantType string `json:"grant_type"`
	}{
		ClientID:  a.clientID,
		Secret:    a.secret,
		Audience:  a.audience,
		GrantType: "client_credentials",
	}

	byt, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	req, _ := http.NewRequest(http.MethodPost, a.tokenURL, bytes.NewBuffer(byt))
	req.Header.Add("content-type", "application/json")

	// a.mtx.RLock()
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}

	defer res.Body.Close()
	byt, err = ioutil.ReadAll(res.Body)
	if err != nil {
		return err
	}

	if res.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected staus code returned while authenticating: %d, %s", res.StatusCode, string(byt))
	}

	if err = json.Unmarshal(byt, &a.token); err != nil {
		return err
	}
	// a.mtx.RUnlock()

	// refresh token 10 seconds before it expires
	refreshTimer := time.NewTimer(time.Second * (a.token.ExpiresIn - 10))
	go func() {
		<-refreshTimer.C
		if err := a.refreshToken(); err != nil {
			// kill service if cannot refresh
			log.Fatalf("Error refreshing Auth0 token: %v", err)
		}
	}()

	return nil
}
