"use strict";
exports.__esModule = true;
var express = require("express");
var cors = require("cors");
var firestore_1 = require("./firestore");
var uuid_1 = require("uuid");
var APP = express();
APP.use(cors());
APP.use(express.json());
var PORT = process.env.PORT || 3000;
function main() {
    APP.listen(PORT, function () { return console.log("inizalite in http://localhost:".concat(PORT)); });
    var userCollection = firestore_1.DATA_BASE.collection('users');
    var roomsCollection = firestore_1.DATA_BASE.collection('rooms');
    APP.post('/signup', function (req, res) {
        var email = req.body.email;
        var name = req.body.name;
        userCollection
            .where('email', '==', email)
            .get()
            .then(function (result) {
            if (result.empty) {
                userCollection.add({ email: email, name: name }).then(function (newUser) {
                    res.json({ id: newUser.id });
                });
            }
            else {
                res.status(400).json({
                    message: 'user exist'
                });
            }
        });
    });
    APP.post('/signin', function (req, res) {
        var email = req.body.email;
        userCollection
            .where('email', '==', email)
            .get()
            .then(function (result) {
            if (result.empty) {
                res.status(404).json({ message: 'not found' });
            }
            else {
                res.json({ id: result.docs[0].id });
            }
        });
    });
    APP.get('/name', function (req, res) {
        var email = req.query.email;
        userCollection
            .where('email', '==', email)
            .get()
            .then(function (result) {
            if (result.empty) {
                res.status(404).json({ message: 'not found' });
            }
            else {
                res.json(result.docs[0].data().name);
            }
        });
    });
    APP.post('/rooms', function (req, res) {
        var userId = req.body.userId;
        userCollection
            .doc(userId)
            .get()
            .then(function (doc) {
            if (doc.exists) {
                var roomRef_1 = firestore_1.RTDB.ref('rooms/' + (0, uuid_1.v4)());
                roomRef_1.set({ messages: [''] }).then(function () {
                    var longID = roomRef_1.key;
                    var roomId = (10000 + Math.floor(Math.random() * 9999)).toString();
                    roomsCollection
                        .doc(roomId)
                        .set({ rtdbRoomId: longID })
                        .then(function () {
                        res.json({ id: roomId });
                    });
                });
            }
            else {
                res.status(404).json({ message: 'this user not exist' });
            }
        });
    });
    APP.get('/rooms/:roomId', function (req, res) {
        var userId = req.query.userId;
        var roomId = req.params.roomId;
        userCollection
            .doc(userId.toString())
            .get()
            .then(function (doc) {
            if (doc.exists) {
                roomsCollection
                    .doc(roomId)
                    .get()
                    .then(function (snapshot) {
                    var data = snapshot.data();
                    res.json(data);
                });
            }
            else {
                res.status(404).json({ error: 'not exist' });
            }
        });
    });
    APP.post('/messages', function (req, res) {
        var message = req.body.message;
        var rtdb_Id = req.body.rtdb_Id;
        var roomRef = firestore_1.RTDB.ref('rooms/' + rtdb_Id + '/messages');
        roomRef.push(message, function () {
            res.json({ send: 'ok' });
        });
    });
}
main();
