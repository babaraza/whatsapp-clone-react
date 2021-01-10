import React, { useEffect, useState } from "react";
import "./Chat.css";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import SendIcon from "@material-ui/icons/Send";
import { useParams, useHistory } from "react-router-dom";
import db from "./firebase";
import firebase from "firebase";
import { useRecoilValue } from "recoil";
import { userState } from "./atoms";

function Chat() {
  const [input, setInput] = useState("");
  let { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [lastSeen, setLastSeen] = useState("");
  const user = useRecoilValue(userState);
  const history = useHistory();

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => setRoomName(snapshot.data().name));

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setMessages(
            snapshot.docs.map((doc) => {
              return doc;
            })
          );
          setLastSeen(
            new Date(
              snapshot.docs[snapshot.docs.length - 1]
                ?.data()
                .timestamp?.toDate()
            ).toLocaleString()
          );
        });
    }
  }, [roomId]);

  const sendMessage = (e) => {
    e.preventDefault();
    setInput("");
    if (input) {
      db.collection("rooms").doc(roomId).collection("messages").add({
        message: input,
        name: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      const objDiv = document.getElementsByClassName("chat__body")[0];
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  };

  const deleteRoom = async () => {
    db.collection("rooms").doc(roomId).delete();
    let documents = await db.collection("rooms").limit(1).get();
    let results = documents.docs[0].id;
    roomId = results;
    history.push(`/rooms/${results}`);
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://picsum.photos/200`} />

        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>Last seen {lastSeen}</p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined style={{ color: "#d4d5d7" }} />
          </IconButton>
          <IconButton onClick={deleteRoom}>
            <DeleteIcon style={{ color: "#d4d5d7" }} />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {messages.map((msg) => (
          <p
            key={msg.id}
            className={`chat__message ${
              msg.data().name === user.displayName && "chat__receiver"
            }`}
          >
            <span className="chat__name">{msg.data().name}</span>
            {msg.data().message}
            <span className="chat__timestamp">
              {new Date(msg.data().timestamp?.toDate()).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </p>
        ))}
      </div>
      <div className="chat__footer">
        <IconButton>
          <InsertEmoticonIcon style={{ color: "#d4d5d7" }} />
        </IconButton>
        <form>
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            placeholder="Type a message"
          />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        <IconButton disabled={!input} onClick={sendMessage}>
          <SendIcon style={{ color: "#d4d5d7" }} />
        </IconButton>
        <IconButton>
          <MicIcon style={{ color: "#d4d5d7" }} />
        </IconButton>
      </div>
    </div>
  );
}

export default Chat;
