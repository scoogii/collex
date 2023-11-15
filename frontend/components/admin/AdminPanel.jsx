import { Box, Button, Paper, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";
import Link from "next/link";

const AdminPanel = () => {
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
    width: "90%",
    color: theme.palette.text.main,
    fontSize: { xs: "18pt", sm: "15pt", md: "18pt", lg: "19pt" },
    "&:hover": {
      textDecoration: "none",
    },
    textTransform: "none",
  };

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

      <Button
        className={styles.hoverPurple}
        href={`/profile/manage_users/${router.query.user}`}
        LinkComponent={Link}
        sx={profileLinkStyle}
      >
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          Manage Users
        </Typography>
      </Button>

      <Button
        className={styles.hoverPurple}
        href={`/profile/manage_campaigns/${router.query.user}`}
        LinkComponent={Link}
        sx={profileLinkStyle}
      >
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          Manage Campaigns
        </Typography>
      </Button>
    </Paper>
  );
};

export default AdminPanel;
