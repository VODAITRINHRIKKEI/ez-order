import React, { useEffect, useState, useRef } from "react";
import Modal from "../../component/Modal";
import Title from "../../component/Title";
import TextField from "@mui/material/TextField";
import FoodItem from "../../component/FoodItem";
import SubTitle from "../../component/SubTitle";
import { useSelector } from "react-redux";
import { db } from "../../app/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { firebase } from "../../app/firebase";
import Chip from "@mui/material/Chip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useSnackbar } from "notistack";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import RadioButtonCheckedOutlinedIcon from "@mui/icons-material/RadioButtonCheckedOutlined";

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography component={"span"} variant={"body2"}>
            {children}
          </Typography>
        </Box>
      )}
    </div>
  );
}

const CheckBoxListComponent = ({ addCheckBox }) => {
  const [checkBoxItem, setCheckBoxItem] = useState({
    name: "",
    price: "",
  });
  return (
    <Box
      sx={{
        display: "grid",
        gap: 1,
        gridTemplateColumns: "repeat(3, 1fr)",
        mt: 2,
      }}
    >
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        onChange={(event) => {
          setCheckBoxItem({ ...checkBoxItem, name: event.target.value });
        }}
        value={checkBoxItem.name !== null ? checkBoxItem.name : ""}
      />
      <TextField
        label="Price"
        variant="outlined"
        fullWidth
        type="number"
        onChange={(event) => {
          setCheckBoxItem({ ...checkBoxItem, price: event.target.value });
        }}
        value={checkBoxItem.price !== null ? checkBoxItem.price : ""}
      />
      <Button
        variant="outlined"
        size="small"
        startIcon={<AddIcon />}
        onClick={async () => {
          await addCheckBox(checkBoxItem);
          await setCheckBoxItem({
            name: "",
            price: "",
          });
        }}
      >
        ADD
      </Button>
    </Box>
  );
};

const RowMenuCreateFoodComponent = ({ item, userInfo, mainCategory }) => {
  const [value, setValue] = React.useState(0);
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");
  const [createDialog, setCreateDialog] = useState(false);
  const [food, setFood] = useState({
    name: "",
    subName: "",
    price: "",
    url: "",
    details: false,
    radio: {},
    checkBox: {},
  });

  useEffect(() => {
    if (!file) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const fileInputRef = useRef(null);
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  const handleFileSelect = async (event) => {
    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 400,
      useWebWorker: true,
    };
    try {
      const file = event.target.files[0];
      const compressedFile = await imageCompression(file, options);
      setFile(compressedFile);
    } catch (err) {
      console.log(err);
    }
  };
  const handleAddCheckboxItem = (checkBoxItem) => {
    console.log(checkBoxItem);
  };
  // const refQuery = db
  //   .collection("user")
  //   .doc(userInfo.uid)
  //   .collection("category")
  //   .doc(mainCategory.id)
  //   .collection("subCategory")
  //   .doc(item.id);
  return (
    <>
      <AddIcon
        className="kanbanIcon"
        fontSize="small"
        onClick={() => {
          setCreateDialog(true);
        }}
      />
      <Modal
        show={createDialog}
        onClose={() => {
          setCreateDialog(false);
        }}
        title={"Create Food"}
      >
        <SubTitle>Preview</SubTitle>
        <div className="foodWrapBox">
          <FoodItem image={preview} food={food} />
        </div>
        <SubTitle>Food infomation</SubTitle>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: "repeat(2, 1fr)",
          }}
        >
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            onChange={(event) => {
              setFood({ ...food, name: event.target.value });
            }}
          />
          <TextField
            label="Sub Name"
            variant="outlined"
            fullWidth
            onChange={(event) => {
              setFood({ ...food, subName: event.target.value });
            }}
          />
          <TextField
            label="Price"
            variant="outlined"
            fullWidth
            type="number"
            onChange={(event) => {
              setFood({ ...food, price: event.target.value });
            }}
          />
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleImageClick}
          >
            Image
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
        </Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={food.details}
              sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
              onChange={() => {
                setFood({ ...food, details: !food.details });
              }}
            />
          }
          label="Details info setting"
        />
        {food.details ? (
          <>
            <Box>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab
                  icon={<CheckBoxOutlinedIcon />}
                  iconPosition="start"
                  label="Check List"
                  {...a11yProps(0)}
                />
                <Tab
                  icon={<RadioButtonCheckedOutlinedIcon />}
                  iconPosition="start"
                  label="Radio List"
                  {...a11yProps(1)}
                />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <CheckBoxListComponent addCheckBox={handleAddCheckboxItem} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              Item Two
            </CustomTabPanel>
          </>
        ) : (
          ""
        )}
      </Modal>
    </>
  );
};

