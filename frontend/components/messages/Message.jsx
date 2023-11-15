import { useTheme } from "@emotion/react";
import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const Message = ({ user, message, timeSent }) => {
  const [name, setName] = useState("");
  const theme = useTheme();

  ////////// STYLES //////////
  const senderStyle = {
    maxWidth: "40vw",
    background: theme.palette.border.main,
    borderRadius: "20px",
    border: "1px solid",
    borderColor: theme.palette.border.main,
    gap: "20px",
    padding: "10px",
  };

  const receiverStyle = {
    maxWidth: "40vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: theme.palette.tertiary.main,
    borderRadius: "20px",
    border: "1px solid",
    borderColor: theme.palette.border.main,
    gap: "20px",
    padding: "10px",
  };

  useEffect(() => {
    let name = localStorage.getItem("username");
    if (name) {
      setName(name);
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: user === name ? "flex-end" : "flex-start",
        width: "100%",
      }}
    >
      {user !== name && (
        <>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              sx={{
                textAlign: "left",
                fontWeight: "bold",
                fontStyle: "normal",
              }}
            >
              {user}
            </Typography>

            <Paper elevation={0} sx={receiverStyle}>
              <Typography
                sx={{
                  width: "100%",
                  textAlign: "center",
                  fontStyle: "normal",
                  wordWrap: "break-word",
                }}
              >
                {message}
              </Typography>
            </Paper>

            <Typography sx={{ textAlign: "left", color: "#787878" }}>
              {timeSent}
            </Typography>
          </Box>
        </>
      )}

      {user === name && (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <Paper elevation={0} sx={senderStyle}>
              <Typography
                sx={{
                  width: "100%",
                  textAlign: "left",
                  fontStyle: "normal",
                  wordWrap: "break-word",
                }}
              >
                {message}
              </Typography>
            </Paper>

            <Typography sx={{ textAlign: "left", color: "#787878" }}>
              {timeSent}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Message;
