package kyc

type Status int

const (
	StatusFullMatch = iota
	StatusPartMatch
	StatusNoMatch
	StatusNoData
	StatusError
)

// Result is used to return the results of a certication check
type Result struct {
	Verified bool
	Status   Status
	Detail   string          // Detail from the provider
	Msg      string          // Human-readable interpretation of the check result
	Matches  map[string]bool // Any name-value pairs that can help with interpreting check result
}

type Identity struct {
	FirstName   string
	MiddleName  string
	LastName    string
	DateOfBirth string
}

type Identifier interface {
	Identity() *Identity
}

type Verifier interface {
	Verify(Identifier, ProofOption) (*Result, error)
}

/*
	VerifierOption
*/
type Option struct {
	Tenant          string
	TrialMode       bool
	InterpretResult bool
}

type VerifierOption interface {
	Apply(*Option)
}

type applier struct {
	fn func(*Option)
}

func newApplier(fn func(*Option)) *applier {
	return &applier{fn: fn}
}

func (af *applier) Apply(r *Option) {
	af.fn(r)
}

// WithTrialMode is used to optionally specify whether the client is using the API in trial mode.
func WithTrialMode(tm bool) VerifierOption {
	return newApplier(func(v *Option) {
		v.TrialMode = tm
	})
}

// WithTrialMode is used to optionally specify whether the client is using the API in trial mode.
func WithTenant(t string) VerifierOption {
	return newApplier(func(v *Option) {
		v.Tenant = t
	})
}

// WithInterpretResult is used to optionally add human-readable interpretation of the result to the response
func WithInterpretResult(interp bool) VerifierOption {
	return newApplier(func(v *Option) {
		v.InterpretResult = interp
	})
}
