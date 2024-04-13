const setUpExpressApp = require('./expressSetup');
const KeyGenerator = require("./KeyGenerator");
const User = require("./User");
const Group = require("./Group");


class SecureApp {
    constructor() {
        this.groups = [];
        setUpExpressApp();
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

const secureApp = new SecureApp();
secureApp.run();        


