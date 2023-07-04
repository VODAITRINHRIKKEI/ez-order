import React, { useState } from "react";
import "./Main.css";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
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

const UserInfoComponent = () => {
  const userInfo = useSelector((state) => state.login.userInfo);
  console.log(userInfo);
  return <></>;
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
        <UserInfoComponent />
      </div>
    </div>
  );
}
