package trc

import (
	"context"
	"fmt"
	"log"
	"time"

	instana "github.com/instana/go-sensor"
	"github.com/opentracing/opentracing-go"
)

func traceMsg(ctx context.Context, lvl, msg string) {
	span, ok := instana.SpanFromContext(ctx)
	if !ok {
		log.Fatal("trace span not found in context")
	}

	span.Tracer().StartSpan(
		string(instana.LogSpanType),
		opentracing.ChildOf(span.Context()),
		opentracing.StartTime(time.Now()),
		opentracing.Tags{
			"log.level":   lvl,
			"log.message": msg,
		},
	).FinishWithOptions(
		opentracing.FinishOptions{
			FinishTime: time.Now(),
		},
	)

	log.Println(lvl + ": " + msg)
}

func traceErr(ctx context.Context, msg string) {
	span, ok := instana.SpanFromContext(ctx)
	if !ok {
		log.Fatal("trace span not found in context")
	}
	// span.LogFields(otlog.Error(errors.New("logged using LogFields")))
	// span.LogKV("error", fmt.Errorf("error getting entity: %v", err))
	span.SetTag("rpc.error", msg)
	log.Println("ERROR: " + msg)
}

// Info uses a trace span to log a message with Instana. Context is expected to
// contain an Instana trace span.
func Info(ctx context.Context, v ...interface{}) {
	traceMsg(ctx, "INFO", fmt.Sprint(v...))
}

// Infof uses a trace span to log a message with Instana. Context is expected to
// contain an Instana trace span.
func Infof(ctx context.Context, format string, v ...interface{}) {
	traceMsg(ctx, "INFO", fmt.Sprintf(format, v...))
}

// Warn uses a trace span to log a message with Instana. Context is expected to
// contain an Instana trace span.
func Warn(ctx context.Context, v ...interface{}) {
	traceMsg(ctx, "WARN", fmt.Sprint(v...))
}

// Warnf uses a trace span to log a message with Instana. Context is expected to
// contain an Instana trace span.
func Warnf(ctx context.Context, format string, v ...interface{}) {
	traceMsg(ctx, "WARN", fmt.Sprintf(format, v...))
}

// Error uses a trace span to log an error with Instana. If multiple
// errors are logged for a single request, only the final one will be displayed.
// Context is expected to contain an Instana trace span.
func Error(ctx context.Context, v ...interface{}) {
	traceErr(ctx, fmt.Sprint(v...))
}

// Errorf uses a trace span to log an error with Instana. If multiple
// errors are logged for a single request, only the final one will be displayed.
// Context is expected to contain an Instana trace span.
func Errorf(ctx context.Context, format string, v ...interface{}) {
	traceErr(ctx, fmt.Sprintf(format, v...))
}

// Fatal uses a trace span to log an error with Instana and then shut the service down.
// If multiple errors are logged for a single request, only the final one will be displayed.
// Context is expected to contain an Instana trace span.
func Fatal(ctx context.Context, v ...interface{}) {
	traceErr(ctx, fmt.Sprint(v...))
	log.Fatal(v...)
}

// Fatalf uses a trace span to log an error with Instana and then shut the service down.
// If multiple errors are logged for a single request, only the final one will be displayed.
// Context is expected to contain an Instana trace span.
func Fatalf(ctx context.Context, format string, v ...interface{}) {
	traceErr(ctx, fmt.Sprintf(format, v...))
	log.Fatalf(format, v...)
}
