'use strict';

const AWS = require('aws-sdk');
const ExtensionGalleryReader = require('./lib/extension-gallery-reader');
const request = require('request');

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    new ExtensionGalleryReader({request}).read()
        .then(data => data.results[0].extensions)
        .then(records => {
            const date = new Date();

            // TODO: Rewrite with batchWrite
            return Promise.all(records.map(record => {
                const params = {
                    TableName : 'vsc-extension-stats--stats',
                    Item: {
                        extensionId: `${record.extensionId}`,
                        fetchedAt: date.toISOString(),
                        raw: record
                    }
                };
                return docClient.put(params).promise();
            }));
        })
        .then(
            () => callback(),
            e => callback(e)
        );
};
