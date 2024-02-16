import { useContext, useEffect, useState } from "react";
import { UserContext } from "../Providers/UserProvider";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle, logOut, signInWithFacebook } from "../Services/FireBase";
import "./Login.css";
import "animate.css";

export const Login = ({ currentUser, 
  setCurrentUser,
  photoURL,
  setPhotoURL
 }) => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      setPhotoURL(user.photoURL);
      setCurrentUser(user);
      navigate("/loggedInPage");
    }
  }, [user, navigate]);

  return (
    <div className="login buttons">
      <section>
        <div className="login">
          <button className="btn btn-dark btn-lg animate__animated animate__rotateIn" onClick={signInWithGoogle}>Sign in With google</button>
          <button className="btn btn-dark btn-lg animate__animated animate__rotateIn" onClick={signInWithFacebook}>Sign in With facebook</button>
          <button className="btn btn-dark btn-lg animate__animated animate__rotateIn" onClick={()=> {navigate("/signup")}}>Sign up!</button>
        </div>
      </section>

    </div>
  );
};