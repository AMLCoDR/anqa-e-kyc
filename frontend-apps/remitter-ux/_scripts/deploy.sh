
az login --tenant 6348743c-9db1-4129-8b8a-5d3763204979

yarn build && \
CNN_STRING=`az storage account show-connection-string \
    --name streactstg --subscription Staging | jq '.connectionString'` && \
az storage blob sync --source "./build/" --container \$web/poc --connection-string $CNN_STRING
