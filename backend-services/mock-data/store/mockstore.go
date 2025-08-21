package store

import (
	pbc "go.buf.build/library/go-grpc/anqa/customer-v1/customer/v1beta1"
	pbe "go.buf.build/library/go-grpc/anqa/entity/entity/v1"
	pbi "go.buf.build/library/go-grpc/anqa/id-check/idcheck/v3"
	pbt "go.buf.build/library/go-grpc/anqa/transaction/transaction/v1"
)

// Store provides transaction-related data access methods.
type Store interface {
	Transactions() ([]*pbt.Transaction, error)
	Entities() ([]*pbe.Entity, []*pbe.Relationship, []*pbi.CheckRequest, error)
	Customers() ([]*pbc.Customer, error)
}

type store struct{}

// New is a factory function to create a Store object
func New() Store {
	return store{}
}

// Return mock transactions
func (s store) Transactions() ([]*pbt.Transaction, error) {
	return mockTransactions()
}

// Return mock entities
func (s store) Entities() ([]*pbe.Entity, []*pbe.Relationship, []*pbi.CheckRequest, error) {
	return mockEntities()
}

// Return mock customers
func (s store) Customers() ([]*pbc.Customer, error) {
	return mockCustomers()
}
