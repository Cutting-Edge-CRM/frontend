import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";
import { getTenantForUser } from "../api/tenant.api";
import { addUserToTenant, inviteUser } from "../api/user.api";
import {v4 as uuidv4} from 'uuid';
import { ErrorTypes } from "../util/errors";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB3PRaHg07hAlzTuiUqsb0fijJQ6RIs4Bs",
    authDomain: "sern-371617.firebaseapp.com",
    projectId: "sern-371617",
    storageBucket: "sern-371617.appspot.com",
    messagingSenderId: "775052226540",
    appId: "1:775052226540:web:4d358654b1f495ed341ac9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
var currentUser: User;
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    return getTenantForUser(email).then(res => {
      let tenantId = res.company;
      auth.tenantId = tenantId;
      return signInWithEmailAndPassword(auth, email, password)
      .then(res => {
        return res;
      }).catch(err => {
        return Promise.reject(new Error(ErrorTypes.INVALIDCREDENTIALS));
      })
    }).catch(err => {
      return Promise.reject(err);
    })
  } catch (err) {
    return Promise.reject(err);
  }
};

const registerWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      authProvider: "local",
      email,
    });
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

const registerNewTenantUser = async (id: string, email: string, password: string) => {
  try {
    auth.tenantId = id;
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addUserToTenant(auth.tenantId, email, user.uid);
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      authProvider: "local",
      email,
    });
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

const inviteNewUser = async (name: string, email: string) => {
  try {
    // TODO: pass params to server and create user there so it doesn't login user
    const tmpPass = uuidv4();
    createUserWithEmailAndPassword(auth, email, tmpPass).then(userCred => {
      inviteUser(email, name, userCred.user.uid);
    }).catch(err => {
      console.error(err);
    })
  } catch {

  }
}

const sendPasswordReset = async (email: string) => {
  try {
    getTenantForUser(email).then(res => {
      let tenantId = res.company;
      auth.tenantId = tenantId;
      sendPasswordResetEmail(auth, email);
    }).catch(err => {
      console.error(err);
    })
    alert("Password reset link sent!");
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    auth.tenantId = user.tenantId;
    currentUser = user;
    console.log(currentUser);
    // ...
  } else {
    console.log('not logged in');
    // User is signed out
    // ...
  }
});

export {
  auth,
  db,
  currentUser,
  onAuthStateChanged,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  registerNewTenantUser,
  inviteNewUser
};