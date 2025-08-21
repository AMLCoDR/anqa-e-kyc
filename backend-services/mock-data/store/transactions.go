package store

import (
	"bytes"
	"encoding/csv"
	"strconv"
	"time"

	// embed transactions csv
	_ "embed"

	pb "go.buf.build/library/go-grpc/anqa/transaction/transaction/v1"
)

//go:embed transactions.csv
var csvTxns []byte

func mockTransactions() ([]*pb.Transaction, error) {

	r := csv.NewReader(bytes.NewReader(csvTxns))
	records, err := r.ReadAll()
	if err != nil {
		return []*pb.Transaction{}, err
	}

	var txns []*pb.Transaction

	for _, rec := range records {
		amt, err := strconv.ParseFloat(rec[1], 64)
		if err != nil {
			return []*pb.Transaction{}, err
		}

		txn := &pb.Transaction{
			Time:           fixDate(rec[0]),
			Amount:         amt,
			Currency:       rec[2],
			Product:        rec[3],
			Reference:      rec[4],
			CustomerName:   rec[5],
			CustomerNumber: rec[6],
			SourceRef:      "mock",
		}

		txns = append(txns, txn)
	}

	return txns, nil
}

var maxDte, _ = time.Parse("2006-01-02", "2020-08-28")

func fixDate(mockDte string) string {

	// get offset from this date and max mocked date
	mockDt, _ := time.Parse("2006-01-02", mockDte)
	offset := mockDt.Sub(maxDte)

	// work backwards from current date
	now := time.Now().Truncate(12 * time.Hour)
	fixed := now.Add(offset)

	return fixed.Format("2006-01-02")
}
