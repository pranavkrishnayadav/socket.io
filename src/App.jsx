import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Container, TextField, Typography, Button, Stack } from "@mui/material";

function App() {
  const socket = useMemo(() => io("http://localhost:3000/", []));

  const [message, setMessage] = useState("");

  const [room, setroom] = useState("");

  const [socketid, setsocketid] = useState("");

  const [messages,setmessages] = useState([])

  const [roomname,setroomname] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };


  const joinroomhandler=(e)=>{
    e.preventDefault()
    socket.emit("join-room",roomname);
    setroomname("")
  };

  useEffect(() => {
    socket.on("connect", () => {
      setsocketid(socket.id);
      console.log("Connected", socket.id);
    });
    socket.on("receive-message", (data) => {
      console.log(data);
      setmessages((messages)=>[...messages,data]);
    });
    socket.on("welcome", (s) => {
      console.log(s);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Typography variant="h1" component="div" gutterBottom>
        Welcome to Socket.io
      </Typography>

      <Typography variant="h2" component="div" gutterBottom>
        {socketid}
      </Typography>
      <form onSubmit={joinroomhandler}>
        <h5>Join Room </h5>
        <TextField
          value={roomname}
          onChange={(e) => setroomname(e.target.value)}
          id="outlined-basic"
          label="Room name"
          variant="outlined"
        />

<Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="Message"
          variant="outlined"
        />
        <TextField
          value={room}
          onChange={(e) => setroom(e.target.value)}
          id="outlined-basic"
          label="room"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>

      <Stack>
      {

        messages.map((m,i)=>{
          <Typography key={i} variant="h6" component="div" gutterBottom>
            {m}
          </Typography>
        })
      }
      </Stack>
    </Container>
  );
}

export default App;
