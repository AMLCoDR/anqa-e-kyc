package kycdz

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/anqaml/id-check/kyc"
)

const (
	testURL = "https://idu-test.datazoo.com/api/v2"
	prodURL = "https://idu.datazoo.com/api/v2"
)

type request struct {
	CountryCode       string            `json:"countryCode"`
	Service           []string          `json:"service"`
	ClientReference   string            `json:"clientReference"`
	FirstName         string            `json:"firstName"`
	MiddleName        string            `json:"middleName"`
	LastName          string            `json:"lastName"`
	FullName          string            `json:"fullName"`
	DateOfBirth       string            `json:"dateOfBirth"`
	Gender            string            `json:"gender"`
	AddressElement1   string            `json:"addressElement1"`
	AddressElement2   string            `json:"addressElement2"`
	AddressElement3   string            `json:"addressElement3"`
	AddressElement4   string            `json:"addressElement4"`
	AddressElement5   string            `json:"addressElement5"`
	IdentityVariables map[string]string `json:"identityVariables"`
	ConsentObtained   map[string]bool   `json:"consentObtained"`
}

type response struct {
	CountryCode        string `json:"countryCode"`
	ClientReference    string `json:"clientReference"`
	ReportingReference string `json:"reportingReference"`
	RequestError       string `json:"requestError"`
	MatchStatus        string `json:"matchStatus"`
	SearchErrorMessage string `json:"searchErrorMessage"`
	SafeHarbour        bool   `json:"safeHarbour"`
	SearchStatus       string `json:"searchStatus"`
	ServiceResponses   map[string]struct {
		Status            int             `json:"status"`
		SourceStatus      string          `json:"sourceStatus"`
		ErrorMessage      string          `json:"errorMessage"`
		IdentityVerified  bool            `json:"identityVerified"`
		SafeHarbourScore  string          `json:"safeHarbourScore"`
		NameMatchScore    string          `json:"nameMatchScore"`
		AddressMatchScore string          `json:"addressMatchScore"`
		Verifications     json.RawMessage `json:"verifications"`
		ReturnedData      json.RawMessage `json:"returnedData"`
	} `json:"serviceResponses"`
	ValidationErrors []string `json:"validationErrors"`
}

type datazoo struct {
	url       string
	pwd       string
	authToken string
	kyc.Option
}

// NewVerifier creates an returns a Verifier that can be used by the client to
// verify one or more identities
func NewVerifier(opts ...kyc.VerifierOption) (*datazoo, error) {

	dz := &datazoo{
		pwd: os.Getenv("DZ_PWD_LIVE"),
		url: prodURL,
	}

	// apply supplied options
	for _, opt := range opts {
		opt.Apply(&dz.Option)
	}

	if dz.TrialMode {
		dz.pwd = os.Getenv("DZ_PWD_TEST")
		dz.url = testURL
	}

	var err error
	if dz.authToken, err = dz.auth(dz.Tenant, dz.pwd); err != nil {
		return nil, err
	}

	return dz, nil
}

// Verify will verify the provided identity using the proof provided. It delegates the
// verification to a method appropriate to the type of proof supplied.
func (dz *datazoo) Verify(id kyc.Identifier, po kyc.ProofOption) (*kyc.Result, error) {

	// unpack the proof into one of kyc.Proof's sub types
	pf := &kyc.Proof{}
	po.Apply(pf)

	// choose verification method appropriate to proof provided
	switch po.Type() {
	case kyc.ProofPassport:
		return dz.verifyPassport(pf.Passport, id)
	case kyc.ProofLicence:
		return dz.verifyLicence(pf.Licence, id)
	case kyc.ProofAddress:
		return dz.verifyAddress(pf.Address, id)
	case kyc.ProofNationalID:
		return dz.verifyNationalID(pf.NationalID, id)
	case kyc.ProofWatchlist:
		return dz.verifyWatchlist(pf.Watchlist, id)
	default:
		return nil, errors.New("no viable proof provided")
	}
}

func (dz *datazoo) verify(req, rsp interface{}) error {
	return dz.callAPI("/verify", req, rsp)
}

func (dz *datazoo) auth(user, pwd string) (string, error) {

	req := struct {
		UserName string
		Password string
	}{
		UserName: user,
		Password: pwd,
	}

	var rsp struct {
		Message      string `json:"message"`
		SessionToken string `json:"sessionToken"`
	}

	if err := dz.callAPI("/auth/sign_in", req, &rsp); err != nil {
		return "", err
	}
	if rsp.SessionToken == "" {
		return "", fmt.Errorf("403: authentication issue for user %s", user)
	}

	return rsp.SessionToken, nil
}

func makeCore(svc string, i kyc.Identifier, countryCode string) request {
	id := i.Identity()

	return request{
		CountryCode:     countryCode,
		Service:         []string{svc},
		ClientReference: "Avid AML",
		FirstName:       id.FirstName,
		MiddleName:      id.MiddleName,
		LastName:        id.LastName,
		DateOfBirth:     id.DateOfBirth,
		ConsentObtained: map[string]bool{svc: true},
	}
}

func (dz *datazoo) callAPI(path string, req, rsp interface{}) error {

	byt, err := json.Marshal(req)
	if err != nil {
		return err
	}

	hreq, err := http.NewRequest(http.MethodPost, dz.url+path, bytes.NewBuffer(byt))
	if err != nil {
		return err
	}

	hreq.Header.Add("Content-Type", "application/json")
	if dz.authToken != "" {
		hreq.Header.Add("Authorization", dz.authToken)
	}

	client := &http.Client{}
	hrsp, err := client.Do(hreq)
	if err != nil {
		return err
	}

	defer hrsp.Body.Close()
	byt, err = ioutil.ReadAll(hrsp.Body)
	if err != nil {
		return err
	}

	if err = json.Unmarshal(byt, rsp); err != nil {
		log.Printf("Error %v reading DataZoo response: %v", hrsp.StatusCode, string(byt))

		var msg map[string]interface{}
		if len(byt) > 0 {
			json.Unmarshal(byt, &msg)
		}

		return fmt.Errorf("bad request: %v %v ", msg, err)
	}

	return nil
}
