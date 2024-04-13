const crypto = require('crypto');

class KeyGenerator {

    generateKeys() {
        return new Promise((resolve, reject) => {
            // Generate a key pair asynchronously
            crypto.generateKeyPair('rsa', {
                modulusLength: 2048, // length of the modulus in bits
                publicKeyEncoding: {
                    type: 'spki', // SubjectPublicKeyInfo (SPKI)
                    format: 'pem' // PEM encoding
                },
                privateKeyEncoding: {
                    type: 'pkcs8', // PrivateKeyInfo (PKCS #8)
                    format: 'pem' // PEM encoding
                }
            }, (err, publicKey, privateKey) => {
                if (err) {
                    console.error('Error generating key pair:', err);
                    return;
                } 
                resolve({publicKey, privateKey});
            });
        });
    }
}

module.exports = KeyGenerator;