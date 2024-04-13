const crypto = require('crypto');
const Post = require("./Post");


class User {
    #privateKey;
    #groupKey;
    #iv;
    constructor(name, publicKey, privateKey) {
        this.name = name;
        this.publicKey = publicKey;
        this.#groupKey = null;
        this.#iv = null;
        this.#privateKey = privateKey;
    }
ß
    static async createUser(name, keyGenerator) {
        try { 
            const{publicKey, privateKey} = await keyGenerator.generateKeys();
            return new User(name, publicKey, privateKey);
        } catch (error) {
            console.error("Error generating keys: ", error);
        }
    }

    encryptWithPublic(plainText) {
        return crypto.publicEncrypt(this.publicKey, Buffer.from(plainText)).toString("base64");
    }

    // Adjust decryptWithPrivate to return a Buffer
    decryptWithPrivate(encrypted) {
        return crypto.privateDecrypt(this.#privateKey, Buffer.from(encrypted, "base64"));
    }

    updateGroupKey(newGroupKeyEncryptedWithPublicKey, newIVEncryptedWithPublicKey) {
        this.#groupKey = this.decryptWithPrivate(newGroupKeyEncryptedWithPublicKey);
        this.#iv = this.decryptWithPrivate(newIVEncryptedWithPublicKey);
        console.log(`${this.name} new group key ${this.#groupKey} and iv ${this.#iv}`);
    }

    createPost(title, content, group) {
        const post = new Post(title, content, this.name);
        group.send(post);
    }

    viewPost(postEncryptedWithGroupKey) {
        const decrypted = this.decryptObjectWithGroupKey(postEncryptedWithGroupKey);
        console.log(decrypted);
    }

    decryptObjectWithGroupKey(encryptedData) {
        const decipher = crypto.createDecipheriv('aes-256-cbc', this.#groupKey, this.#iv);
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return JSON.parse(decrypted);
    }
}

module.exports = User;