import * as admin from 'firebase-admin';
const DATA_KEY = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
	credential: admin.credential.cert(DATA_KEY as any),
	databaseURL: 'https://dwf-m6-mj-dev-default-rtdb.firebaseio.com',
});
const DATA_BASE = admin.firestore();
const RTDB = admin.database();

export { DATA_BASE, RTDB };
