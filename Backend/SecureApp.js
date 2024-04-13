const KeyGenerator = require("./KeyGenerator");
const User = require("./User");
const Group = require("./Group");
const express = require("express");
const cors = require('cors');
require('dotenv').config();
const { PORT, AWS_REGION, TABLE_NAME } = process.env;
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocument } = require('@aws-sdk/lib-dynamodb');


class SecureApp {
    constructor() {
        this.groups = [];
        this.users = [];
        this.setUpExpressApp();
    }

    run = async () => {
        const keyGenerator = new KeyGenerator();
        
        const numUsers = 3;
        try {
            for(let i = 0; i < numUsers; i++) {
                this.users.push(User.createUser("Mr. " + i, keyGenerator));
            }
            this.users = await Promise.all(this.users);
        } catch (error) { 
            console.error("Error generating keys: ", error);
        }
    
        const someGroup = new Group([this.users[0], this.users[1]]);
        // users[0].createPost("Heading here", "Hello guys!", someGroup);   
        someGroup.addUser(this.users[2]);
        // users[2].createPost("Second heading here", "Second hello guys!", someGroup);
    }

    setUpExpressApp = () => {
        const app = express();
        app.use(express.json());
        app.use(cors());
    
        const client = new DynamoDBClient({
            region: AWS_REGION
        });
        const documentClient = DynamoDBDocument.from(client);
    
        app.get('/api/getData', async (_, res)  => {
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

        app.get('/api/getUsers', (_, res) => {
            res.json(this.users);
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
}

const secureApp = new SecureApp();
secureApp.run();        


