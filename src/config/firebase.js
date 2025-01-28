const admin = require("firebase-admin")
const serviceAccount = require("./serviceAccountKey.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'tastybites-390b3.appspot.com'
})
const db = admin.firestore();


db.collection('testCollection')
  .get()
  .then((snapshot) => {
    console.log('Firestore connection successful!');
    snapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
    });
  })
  .catch((error) => {
    console.error('Error connecting to Firestore:', error);
  })

module.exports = { db , admin };

