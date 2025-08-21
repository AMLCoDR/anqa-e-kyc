package kycdz

import (
	"encoding/json"
	"errors"
	"log"

	"github.com/anqaml/id-check/kyc"
)

type watchlistVerifications struct {
	FirstName   bool `json:"firstName"`
	LastName    bool `json:"lastName"`
	DateOfBirth bool `json:"dateOfBirth"`
	Gender      bool `json:"gender"`
}

type watchlistReturnedData struct {
	WatchlistResults []struct {
		AdditionalInfoURL string   `json:"additionalInfoURL"`
		Category          string   `json:"category"`
		DeathIndex        string   `json:"deathIndex"`
		Gender            string   `json:"gender"`
		OtherNames        []string `json:"otherNames"`
		ScanId            string   `json:"scanId"`
	} `json:"watchlistResults"`
}

type WatchlistAML struct {
	AdditionalInfoURL string   `json:"additionalInfoURL"`
	Category          string   `json:"category"`
	DeathIndex        string   `json:"deathIndex"`
	Gender            string   `json:"gender"`
	OtherNames        []string `json:"otherNames"`
}
type WatchlistDetailData struct {
	WatchlistAML []WatchlistAML `json:"watchlistAML"`
}
type WatchlistDetail struct {
	FirstName   bool                `json:"firstName"`
	LastName    bool                `json:"lastName"`
	DateOfBirth bool                `json:"dateOfBirth"`
	Gender      bool                `json:"gender"`
	Data        WatchlistDetailData `json:"data"`
}

func (dz *datazoo) verifyWatchlist(w *kyc.Watchlist, i kyc.Identifier) (*kyc.Result, error) {

	svc := "Watchlist AML"
	req := makeCore(svc, i, "All")

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
		return nil, errors.New("no response received for Watchlist AML")
	}
	svcRsp := rsp.ServiceResponses[svc]

	// unmarshal watchlist-specific response
	var wv watchlistVerifications
	if err := json.Unmarshal(svcRsp.Verifications, &wv); err != nil {
		return nil, err
	}
	var wr watchlistReturnedData
	if err := json.Unmarshal(svcRsp.ReturnedData, &wr); err != nil {
		return nil, err
	}

	wd := WatchlistDetail{
		FirstName:   wv.FirstName,
		LastName:    wv.LastName,
		Gender:      wv.Gender,
		DateOfBirth: wv.DateOfBirth,
	}

	l := len(wr.WatchlistResults)
	if l > 0 {
		wd.Data = WatchlistDetailData{
			WatchlistAML: make([]WatchlistAML, l),
		}
		for i, r := range wr.WatchlistResults {
			wd.Data.WatchlistAML[i] = WatchlistAML{
				AdditionalInfoURL: r.AdditionalInfoURL,
				Category:          r.Category,
				DeathIndex:        r.DeathIndex,
				Gender:            r.Gender,
				OtherNames:        r.OtherNames,
			}
		}
	}

	byt, err := json.Marshal(wd)
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
		InterpretWatchlist(&result)
	}

	return &result, nil
}

func InterpretWatchlist(result *kyc.Result) {

	switch result.Status {
	case kyc.StatusFullMatch:
		result.Msg = "A full match was found"
	case kyc.StatusPartMatch:
		result.Msg = "A partial match was found. Check that you have entered all parts of the person's details correctly"
	case kyc.StatusNoMatch:
		result.Msg = "No match was found. Check that you have entered all parts of the person's details correctly"
	case kyc.StatusNoData:
		result.Msg = "We were unable to get a reply from the data provider for this check. Please try again later"
		return
	case kyc.StatusError:
		// TODO: Improve this when exception handling above is fixed
		result.Msg = "An error occurred when trying to do this check. Please try again"
		return
	}

	var wd WatchlistDetail
	if err := json.Unmarshal([]byte(result.Detail), &wd); err != nil {
		// Error can't be fatal here. Log and return.
		log.Println("Error unmarshalling watchlist detail to interpret", result.Detail, err)
		return
	}
	result.Matches = make(map[string]bool)
	result.Matches["First or middle name"] = wd.FirstName
	result.Matches["Last name"] = wd.LastName
	result.Matches["Gender"] = wd.Gender
	result.Matches["Date of birth"] = wd.DateOfBirth
}
