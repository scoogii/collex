import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useEffect, useState } from "react";
import SelectMessageModal from "./SelectMessageModal";
import { useRouter } from "next/router";

const MessagesPanel = ({ messages }) => {
  const [username, setUsername] = useState("");
  const [selectOpen, setSelectOpen] = useState(false);
  const theme = useTheme();
  const router = useRouter();

  ////////// STYLES //////////
  const messagesContainer = {
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
    backgroundImage: "url('/collex_background.png')",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  const conversationsContainer = {
    border: "2px solid",
    borderColor: theme.palette.border.main,
    background: theme.palette.primary.main,
    width: { xs: "80vw", sm: "70vw", lg: "50vw" },
    height: { xs: "50vh" },
    overflow: "auto",
  };

  const actionsContainer = {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: { xs: "80vw", sm: "70vw", lg: "50vw" },
    marginBottom: "-30px",
  };

  const messagePreviewStyle = {
    width: "100%",
    height: "100%",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    background: theme.palette.tertiary.main,
    border: "1px solid",
    borderColor: theme.palette.border.main,
  };

  useEffect(() => {
    let name = localStorage.getItem("username");
    if (name) {
      setUsername(name);
    }
  }, []);

  return (
    <>
      <SelectMessageModal
        selectOpen={selectOpen}
        setSelectOpen={setSelectOpen}
      />

      <Box bgcolor={theme.palette.primary.main} sx={messagesContainer}>
        <Typography variant="h2" sx={{ marginTop: "1vh" }}>
          Messages
        </Typography>

        <Box sx={actionsContainer}>
          <Tooltip title="Start a new conversation">
            <IconButton
              onClick={() => {
                setSelectOpen(true);
              }}
            >
              <AddBoxIcon
                sx={{
                  color: "#8c52ff",
                  width: { xs: 30, md: 35, lg: 40 },
                  height: { xs: 30, md: 35, lg: 40 },
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>

        {messages.length === 0 && (
          <Paper elevation={0} sx={conversationsContainer}>
            <Box
              className="flex"
              sx={{
                flexDirection: "column",
                width: "100%",
                height: "100%",
                textAlign: "center",
              }}
            >
              <Typography>No current messages.</Typography>
            </Box>
          </Paper>
        )}

        {messages.length !== 0 && (
          <Paper
            elevation={0}
            sx={{
              background: theme.palette.primary.main,
              width: { xs: "80vw", sm: "70vw", lg: "50vw" },
              height: { xs: "50vh" },
              overflow: "auto",
            }}
          >
            {messages.map((messagePreview, index) => (
              <Button
                key={index}
                onClick={() => {
                  router.push(`/messages/${messagePreview.user}`);
                }}
                sx={{
                  padding: "0px",
                  textTransform: "none",
                  width: "100%",
                  height: { xs: "40%", sm: "30%", lg: "25%" },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  overflow: "auto",
                }}
              >
                <Paper elevation={0} sx={messagePreviewStyle}>
                  <Box className="flex" sx={{ textAlign: "left" }}>
                    {messagePreview.unread && (
                      <Chip
                        size="small"
                        label={messagePreview.num_unread}
                        sx={{
                          fontSize: "12pt",
                          background: "#fe4034",
                          marginRight: "15px",
                        }}
                      />
                    )}

                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {" "}
                      {messagePreview.user}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      textAlign: "left",
                      maxWidth: "80%",
                      display: "block",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                  >
                    {messagePreview.last_message.sender === username ? (
                      <>You: {messagePreview.last_message.message}</>
                    ) : (
                      <>
                        {messagePreview.last_message.sender}:{" "}
                        {messagePreview.last_message.message}
                      </>
                    )}
                  </Typography>

                  <Typography
                    sx={{
                      textAlign: "left",
                      fontStyle: "italic",
                      color: "#787878",
                    }}
                  >
                    {messagePreview.last_message.timestamp}
                  </Typography>
                </Paper>
              </Button>
            ))}
          </Paper>
        )}
      </Box>
    </>
  );
};

export default MessagesPanel;
