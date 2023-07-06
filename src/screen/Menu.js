import React, { useState } from "react";
import Layout from "../layout/Layout";
import Title from "../component/Title";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Modal from "../component/Modal";

const MainComponent = () => {
  return (
    <>
      <Title>Menu</Title>
    </>
  );
};
const TabComponent = () => {
  const [showDialog, setShowDialog] = useState(false);
  const createConfirm = () => {
    console.log("created");
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
      ></Modal>
    </>
  );
};
export default function Menu() {
  return <Layout main={<MainComponent />} tab={<TabComponent />}></Layout>;
}
