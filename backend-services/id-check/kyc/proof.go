package kyc

type Passport struct {
	Number string
	Expiry string
}
type Licence struct {
	Number  string
	Version string
}
type Address struct {
	UnitNumber   string
	StreetNumber string
	StreetName   string
	StreetType   string
	Suburb       string
	City         string
	Region       string
	Postcode     string
	Country      string
}
type NationalID struct {
	Number string
}
type Watchlist struct{}

type Proof struct {
	*Address
	*Passport
	*Licence
	*NationalID
	*Watchlist
}

type ProofType int

const (
	ProofPassport = iota
	ProofLicence
	ProofAddress
	ProofNationalID
	ProofWatchlist
)

type ProofOption interface {
	Apply(*Proof)
	Type() ProofType
}

type proof struct {
	pt ProofType
	fn func(*Proof)
}

func newProof(pt ProofType, fn func(*Proof)) *proof {
	return &proof{pt: pt, fn: fn}
}

func (af *proof) Apply(d *Proof) {
	af.fn(d)
}
func (af *proof) Type() ProofType {
	return af.pt
}

func WithPassport(p *Passport) ProofOption {
	return newProof(ProofPassport, func(d *Proof) {
		d.Passport = p
	})
}

func WithLicence(l *Licence) ProofOption {
	return newProof(ProofLicence, func(d *Proof) {
		d.Licence = l
	})
}

func WithAddress(a *Address) ProofOption {
	return newProof(ProofAddress, func(d *Proof) {
		d.Address = a
	})
}

func WithNationalID(n *NationalID) ProofOption {
	return newProof(ProofNationalID, func(d *Proof) {
		d.NationalID = n
	})
}

func WithWatchlist(w *Watchlist) ProofOption {
	return newProof(ProofWatchlist, func(d *Proof) {
		d.Watchlist = w
	})
}
