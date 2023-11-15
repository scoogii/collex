import AlertBar from "@/components/AlertBar";
import UserBox from "@/components/user/UserBox";
import { useTheme } from "@emotion/react";
import { Search } from "@mui/icons-material";
import {
  Box,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

const ManageUsersPanel = () => {
  ////////// STATE VARIABLES //////////
  const [admins, setAdmins] = useState([]);
  const [adminSearch, setAdminSearch] = useState("");
  const [adminResults, setAdminResults] = useState([]);

  const [managers, setManagers] = useState([]);
  const [managerSearch, setManagerSearch] = useState("");
  const [managerResults, setManagerResults] = useState([]);

  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [userResults, setUserResults] = useState([]);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const theme = useTheme();

  ////////// HANDLERS //////////
  const getUsers = async () => {
    const response = await fetch(`http://localhost:8080/admin/all_user_roles`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });

    const data = await response.json();

    if (data.error) {
      alert(data.error);
    } else {
      setAdmins(
        data["users"]["administrators"].filter((admin) => {
          return admin.username !== localStorage.getItem("username");
        }),
      );
      setManagers(data["users"]["campaign_managers"]);
      setUsers(data["users"]["users"]);
    }
  };

  const handleAdminSearch = async () => {
    const response = await fetch(
      `http://localhost:8080/admin/search_admins?username=${adminSearch}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      },
    );

    const data = await response.json();

    if (data.error) {
      alert(data.error);
    } else {
      if (data["users"].length === 0) {
        setAlertOpen(true);
        setAlertMessage(`No admins found with name ${adminSearch}.`);
      }
      setAdminResults(data["users"].map((user) => user.username));
    }
  };

  const handleManagerSearch = async () => {
    const response = await fetch(
      `http://localhost:8080/admin/search_campaign_managers?username=${managerSearch}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      },
    );

    const data = await response.json();

    if (data.error) {
      alert(data.error);
    } else {
      if (data["users"].length === 0) {
        setAlertOpen(true);
        setAlertMessage(`No managers found with name ${managerSearch}.`);
      }
      setManagerResults(data["users"].map((user) => user.username));
    }
  };

  const handleUserSearch = async () => {
    const response = await fetch(
      `http://localhost:8080/admin/search_users?username=${userSearch}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      },
    );

    const data = await response.json();

    if (data.error) {
      alert(data.error);
    } else {
      if (data["users"].length === 0) {
        setAlertOpen(true);
        setAlertMessage(`No collectors found with name ${managerSearch}.`);
      }
      setUserResults(data["users"].map((user) => user.username));
    }
  };

  ////////// STYLES //////////
  const gridPaperStyle = {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    height: "calc(100vh - 85px)",
    paddingTop: "10px",
    paddingBottom: "10px",
    background: theme.palette.tertiary.main,
    gap: "3vh",
    overflow: "auto",
  };

  const searchBarStyle = {
    marginTop: "20px",
    marginBottom: { xs: "-10px", sm: "-20px", md: "-25px", lg: "-30px" },
    width: { xs: "250px", sm: "300px", lg: "350px" },
    height: { lg: "80px" },
    color: "black",
    "& label.Mui-focused": {
      color: "#8c52ff",
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "#8c52ff",
      },
    },
    "& fieldset.MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.border.main,
    },
    "&:hover fieldset.MuiOutlinedInput-notchedOutline": {
      borderColor: "#8c52ff",
    },
  };

  const searchResultsStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginTop: { xs: "30px", md: "40px", lg: "20px" },
    height: { xs: "200px", sm: "250px", md: "350px", lg: "400px" },
    width: "90%",
    background: theme.palette.primary.main,
    border: "2px solid",
    borderRadius: "12px",
    borderColor: theme.palette.border.main,
    padding: "10px",
    gap: "10px",
    overflow: "auto",
  };

  ////////// USE EFFECTS //////////
  useEffect(() => {
    getUsers();
    setAdminSearch("");
    setManagerSearch("");
    setUserSearch("");
    setAdminResults([]);
    setManagerResults([]);
    setUserResults([]);
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

      <Paper sx={gridPaperStyle}>
        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
          Manage Users
        </Typography>

        <Box className="flex" sx={{ flexDirection: "column", width: "100%" }}>
          <Typography
            variant="h5"
            sx={{ textAlign: "center", fontStyle: "italic" }}
          >
            Search Admins
          </Typography>

          <TextField
            label="Search Admin"
            value={adminSearch}
            sx={searchBarStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            onChange={(e) => {
              setAdminSearch(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAdminSearch();
              }
            }}
          />

          <Paper elevation={0} sx={searchResultsStyle}>
            {admins
              .filter((user) => {
                return adminResults.length === 0
                  ? true
                  : adminResults.includes(user.username);
              })
              .map((user, index) => (
                <UserBox key={index} user={user} getUsers={getUsers} />
              ))}
          </Paper>
        </Box>

        <Box className="flex" sx={{ flexDirection: "column", width: "100%" }}>
          <Typography
            variant="h5"
            sx={{ textAlign: "center", fontStyle: "italic" }}
          >
            Search Managers
          </Typography>

          <TextField
            label="Search Manager"
            value={managerSearch}
            sx={searchBarStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            onChange={(e) => {
              setManagerSearch(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleManagerSearch();
              }
            }}
          />

          <Paper elevation={0} sx={searchResultsStyle}>
            {managers
              .filter((user) => {
                return managerResults.length === 0
                  ? true
                  : managerResults.includes(user.username);
              })
              .map((user, index) => (
                <UserBox key={index} user={user} getUsers={getUsers} />
              ))}
          </Paper>
        </Box>

        <Box className="flex" sx={{ flexDirection: "column", width: "100%" }}>
          <Typography variant="h5" sx={{ fontStyle: "italic" }}>
            Search Collectors
          </Typography>

          <TextField
            label="Search User"
            value={userSearch}
            sx={searchBarStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            onChange={(e) => {
              setUserSearch(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleUserSearch();
              }
            }}
          />

          <Paper
            elevation={0}
            sx={searchResultsStyle}
            style={{ marginBottom: "50px" }}
          >
            {users
              .filter((user) => {
                return userResults.length === 0
                  ? true
                  : userResults.includes(user.username);
              })
              .map((user, index) => (
                <UserBox key={index} user={user} getUsers={getUsers} />
              ))}
          </Paper>
        </Box>
      </Paper>
    </>
  );
};

export default ManageUsersPanel;
