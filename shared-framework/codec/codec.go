package codec

import (
	"bytes"
	"fmt"
	"reflect"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson/bsoncodec"
	"go.mongodb.org/mongo-driver/bson/bsonrw"
	"google.golang.org/protobuf/proto"
	"google.golang.org/protobuf/reflect/protoreflect"
	"k8s.io/klog/v2"
)

type Registry struct {
	protoField string
}

type Wrapper struct {
	Tenant    string        `bson:"tenant"`
	CreatedAt time.Time     `bson:"createdAt"`
	CreatedBy string        `bson:"createdBy"`
	UpdatedAt time.Time     `bson:"updatedAt"`
	UpdatedBy string        `bson:"updatedBy"`
	Message   proto.Message `bson:"message"`
}

// ProtoCodec provides a custom codec for encoding/decoding proto messages
type ProtoCodec struct{}

type WrapperCodec struct {
	protoField string
}

// RegisterOption is used to support optional arguments for the Register method.
type RegisterOption interface {
	apply(*Registry)
}

type applier struct {
	fn func(*Registry)
}

func newApplier(f func(*Registry)) *applier {
	return &applier{fn: f}
}

func (af *applier) apply(r *Registry) {
	af.fn(r)
}

// Register initialises the bson codec used to read and write proto messages.
func Register(opts ...RegisterOption) *Registry {

	r := Registry{}

	// apply any options provided
	for _, opt := range opts {
		opt.apply(&r)
	}

	// rb := bson.NewRegistryBuilder()
	// rb.RegisterCodec(reflect.TypeOf(Wrapper{}), &WrapperCodec{protoField: r.protoField})
	// rb.RegisterCodec(reflect.TypeOf((*proto.Message)(nil)).Elem(), &ProtoCodec{})
	// rb.Build()

	return &r
}

// ProtoField is used to override the default field name (of proto) for the proto object.
func ProtoField(f string) RegisterOption {
	return newApplier(func(r *Registry) {
		r.protoField = f
	})
}

// MarshalOption is used to identify marshal options
type MarshalOption interface {
	write(bsonrw.DocumentWriter) error
}

type writer struct {
	fn func(bsonrw.DocumentWriter) error
}

func newWriter(f func(bsonrw.DocumentWriter) error) *writer {
	return &writer{fn: f}
}

func (wf *writer) write(dw bsonrw.DocumentWriter) error {
	return wf.fn(dw)
}

// Marshal uses a bsonrw.ValueWriter to marshal the proto message to bytes ready to write to Mongo.
func (r *Registry) Marshal(msg proto.Message, opts ...MarshalOption) ([]byte, error) {

	doc := new(bytes.Buffer)
	vw, err := bsonrw.NewBSONValueWriter(doc)
	if err != nil {
		return []byte{}, err
	}

	// start document write
	dw, err := vw.WriteDocument()
	if err != nil {
		return []byte{}, err
	}

	// write metadata option values (tenant, user, etc.)
	for _, opt := range opts {
		opt.write(dw)
	}

	// write proto message (using name provided)
	fvw, err := dw.WriteDocumentElement(r.protoField)
	if err != nil {
		return []byte{}, err
	}
	pc := &ProtoCodec{}
	if err := pc.writeMessage(msg.ProtoReflect(), fvw); err != nil {
		return []byte{}, err
	}

	// complete document write
	if err := dw.WriteDocumentEnd(); err != nil {
		return []byte{}, err
	}

	return doc.Bytes(), nil
}

// Tenant is used to set the tenant when marshalling proto data for write
func Tenant(t string) MarshalOption {
	return newWriter(func(dw bsonrw.DocumentWriter) error {
		vw, err := dw.WriteDocumentElement("tenant")
		if err != nil {
			return err
		}
		if err := vw.WriteString(t); err != nil {
			return err
		}
		return nil
	})
}

// CreatedBy sets the user who created the record and time of update
func CreatedBy(u string) MarshalOption {
	return newWriter(func(dw bsonrw.DocumentWriter) error {
		return writeAudit(u, "created", dw)
	})
}

// UpdatedBy sets the user who updated the record and time of update
func UpdatedBy(u string) MarshalOption {
	return newWriter(func(dw bsonrw.DocumentWriter) error {
		return writeAudit(u, "updated", dw)
	})
}

func writeAudit(u, f string, dw bsonrw.DocumentWriter) error {
	vw, err := dw.WriteDocumentElement(f + "At")
	if err != nil {
		return err
	}
	if err := vw.WriteDateTime(time.Now().Unix() * 1000); err != nil {
		return err
	}
	vw, err = dw.WriteDocumentElement(f + "By")
	if err != nil {
		return err
	}
	if err := vw.WriteString(u); err != nil {
		return err
	}
	return nil
}

