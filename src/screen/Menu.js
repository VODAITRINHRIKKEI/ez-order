import React, { useState } from "react";
import Layout from "../layout/Layout";
import Title from "../component/Title";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Modal from "../component/Modal";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { firebase } from "../app/firebase";
import { db } from "../app/firebase";
const MainComponent = () => {
  return (
    <>
      <Title>Menu</Title>
    </>
  );
};

const CreateCategoryComponent = (props) => {
  //state
  const { enqueueSnackbar } = useSnackbar();
  const [showDialog, setShowDialog] = useState(false);
  const [multiMenu, setMultiMenu] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  //function
  const createMessage = (message, variant) => {
    enqueueSnackbar(message, { variant });
  };
  const createConfirm = async () => {
    console.log(props.userId);
    console.log(showDialog);
    try {
      await db.collection("user").doc(props.userId).collection("category").add({
        name: categoryName,
        isMulti: multiMenu,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      createMessage("Created!", "success");
    } catch (error) {
      createMessage("Failed!", "error");
    }
  };
  return (
    <>
      <div className="headerWithIcon">
        <Title>Categories</Title>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => {
            setShowDialog(true);
          }}
        >
          Add
        </Button>
      </div>
      <Modal
        show={showDialog}
        title="Create new Category"
        onClose={() => {
          setShowDialog(false);
        }}
        confirm={() => {
          createConfirm();
        }}
      >
        <TextField
          label="Category name"
          variant="outlined"
          fullWidth
          onChange={(event) => {
            setCategoryName(event.target.value);
          }}
        />
        <FormControlLabel
          label="Multi Category"
          control={
            <Checkbox
              checked={multiMenu}
              onChange={(event) => {
                setMultiMenu(event.target.checked);
              }}
            ></Checkbox>
          }
        />
      </Modal>
    </>
  );
};

const TabComponent = () => {
  const user = useSelector((state) => state.login.userInfo);
  const userId = user.uid;
  return (
    <>
      <CreateCategoryComponent userId={userId} />
    </>
  );
};
export default function Menu() {
  return <Layout main={<MainComponent />} tab={<TabComponent />}></Layout>;
}
