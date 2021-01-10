import React, { useState, useEffect } from "react";
import "./SidebarChat.css";
import Avatar from "@material-ui/core/Avatar";
import db from "./firebase";
import { Link } from "react-router-dom";

function SidebarChat({ id, name, thumb }) {
  const [messages, setMessages] = useState("");

  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
        });
    }
  }, [id]);

  return (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar src={thumb} />
        <div className="sidebarChat__info">
          <h2>{name}</h2>
          <p className="sidebarChat__lastMessage">{messages[0]?.message} </p>
        </div>
      </div>
    </Link>
  );
}

export default SidebarChat;
