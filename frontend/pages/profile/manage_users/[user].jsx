import Nav from "@/components/Nav";
import AdminPanel from "@/components/admin/AdminPanel";
import ManageUsersPanel from "@/components/admin/manage/ManageUsersPanel";
import { useTheme } from "@emotion/react";
import { Box, Grid } from "@mui/material";

const ManageUserPage = ({ toggleTheme }) => {
  const theme = useTheme();

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
            <AdminPanel />
          </Grid>
          <Grid item xs={12} sm={9}>
            <ManageUsersPanel />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ManageUserPage;
