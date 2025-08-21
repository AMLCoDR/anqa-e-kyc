package kycdz

import (
	"encoding/json"
	"errors"
	"log"

	"github.com/anqaml/id-check/kyc"
)

type addressVerifications struct {
	FirstName       bool `json:"firstName"`
	LastName        bool `json:"lastName"`
	AddressElement1 bool `json:"addressElement1"`
	AddressElement3 bool `json:"addressElement3"`
	AddressElement4 bool `json:"addressElement4"`
	AddressElement5 bool `json:"addressElement5"`
}

type AddressDetailData struct {
	Street   string `json:"street"`
	Suburb   string `json:"suburb"`
	City     string `json:"city"`
	PostCode string `json:"postCode"`
}
type AddressDetail struct {
	FirstName bool              `json:"firstName"`
	LastName  bool              `json:"lastName"`
	Street    bool              `json:"street"`
	Suburb    bool              `json:"suburb"`
	City      bool              `json:"city"`
	PostCode  bool              `json:"postCode"`
	Data      AddressDetailData `json:"data"`
}

func (dz *datazoo) verifyAddress(a *kyc.Address, i kyc.Identifier) (*kyc.Result, error) {

	svc := "New Zealand Residential"
	req := makeCore(svc, i, "NZ")
	req.AddressElement1 = a.StreetNumber + " " + a.StreetName + " " + a.StreetType
	req.AddressElement3 = a.Suburb
	req.AddressElement4 = a.City
	req.AddressElement5 = a.Postcode

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
		return nil, errors.New("no response received for New Zealand Residential")
	}
	svcRsp := rsp.ServiceResponses[svc]

	// unmarshal address-specific response
	var av addressVerifications
	if err := json.Unmarshal(svcRsp.Verifications, &av); err != nil {
		return nil, err
	}

	ad := AddressDetail{
		FirstName: av.FirstName,
		LastName:  av.LastName,
		Street:    av.AddressElement1,
		Suburb:    av.AddressElement3,
		City:      av.AddressElement4,
		PostCode:  av.AddressElement5,
		Data: AddressDetailData{
			Street:   req.AddressElement1,
			Suburb:   req.AddressElement3,
			City:     req.AddressElement4,
			PostCode: req.AddressElement5,
		},
	}
	byt, err := json.Marshal(ad)
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
		InterpretAddress(&result)
	}

	return &result, nil
}

func InterpretAddress(result *kyc.Result) {
	switch result.Status {
	case kyc.StatusFullMatch:
		result.Msg = "A full match was found"
	case kyc.StatusPartMatch:
		result.Msg = "A partial match was found. Check that you have entered all parts of the person's name and address"
	case kyc.StatusNoMatch:
		result.Msg = "No match was found. Check that you have entered all parts of the person's name and address"
	case kyc.StatusNoData:
		result.Msg = "We were unable to get a reply from the data provider for this check. Please try again later"
		return
	case kyc.StatusError:
		// TODO: Improve this when exception handling above is fixed
		result.Msg = "An error occurred when trying to do this check. Please try again"
		return
	}

	var ad AddressDetail
	if err := json.Unmarshal([]byte(result.Detail), &ad); err != nil {
		// Error can't be fatal here. Log and return.
		log.Println("Error unmarshalling address detail to interpret", result.Detail, err)
		return
	}
	result.Matches = make(map[string]bool)
	result.Matches["First name"] = ad.FirstName
	result.Matches["Last name"] = ad.LastName
	result.Matches["Street"] = ad.Street
	result.Matches["Suburb"] = ad.Suburb
	result.Matches["City"] = ad.City
	result.Matches["PostCode"] = ad.PostCode
}