// Unmarshal uses a bsonrw.ValueReader to unmarshal bson to the proto message.
func (r *Registry) Unmarshal(bson []byte, msg proto.Message) error {

	vr := bsonrw.NewBSONDocumentReader(bson)
	dr, err := vr.ReadDocument()
	if err != nil {
		return err
	}

	for f, fvr, err := dr.ReadElement(); err != bsonrw.ErrEOD; f, fvr, err = dr.ReadElement() {
		if err != nil {
			return err
		}

		// only unmarshal proto message — skip other fields
		if f != r.protoField {
			if err := vr.Skip(); err != nil {
				return err
			}
			continue
		}

		pc := &ProtoCodec{}
		pc.readMessage(msg.ProtoReflect(), fvr)
	}

	return nil
}

// Write proto Message to bson. Recursively writes nested messages and oneofs
func (pc *ProtoCodec) writeMessage(m protoreflect.Message, vw bsonrw.ValueWriter) error {

	dw, err := vw.WriteDocument()
	if err != nil {
		return err
	}

	// Loop over all message elements
	m.Range(func(fd protoreflect.FieldDescriptor, val protoreflect.Value) bool {

		vw, err := dw.WriteDocumentElement(fd.JSONName())
		if err != nil {
			return false
		}

		// Write 'repeated' elements as array
		if fd.Cardinality() == protoreflect.Repeated {
			aw, err := vw.WriteArray()
			if err != nil {
				klog.Errorf("error starting array write: %v", err)
				return false
			}

			for i := 0; i < val.List().Len(); i++ {
				avw, err := aw.WriteArrayElement()
				if err != nil {
					klog.Errorf("error getting array element writer: %v", err)
					return false
				}
				if err := pc.writeElement(fd, val.List().Get(i), avw); err != nil {
					klog.Errorf("error writing array element: %v", err)
					return false
				}
			}

			if err := aw.WriteArrayEnd(); err != nil {
				klog.Errorf("error ending array write: %v", err)
				return false
			}
		} else {
			// Singular element (including 'oneofs')
			if err := pc.writeElement(fd, val, vw); err != nil {
				klog.Errorf("error writing singular element: %v", err)
				return false
			}
		}

		return true
	})

	return dw.WriteDocumentEnd()
}

func (pc *ProtoCodec) writeElement(fd protoreflect.FieldDescriptor, val protoreflect.Value, vw bsonrw.ValueWriter) error {
	switch fd.Kind() {
	case protoreflect.StringKind:
		return vw.WriteString(val.String())
	case protoreflect.Int32Kind:
		return vw.WriteInt32(int32(val.Int()))
	case protoreflect.Int64Kind:
		return vw.WriteInt64(int64(val.Int()))
	case protoreflect.DoubleKind:
		return vw.WriteDouble(val.Float())
	case protoreflect.BoolKind:
		return vw.WriteBoolean(val.Bool())
	case protoreflect.EnumKind:
		return vw.WriteInt32(int32(val.Enum()))
	case protoreflect.MessageKind:
		md := fd.Message()
		switch md.FullName() {
		case "google.protobuf.Timestamp":
			sec := val.Message().Get(md.Fields().ByJSONName("seconds")).Int()
			return vw.WriteDateTime(sec * 1000)
		default:
			return pc.writeMessage(val.Message(), vw)
		}
	default:
		return fmt.Errorf("unexpected kind for element %s, value %v", fd.JSONName(), val)
	}
}

// Read bson document into proto Message. Recursively reads nested documents
// into nested messages and oneofs
func (pc *ProtoCodec) readMessage(m protoreflect.Message, vr bsonrw.ValueReader) error {

	fields := m.Descriptor().Fields()

	dr, err := vr.ReadDocument()
	if err != nil {
		return err
	}

	for f, fvr, err := dr.ReadElement(); err != bsonrw.ErrEOD; f, fvr, err = dr.ReadElement() {
		if err != nil {
			return err
		}

		fd := fields.ByJSONName(f)
		if fd == nil {
			if err := fvr.Skip(); err != nil {
				return err
			}
			continue
		}

		if fd.IsList() {
			ar, err := fvr.ReadArray()
			if err != nil {
				return err
			}

			// Initialise list - it needs to be explicitly created
			ls := m.NewField(fd)

			for vr, err := ar.ReadValue(); err != bsonrw.ErrEOA; vr, err = ar.ReadValue() {
				if err != nil {
					return err
				}
				val, err := pc.readElement(ls, fd, vr)
				if err != nil {
					return err
				}
				ls.List().Append(val)
			}

			// Update field with list
			m.Set(fd, ls)
		} else {
			// Singular element (including 'oneofs')
			val, err := pc.readElement(m.Get(fd), fd, fvr)
			if err != nil {
				return err
			}
			m.Set(fd, val)
		}
	}

	return nil
}

