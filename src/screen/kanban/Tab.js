import React, { useEffect, useState, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Title from "../../component/Title";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Modal from "../../component/Modal";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Item from "../../component/Item";
import { useSelector, useDispatch } from "react-redux";
import { setSelectCategoryItem } from "../../slice/menuSlice";
import { useSnackbar } from "notistack";
import { firebase } from "../../app/firebase";
import { db } from "../../app/firebase";
const CreateCategoryComponent = (props) => {
  // State
  const { enqueueSnackbar } = useSnackbar();
  const [showDialog, setShowDialog] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  // Function
  const createMessage = (message, variant) => {
    enqueueSnackbar(message, { variant });
  };

  const createConfirm = async () => {
    try {
      const categoryRef = db
        .collection("user")
        .doc(props.userId)
        .collection("category");

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

      const newCategoryRef = await categoryRef.add({
        name: categoryName,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        index: newIndex,
      });

      // Thêm collection "subCategory"
      const subCategoryRef = newCategoryRef.collection("subCategory");

      const subCategoryQuerySnapshot = await subCategoryRef
        .orderBy("index", "desc")
        .limit(1)
        .get();
      let newSubCategoryIndex = 0;

      if (!subCategoryQuerySnapshot.empty) {
        const lastSubCategory = subCategoryQuerySnapshot.docs[0];
        const lastSubCategoryData = lastSubCategory.data();
        newSubCategoryIndex = lastSubCategoryData.index + 1;
      }

      await subCategoryRef.add({
        name: "subCategory",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        index: newSubCategoryIndex,
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
      </Modal>
    </>
  );
};

const CategoriesComponent = (props) => {
  const selectCategoryId = useSelector((state) => state.menu.categoryItem.id);
  const firstSelect = useRef(true);
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const createMessage = (message, variant) => {
    enqueueSnackbar(message, { variant });
  };

  useEffect(() => {
    if (selectCategoryId) {
      firstSelect.current = false;
    } else {
      firstSelect.current = true;
    }
  }, [selectCategoryId]);

  useEffect(() => {
    fetchCategoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCategoryData = async () => {
    try {
      const querySnapshot = db
        .collection("user")
        .doc(props.userId)
        .collection("category")
        .orderBy("index", "asc")
        .onSnapshot((querySnapshot) => {
          const data = [];
          // eslint-disable-next-line array-callback-return
          querySnapshot.docs.map((doc) => {
            const item = doc.data();
            item.id = doc.id;
            data.push(item);
          });
          setCategories(data);
          if (firstSelect.current && data.length > 0) {
            // console.log(!selectCategoryId);
            const setCategoryItem = {
              name: data[0].name,
              id: data[0].id,
            };
            dispatch(setSelectCategoryItem(setCategoryItem));
          }
        });
      return querySnapshot;
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCategories(items);

    try {
      const updatePromises = items.map((item, index) => {
        return db
          .collection("user")
          .doc(props.userId)
          .collection("category")
          .doc(item.id)
          .update({ index });
      });
      await Promise.all(updatePromises);
      createMessage("Updated!", "success");
    } catch (error) {
      console.error("Error updating category index:", error);
    }
  };

  return (
    <>
      {categories ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="category">
            {(provided) => (
              <div
                className="categoryList"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {categories.map((el, index) => (
                  <Draggable
                    key={el.id}
                    draggableId={el.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => {
                          const setCategoryItem = {
                            name: el.name,
                            id: el.id,
                          };
                          dispatch(setSelectCategoryItem(setCategoryItem));
                        }}
                      >
                        <CategoryComponent el={el} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        "Loading"
      )}
    </>
  );
};

const CategoryComponent = (props) => {
  const userId = useSelector((state) => state.login.userInfo.uid);
  const name = props.el ? props.el.name : "";
  const editRef = useRef(null);
  const deleteRef = useRef(null);
  const activeCategoryId = useSelector((state) => state.menu.categoryItem.id);

  const [active, setActive] = useState(false);
  useEffect(() => {
    if (activeCategoryId !== props.el.id) {
      setActive(false);
    } else {
      setActive(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategoryId]);

  const triggerEditCategory = () => {
    if (editRef.current) {
      editRef.current.editCategory();
    }
  };

  const triggerDeleteCategory = () => {
    if (deleteRef.current) {
      deleteRef.current.deleteCategory();
    }
  };

  return (
    <>
      <Item
        title={name}
        edit={triggerEditCategory}
        delete={triggerDeleteCategory}
        active={active}
      />
      <EditCategoryComponent ref={editRef} item={props.el} userId={userId} />
      <DeleteCategoryComponent
        ref={deleteRef}
        item={props.el}
        userId={userId}
      />
    </>
  );
};

const EditCategoryComponent = React.forwardRef((props, ref) => {
  const { enqueueSnackbar } = useSnackbar();
  const [show, setShow] = useState(false);
  const [categoryName, setCategoryName] = useState(props.item.name);

  const editCategory = () => {
    setShow(true);
  };

  const createMessage = (message, variant) => {
    enqueueSnackbar(message, { variant });
  };

  const confirmEdit = async () => {
    try {
      await db
        .collection("user")
        .doc(props.userId)
        .collection("category")
        .doc(props.item.id)
        .update({
          name: categoryName,
          updateAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      createMessage("Updated!", "success");
    } catch (error) {
      createMessage("Failed!", "error");
    }
  };

  // Gán hàm editCategory vào ref
  React.useImperativeHandle(ref, () => ({
    editCategory: editCategory,
  }));

  return (
    <Modal
      title={"Edit " + props.item.name}
      show={show}
      onClose={() => {
        setShow(false);
      }}
      confirm={confirmEdit}
    >
      <TextField
        label="Category name"
        variant="outlined"
        fullWidth
        onChange={(event) => {
          setCategoryName(event.target.value);
        }}
        value={categoryName}
      />
    </Modal>
  );
});

const DeleteCategoryComponent = React.forwardRef((props, ref) => {
  const { enqueueSnackbar } = useSnackbar();
  const createMessage = (message, variant) => {
    enqueueSnackbar(message, { variant });
  };

  React.useImperativeHandle(ref, () => ({
    deleteCategory: deleteCategory,
  }));

  const [show, setShow] = useState(false);

  const deleteCategory = () => {
    setShow(true);
  };

  const confirmDelete = async () => {
    try {
      // Xoá dữ liệu trong collection "category" và các collection và tài liệu con
      const categoryRef = db
        .collection("user")
        .doc(props.userId)
        .collection("category")
        .doc(props.item.id);
      await deleteCollection(categoryRef);
      await categoryRef.delete();
      createMessage("Deleted!", "error");
    } catch (error) {
      createMessage("Failed!", "error");
    }
  };

  const deleteCollection = async (ref) => {
    const snapshot = await ref.collection("subCategory").get();
    snapshot.forEach(async (subCategoryDoc) => {
      // Xoá dữ liệu trong collection "subCategory" và các collection và tài liệu con
      const subCategoryRef = ref
        .collection("subCategory")
        .doc(subCategoryDoc.id);
      await deleteCollection(subCategoryRef);

      // Xoá tài liệu "subCategory" chính
      await subCategoryRef.delete();
    });

    const foodSnapshot = await ref.collection("food").get();
    foodSnapshot.forEach((foodDoc) => {
      // Xoá tài liệu "food"
      foodDoc.ref.delete();
    });
  };

  return (
    <Modal
      title={"Delete " + props.item.name}
      show={show}
      onClose={() => {
        setShow(false);
      }}
      confirm={confirmDelete}
      type="delete"
    >
      <Alert variant="outlined" severity="error">
        Are you sure you want to delete this Category?
      </Alert>
    </Modal>
  );
});

const TabComponent = () => {
  const user = useSelector((state) => state.login.userInfo);
  const userId = user.uid;
  return (
    <>
      <CreateCategoryComponent userId={userId} />
      <CategoriesComponent userId={userId} />
    </>
  );
};
export default function Tab() {
  return (
    <>
      <TabComponent></TabComponent>
    </>
  );
}
