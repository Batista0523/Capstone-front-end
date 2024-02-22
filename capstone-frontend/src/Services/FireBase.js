// Import the functions you need from the SDKs you need
import { getApp, initializeApp, deleteApp, } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, signInWithPopup, getAuth, signOut, FacebookAuthProvider, signInAnonymously } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

auth.useDeviceLanguage();

const googleAuth = new GoogleAuthProvider();
export const facebookAuth = new FacebookAuthProvider();

export const signInWithFacebook = () => {
  try {
    //the signInWithPopUp() method accepts ANY provider we create. This is all our authentication logic
    signInWithPopup(auth, facebookAuth).then((res) => {
      // const credential = FacebookAuthProvider.credentialFromResult(res);
      // const accessToken = credential.accessToken;
      // fetch(`https://graph.facebook.com/${res.user.providerData[0].uid}/picture?type=large&access_token=${accessToken}`)
      //   .then((response) => response.blob())
      //   .then((blob) => {
      //     URL.createObjectURL(blob);
      //   })
      console.log(res);
    });
  } catch (err) {
    console.error(err);
  }
};

export const signInAnon = () => {
  signInAnonymously(auth)
    .then(() => {
      // Signed in..
    })
    .catch((error) => {
      console.error(error)
    });
}

export const signInWithGoogle = () => {
  try {
    signInWithPopup(auth, googleAuth).then((res) => {
      // signed in success
    });
  } catch (err) {
    console.error(err);
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.log(err);
  }
}


const analytics = getAnalytics(app);