package protobson

import (
	"context"
	"reflect"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/bsoncodec"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"google.golang.org/protobuf/reflect/protoreflect"

	"github.com/anqaml/proto-bson/config"
)

type Connection struct {
	Database *mongo.Database
	app      string
	host     string
	user     string
	password string
	cfg      string
	audit    []string
	pbfld    map[reflect.Type]string
	rb       *bsoncodec.RegistryBuilder
}

type ConnectOption func(*Connection)

// New initialises the database connection and returns datastores ready for
// use by clients
func Connect(opts ...ConnectOption) (*Connection, error) {
	cnn := Connection{
		app:   "anqa",
		pbfld: make(map[reflect.Type]string),
		audit: []string{},
		rb:    bson.NewRegistryBuilder(),
	}

	// apply any options provided
	for _, opt := range opts {
		opt(&cnn)
	}

	reg := cnn.rb.Build()

	client, err := mongo.NewClient(
		options.Client().SetRegistry(reg),
		options.Client().ApplyURI(cnn.host),
		options.Client().SetAuth(options.Credential{Username: cnn.user, Password: cnn.password}),
		options.Client().SetAppName(cnn.app),
	)
	if err != nil {
		return nil, err
	}

	err = client.Connect(context.Background())
	if err != nil {
		return nil, err
	}

	cnn.Database = client.Database(cnn.app)
	config.Apply(cnn.cfg, cnn.Database)

	for _, coll := range cnn.audit {
		go cnn.auditChanges(coll)
	}

	return &cnn, nil
}

// Proto registers a specific proto message interface for use with the mongo
// driver Decode methods as well as this library's Marshal/Unmarshal methods.
// The fieldName argument can be used to override the default proto field name
// derived from the proto name.
func Proto(msg protoreflect.ProtoMessage, fieldName ...string) ConnectOption {
	return func(c *Connection) {
		t := reflect.TypeOf(msg)
		if len(fieldName) == 0 {
			parts := strings.Split(t.String(), ".")
			name := parts[len(parts)-1]
			fieldName = append(fieldName, strings.ToLower(name))
		}
		c.pbfld[t] = fieldName[0]
		c.rb.RegisterCodec(t.Elem(), &ProtoCodec{})
	}
}

// Host is connection details of the host Mongo host to connect to.
// For example, mongodb+srv://anqastg.sglxh.mongodb.net.
func Host(h string) ConnectOption {
	return func(c *Connection) {
		c.host = h
	}
}

// User is the user to connect with.
func User(u string) ConnectOption {
	return func(c *Connection) {
		c.user = u
	}
}

// Password is the password to use to connect with.
func Password(p string) ConnectOption {
	return func(c *Connection) {
		c.password = p
	}
}

// App is the name of the Mongo App to connect to .
func App(a string) ConnectOption {
	return func(c *Connection) {
		c.app = a
	}
}

// App is the name of the Mongo App to connect to .
func Configure(yml string) ConnectOption {
	return func(c *Connection) {
		c.cfg = yml
	}
}

func Audit(coll string) ConnectOption {
	return func(c *Connection) {
		c.audit = append(c.audit, coll)
	}
}

// Apply configuration changes to database.
func (c *Connection) Configure(yml string) error {
	return config.Apply(yml, c.Database)
}

// audit collection data changes
// See: https://docs.mongodb.com/manual/changeStreams/
func (c *Connection) auditChanges(coll string) error {

	ctx := context.Background()
	cs, err := c.Database.Collection(coll).Watch(ctx, mongo.Pipeline{})
	if err != nil {
		return err
	}
	defer cs.Close(ctx)

	// loop while change stream active
	for cs.Next(ctx) {
		c.Database.Collection("audit").InsertOne(ctx, cs.Current)
	}

	return nil
}
