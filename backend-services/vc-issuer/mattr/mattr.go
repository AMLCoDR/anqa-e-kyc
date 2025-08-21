package mattr

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"time"

	pb "github.com/anqaml/vc-issuer/gen/proto/go/vcissuer/v1"
	"google.golang.org/protobuf/encoding/protojson"
)

type token struct {
	AccessToken string        `json:"access_token"`
	Scope       string        `json:"scope"`
	ExpiresIn   time.Duration `json:"expires_in"`
	TokenType   string        `json:"token_type"`
}

// Mattr is used to create a receiver for Mattr methods
type Mattr struct {
	// mtx *sync.RWMutex
	clientID string
	secret   string
	audience string
	tokenURL string
	token    token
}

const (
	baseURL = "https://anqa-aml-zryywt.vii.mattr.global/core/v1/credentials"
)

// New creates a connection to Mattr
func New(clientID, secret, domain string) *Mattr {

	a := &Mattr{
		// mtx:      &sync.RWMutex{},
		clientID: clientID,
		secret:   secret,
		audience: "https://vii.mattr.global",
		tokenURL: "https://auth.mattr.global/oauth/token",
		// audience: "https://" + domain + "/api/v2/",
		// tokenURL: "https://" + domain + "/oauth/token",
	}

	if err := a.refreshToken(); err != nil {
		// kill service if cannot refresh
		log.Fatalf("Error refreshing Mattr token: %v", err)
	}

	return a
}

// AddUser adds a new user to Mattr
// https://learn.mattr.global/api-reference/v1.0.1#operation/createCredential
func (a *Mattr) CreateCredential(req *pb.CreateRequest) (*pb.Credential, error) {

	byt, err := protojson.Marshal(req)
	if err != nil {
		return &pb.Credential{}, err
	}

	areq, err := http.NewRequest(http.MethodPost, baseURL, bytes.NewBuffer(byt))
	if err != nil {
		return &pb.Credential{}, err
	}
	areq.Header.Add("content-type", "application/json")
	areq.Header.Add("authorization", "Bearer "+a.token.AccessToken)

	res, err := http.DefaultClient.Do(areq)
	if err != nil {
		return &pb.Credential{}, err
	}

	defer res.Body.Close()
	byt, err = ioutil.ReadAll(res.Body)
	if err != nil {
		return &pb.Credential{}, err
	}

	if res.StatusCode != http.StatusCreated {
		return &pb.Credential{}, fmt.Errorf("an error occurred creating user: %s", string(byt))
	}

	// var cred pb.Credential
	var rsp struct {
		ID           string          `json:"id"`
		Credential   json.RawMessage `json:"credential"`
		IssuanceDate string          `json:"issuanceDate"`
	}
	if err = json.Unmarshal(byt, &rsp); err != nil {
		return &pb.Credential{}, err
	}

	var cred pb.Credential
	if err = protojson.Unmarshal(rsp.Credential, &cred); err != nil {
		return &pb.Credential{}, err
	}

	cred.Id = rsp.ID
	return &cred, nil
}

func (a *Mattr) GetCredential(id string) (*pb.Credential, error) {

	req, err := http.NewRequest(http.MethodGet, baseURL+"/"+url.QueryEscape(id), nil)
	if err != nil {
		return &pb.Credential{}, err
	}
	req.Header.Add("authorization", "Bearer "+a.token.AccessToken)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return &pb.Credential{}, err
	}

	defer res.Body.Close()
	byt, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return &pb.Credential{}, err
	}
	if res.StatusCode != http.StatusOK {
		return &pb.Credential{}, fmt.Errorf("unexpected response requesting credential: %d, %s", res.StatusCode, string(byt))
	}

	var rsp struct {
		ID           string          `json:"id"`
		Credential   json.RawMessage `json:"credential"`
		IssuanceDate string          `json:"issuanceDate"`
	}
	if err = json.Unmarshal(byt, &rsp); err != nil {
		return &pb.Credential{}, err
	}

	var cred pb.Credential
	if err = protojson.Unmarshal(rsp.Credential, &cred); err != nil {
		return &pb.Credential{}, err
	}
	cred.Id = rsp.ID

	return &cred, nil
}

// ListCredentials adds a new user to Mattr
func (a *Mattr) ListCredentials(id string) (*pb.QueryResponse, error) {

	req, err := http.NewRequest(http.MethodGet, baseURL+"?"+url.QueryEscape(id), nil)
	if err != nil {
		return &pb.QueryResponse{}, err
	}
	req.Header.Add("authorization", "Bearer "+a.token.AccessToken)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return &pb.QueryResponse{}, err
	}

	defer res.Body.Close()
	byt, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return &pb.QueryResponse{}, err
	}
	if res.StatusCode != http.StatusOK {
		return &pb.QueryResponse{}, fmt.Errorf("an error occurred fetching users: %s", string(byt))
	}

	type item struct {
		ID           string          `json:"id"`
		Credential   json.RawMessage `json:"credential"`
		IssuanceDate string          `json:"issuanceDate"`
	}
	var rsp struct {
		NextCursor string `json:"nextCursor"`
		Data       []item `json:"data"`
	}

	if err = json.Unmarshal(byt, &rsp); err != nil {
		return &pb.QueryResponse{}, err
	}

	qrsp := pb.QueryResponse{}
	for _, c := range rsp.Data {
		if len(c.Credential) == 0 {
			continue
		}
		var cred pb.Credential
		if err = protojson.Unmarshal(c.Credential, &cred); err != nil {
			return &pb.QueryResponse{}, err
		}
		cred.Id = c.ID

		qrsp.Cursor = append(qrsp.Cursor, &cred)
	}
	return &qrsp, nil
}

// DeleteCredential adds a new user to Mattr
func (a *Mattr) DeleteCredential(id string) error {

	// id := url.QueryEscape(dr.CredentialId)

	req, err := http.NewRequest(http.MethodDelete, baseURL+"/"+url.QueryEscape(id), nil)
	if err != nil {
		return err
	}
	req.Header.Add("authorization", "Bearer "+a.token.AccessToken)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}

	if res.StatusCode != http.StatusNoContent {
		return fmt.Errorf("an error occurred deleting user: %s", &pb.Credential{})
	}

	// TODO: handle error response @andrewweston
	// defer res.Body.Close()

	// byt, err := ioutil.ReadAll(res.Body)
	// if err != nil {
	// 	return err
	// }
	// if res.StatusCode != http.StatusOK {
	// 	return fmt.Errorf("unexpected response requesting credential: %d, %s", res.StatusCode, string(byt))
	// }

	// var rsp struct {
	// 	ID           string          `json:"id"`
	// 	Credential   json.RawMessage `json:"credential"`
	// 	IssuanceDate string          `json:"issuanceDate"`
	// }
	// if err = json.Unmarshal(byt, &rsp); err != nil {
	// 	return err
	// }

	return nil
}

func (a *Mattr) refreshToken() error {

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
			log.Fatalf("Error refreshing Mattr token: %v", err)
		}
	}()

	return nil
}
