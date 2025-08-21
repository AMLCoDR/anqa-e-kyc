#!/bin/bash

curl -X POST \
    --data "grant_type=client_credentials&client_id=$2&client_secret=$3&resource=https%3A%2F%2Fmanagement.azure.com%2F" \
    https://login.microsoftonline.com/$1/oauth2/token