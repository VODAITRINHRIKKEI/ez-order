import React from "react";
import { signOut } from "firebase/auth";
import { authentication } from "../app/firebase";
import { useDispatch } from "react-redux";
import { setToken, setUserInfo } from "../slice/loginSlice";
export default function Dashboard() {
  const dispatch = useDispatch();
  const logOut = () => {
    signOut(authentication)
      .then(() => {
        console.log("da dang xuat");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <button onClick={logOut}>Logout</button>
    </div>
  );
}
