import React, { useEffect, useState, useRef } from "react";
import Modal from "../../component/Modal";
import Title from "../../component/Title";
import TextField from "@mui/material/TextField";
import FoodItem from "../../component/FoodItem";
import SubTitle from "../../component/SubTitle";
import { useSelector } from "react-redux";
import { db } from "../../app/firebase";
import { storage } from "../../app/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid";
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
import CloseIcon from "@mui/icons-material/Close";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RemoveIcon from "@mui/icons-material/Remove";
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

const RadioListComponent = ({ addRadio }) => {
  const [radioName, setRadioName] = useState("");
  const [radioItem, setRadioItem] = useState([]);
  const [radioInput, setRadioInput] = useState({
    name: "",
    price: "",
  });
  const checkPrice = (price) => {
    if (price !== 0) {
      return "(" + price + ")";
    } else {
      return "(無料)";
    }
  };
  const createRadioItem = async () => {
    const item = { ...radioInput, id: uuidv4() };
    if (item.price === "") {
      item.price = 0;
    }
    setRadioItem([...radioItem, item]);
    setRadioInput({
      name: "",
      price: "",
    });
  };
  const confirmAddRadio = async () => {
    const item = {
      name: radioName,
      list: [...radioItem],
    };
    addRadio(item);
    await setNormalInput();
  };

  const setNormalInput = () => {
    setRadioName("");
    setRadioItem([]);
    setRadioInput({
      name: "",
      price: "",
    });
  };
  return (
    <div className="radioInputBox">
      <div className="radioInputPreview">
        <SubTitle>Preview</SubTitle>
        <div className="radioItemListWrap">
          <FormControl className="radioFormControl">
            <div className="radioItemListHeader">
              <FormLabel id="demo-controlled-radio-buttons-group">
                <p className="radioItemListHeaderTitle">{radioName}</p>
              </FormLabel>
              {radioName !== "" ? (
                <div className="iconWrapBox">
                  <RemoveIcon
                    color="darkColor"
                    sx={{ mr: 1 }}
                    onClick={setNormalInput}
                  ></RemoveIcon>
                  {radioItem.length >= 2 ? (
                    <AddIcon
                      color="primary"
                      onClick={confirmAddRadio}
                    ></AddIcon>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
            >
              {radioItem ? (
                <div className="radioList">
                  {radioItem.map((el) => {
                    return (
                      <div className="radioItem" key={el.id}>
                        <FormControlLabel
                          value={el.name}
                          control={
                            <Radio
                              sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
                            />
                          }
                          label={
                            <SubTitle>
                              {el.name + checkPrice(el.price)}
                            </SubTitle>
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                ""
              )}
            </RadioGroup>
          </FormControl>
        </div>
      </div>
      <div className="radioInputContent">
        <SubTitle>InputContent</SubTitle>
        <TextField
          label="Radio Name"
          variant="outlined"
          fullWidth
          onChange={(event) => {
            setRadioName(event.target.value);
          }}
          value={radioName}
        />
        <Box
          sx={{
            display: "grid",
            gap: 1,
            gridTemplateColumns: "repeat(3, 1fr)",
            mt: 1,
          }}
        >
          <TextField
            label="Name"
            variant="outlined"
            size="small"
            fullWidth
            onChange={(event) => {
              setRadioInput({ ...radioInput, name: event.target.value });
            }}
            value={radioInput.name}
          />
          <TextField
            label="Price"
            variant="outlined"
            fullWidth
            size="small"
            type="number"
            value={radioInput.price}
            onChange={(event) => {
              setRadioInput({ ...radioInput, price: event.target.value });
            }}
          />
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={async () => {
              createRadioItem();
            }}
          >
            ADD
          </Button>
        </Box>
      </div>
    </div>
  );
};

const FoodDetails = ({ food, removeCheckboxItem, removeRadioItem }) => {
  const checkPrice = (price) => {
    if (price !== 0) {
      return "(" + price + ")";
    } else {
      return "(無料)";
    }
  };
  return (
    <>
      {food.checkBox.length > 0 ? (
        <Box>
          <SubTitle>Check</SubTitle>
          {food.checkBox.map((el) => {
            return (
              <div className="foodCheckboxList" key={el.id}>
                <div className="foodCheckbox">
                  <FormControlLabel
                    control={<Checkbox />}
                    label={
                      <SubTitle>{el.name + checkPrice(el.price)}</SubTitle>
                    }
                  />
                  <CloseIcon
                    fontSize="small"
                    color="darkColor"
                    onClick={async () => {
                      await removeCheckboxItem(el.id);
                    }}
                  ></CloseIcon>
                </div>
              </div>
            );
          })}
        </Box>
      ) : (
        ""
      )}

      {food.radio.length > 0 ? (
        <Box>
          <SubTitle>Choose</SubTitle>
          {food.radio.map((el) => {
            return (
              <div className="foodRadioBox" key={el.id}>
                <div className="foodRadioBoxHeader">
                  <SubTitle>{el.name}</SubTitle>
                  <CloseIcon
                    fontSize="small"
                    color="darkColor"
                    onClick={async () => {
                      await removeRadioItem(el.id);
                    }}
                  ></CloseIcon>
                </div>
                {el.list ? (
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue={el.list[0].name}
                      name="radio-buttons-group"
                    >
                      <div className="radioList">
                        {el.list.map((item) => {
                          return (
                            <FormControlLabel
                              value={item.name}
                              control={<Radio />}
                              label={
                                <SubTitle>
                                  {item.name + checkPrice(item.price)}
                                </SubTitle>
                              }
                            />
                          );
                        })}
                      </div>
                    </RadioGroup>
                  </FormControl>
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </Box>
      ) : (
        ""
      )}
    </>
  );
};

const RowMenuCreateFoodComponent = ({ item, userInfo, mainCategory }) => {
  const { enqueueSnackbar } = useSnackbar();
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
    radio: [],
    checkBox: [],
  });
  const fileInputRef = useRef(null);

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

  const createMessage = (message, variant) => {
    enqueueSnackbar(message, { variant });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
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
    const concatCheckbox = { ...checkBoxItem, id: uuidv4() };
    if (concatCheckbox.price === "") {
      concatCheckbox.price = 0;
    }
    setFood({ ...food, checkBox: [...food.checkBox, concatCheckbox] });
  };
  const handleAddRadioItem = (RadioItem) => {
    const item = { ...RadioItem, id: uuidv4() };
    setFood({ ...food, radio: [...food.radio, item] });
  };
  const removeCheckbox = (checkboxId) => {
    const updatedCheckBox = food.checkBox.filter(
      (checkbox) => checkbox.id !== checkboxId
    );
    setFood({ ...food, checkBox: updatedCheckBox });
  };
  const removeRadio = (radioItemId) => {
    const updatedRadio = food.radio.filter((radio) => radio.id !== radioItemId);
    setFood({ ...food, radio: updatedRadio });
  };
  const handleUpdateImage = async () => {
    try {
      if (!file) {
        const url =
          "https://us.123rf.com/450wm/yehorlisnyi/yehorlisnyi2104/yehorlisnyi210400016/167492439-no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-comin.jpg?ver=6";
        return url;
      } else {
        const storageRef = ref(storage, `/files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        await uploadTask;
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        return url;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const refQuery = db
    .collection("user")
    .doc(userInfo.uid)
    .collection("category")
    .doc(mainCategory.id)
    .collection("subCategory")
    .doc(item.id);

  const createFoodConfirm = async () => {
    try {
      const responseUrl = await handleUpdateImage();
      const item = { ...food };
      item.url = responseUrl;
      await refQuery.collection("food").add(item);
      createMessage("Created!", "success");
    } catch (error) {
      createMessage("Failed!", "error");
    }
  };

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
        confirm={createFoodConfirm}
      >
        <div className="foodWrapBox">
          <FoodItem image={preview} food={food} />
        </div>
        {food.details ? (
          <FoodDetails
            food={food}
            removeCheckboxItem={removeCheckbox}
            removeRadioItem={removeRadio}
          />
        ) : (
          ""
        )}
        <SubTitle>Input Form</SubTitle>
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
          label={<SubTitle>Setting details</SubTitle>}
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
              <RadioListComponent addRadio={handleAddRadioItem} />
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

const RowMenuContentComponent = ({ item, userInfo, mainCategory }) => {
  return <></>;
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
            <RowMenuContentComponent
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