func (pc *ProtoCodec) readElement(f protoreflect.Value, fd protoreflect.FieldDescriptor, vr bsonrw.ValueReader) (protoreflect.Value, error) {

	switch fd.Kind() {
	case protoreflect.StringKind:
		mval, err := vr.ReadString()
		if err != nil {
			return protoreflect.Value{}, err
		}
		return protoreflect.ValueOfString(mval), nil
	case protoreflect.Int32Kind:
		mval, err := vr.ReadInt32()
		if err != nil {
			return protoreflect.Value{}, err
		}
		return protoreflect.ValueOfInt32(mval), nil
	case protoreflect.Int64Kind:
		mval, err := vr.ReadInt64()
		if err != nil {
			return protoreflect.Value{}, err
		}
		return protoreflect.ValueOfInt64(mval), nil
	case protoreflect.DoubleKind:
		mval, err := vr.ReadDouble()
		if err != nil {
			return protoreflect.Value{}, err
		}
		return protoreflect.ValueOfFloat64(mval), nil
	case protoreflect.EnumKind:
		mval, err := vr.ReadInt32()
		if err != nil {
			return protoreflect.Value{}, err
		}
		return protoreflect.ValueOfEnum(protoreflect.EnumNumber(mval)), nil
	case protoreflect.BoolKind:
		mval, err := vr.ReadBoolean()
		if err != nil {
			return protoreflect.Value{}, err
		}
		return protoreflect.ValueOfBool(mval), nil
	case protoreflect.MessageKind:
		var msg protoreflect.Message
		if fd.IsList() {
			msg = f.List().NewElement().Message()
		} else {
			msg = f.Message().New()
		}

		md := fd.Message()
		switch md.FullName() {
		case "google.protobuf.Timestamp":
			mval, err := vr.ReadDateTime()
			if err != nil {
				return protoreflect.Value{}, err
			}
			msg.Set(md.Fields().ByJSONName("seconds"), protoreflect.ValueOfInt64(mval/1000))
		default:
			if err := pc.readMessage(msg, vr); err != nil {
				return protoreflect.Value{}, err
			}
		}
		return protoreflect.ValueOfMessage(msg), nil
	default:
		if err := vr.Skip(); err != nil {
			return protoreflect.Value{}, err
		}
	}

	return protoreflect.Value{}, nil
}

// EncodeValue provides custom encoding for structs that contain proto messages
func (wc *WrapperCodec) EncodeValue(ctx bsoncodec.EncodeContext, vw bsonrw.ValueWriter, val reflect.Value) error {

	dw, err := vw.WriteDocument()
	if err != nil {
		return err
	}

	t := reflect.Indirect(val).Type()

	for i := 0; i < t.NumField(); i++ {
		fVal := val.FieldByName(t.Field(i).Name)

		// TODO: improve bson field name look up
		// bson field name
		bsonName := t.Field(i).Tag.Get("bson")
		if bsonName == "message" {
			bsonName = wc.protoField
		}

		if !fVal.IsZero() {
			fvw, err := dw.WriteDocumentElement(bsonName)
			if err != nil {
				return err
			}
			enc, err := ctx.LookupEncoder(fVal.Type())
			if err != nil {
				return err
			}
			if err := enc.EncodeValue(ctx, fvw, fVal); err != nil {
				return err
			}
		}
	}

	return dw.WriteDocumentEnd()
}

// DecodeValue provides customer decoding for structs that contain proto messages
func (wc *WrapperCodec) DecodeValue(ctx bsoncodec.DecodeContext, vr bsonrw.ValueReader, val reflect.Value) error {

	if !val.IsValid() || !val.CanSet() || val.Kind() != reflect.Struct {
		return bsoncodec.ValueDecoderError{
			Name:     "CustDecodeValue",
			Kinds:    []reflect.Kind{reflect.Struct},
			Received: val,
		}
	}

	// read top-level data to struct
	dr, err := vr.ReadDocument()
	if err != nil {
		return err
	}

	for f, fvr, err := dr.ReadElement(); err != bsonrw.ErrEOD; f, fvr, err = dr.ReadElement() {
		if err != nil {
			return err
		}

		// TODO: improve struct field name look up
		// find struct field from bson field name
		fval := val.FieldByNameFunc(func(name string) bool {
			if name == "Message" && f == wc.protoField {
				return true
			}
			return strings.EqualFold(name, f)
		})

		if !fval.IsValid() || !fval.CanSet() {
			if err := vr.Skip(); err != nil {
				return err
			}
			continue
		}

		// Read data into struct field
		switch fval.Kind() {
		case reflect.String:
			// Save time (?) on known data types
			val, err := fvr.ReadString()
			if err != nil {
				return err
			}
			fval.SetString(val)
		default:
			// Cover any other data type
			dec, err := ctx.LookupDecoder(fval.Type())
			if err != nil {
				return err
			}
			if err := dec.DecodeValue(ctx, fvr, fval); err != nil {
				return err
			}
		}
	}

	return nil
}

// EncodeValue provides custom encoding for proto messages saved to Mongo
func (pc *ProtoCodec) EncodeValue(ctx bsoncodec.EncodeContext, vw bsonrw.ValueWriter, val reflect.Value) error {
	pb := val.Interface().(proto.Message)
	return pc.writeMessage(pb.ProtoReflect(), vw)
}

// DecodeValue provides custom decoding for proto messages stored in Mongo
func (pc *ProtoCodec) DecodeValue(ctx bsoncodec.DecodeContext, vr bsonrw.ValueReader, val reflect.Value) error {

	// Create message instance if nil
	if val.IsNil() {
		val.Set(reflect.New(val.Type().Elem()))
	}

	pb := val.Interface().(proto.Message)
	return pc.readMessage(pb.ProtoReflect(), vr)
}
