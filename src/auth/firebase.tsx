import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User,
  signInAnonymously,
  updatePassword,
  signInWithEmailLink,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
} from "firebase/firestore";
import { getTenantForClient, getTenantForUser } from "../api/tenant.api";
import { addUserToTenant } from "../api/user.api";
// import {v4 as uuidv4} from 'uuid';
import { ErrorTypes } from "../util/errors";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
var currentUser: User;
var currentUserClaims: any;
const db = getFirestore(app);
// const googleProvider = new GoogleAuthProvider();

const setNewPassword = (password: string) => {
  console.log(password);
  return updatePassword(currentUser, password)
  .then(res => {
    return res;
  }, err => {
    console.log(err);
    return Promise.reject(new Error(ErrorTypes.UNKNOWNERROR));
  }).catch(err => {
    console.log(err);
    return Promise.reject(new Error(ErrorTypes.UNKNOWNERROR));
  })
}

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

// const logInWithGoogle = async () => {

//   signInWithPopup(auth, googleProvider)
//   .then((result) => {
//     // This gives you a Google Access Token. You can use it to access the Google API.
//     const credential = GoogleAuthProvider.credentialFromResult(result);
//     const token = credential?.accessToken;
//     // The signed-in user info.
//     const user = result.user;
//     // IdP data available using getAdditionalUserInfo(result)
//     // ...
//     console.log(user);
//     console.log(token);
//   }).catch((error) => {
//     console.error(error);
//   });
// };

const loginAnonymously = async (client: string) => {
  try {
    return getTenantForClient(client).then(res => {
      let tenantId = res.company;
      auth.tenantId = tenantId;
      return signInAnonymously(auth)
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
    }).catch(err => {
      return Promise.reject(err);
    })
  } catch (err) {
    return Promise.reject(err);
  }
}

const signInFromEmail = async (email: string, link: string) => {
  try {
    return getTenantForUser(email).then(res => {
      let tenantId = res.company;
      auth.tenantId = tenantId;
      return signInWithEmailLink(auth, email, link)
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
    }).catch(err => {
      return Promise.reject(err);
    })
  } catch (err) {
    return Promise.reject(err);
  }
}

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
    createUserWithEmailAndPassword(auth, email, password)
    .then(res => {
      const user = res.user;
      // set user permissions
      addUserToTenant(auth.tenantId as string, email, user.uid)
      .then(_ => {
        addDoc(collection(db, "users"), {
          uid: user.uid,
          authProvider: "local",
          email,
        }).then(_ => {
          currentUser.getIdToken(true)
          .then(res => {
            // successfully created new user
          }, err => {
            console.error(err);
          })
        }, err => {
          console.error(err);
        })
      }, err => {
        console.error(err);
      })
    }, err => {
      console.error(err);
    })
    
    
  } catch (err: any) {
    console.error(err);
  }
};

const sendPasswordReset = async (email: string) => {
  try {
    return getTenantForUser(email).then(res => {
      let tenantId = res.company;
      auth.tenantId = tenantId;
      return sendPasswordResetEmail(auth, email)
      .then(_ => {
      }, err => {
        throw new Error("Error sending password reset email");
      })
    }).catch(err => {
      console.error(err);
    })
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
    user.getIdTokenResult()
    .then((idTokenResult) => {
      currentUserClaims = idTokenResult.claims;
      console.log(currentUserClaims);
    })
    .catch((error) => {
      console.log(error);
    });
    console.log(currentUser);
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
  currentUserClaims,
  onAuthStateChanged,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  registerNewTenantUser,
  loginAnonymously,
  setNewPassword,
  signInFromEmail
};