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
        this.groups.push(someGroup);
        // users[0].createPost("Heading here", "Hello guys!", someGroup);   
        // someGroup.addUser(this.users[2]);
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

        app.get('/api/get', async (req, res)  => {
            try {
                const response = await documentClient.get({
                    TableName: process.env.TABLE_NAME,
                    Key: {
                        PKey: req.query.PKey
                    }
                });
                const item = response.Item;
                console.log("Item is " + item.content);
                console.log("Decrypted is " + this.users[0].decryptObjectWithGroupKey(item.content));
                res.json(item.content);
            } catch (err) {
                console.error("ERROR:", err.message);
            }
        });

        app.get('/api/getUsers', (_, res) => {
            res.json(this.users);
        });
    
        app.post('/api/post', async (req, res) => {
            const title = req.body.Title;
            console.log(parseInt(req.body.Group));
            const encryptedContent = this.groups[parseInt(req.body.Group)].encryptWithGroupKey(req.body.Content);
            const group = req.body.Group;
            // console.log(`Encrypted content is ${encryptedContent.toString('hex')}`);
            await documentClient.put({
                TableName: process.env.TABLE_NAME,
                Item: {
                    PKey: req.body.PKey,
                    ...{group: group, title: title, content: encryptedContent}
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




