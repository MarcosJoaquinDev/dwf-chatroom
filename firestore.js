"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RTDB = exports.DATA_BASE = void 0;
const admin = require("firebase-admin");
const serviceAccount = require("./key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://dwf-m6-mj-dev-default-rtdb.firebaseio.com"
});
const DATA_BASE = admin.firestore();
exports.DATA_BASE = DATA_BASE;
const RTDB = admin.database();
exports.RTDB = RTDB;
