import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";
const config = {
    apiKey: "6jCkCvbZFxqFBb8GvcAynHyhe5QyDGtPmu9Ci01U",
    authDomain: "dwf-m6-mj-dev.firebaseapp.com",
    databaseURL:"https://dwf-m6-mj-dev-default-rtdb.firebaseio.com/",
}

const APP = initializeApp(config);
const RTDB = getDatabase(APP);

export{RTDB}