import React from "react";
import Switch from "@mui/material/Switch";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
export default function FoodItem(props) {
  const preview = props.image;
  const food = props.food ? props.food : {};
  return (
    <div className="foodCard">
      {preview ? (
        <div className="foodCardImage">
          <img src={preview} alt="" />
        </div>
      ) : (
        <div className="foodCardImage">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930"
            alt=""
          />
        </div>
      )}

      <div className="foodCardInfo">
        <p className="foodName">{food.name ? food.name : "Name"}</p>
        <p className="foodSubName">
          {food.subName ? food.subName : "Sub Name"}
        </p>
        <p className="foodPrice">{food.price ? food.price : "Price"}</p>
        <div className="foodAction">
          <Switch checked={food.status} onChange={props.changeStatus} />
          <div className="foodActionIcon">
            <EditOutlinedIcon fontSize="small" color="primary" />
            <DeleteOutlinedIcon fontSize="small" color="redColor" />
          </div>
        </div>
      </div>
    </div>
  );
}
