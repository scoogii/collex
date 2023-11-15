import { useTheme } from "@emotion/react";
import { CloseRounded, Gavel } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import SuccessBar from "@/components/SuccessBar";
import { useRouter } from "next/router";
import AlertBar from "@/components/AlertBar";

const ManageUserModal = ({ manageOpen, setManageOpen, user, getUsers }) => {
  const [role, setRole] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const theme = useTheme();
  const router = useRouter();

  ////////// HANDLERS //////////
  const handleChangeAdmin = async () => {
    const response = await fetch(
      `http://localhost:8080/admin/set_user_as_administrator?username=${user.username}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
      },
    );

    const data = await response.json();

    // Check response status code
    if (response.status !== 200) {
      setAlertMessage(data.message);
      setAlertOpen(true);
      return;
    }

    if (data.error) {
      alert(data.error);
    } else {
      getUsers();
      setManageOpen(false);
      setSuccessOpen(true);
      setSuccessMessage(`Successfully changed ${user.username} to an admin.`);
    }
  };

  const handleChangeManager = async () => {
    const response = await fetch(
      `http://localhost:8080/admin/set_user_as_campaign_manager?username=${user.username}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
      },
    );

    const data = await response.json();

    // Check response status code
    if (response.status !== 200) {
      setAlertMessage(data.message);
      setAlertOpen(true);
      return;
    }

    if (data.error) {
      alert(data.error);
    } else {
      getUsers();
      setManageOpen(false);
      setSuccessOpen(true);
      setSuccessMessage(`Successfully changed ${user.username} to a manager.`);
    }
  };

  const handleChangeCollector = async () => {
    const response = await fetch(
      `http://localhost:8080/admin/set_user_as_collector?username=${user.username}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
      },
    );

    const data = await response.json();

    // Check response status code
    if (response.status !== 200) {
      setAlertMessage(data.message);
      setAlertOpen(true);
      return;
    }

    if (data.error) {
      alert(data.error);
    } else {
      getUsers();
      setManageOpen(false);
      setSuccessOpen(true);
      setSuccessMessage(
        `Successfully changed ${user.username} to a collector.`,
      );
    }
  };

  const handleBanUser = async () => {
    const response = await fetch(
      `http://localhost:8080/admin/ban_user?username=${user.username}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
      },
    );

    const data = await response.json();

    // Check response status code
    if (response.status !== 200) {
      setAlertMessage(data.message);
      setAlertOpen(true);
      return;
    }

    if (data.error) {
      alert(data.error);
    } else {
      getUsers();
      setManageOpen(false);
      setSuccessOpen(true);
      setSuccessMessage(`Successfully banned ${user.username}`);
    }
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  ////////// STYLES //////////
  const modalStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const modalContainerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "100%",
    gap: "10px",
    padding: "10px",
    overflow: "auto",
  };

  const contentContainerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    height: "43%",
    border: "1px solid",
    borderRadius: "10px",
    borderColor: theme.palette.border.main,
    background: theme.palette.tertiary.main,
  };

  const toggleButtonStyle = {
    width: "100px",
    textAlign: "center",
    textTransform: "none",
  };

  const nameButtonStyle = {
    textTransform: "none",
    color: theme.palette.text.main,
    maxWidth: "80%",
    display: "block",
    textOverflow: "ellipsis",
    overflow: "hidden",
  };

  const buttonStyle = {
    gap: "5px",
    background: "#de163b",
    fontSize: "14pt",
    width: "110px",
    height: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "12px",
    textTransform: "none",
    color: "white",
    "&:hover": {
      background: "#de163b",
    },
  };

  ////////// USE EFFECTS //////////
  useEffect(() => {
    if (user.is_admin === 0 && user.is_campaign_manager === 0) {
      setRole("Collector");
      return;
    } else if (user.is_admin === 1 && user.is_campaign_manager === 0) {
      setRole("Admin");
    } else {
      setRole("Manager");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <AlertBar
        isOpen={alertOpen}
        handleClose={() => {
          setAlertOpen(false);
        }}
        message={alertMessage}
      />

      <SuccessBar
        isOpen={successOpen}
        handleClose={() => {
          setSuccessOpen(false);
        }}
        message={successMessage}
      />

      <Modal
        disableAutoFocus={true}
        open={manageOpen}
        onClose={() => {
          setManageOpen(false);
        }}
        sx={modalStyle}
      >
        <Paper
          sx={{
            width: { xs: "350px", md: "400px" },
            height: { xs: "420px", md: "450px" },
            background: theme.palette.primary.main,
            border: "2px solid",
            borderColor: theme.palette.border.main,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-start",
              width: "100%",
              height: "3vh",
            }}
          >
            <IconButton
              size="small"
              onClick={() => {
                setManageOpen(false);
              }}
            >
              <CloseRounded
                sx={{
                  color: "#e65c53",
                  width: { xs: 30, md: 35, lg: 40 },
                  height: { xs: 30, md: 35, lg: 40 },
                }}
              />
            </IconButton>
          </Box>

          <Box sx={modalContainerStyle}>
            <Button
              className={styles.hoverPurple}
              sx={nameButtonStyle}
              onClick={() => {
                router.push(`/profile/${user.username}`);
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  marginTop: "-1.5vh",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {user.username}
              </Typography>
            </Button>

            <Box
              component="img"
              src="/profile_image.png"
              sx={{ width: "20%" }}
            />

            <Box sx={contentContainerStyle}>
              <Typography
                variant="h6"
                sx={{ textAlign: "center", padding: "5px" }}
              >
                {user.email}
              </Typography>

              <Box
                sx={{
                  height: "1px",
                  width: "100%",
                  background: theme.palette.border.main,
                }}
              />

              <Box className="flex">
                <ToggleButtonGroup
                  value={role}
                  exclusive
                  onChange={(e) => {
                    handleRoleChange(e);
                  }}
                >
                  <ToggleButton
                    value="Admin"
                    className={styles.selectButton}
                    sx={toggleButtonStyle}
                    onClick={handleChangeAdmin}
                  >
                    Admin
                  </ToggleButton>

                  <ToggleButton
                    value="Manager"
                    className={styles.selectButton}
                    sx={toggleButtonStyle}
                    onClick={handleChangeManager}
                  >
                    Manager
                  </ToggleButton>

                  <ToggleButton
                    value="Collector"
                    className={styles.selectButton}
                    sx={toggleButtonStyle}
                    onClick={handleChangeCollector}
                  >
                    Collector
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>

            <Box className="flex" sx={{ width: "100%", height: "15%" }}>
              <Button
                className={styles.selectButton}
                sx={buttonStyle}
                onClick={() => {
                  handleBanUser();
                }}
              >
                <Gavel /> Ban
              </Button>
            </Box>
          </Box>
        </Paper>
      </Modal>
    </>
  );
};

export default ManageUserModal;
