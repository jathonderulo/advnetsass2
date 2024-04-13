

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
        users[0].createPost("Heading here", "Hello guys!", someGroup);   
        someGroup.addUser(users[2]);
        users[2].createPost("Second heading here", "Second hello guys!", someGroup);
    }
}

const client = new DynamoDBClient({
    region: AWS_REGION
});

const documentClient = DynamoDBDocument.from(client); 

const secureApp = new SecureApp();
secureApp.run();

app.get('/api/get', async (req, res)  => {
    // console.log('Data received:', req.body.data); // Log the data received  
    const pKey = req.query;
    if (!pKey) {
        return res.status(400).json({ error: 'PKey parameter is required' });
    }
    const resFromDB = await documentClient.get({
        TableName: TABLE_NAME,
        Key: pKey
    });
    const item = resFromDB.Item;
    console.log(item);  
    res.json({ item });
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



// const test = async () => {
     
//     const item1 = {Hello: "World"};
//     const item2 = {Jason: "Liu"};
//     const item3 = {Mia:"Cimas"};

//     await documentClient.put({
//         TableName: process.env.TABLE_NAME,
//         Item: {
//             PKey: "Item 1",
//             ...item1,
//         },
//     });

//     await documentClient.put({
//         TableName: process.env.TABLE_NAME,
//         Item: {
//             PKey: "Item 2",
//             ...item2,
//         },
//         });

//     await documentClient.put({
//         TableName: process.env.TABLE_NAME,
//         Item: {
//             PKey: "Item 3",
//             ...item3,
//         },
//         });

//     const res = await documentClient.get({
//     TableName: TABLE_NAME,
//     Key:{
//             PKey: "Item 2"
//         }
//     });
//     const item = res.Item;
//     console.log(item);

//     const params = {
//         TableName: TABLE_NAME
//     };

//     try {
//         const params = { TableName: TABLE_NAME };
//         const data = await documentClient.scan(params);
//         console.log("Scan succeeded.");
//         data.Items.forEach(item => {
//             console.log("Item :", JSON.stringify(item));
//         });
//     } catch (err) {
//         console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
//     }
// }
// test();
