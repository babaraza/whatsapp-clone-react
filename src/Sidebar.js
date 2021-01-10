import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import Avatar from "@material-ui/core/Avatar";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import SidebarChat from "./SidebarChat";
import db from "./firebase.js";
import { userState } from "./atoms";
import { auth } from "./firebase";
import { useRecoilState } from "recoil";

function Sidebar() {
  const [rooms, setRooms] = useState([]);
  const [user, setUser] = useRecoilState(userState);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const unsubscribe = db.collection("rooms").onSnapshot((snapshot) =>
      setRooms(
        snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            data: doc.data(),
          };
        })
      )
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const logOut = () => {
    auth.signOut().then(() => {
      setUser(null);
    });
  };

  const createChat = () => {
    const roomName = prompt("Please enter name for chat");

    if (roomName) {
      db.collection("rooms").add({
        name: roomName,
        thumb: "https://picsum.photos/200",
      });
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__headerLeft">
          <Avatar src={user?.photoURL} />
          <div className="sidebar__userName">{user?.displayName}</div>
        </div>
        <div className="sidebar__headerRight">
          <IconButton onClick={createChat}>
            <ChatIcon style={{ color: "#d4d5d7" }} />
          </IconButton>
          <Menu
            id="logout-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={logOut}>Logout</MenuItem>
          </Menu>
          <IconButton
            aria-controls="logout-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon style={{ color: "#d4d5d7" }} />
          </IconButton>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input type="text" placeholder="Search chat rooms" />
        </div>
      </div>

      <div className="sidebar__chats">
        {rooms.map((room) => (
          <SidebarChat
            key={room.id}
            id={room.id}
            name={room.data.name}
            thumb={room.data.thumb}
          />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
