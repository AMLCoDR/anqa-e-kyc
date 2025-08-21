package kycdz

import (
	"encoding/json"
	"errors"
	"log"

	"github.com/anqaml/id-check/kyc"
)

type licenceVerifications struct {
	FirstName   bool `json:"firstName"`
	LastName    bool `json:"lastName"`
	DateOfBirth bool `json:"dateOfBirth"`
	LicenceNo   bool `json:"licenceNo"`
}

type LicenceDetailData struct {
	LicenceNo      string `json:"licenceNo"`
	LicenceVersion string `json:"licenceVersion"`
}
type LicenceDetail struct {
	FirstName   bool              `json:"firstName"`
	LastName    bool              `json:"lastName"`
	DateOfBirth bool              `json:"dateOfBirth"`
	LicenceNo   bool              `json:"licenceNo"`
	Data        LicenceDetailData `json:"data"`
}

func (dz *datazoo) verifyLicence(l *kyc.Licence, i kyc.Identifier) (*kyc.Result, error) {

	svc := "New Zealand Driver Licence"
	req := makeCore(svc, i, "NZ")
	req.IdentityVariables = map[string]string{
		"driversLicenceNo":      l.Number,
		"driversLicenceVersion": l.Version,
	}

	// make request
	var rsp response
	if err := dz.verify(req, &rsp); err != nil {
		return nil, err
	}

	// TODO: Do not generate errors if we get a response we can interpret. Only generate errors on unhandled "exceptions"
	if rsp.SearchErrorMessage != "" {
		return nil, errors.New(rsp.SearchErrorMessage)
	}
	if rsp.RequestError != "" {
		return nil, errors.New(rsp.RequestError)
	}
	if rsp.ServiceResponses == nil {
		return nil, errors.New("no response for New Zealand Driver Licence")
	}
	svcRsp := rsp.ServiceResponses[svc]

	// unmarshal licence-specific response
	var lv licenceVerifications
	if err := json.Unmarshal(svcRsp.Verifications, &lv); err != nil {
		return nil, err
	}

	ld := LicenceDetail{
		FirstName:   lv.FirstName,
		LastName:    lv.LastName,
		DateOfBirth: lv.DateOfBirth,
		LicenceNo:   lv.LicenceNo,
	}
	if len(l.Number) > 4 {
		ld.Data = LicenceDetailData{
			LicenceNo:      l.Number[:len(l.Number)-4] + "XXXX",
			LicenceVersion: l.Version[:len(l.Version)-2] + "XX",
		}
	}

	byt, err := json.Marshal(ld)
	if err != nil {
		return nil, err
	}

	result := kyc.Result{
		Verified: svcRsp.IdentityVerified,
		Status:   kyc.Status(svcRsp.Status),
		Detail:   string(byt),
		// Reference: rsp.ReportingReference,
	}
	if dz.InterpretResult {
		InterpretLicence(&result)
	}

	return &result, nil
}

func InterpretLicence(result *kyc.Result) {

	switch result.Status {
	case kyc.StatusFullMatch:
		result.Msg = "A full match was found"
	case kyc.StatusPartMatch:
		result.Msg = "A partial match was found. Check that you have entered all information as it appears on the driver's licence"
	case kyc.StatusNoMatch:
		result.Msg = "No match was found. Check that you have entered all information as it appears on the driver's licence"
	case kyc.StatusNoData:
		result.Msg = "We were unable to get a reply from the data provider for this check. Please try again later"
		return
	case kyc.StatusError:
		// TODO: Improve this when exception handling above is fixed
		result.Msg = "An error occurred when trying to do this check. Please try again"
		return
	}

	var ld LicenceDetail
	if err := json.Unmarshal([]byte(result.Detail), &ld); err != nil {
		// Error can't be fatal here. Log and return.
		log.Println("Error unmarshalling license detail to interpret", result.Detail, err)
		return
	}
	result.Matches = make(map[string]bool)
	result.Matches["First name"] = ld.FirstName
	result.Matches["Last name"] = ld.LastName
	result.Matches["Date of birth"] = ld.DateOfBirth
	result.Matches["License number or version"] = ld.LicenceNo
}
