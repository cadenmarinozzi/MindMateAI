const { initializeApp } = require('firebase/app');
const {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} = require('firebase/auth');
const {
	doc,
	getDoc,
	setDoc,
	collection,
	addDoc,
	deleteDoc,
	updateDoc,
} = require('firebase/firestore');
const { getFirestore } = require('firebase/firestore');
const utils = require('../../modules/utils');
require('dotenv').config();

const firebaseConfig = {
	apiKey: process.env._FIREBASE_API_KEY,
	authDomain: process.env._FIREBASE_AUTH_DOMAIN,
	projectId: process.env._FIREBASE_PROJECT_ID,
	storageBucket: process.env._FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env._FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env._FIREBASE_APP_ID,
	measurementId: process.env._FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

async function editUserNickname({ email, password, nickname }) {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);

		if (!userCredential) {
			return false;
		}

		const userId = utils.emailToFirebaseID(email);

		await updateDoc(doc(firestore, 'users', userId), {
			nickname,
		});

		return true;
	} catch (err) {
		console.error(err);

		return false;
	}
}

async function createUser({ email, password, nickname }) {
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;

		const userId = utils.emailToFirebaseID(email);

		await setDoc(doc(firestore, 'users', userId), {
			nickname,
			email,
		});

		return true;
	} catch (err) {
		console.error(err);

		return false;
	}
}

async function deleteAccount({ email, password }) {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;

		if (!user) {
			return;
		}

		const userId = utils.emailToFirebaseID(email);

		await deleteDoc(doc(firestore, 'users', userId));

		await user.delete();

		return true;
	} catch (err) {
		console.error(err);

		return false;
	}
}

async function login({ email, password }) {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;

		if (!user) {
			return;
		}

		const userId = utils.emailToFirebaseID(email);

		const userDoc = await getDoc(doc(firestore, 'users', userId));

		if (!userDoc.exists()) {
			return false;
		}

		const userData = userDoc.data();

		return userData;
	} catch (err) {
		console.error(err);

		return false;
	}
}

exports.createUser = createUser;
exports.login = login;
exports.deleteAccount = deleteAccount;
exports.editUserNickname = editUserNickname;
