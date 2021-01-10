import React from "react";
import "./Login.css";
import Button from "@material-ui/core/Button";
import { auth, provider } from "./firebase";
// import firebase from "firebase";
import { userState } from "./atoms";
import { useSetRecoilState } from "recoil";

function Login() {
  const setUser = useSetRecoilState(userState);

  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        setUser(result.user);
      })
      .catch((error) => alert(error.message));

    // new way
    // firebase
    //   .auth()
    //   .setPersistence(firebase.auth.Auth.Persistence.SESSION)
    //   .then(function () {
    //     // Existing and future Auth states are now persisted in the current
    //     // session only. Closing the window would clear any existing state even
    //     // if a user forgets to sign out.
    //     // ...
    //     // New sign-in will be persisted with session persistence.
    //     const provider = new firebase.auth.GoogleAuthProvider();
    //     return firebase.auth().signInWithPopup(provider);
    //   })
    //   .then((result) => {
    //     setUser(result.user);
    //   })
    //   .catch(function (error) {
    //     // Handle Errors here.
    //     var errorCode = error.code;
    //     var errorMessage = error.message;
    //   });
  };

  return (
    <div className="login">
      <div className="login__container">
        <img
          src="http://www.pngmart.com/files/11/Chat-Logo-PNG-Pic.png"
          alt=""
        />
        <div className="login__text">
          <h1>Sign in to Chat </h1>
        </div>
        <Button type="submit" onClick={signIn}>
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}

export default Login;
