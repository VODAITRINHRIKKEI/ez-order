import React, { useState } from "react";
import "./Main.css";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { authentication } from "../app/firebase";
import { useDispatch } from "react-redux";
import { setToken, setUserInfo } from "../slice/loginSlice";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import TableRestaurantOutlinedIcon from "@mui/icons-material/TableRestaurantOutlined";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import IconButton from "@mui/material/IconButton";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
const UserNotificationComponent = () => {
  return (
    <div className="notificationIcon">
      <NotificationsActiveIcon />
    </div>
  );
};

const UserInfoComponent = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.login.userInfo);
  const [anchorEl, setAnchorEl] = useState(null);
  const avatarNotFound =
    "https://api-private.atlassian.com/users/47c292919c69eb82fb5eaa113ce0bf98/avatar";
  const open = Boolean(anchorEl);
  const handleClickImage = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const logOut = async () => {
    await signOut(authentication)
      .then(() => {
        console.log("da dang xuat");
      })
      .catch((error) => {
        console.log(error);
      });
    await dispatch(setToken(""));
    await dispatch(setUserInfo(null));
  };
  return (
    <>
      <IconButton
        className="userImage"
        onClick={handleClickImage}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <img
          src={userInfo?.photoURL ? userInfo.photoURL : avatarNotFound}
          alt="avatar"
        />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={logOut}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default function Nav() {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const navLinks = [
    {
      to: "/menu",
      icon: <AutoStoriesOutlinedIcon />,
      iconFilled: <AutoStoriesIcon />,
      name: "Menu",
    },
    {
      to: "/table",
      icon: <TableRestaurantOutlinedIcon />,
      iconFilled: <TableRestaurantIcon />,
      name: "Table",
    },
    {
      to: "/",
      icon: <DashboardOutlinedIcon />,
      iconFilled: <DashboardIcon />,
      name: "Dashboard",
    },
    {
      to: "/bill",
      icon: <ReceiptLongOutlinedIcon />,
      iconFilled: <ReceiptLongIcon />,
      name: "Bills",
    },
    {
      to: "/setting",
      icon: <SettingsOutlinedIcon />,
      iconFilled: <SettingsIcon />,
      name: "Setting",
    },
  ];

  const location = useLocation();
  const [activeLink, setActiveLink] = useState(null);

  const handleClick = (index) => {
    setActiveLink(index);
  };

  // Kiểm tra đường dẫn hiện tại và cập nhật activeLink
  React.useEffect(() => {
    const activeIndex = navLinks.findIndex(
      (link) => link.to === location.pathname
    );
    setActiveLink(activeIndex);
  }, [location.pathname, navLinks]);

  return (
    <div className="nav">
      <div className="navLogo">Ez-Order</div>
      <div className="navLinks">
        {navLinks.map((link, index) => (
          <div
            className={`navLink ${activeLink === index ? "navLinkActive" : ""}`}
            key={index}
            onClick={() => handleClick(index)}
          >
            <Link to={link.to}>
              <div className="navIcon">
                {activeLink === index ? link.iconFilled : link.icon}
              </div>
              <div className="navLinkName">{link.name}</div>
            </Link>
          </div>
        ))}
      </div>
      <div className="navUser">
        <UserNotificationComponent />
        <UserInfoComponent />
      </div>
    </div>
  );
}
