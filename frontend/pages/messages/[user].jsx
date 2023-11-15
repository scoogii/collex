import Nav from "@/components/Nav";
import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  IconButton,
  List,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styles from "@/styles/Home.module.css";
import Message from "@/components/messages/Message";

const UserConversation = ({ toggleTheme }) => {
  const [id, setId] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [message, setMessage] = useState("");
  const [isShown, setIsShown] = useState(false);
  const messageRef = useRef(null);
  const theme = useTheme();
  const router = useRouter();

  ////////// HANDLERS //////////
  const getConversation = async () => {
    const response = await fetch(
      `http://localhost:8080/message/get_conversation?user1_username=${localStorage.getItem(
        "username",
      )}&user2_username=${router.query.user}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      },
    );

    const data = await response.json();

    // Check response status code
    if (response.status !== 200) {
      alert(data.message);
      return;
    }

    if (data.error) {
      alert(data.error);
      return;
    }

    setId(data.conversation_id);
    setConversation(data.messages);
  };

  const handleSendMessage = async () => {
    if (!message) {
      return;
    }

    const response = await fetch(`http://localhost:8080/message/send_message`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        conversation_id: id,
        message: message,
        receiver_username: router.query.user,
        sender_username: localStorage.getItem("username"),
      }),
    });

    const data = await response.json();

    // Check response status code
    if (response.status !== 200) {
      alert(data.message);
      return;
    }

    if (data.error) {
      alert(data.error);
    }

    setMessage("");
    getConversation();
  };

  ////////// STYLES //////////
  const baseContainer = {
    display: "flex",
    gap: "30px",
    padding: "10px",
    flexDirection: "column",
    alignItems: "center",
    color: theme.palette.text.main,
    minHeight: "calc(100vh - 80px)",
    marginTop: "80px",
    background: theme.palette.tertiary.main,
    width: "100%",
  };

  const conversationsContainer = {
    border: "2px solid",
    borderRadius: "12px",
    borderColor: theme.palette.border.main,
    background: theme.palette.primary.main,
    width: { xs: "90vw", md: "80vw" },
    height: { xs: "50vh", sm: "60vh" },
    overflow: "auto",
  };

  const actionBarStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "2px solid",
    borderRadius: "12px",
    borderColor: theme.palette.border.main,
    background: theme.palette.tertiary.main,
    width: { xs: "90vw", md: "80vw" },
    overflow: "auto",
  };

  const textFieldStyle = {
    width: "100%",
    color: "black",
    "& label.Mui-focused": {
      color: "transparent",
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "transparent",
      },
    },
    "& fieldset.MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
    },
    "&:hover fieldset.MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
    },
  };

  ////////// USE EFFECTS //////////
  useEffect(() => {
    // If user is attempting to message themself, redirect to messages
    let name = localStorage.getItem("username");
    if (name === router.query.user) {
      router.push("/messages");
    }

    if (router.query.user && name) {
      setMessage("");
      getConversation();
    }
  }, [router.query.user]); // eslint-disable-line react-hooks/exhaustive-deps

  // User not logged in, redirect to home
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      setIsShown(true);
    }
  }, []);

  useEffect(() => {
    messageRef.current?.lastElementChild?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [conversation]);

  return (
    <>
      <Nav toggleTheme={toggleTheme} />

      <Box bgcolor={theme.palette.primary.main} sx={baseContainer}>
        {isShown && (
          <>
            <Box className="flex" sx={{ flexWrap: "wrap" }}>
              <Typography
                variant="h4"
                sx={{
                  marginTop: "1vh",
                  textAlign: "center",
                  fontStyle: "normal",
                  wordWrap: "break-word",
                }}
              >
                Chatting with:
              </Typography>

              <Typography
                variant="h4"
                sx={{ marginTop: "1vh", textAlign: "center" }}
              >
                &nbsp;
              </Typography>

              <Button
                className={styles.hoverPurple}
                onClick={() => {
                  router.push(`/profile/${router.query.user}`);
                }}
                sx={{
                  color: theme.palette.text.main,
                  textTransform: "none",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    marginTop: "1vh",
                    fontWeight: "bold",
                    marginTop: "1vh",
                    textAlign: "center",
                    wordWrap: "break-word",
                  }}
                >
                  {router.query.user}
                </Typography>
              </Button>
            </Box>

            <Paper elevation={0} sx={conversationsContainer}>
              {conversation.length === 0 && (
                <Box
                  className="flex"
                  sx={{
                    padding: "10px",
                    flexDirection: "column",
                    width: "100%",
                    height: "100%",
                    textAlign: "center",
                    fontStyle: "italic",
                  }}
                >
                  Start a conversation with {router.query.user}!
                </Box>
              )}

              {conversation.length !== 0 && (
                <Box
                  sx={{
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column-reverse",
                    justifyContent: "flex-start",
                    width: "100%",
                    height: "100%",
                    textAlign: "center",
                    fontStyle: "italic",
                    gap: "10px",
                    overflow: "auto",
                  }}
                >
                  <List ref={messageRef}>
                    {conversation.map((message, index) => (
                      <Message
                        key={index}
                        user={message.sender}
                        message={message.message}
                        timeSent={message.timestamp}
                      />
                    ))}
                  </List>
                </Box>
              )}
            </Paper>

            <Paper elevation={0} sx={actionBarStyle}>
              <TextField
                value={message}
                placeholder="Send a message"
                sx={textFieldStyle}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.code === "Enter") {
                    handleSendMessage();
                  }
                }}
              />

              <IconButton
                size="large"
                className={styles.selectButton}
                onClick={handleSendMessage}
              >
                <SendRoundedIcon sx={{ color: "#8c52ff" }} />
              </IconButton>
            </Paper>
          </>
        )}
      </Box>
    </>
  );
};

export default UserConversation;
