import { Box, Button, Paper, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";

const UserPanel = () => {
  const [username, setUsername] = useState("");
  const theme = useTheme();
  const router = useRouter();

  ////////// STYLES //////////
  const gridPaperStyle = {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    height: "calc(100vh - 85px)",
    paddingTop: "10px",
    paddingBottom: "10px",
    background: theme.palette.tertiary.main,
    overflow: "auto",
  };

  const profileLinkStyle = {
    width: { xs: "40%", sm: "70%", lg: "50%" },
    color: theme.palette.text.main,
    fontSize: { xs: "18pt", sm: "15pt", md: "18pt", lg: "19pt" },
    "&:hover": {
      textDecoration: "none",
    },
    textTransform: "none",
  };

  useEffect(() => {
    if (router.query.user) {
      let name = localStorage.getItem("username");
      setUsername(name);
    }
  }, [router.query.user]);

  return (
    <Paper sx={gridPaperStyle}>
      <Button
        className={styles.hoverPurple}
        href={`/profile/${router.query.user}`}
        LinkComponent={Link}
        sx={profileLinkStyle}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          {router.query.user}
        </Typography>
      </Button>
      <Box
        component="img"
        src="/profile_image.png"
        sx={{
          maxWidth: {
            xs: "150px",
            sm: "150px",
            md: "170px",
            lg: "200px",
          },
          maxHeight: {
            xs: "150px",
            sm: "150px",
            md: "170px",
            lg: "200px",
          },
        }}
      />

      {username !== router.query.user && username && (
        <Button
          className={styles.scaleButton}
          href={`/messages/${router.query.user}`}
          LinkComponent={Link}
          sx={profileLinkStyle}
          style={{
            marginBottom: "2vh",
            border: "2px solid",
            borderColor: theme.palette.border.main,
            borderRadius: "12px",
            background: theme.palette.primary.main,
          }}
        >
          Message
        </Button>
      )}

      <Button
        className={styles.hoverPurple}
        href={`/profile/collection/${router.query.user}`}
        LinkComponent={Link}
        sx={profileLinkStyle}
      >
        Collection
      </Button>
      <Button
        className={styles.hoverPurple}
        href={`/profile/experience/${router.query.user}`}
        LinkComponent={Link}
        sx={profileLinkStyle}
      >
        Experience
      </Button>
      <Button
        className={styles.hoverPurple}
        href={`/profile/progress/${router.query.user}`}
        LinkComponent={Link}
        sx={profileLinkStyle}
      >
        Progress
      </Button>
      <Button
        className={styles.hoverPurple}
        href={`/profile/trading/${router.query.user}`}
        LinkComponent={Link}
        sx={profileLinkStyle}
      >
        Trading
      </Button>
      <Button
        className={styles.hoverPurple}
        href={`/profile/wishlist/${router.query.user}`}
        LinkComponent={Link}
        sx={profileLinkStyle}
      >
        Wishlist
      </Button>
    </Paper>
  );
};

export default UserPanel;
