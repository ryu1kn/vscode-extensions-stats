# vscode-extensions-stats

AWS Lambda function to save my Visual Studio Code extension stats into DynamoDB

## Package Lambda

Go to lambda-uploader directory and execute following

```sh
node --harmony_rest_parameters upload-lambda --function-name fetch-vscode-extension-stats --config ./config/vsc-extension-stats.json
```
