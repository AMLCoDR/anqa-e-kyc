package vd

// Data validation error type
type ValidationError struct {
	Message string
	Errors  []string
}

func (e *ValidationError) Error() string { return e.Message }

func (e *ValidationError) ValidationError() []string { return e.Errors }
