package config

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"gopkg.in/yaml.v2"
)

type ConfigIndex struct {
	Name    string
	Version string
	Unique  bool
	Keys    []struct {
		Field string
		Type  string
	}
}

type Config struct {
	Collections []struct {
		Name    string
		Audit   bool
		Indexes []ConfigIndex
	}
}

type ExistingIndex struct {
	Unique  bool
	Name    string
	Key     map[string]interface{}
	Weights map[string]interface{}
}

var (
	keyTypeMap = map[string]interface{}{
		"asc":  int32(1),
		"desc": int32(-1),
		"text": "text",
	}
)

func Apply(yml string, db *mongo.Database) error {

	cfg := []byte(yml)
	var config Config
	if err := yaml.Unmarshal(cfg, &config); err != nil {
		return err
	}

	for _, cfgColl := range config.Collections {
		if err := createCollection(db, cfgColl.Name); err != nil {
			return err
		}

		mgoColl := db.Collection(cfgColl.Name)

		// delete existing indexes not found in config
		toDelete := dbIndexes(mgoColl)
		// ...remove from map if found in config
		for _, idx := range cfgColl.Indexes {
			delete(toDelete, idx.Name)
		}
		// ...delete any remaining indexes
		for k := range toDelete {
			deleteIndex(mgoColl, k)
		}

		// create or update configured indexes
		existing := dbIndexes(mgoColl)
		for _, idx := range cfgColl.Indexes {
			if curIdx, ok := existing[idx.Name]; ok && indexEqual(curIdx, idx) {
				continue
			}
			if err := createIndex(mgoColl, idx); err != nil {
				return err
			}
		}
	}

	return nil
}

// create collection if doesn't exist
func createCollection(db *mongo.Database, name string) error {

	// check collection exists
	names, err := db.ListCollectionNames(context.Background(), bson.M{"name": name})
	if err != nil {
		return err
	}
	if len(names) > 0 {
		return nil
	}

	// create tenant validator
	opts := options.CreateCollection().SetValidator(
		bson.M{"$jsonSchema": bson.M{
			"bsonType": "object",
			"required": []string{"tenant"},
			"properties": bson.M{
				"tenant": bson.M{
					"bsonType":    "string",
					"description": "the tenant documents belong to",
				},
			},
		}},
	)

	if err := db.CreateCollection(context.Background(), name, opts); err != nil {
		return err
	}

	return nil
}

func deleteIndex(coll *mongo.Collection, name string) error {
	const ErrIndexNotFound = 27

	if _, err := coll.Indexes().DropOne(context.Background(), name); err != nil {
		if err.(mongo.CommandError).Code != ErrIndexNotFound {
			return err
		}
	}

	return nil
}

func createIndex(coll *mongo.Collection, cfgIdx ConfigIndex) error {

	// drop index if already exists
	if err := deleteIndex(coll, cfgIdx.Name); err != nil {
		return err
	}

	// build keys
	idxKeys := bson.D{}
	for _, key := range cfgIdx.Keys {
		keyType := key.Type
		if keyType == "" {
			keyType = "asc"
		}
		idxKeys = append(idxKeys, bson.E{Key: key.Field, Value: keyTypeMap[key.Type]})
	}

	// define model
	model := mongo.IndexModel{
		Keys: idxKeys,
		Options: options.Index().
			SetName(cfgIdx.Name).
			SetUnique(cfgIdx.Unique),
	}

	// create index
	if _, err := coll.Indexes().CreateOne(context.Background(), model); err != nil {
		return err
	}

	return nil
}

func dbIndexes(coll *mongo.Collection) map[string]ExistingIndex {

	var existing = map[string]ExistingIndex{}

	ctx := context.Background()
	indexView := coll.Indexes()

	curs, _ := indexView.List(ctx)
	for curs.Next(ctx) {
		var def ExistingIndex
		bson.Unmarshal(curs.Current, &def)

		// simplify full text index spec
		if _, ok := def.Key["_fts"]; ok {
			delete(def.Key, "_fts")
			delete(def.Key, "_ftsx")
			for k := range def.Weights {
				def.Key[k] = "text"
			}
		}

		existing[def.Name] = def
	}

	// remove built in index
	delete(existing, "_id_")
	return existing
}

func indexEqual(curIdx ExistingIndex, cfgIdx ConfigIndex) bool {

	if len(curIdx.Key) != len(cfgIdx.Keys) {
		// number of keys is different
		return false
	}

	for _, key := range cfgIdx.Keys {
		keyType, ok := curIdx.Key[key.Field]
		if !ok {
			// key doesn't exist
			return false
		}
		if keyType != keyTypeMap[key.Type] {
			// key type has changed
			return false
		}
	}

	return true
}
