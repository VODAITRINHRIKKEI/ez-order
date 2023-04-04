import React, { useEffect, useState } from "react";
import { authentication } from "../app/firebase";
import { db } from "../app/firebase";
import { firebase } from "../app/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import "./Login.css";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";
import { setToken } from "../slice/loginSlice";
import { useDispatch } from "react-redux";
import Home from "./Home";
function LoadingComponent() {
  return <div className="loading"></div>;
}

function LoginComponent() {
  const setUser = (user) => {
    db.collection("user")
      .doc(user.uid)
      .get()
      .then((doc) => {
        console.log(doc);
        if (doc.exists) {
          console.log("Có dữ liệu");
        } else {
          const userId = user.uid;
          console.log(user);
          db.collection("user").doc(userId).set({
            name: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified,
            uid: user.uid,
            photoURL: user.photoURL,
            role: "user",
          });
        }
      });
  };
  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(authentication, provider)
      .then((res) => {
        setUser(res.user);
        console.log("Dang nhap thanh cong");
      })
      .catch((error) => {
        console.log("Login Failed");
      });
  };
  return (
    <>
      <p className="LoginBoxTitle">Login</p>
      <Stack spacing={2}>
        <TextField
          id="outlined-basic"
          label="Username"
          variant="outlined"
          fullWidth
        />
        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          fullWidth
        />
        <Button variant="contained" fullWidth size="large">
          Login
        </Button>
        <Button
          variant="outlined"
          fullWidth
          size="large"
          onClick={() => {
            loginWithGoogle();
          }}
        >
          <div className="loginWithGmailButton">
            <GoogleIcon></GoogleIcon>
            <span className="loginWithGmailText">Login with Gmail</span>
          </div>
        </Button>
      </Stack>
    </>
  );
}


export default function Login() {
  const [loading, isLoading] = useState(false);
  const [needLogging, isNeedLogging] = useState(true);
  const [userToken, setUserToken] = useState("")
  const dispatch = useDispatch();
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    await firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(setToken(user.uid));
        setUserToken(user.uid)
      } else {
        dispatch(setToken(""));
      }
    });
    await checkToken();
  };
  const checkToken = async () => {
    await isLoading(true);
    if (userToken != null) {
      isNeedLogging(false);
    }
  };
  return (
    <>
      {loading ? (
        <>
          {needLogging ? (
            <div className="login">
              <div className="loginBox">
                <LoginComponent></LoginComponent>
              </div>
            </div>
          ) : (
            <Home></Home>
          )}
        </>
      ) : (
        <LoadingComponent></LoadingComponent>
      )}
    </>
  );
}
