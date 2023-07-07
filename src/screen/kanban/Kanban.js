/* eslint-disable array-callback-return */
import React, { useEffect, useState, useRef } from "react";
import Title from "../../component/Title";
import TextField from "@mui/material/TextField";
import { useSelector } from "react-redux";
import { db } from "../../app/firebase";
import { firebase } from "../../app/firebase";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import Modal from "../../component/Modal";
import { useSnackbar } from "notistack";

const RowMenuComponent = (props) => {
  const item = props.item;
  console.log(item);
  return (
    <div className="kanbanRow">
      <div className="kanbanRowHeader">
        <div className="kanbanRowHeaderTitle">
          <p>{item.name ? item.name : ""}</p>
          <div className="kanbanChip">item</div>
        </div>
        <div className="kanbanRowHeaderIcons">
          <AddIcon className="kanbanIcon" fontSize="small" />
          <RemoveOutlinedIcon className="kanbanIcon" fontSize="small" />
        </div>
      </div>
    </div>
  );
};

export default function Kanban() {
  // state
  const { enqueueSnackbar } = useSnackbar();
  const userInfo = useSelector((state) => state.login.userInfo);
  const mainCategory = useSelector((state) => state.menu.categoryItem);
  const [subCategory, setSubCategory] = useState();
  const [showDialog, setShowDialog] = useState();
  const categoryName = useRef(null);
  // function
  const createMessage = (message, variant) => {
    enqueueSnackbar(message, { variant });
  };
  const fetchData = async () => {
    try {
      const query = db
        .collection("user")
        .doc(userInfo.uid)
        .collection("category")
        .doc(mainCategory.id)
        .collection("subCategory")
        .onSnapshot((querySnapshot) => {
          const data = [];
          querySnapshot.docs.map((doc) => {
            const item = doc.data();
            item.id = doc.id;
            data.push(item);
          });
          console.log(data);
          setSubCategory(data);
        });
      return query;
    } catch (error) {}
  };

  const confirmCreateSubCategory = async () => {
    try {
      const categoryRef = db
        .collection("user")
        .doc(userInfo.uid)
        .collection("category")
        .doc(mainCategory.id)
        .collection("subCategory");

      const querySnapshot = await categoryRef
        .orderBy("index", "desc")
        .limit(1)
        .get();

      let newIndex = 0;
      if (!querySnapshot.empty) {
        const lastCategory = querySnapshot.docs[0];
        const lastCategoryData = lastCategory.data();
        newIndex = lastCategoryData.index + 1;
      }

      await categoryRef.add({
        name: categoryName.current,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        index: newIndex,
      });

      createMessage("Created!", "success");
    } catch (error) {}
  };

  // effect
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainCategory]);

  return (
    <>
      <div className="headerWithIcon">
        <Title>
          <span>{mainCategory ? mainCategory.name : "Menu"}</span>
          <span>
            {subCategory ? (
              <Chip
                label={subCategory.length + " Category"}
                color="primary"
                size="small"
                sx={{ ml: "4px" }}
              ></Chip>
            ) : (
              ""
            )}
          </span>
        </Title>
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
        onClose={() => {
          setShowDialog(false);
        }}
        title="Sub Category Create"
        confirm={confirmCreateSubCategory}
      >
        <TextField
          label="Sub Category name"
          variant="outlined"
          fullWidth
          onChange={(event) => {
            categoryName.current = event.target.value;
          }}
        />
      </Modal>
      {subCategory ? (
        <div className="kanban">
          {subCategory.map((el) => {
            return <RowMenuComponent item={el} key={el.id}></RowMenuComponent>;
          })}
        </div>
      ) : (
        ""
      )}
    </>
  );
}