const RowMenuHeaderComponent = ({ item, userInfo, mainCategory }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editCategoryName, setEditCategoryName] = useState(item.name);
  const openMenu = Boolean(anchorEl);
  const createMessage = (message, variant) => {
    enqueueSnackbar(message, { variant });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const refQuery = db
    .collection("user")
    .doc(userInfo.uid)
    .collection("category")
    .doc(mainCategory.id)
    .collection("subCategory")
    .doc(item.id);

  const editConfirm = async () => {
    try {
      await refQuery.update({
        name: editCategoryName,
      });

      handleClose();
      createMessage("Updated!", "success");
    } catch (error) {
      createMessage("Failed!", "error");
      await handleClose();
    }
  };

  const deleteConfirm = async () => {
    try {
      await refQuery
        .collection("food")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            doc.ref.delete();
          });
        });

      await refQuery.delete();
      createMessage("Deleted!", "error");
    } catch (error) {
      createMessage("Failed!", "error");
    }
  };

  return (
    <>
      <div className="kanbanRowHeader">
        <div className="kanbanRowHeaderTitle">
          <p>{item.name ? item.name : ""}</p>
          <div className="kanbanChip">item</div>
        </div>
        <div className="kanbanRowHeaderIcons">
          <RowMenuCreateFoodComponent
            item={item}
            userInfo={userInfo}
            mainCategory={mainCategory}
          />
          <MoreVertIcon
            className="kanbanIcon"
            fontSize="small"
            id="basic-button"
            aria-controls={openMenu ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? "true" : undefined}
            onClick={handleClick}
          />
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              onClick={() => {
                setEditDialog(true);
                handleClose();
              }}
            >
              <ListItemIcon>
                <EditOutlinedIcon fontSize="small" color="greyColor" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setDeleteDialog(true);
                handleClose();
              }}
            >
              <ListItemIcon>
                <DeleteOutlinedIcon fontSize="small" color="redColor" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>
        </div>
      </div>
      <Modal
        show={editDialog}
        onClose={() => {
          setEditDialog(false);
        }}
        title={"Edit " + item.name + " Category"}
        confirm={editConfirm}
      >
        <TextField
          label="Sub Category name"
          variant="outlined"
          fullWidth
          onChange={(event) => {
            setEditCategoryName(event.target.value);
          }}
          value={editCategoryName}
        />
      </Modal>
      <Modal
        show={deleteDialog}
        onClose={() => {
          setDeleteDialog(false);
        }}
        title={"Delete " + item.name + " Category"}
        confirm={deleteConfirm}
      >
        <Alert variant="outlined" severity="error">
          Are you sure you want to delete this Category?
        </Alert>
      </Modal>
    </>
  );
};

const RowMenuComponent = ({ item, index, userInfo, mainCategory }) => {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="kanbanRow">
            <RowMenuHeaderComponent
              item={item}
              userInfo={userInfo}
              mainCategory={mainCategory}
            />
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default function Kanban() {
  const { enqueueSnackbar } = useSnackbar();
  const userInfo = useSelector((state) => state.login.userInfo);
  const mainCategory = useSelector((state) => state.menu.categoryItem);
  const [subCategory, setSubCategory] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const categoryName = useRef(null);

  const createMessage = (message, variant) => {
    enqueueSnackbar(message, { variant });
  };

  const fetchData = () => {
    return db
      .collection("user")
      .doc(userInfo.uid)
      .collection("category")
      .doc(mainCategory.id)
      .collection("subCategory")
      .orderBy("index", "asc")
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          const item = doc.data();
          item.id = doc.id;
          return item;
        });
        setSubCategory(data);
      });
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
    } catch (error) {
      createMessage("Failed!", "error");
    }
  };

  useEffect(() => {
    const unsubscribe = fetchData();
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line
  }, [mainCategory]);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const items = Array.from(subCategory);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    const isIndexChanged = items.some((item, index) => item.index !== index);
    setSubCategory(items);
    if (isIndexChanged) {
      try {
        const updatePromises = items.map((item, index) => {
          return db
            .collection("user")
            .doc(userInfo.uid)
            .collection("category")
            .doc(mainCategory.id)
            .collection("subCategory")
            .doc(item.id)
            .update({ index });
        });
        await Promise.all(updatePromises);
        createMessage("Updated!", "success");
      } catch (error) {
        console.error("Error updating category index:", error);
      }
    }
  };

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
              />
            ) : null}
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
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="subCategory" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="kanban"
            >
              {subCategory.map((el, index) => (
                <RowMenuComponent
                  item={el}
                  index={index}
                  userInfo={userInfo}
                  mainCategory={mainCategory}
                  key={el.id}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}
