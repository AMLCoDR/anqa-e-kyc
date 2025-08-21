FROM golang:alpine AS builder

# Create an unprivileged user
RUN adduser \    
    --disabled-password \    
    --gecos "" \    
    --home "/nonexistent" \    
    --shell "/sbin/nologin" \    
    --no-create-home \    
    --uid 10001 \    
    appuser

# Get CA certs required for HTTPS. Git is required for dependencies.
RUN apk update  && apk upgrade && apk add --no-cache git
# ca-certificates <- not 

# Set working directory /src (default dir is /go)
WORKDIR /src
COPY . .

# Access private repos
ARG GITHUB_USER
ARG GITHUB_PASSWORD
ARG BUF_USER
ARG BUF_PASSWORD

RUN echo "machine github.com login $GITHUB_USER password $GITHUB_PASSWORD" >> ~/.netrc
RUN echo "machine go.buf.build login $BUF_USER password $BUF_PASSWORD" >> ~/.netrc
RUN go env -w GOPRIVATE="github.com/anqaml/*,go.buf.build"

# Build as static-linked binary (no external dependencies).
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -installsuffix cgo -o /app

# Build minimal image (800mb -> 15Mb)
FROM scratch

COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /etc/group /etc/group
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /app /app

# Perform any further action as an unprivileged user
USER appuser:appuser
ENTRYPOINT ["/app"]