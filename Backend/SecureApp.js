

const KeyGenerator = require("./KeyGenerator");
const User = require("./User");
const Group = require("./Group");
const express = require("express");
const cors = require('cors');
const app = express();
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocument } = require('@aws-sdk/lib-dynamodb');

app.use(express.json());
app.use(cors());
require('dotenv').config();
const { PORT, AWS_REGION, TABLE_NAME } = process.env;


class SecureApp {
    constructor() {
        this.groups = [];
    }

    run = async () => {
        const keyGenerator = new KeyGenerator();
        let users = [];
        const numUsers = 3;
        try {
            for(let i = 0; i < numUsers; i++) {
                users.push(User.createUser("Mr. " + i, keyGenerator));
            }
            users = await Promise.all(users);
        } catch (error) { 
            console.error("Error generating keys: ", error);
        }
    
        const someGroup = new Group([users[0], users[1]]);
        // users[0].createPost("Heading here", "Hello guys!", someGroup);   
        someGroup.addUser(users[2]);
        // users[2].createPost("Second heading here", "Second hello guys!", someGroup);
    }
}

const client = new DynamoDBClient({
    region: AWS_REGION
});

const documentClient = DynamoDBDocument.from(client); 

const secureApp = new SecureApp();
secureApp.run();

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
    res.json({Hello: "WTF"});
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

