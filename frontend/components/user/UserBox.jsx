import { useTheme } from "@emotion/react";
import { Box, Button, Typography } from "@mui/material";
import styles from "@/styles/Home.module.css";
import ManageUserModal from "../admin/manage/ManageUserModal";
import { useState } from "react";

const UserBox = ({ user, getUsers }) => {
  const [manageOpen, setManageOpen] = useState(false);
  const theme = useTheme();

  ////////// STYLES //////////
  const userContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: { xs: "100px", md: "120px", lg: "150px" },
    height: { xs: "100px", md: "120px", lg: "150px" },
    background: theme.palette.tertiary.main,
    border: "2px solid",
    borderColor: theme.palette.border.main,
    borderRadius: "12px",
    color: theme.palette.text.main,
    textTransform: "none",
  };

  return (
    <>
      <ManageUserModal
        manageOpen={manageOpen}
        setManageOpen={setManageOpen}
        user={user}
        getUsers={getUsers}
      />

      <Button
        className={styles.selectButton}
        elevation={0}
        sx={userContainerStyle}
        onClick={() => {
          setManageOpen(true);
        }}
      >
        <Box component="img" src="/profile_image.png" sx={{ width: "50%" }} />
        <Typography
          variant="h6"
          sx={{
            maxWidth: "90%",
            textAlign: "center",
            fontWeight: "bold",
            display: "block",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {user.username}
        </Typography>
      </Button>
    </>
  );
};

export default UserBox;
