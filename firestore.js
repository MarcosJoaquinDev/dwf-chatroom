"use strict";
exports.__esModule = true;
exports.RTDB = exports.DATA_BASE = void 0;
var admin = require("firebase-admin");
var serviceAccount = require("./key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://dwf-m6-mj-dev-default-rtdb.firebaseio.com"
});
var DATA_BASE = admin.firestore();
exports.DATA_BASE = DATA_BASE;
var RTDB = admin.database();
exports.RTDB = RTDB;
