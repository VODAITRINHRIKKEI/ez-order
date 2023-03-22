import React, { useState } from "react";
import { authentication } from "../app/firebase";
import { db } from "../app/firebase";
import { firebase } from "../app/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import "./Login.css";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";
export default function Login() {
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
    <div className="login">
      <div className="loginBox">
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
      </div>
    </div>
  );
}
