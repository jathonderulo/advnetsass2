const express = require("express");
const cors = require('cors');
require('dotenv').config();
const { PORT, AWS_REGION, TABLE_NAME } = process.env;
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocument } = require('@aws-sdk/lib-dynamodb');

const setUpExpressApp = () => {
    const app = express();
    app.use(express.json());
    app.use(cors());

    const client = new DynamoDBClient({
        region: AWS_REGION
    });
    const documentClient = DynamoDBDocument.from(client);

    app.get('/api/get', async (_, res)  => {
        let data = "";
        try {
            const params = { TableName: TABLE_NAME };
            data = await documentClient.scan(params);
            console.log("Scan succeeded.");
            data.Items.forEach(item => {
                console.log("Item :", JSON.stringify(item));
            });
        } catch (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        }
        res.json(data);
    });

    app.post('/api/post', async (req, res) => {
        const title = req.body.Title;
        const content = req.body.Content;
        console.log(title, content);
        await documentClient.put({
            TableName: process.env.TABLE_NAME,
            Item: {
                PKey: req.body.PKey,
                ...{title: title, content: content}
            },
        });
        res.json({Message: "Success ig??"});
    });

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

module.exports = setUpExpressApp;
