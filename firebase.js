import firebase from "firebase";
const firebaseConfig = {
  databaseURL: 'https://seek-1be1b.firebaseio.com',
  apiKey: "AIzaSyAydVpIzgKTP-LCn5ngCpPv0Bi0x6AZZD0",
  authDomain: "seek-1be1b.firebaseapp.com",
  projectId: "seek-1be1b",
  storageBucket: "seek-1be1b.appspot.com",
  messagingSenderId: "498531436216",
  appId: "1:498531436216:web:aaf0c6d3a82c3d13f4164d",
  measurementId: "G-SKRM3WNHSL"
};


const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export { db, auth, storage ,firebaseApp};