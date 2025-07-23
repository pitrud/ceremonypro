const admin = require('firebase-admin');
const serviceAccount = require('./weddingapp-92b28-firebase-adminsdk-fbsvc-651f9e75f5.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
