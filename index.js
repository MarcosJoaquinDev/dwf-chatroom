"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const firestore_1 = require("./firestore");
const uuid_1 = require("uuid");
const APP = express();
APP.use(cors());
APP.use(express.json());
const PORT = process.env.PORT || 3000;
function main() {
    APP.listen(PORT, () => console.log(`inizalite in http://localhost:${PORT}`));
    const userCollection = firestore_1.DATA_BASE.collection('users');
    const roomsCollection = firestore_1.DATA_BASE.collection('rooms');
    APP.post('/signup', (req, res) => {
        const { email } = req.body;
        const { name } = req.body;
        userCollection
            .where('email', '==', email)
            .get()
            .then((result) => {
            if (result.empty) {
                userCollection.add({ email: email, name: name }).then((newUser) => {
                    res.json({ id: newUser.id });
                });
            }
            else {
                res.status(400).json({
                    message: 'user exist',
                });
            }
        });
    });
    APP.post('/signin', (req, res) => {
        const { email } = req.body;
        userCollection
            .where('email', '==', email)
            .get()
            .then((result) => {
            if (result.empty) {
                res.status(404).json({ message: 'not found' });
            }
            else {
                res.json({ id: result.docs[0].id });
            }
        });
    });
    APP.get('/name', (req, res) => {
        const { email } = req.query;
        userCollection
            .where('email', '==', email)
            .get()
            .then((result) => {
            if (result.empty) {
                res.status(404).json({ message: 'not found' });
            }
            else {
                res.json(result.docs[0].data().name);
            }
        });
    });
    APP.post('/rooms', (req, res) => {
        const { userId } = req.body;
        userCollection
            .doc(userId)
            .get()
            .then((doc) => {
            if (doc.exists) {
                const roomRef = firestore_1.RTDB.ref('rooms/' + (0, uuid_1.v4)());
                roomRef.set({ messages: [''] }).then(() => {
                    const longID = roomRef.key;
                    const roomId = (10000 + Math.floor(Math.random() * 9999)).toString();
                    roomsCollection
                        .doc(roomId)
                        .set({ rtdbRoomId: longID })
                        .then(() => {
                        res.json({ id: roomId });
                    });
                });
            }
            else {
                res.status(404).json({ message: 'this user not exist' });
            }
        });
    });
    APP.get('/rooms/:roomId', (req, res) => {
        const { userId } = req.query;
        const { roomId } = req.params;
        userCollection
            .doc(userId.toString())
            .get()
            .then((doc) => {
            if (doc.exists) {
                roomsCollection
                    .doc(roomId)
                    .get()
                    .then((snapshot) => {
                    const data = snapshot.data();
                    res.json(data);
                });
            }
            else {
                res.status(404).json({ error: 'not exist' });
            }
        });
    });
    APP.post('/messages', (req, res) => {
        const { message } = req.body;
        const { rtdb_Id } = req.body;
        const roomRef = firestore_1.RTDB.ref('rooms/' + rtdb_Id + '/messages');
        roomRef.push(message, () => {
            res.json({ send: 'ok' });
        });
    });
}
main();
