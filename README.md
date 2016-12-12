# vscode-extensions-stats

AWS Lambda function to save my Visual Studio Code extension stats into DynamoDB

## Deploy lambda

Now vscode-extensions-stats uses [kumo](https://www.npmjs.com/package/kumo-plugins) to deploy the lambda.
Go to `lambdas/fetch-vscode-extension-stats` directory and execute following:

```sh
$ kumo deploy-module --region ap-southeast-2 --env dev --verbose
```

## Run app to get install counts per extensions

```sh
$ node app --config path/to/config.json
```

```json
{
  "aws.region": "REGION",
  "aws.accessKeyId": "ACCESS_KEY_ID",
  "aws.secretAccessKey": "SECRET_ACCESS_KEY"
}
```