import { Box, Grid } from "@mui/material";
import { useTheme } from "@emotion/react";
import Nav from "@/components/Nav";
import UserPanel from "@/components/user/UserPanel";
import AdminPanel from "@/components/admin/AdminPanel";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminDashboard from "@/components/admin/AdminDashboard";
import UserDashboard from "@/components/user/UserDashboard";

const ProfileUser = ({ toggleTheme }) => {
  const theme = useTheme();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(0);
  const [username, setUsername] = useState("");

  useEffect(() => {
    let admin = localStorage.getItem("is_admin");
    setIsAdmin(parseInt(admin));
  }, [router.query.user]);

  useEffect(() => {
    let name = localStorage.getItem("username");
    setUsername(name);
  }, [router.query.user]);

  return (
    <>
      <Nav toggleTheme={toggleTheme} />
      <Box
        bgcolor={theme.palette.primary.main}
        sx={{
          color: theme.palette.text.main,
          minHeight: "calc(100vh - 85px)",
          marginTop: "85px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Grid
          container
          spacing={1}
          sx={{
            display: "flex",
            width: "100vw",
          }}
        >
          <Grid item xs={12} sm={3}>
            {isAdmin === 1 && router.query.user === username ? (
              <AdminPanel />
            ) : (
              <UserPanel />
            )}
          </Grid>
          <Grid item xs={12} sm={9}>
            {isAdmin === 1 && router.query.user === username ? (
              <AdminDashboard />
            ) : (
              <UserDashboard />
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ProfileUser;
