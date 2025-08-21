package kycdz

import (
	"encoding/json"
	"errors"
	"log"

	"github.com/anqaml/id-check/kyc"
)

type passportVerifications struct {
	FirstName   bool `json:"firstName"`
	LastName    bool `json:"lastName"`
	DateOfBirth bool `json:"dateOfBirth"`
	PassportNo  bool `json:"passportNo"`
}

type PassportDetailData struct {
	PassportNo     string `json:"passportNo"`
	PassportExpiry string `json:"passportExpiry"`
}
type PassportDetail struct {
	FirstName   bool               `json:"firstName"`
	LastName    bool               `json:"lastName"`
	DateOfBirth bool               `json:"dateOfBirth"`
	PassportNo  bool               `json:"passportNo"`
	Data        PassportDetailData `json:"data"`
}

func (dz *datazoo) verifyPassport(p *kyc.Passport, i kyc.Identifier) (*kyc.Result, error) {

	svc := "New Zealand DIA Passport"

	req := makeCore(svc, i, "NZ")
	req.IdentityVariables = map[string]string{
		"passportNo":     p.Number,
		"passportExpiry": p.Expiry,
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
		return nil, errors.New("no response received for New Zealand DIA Passport")
	}
	svcRsp := rsp.ServiceResponses[svc]

	// unmarshal passport-specific response
	var pv passportVerifications
	if err := json.Unmarshal(svcRsp.Verifications, &pv); err != nil {
		return nil, err
	}

	pd := PassportDetail{
		FirstName:   pv.FirstName,
		LastName:    pv.LastName,
		DateOfBirth: pv.DateOfBirth,
		PassportNo:  pv.PassportNo,
	}
	if len(p.Number) > 4 {
		pd.Data = PassportDetailData{
			PassportNo:     p.Number[:len(p.Number)-4] + "XXXX",
			PassportExpiry: p.Expiry[:len(p.Expiry)-5] + "XX-XX",
		}
	}

	byt, err := json.Marshal(pd)
	if err != nil {
		return nil, err
	}

	result := kyc.Result{
		Verified: svcRsp.IdentityVerified,
		Status:   kyc.Status(svcRsp.Status),
		Detail:   string(byt),
	}
	if dz.InterpretResult {
		InterpretPassport(&result)
	}

	return &result, nil
}

func InterpretPassport(result *kyc.Result) {

	switch result.Status {
	case kyc.StatusFullMatch:
		result.Msg = "A full match was found"
	case kyc.StatusPartMatch:
		result.Msg = "A partial match was found. Check that you have entered all parts of the person's name as it appears on the passport"
	case kyc.StatusNoMatch:
		result.Msg = "No match was found. Check that you have entered all parts of the person's name as it appears on the passport"
	case kyc.StatusNoData:
		result.Msg = "We were unable to get a reply from the data provider for this check. Please try again later"
		return
	case kyc.StatusError:
		if result.Detail == "User not permitted to access data source New Zealand DIA Passport" {
			result.Msg = "Your organisation is not yet authorised by the Department of Internal Affairs to make passport checks"
		} else {
			// TODO: Improve this when exception handling above is fixed
			result.Msg = "An error occurred when trying to do this check. Please try again"
		}
		return
	}

	var pd PassportDetail
	if err := json.Unmarshal([]byte(result.Detail), &pd); err != nil {
		// Error can't be fatal here. Log and return.
		log.Println("Error unmarshalling passport detail to interpret", result.Detail, err)
		return
	}
	result.Matches = make(map[string]bool)
	result.Matches["First or middle name"] = pd.FirstName
	result.Matches["Last name"] = pd.LastName
	result.Matches["Date of birth"] = pd.DateOfBirth
	result.Matches["Passport number"] = pd.PassportNo
}
