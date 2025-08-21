package kycdz

import (
	"encoding/json"
	"errors"
	"log"

	"github.com/anqaml/id-check/kyc"
)

type nationalIdVerifications struct {
	FullName    bool `json:"fullName"`
	DateOfBirth bool `json:"dateOfBirth"`
	IdCardNo    bool `json:"idCardNo"`
}
type nationalIdReturnedData struct {
	Address string `json:"address"`
	Gender  string `json:"gender"`
	Source  string `json:"source"`
}

type NationalIdDetailData struct {
	IdCardNo string `json:"idCardNo"`
	Address  string `json:"address"`
	Gender   string `json:"gender"`
}
type NationalIdDetail struct {
	FullName    bool                 `json:"fullName"`
	DateOfBirth bool                 `json:"dateOfBirth"`
	IdCardNo    bool                 `json:"idCardNo"`
	Data        NationalIdDetailData `json:"data"`
}

func (dz *datazoo) verifyNationalID(n *kyc.NationalID, i kyc.Identifier) (*kyc.Result, error) {

	svc := "China ID Verification"
	req := makeCore(svc, i, "CHN")
	req.FullName = req.LastName + req.FirstName
	req.IdentityVariables = map[string]string{
		"idCardNo": n.Number,
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
		return nil, errors.New("no response received for China ID Verification")
	}
	svcRsp := rsp.ServiceResponses[svc]

	// unmarshal nationalId-specific response
	var nv nationalIdVerifications
	if err := json.Unmarshal(svcRsp.Verifications, &nv); err != nil {
		return nil, err
	}
	var nr nationalIdReturnedData
	if err := json.Unmarshal(svcRsp.ReturnedData, &nr); err != nil {
		return nil, err
	}

	nd := NationalIdDetail{
		FullName:    nv.FullName,
		DateOfBirth: nv.DateOfBirth,
		IdCardNo:    nv.IdCardNo,
	}

	if len(n.Number) > 4 {
		nd.Data = NationalIdDetailData{
			IdCardNo: n.Number[:len(n.Number)-6] + "XXXXXX",
			Address:  nr.Address,
			Gender:   nr.Gender,
		}
	}

	byt, err := json.Marshal(nd)
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
		InterpretNationalID(&result)
	}

	return &result, nil
}

func InterpretNationalID(result *kyc.Result) {

	switch result.Status {
	case kyc.StatusFullMatch:
		result.Msg = "A full match was found"
	case kyc.StatusPartMatch:
		result.Msg = "A partial match was found. Check that you have entered all information correctly"
	case kyc.StatusNoMatch:
		result.Msg = "No match was found. Check that you have entered all information correctly"
	case kyc.StatusNoData:
		result.Msg = "We were unable to get a reply from the data provider for this check. Please try again later"
		return
	case kyc.StatusError:
		// TODO: Improve this when exception handling above is fixed
		result.Msg = "An error occurred when trying to do this check. Please try again"
		return
	}

	var nd NationalIdDetail
	if err := json.Unmarshal([]byte(result.Detail), &nd); err != nil {
		// Error can't be fatal here. Log and return.
		log.Println("Error unmarshalling national ID detail to interpret", result.Detail, err)
		return
	}
	result.Matches = make(map[string]bool)
	result.Matches["Full name"] = nd.FullName
	result.Matches["Date of birth"] = nd.DateOfBirth
	result.Matches["ID card number"] = nd.IdCardNo
}
