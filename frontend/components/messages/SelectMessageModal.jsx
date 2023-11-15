import {
  Autocomplete,
  Box,
  Button,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { useTheme } from "@emotion/react";
import AlertBar from "../AlertBar";
import { useRouter } from "next/router";

const SelectMessageModal = ({ selectOpen, setSelectOpen }) => {
  ////////// STATE VARIABLES //////////
  const [usernames, setUsernames] = useState([]);
  const [targetUser, setTargetUser] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);
  const theme = useTheme();
  const router = useRouter();

  ////////// HANDLERS //////////
  const getAllUsernames = async () => {
    // Send request to backend for user's collectibles
    const response = await fetch(`http://localhost:8080/auth/get_all_users`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });

    const data = await response.json();

    if (data.error) {
      alert(data.error);
    } else {
      let allNames = data["accounts"].map((item) => {
        return item.username;
      });

      setUsernames(
        allNames
          .filter((item) => {
            return item !== localStorage.getItem("username");
          })
          .filter((item) => {
            return item !== "superuser";
          }),
      );
    }
  };

  const handleUserSelect = (e) => {
    e.preventDefault();

    if (!usernames.includes(targetUser)) {
      setAlertMessage(`User ${targetUser} doesn't exist`);
      setAlertOpen(true);
      return;
    }

    setSelectOpen(false);
    router.push(`/messages/${targetUser}`);
  };

  ////////// STYLES //////////
  const modalStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  };

  const autocompleteStyle = {
    width: { xs: "180px", sm: "200px", md: "250px" },
    color: "black",
    "& label.Mui-focused": {
      color: "#8c52ff",
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "#8c52ff",
      },
    },
  };

  const buttonStyle = {
    background: "#8c52ff",
    fontSize: "15pt",
    width: { xs: "150px", md: "150px" },
    height: { xs: "55px", md: "60px" },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "15px",
    textTransform: "none",
    color: "white",
    "&:hover": {
      background: "#8c52ff",
    },
  };

  ////////// STYLES //////////
  useEffect(() => {
    getAllUsernames();
  }, []);

  useEffect(() => {
    if (selectOpen === true) {
      setTargetUser("");
    }
  }, [selectOpen]);

  return (
    <>
      <AlertBar
        isOpen={alertOpen}
        handleClose={() => {
          setAlertOpen(false);
        }}
        message={alertMessage}
      />

      <Modal
        disableAutoFocus={true}
        open={selectOpen}
        onClose={() => {
          setSelectOpen(false);
        }}
        sx={modalStyle}
      >
        <Paper
          className="flex"
          sx={{
            flexDirection: "column",
            width: { xs: "70vw", sm: "50vw", md: "40vw", lg: "30vw" },
            height: { xs: "35vh" },
            background: theme.palette.primary.main,
            border: "2px solid",
            borderColor: theme.palette.border.main,
          }}
        >
          <Button
            className={styles.scaleButton}
            onClick={() => {
              setSelectOpen(false);
            }}
            sx={{
              position: "absolute",
              right: {
                xs: "calc(13vw)",
                sm: "calc(24vw)",
                md: "calc(30vw)",
                lg: "calc(35vw)",
              },
              top: "33vh",
            }}
          >
            <CloseRoundedIcon
              sx={{
                color: "#e65c53",
                width: { xs: 30, md: 35, lg: 40 },
                height: { xs: 30, md: 35, lg: 40 },
              }}
            />
          </Button>
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "20pt", sm: "22pt", md: "25pt", lg: "30pt" },
              }}
            >
              Select User
            </Typography>
            <form
              onSubmit={(e) => {
                handleUserSelect(e);
              }}
            >
              <Box
                className="flex"
                sx={{
                  flexDirection: "column",
                  gap: "1.5rem",
                  marginTop: "1.5rem",
                }}
              >
                <Autocomplete
                  required
                  options={usernames}
                  value={targetUser}
                  sx={autocompleteStyle}
                  onChange={(e, newUser) => {
                    setTargetUser(newUser);
                  }}
                  onKeyDown={(e) => {
                    if (e.code === "Enter") {
                      handleUserSelect(e);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Select a User" />
                  )}
                />
                <Button
                  className={styles.selectButton}
                  type="submit"
                  onClick={(e) => {
                    handleUserSelect(e);
                  }}
                  sx={buttonStyle}
                >
                  Continue
                </Button>
              </Box>
            </form>
          </Box>
        </Paper>
      </Modal>
    </>
  );
};

export default SelectMessageModal;
