const crypto = require('crypto');

class Group {
    #groupKey;
    #iv;
    constructor(listOfUsers) {
        this.listOfUsers = listOfUsers;
        this.updateUserGroupKeys();
    }

    updateUserGroupKeys() {
        this.#groupKey = crypto.randomBytes(32);
        this.#iv = crypto.randomBytes(16);
        // console.log(`group iv is ${this.#iv.toString('hex')}`);
        // console.log(`group group key is ${this.#groupKey.toString('hex')}`);
        for(let i = 0; i < this.listOfUsers.length; i++) {
            const encryptedGroupKeyWithPublicKey = this.listOfUsers[i].encryptWithPublic(this.#groupKey);
            const encryptedIVWithPublicKey = this.listOfUsers[i].encryptWithPublic(this.#iv);

            this.listOfUsers[i].updateGroupKey(encryptedGroupKeyWithPublicKey, encryptedIVWithPublicKey);
        }
    }

    encryptWithGroupKey(post) {
        // const serializedPost = JSON.stringify(post);
        const cipher = crypto.createCipheriv('aes-256-cbc', this.#groupKey, this.#iv);
        let encrypted = cipher.update(post, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    send(post) {        
        for(let i = 0; i < this.listOfUsers.length; i++) {
            this.listOfUsers[i].viewPost(this.encryptWithGroupKey(post));
        }
    }

    addUser(user) {
        this.listOfUsers.push(user);
        console.log(`User ${user.name} added!`);
        this.updateUserGroupKeys();
    }

    removeUser(userToRemove) {
        if (this.listOfUsers.find(user => user.name === userToRemove.name)) {
            this.listOfUsers = this.listOfUsers.filter(user => user.name !== userToRemove.name);
            console.log(`Removed user ${userToRemove.name}.`)
        } else {
            console.log(`Error: user ${userToRemove.name} was not in the list in the first place. `)
        }
    }


}

module.exports = Group;