import React from "react";
import "./Component.css";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

export default function Item(props) {
  const itemComponentClasses = props.active
    ? "itemComponent itemComponentActive"
    : "itemComponent";
  return (
    <div className={itemComponentClasses}>
      <p className="itemTitle">{props.title}</p>
      <div className="itemIcons">
        <div
          className="editIcon itemIcon"
          onClick={() => {
            try {
              props.edit();
            } catch (error) {}
          }}
        >
          <EditOutlinedIcon fontSize="small" />
        </div>
        <div
          className="deleteIcon itemIcon"
          onClick={() => {
            try {
              props.delete();
            } catch (error) {}
          }}
        >
          <DeleteOutlineOutlinedIcon fontSize="small" />
        </div>
      </div>
    </div>
  );
}
