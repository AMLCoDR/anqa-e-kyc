package ac

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	pb "github.com/anqaml/user/gen/proto/go/user/v1"
)

// AppMetadata is used to set tenantId in ActiveCampaign
type AppMetadata struct {
	TenantID string `json:"tenantId"`
}

// Identity is an ActiveCampaign msg identity
type Identity struct {
	Connection string `json:"connection"`
	UserID     string `json:"user_id"`
	Provider   string `json:"provider"`
	IsSocial   bool   `json:"isSocial"`
}

// Contact represents an ActiveCampaign contact
type Contact struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Phone     string `json:"phone"`
}

// FieldValue is a name/value pair used to add custom fields while creating a contact
type FieldValue struct {
	Field string `json:"field"`
	Value string `json:"value"`
}

// ContactList represents the link between a contact and a list
type ContactList struct {
	ListID    string `json:"list"`
	ContactID string `json:"contact"`
	Status    string `json:"status"`
}

// CreateContact is used to create an ActiveCampaign contact
type CreateContact struct {
	Contact     Contact      `json:"contact"`
	FieldValues []FieldValue `json:"fieldValues"`
}

// AddList adds a contact to an ActiveCampaign list
type AddList struct {
	ContactList ContactList `json:"contactList"`
}

const signupListID = "11"
const confirmed = "1"

// ActiveCampaign is used to create a receiver for ActiveCampaign methods
type ActiveCampaign struct {
	url   string
	token string
}

// New creates a connection to ActiveCampaign
func New(url, token string) *ActiveCampaign {
	return &ActiveCampaign{
		url:   url,
		token: token,
	}
}

// AddContact adds a new user to ActiveCampaign. The method subscribes to the NATS
// "user.added" event.
func (a *ActiveCampaign) AddContact(req *pb.SignUpRequest) error {

	c := CreateContact{
		Contact: Contact{
			Email: req.Email,
			// FirstName: msg.User.FirstName,
			// LastName:  msg.User.LastName,
		},
	}

	byt, err := json.Marshal(c)
	if err != nil {
		return err
	}

	acReq, err := http.NewRequest(http.MethodPost, a.url+"contacts", bytes.NewBuffer(byt))
	if err != nil {
		return err
	}
	acReq.Header.Add("content-type", "application/json")
	acReq.Header.Add("Api-Token", a.token)

	res, err := http.DefaultClient.Do(acReq)
	if err != nil {
		return err
	}

	defer res.Body.Close()
	byt, err = ioutil.ReadAll(res.Body)
	if err != nil {
		return err
	}

	if res.StatusCode != http.StatusCreated {
		return fmt.Errorf("an error occurred creating msg: %s", string(byt))
	}

	// get contact Id to add to "Sign Up" list
	var rsp struct {
		Contact Contact `json:"contact"`
	}

	if err = json.Unmarshal(byt, &rsp); err != nil {
		return err
	}

	a.AddToList(rsp.Contact.ID)

	return nil
}

// AddToList adds a contact msg to an ActiveCampaign list
func (a *ActiveCampaign) AddToList(contactID string) error {

	al := AddList{
		ContactList: ContactList{
			ListID:    signupListID,
			ContactID: contactID,
			Status:    confirmed,
		},
	}

	byt, err := json.Marshal(al)
	if err != nil {
		return err
	}

	req, err := http.NewRequest(http.MethodPost, a.url+"contactLists", bytes.NewBuffer(byt))
	if err != nil {
		return err
	}
	req.Header.Add("content-type", "application/json")
	req.Header.Add("Api-Token", a.token)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}

	defer res.Body.Close()
	byt, err = ioutil.ReadAll(res.Body)
	if err != nil {
		return err
	}

	if res.StatusCode != http.StatusCreated {
		return fmt.Errorf("an error occurred adding contact to list: %s", string(byt))
	}

	return nil
}
