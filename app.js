
const aws = require('aws-sdk');
const fs = require('fs');

const argv = require('minimist')(process.argv.slice(2));

const config = JSON.parse(fs.readFileSync(argv.config, 'utf8'));
const docClient = new aws.DynamoDB.DocumentClient({
    region: config['aws.region'],
    accessKeyId: config['aws.accessKeyId'],
    secretAccessKey: config['aws.secretAccessKey']
});

const params = {
    TableName : 'vsc-extension-stats--stats',
    KeyConditionExpression: 'extensionId = :extId',
    ExpressionAttributeValues: {
        ':extId': '2100095e-ca9e-42ef-9bb4-5da1002c8139'
    }
};
docClient.query(params).promise()
    .then(data => data.Items.map(item => item.raw.statistics))
    .then(items => items.map(
        item => item.filter(attribute => attribute.statisticName === 'install')[0].value
    ))
    .then(stats => {
        console.log(JSON.stringify(stats, null, 2));
    }).catch(e => {
        console.log(e);
    });
