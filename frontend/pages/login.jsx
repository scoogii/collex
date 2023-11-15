import Nav from "@/components/Nav";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import styles from "@/styles/Home.module.css";
import { useTheme } from "@emotion/react";
import { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyIcon from "@mui/icons-material/Key";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Link from "next/link";
import { useRouter } from "next/router";
import AlertBar from "@/components/AlertBar";

const Login = ({ toggleTheme }) => {
  const router = useRouter();

  ////////// STATE VARIABLES //////////
  const theme = useTheme();
  const [hidden, setHidden] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  ////////// HANDLERS //////////
  // Handlers for visibility of password
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleUserLogin = async (e) => {
    e.preventDefault();

    // Send request to backend for login
    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        password: password,
        username: username,
      }),
    });

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
      // If the login is successful, the user is logged in and sent to home
      localStorage.setItem("is_admin", data["is_admin"]);
      localStorage.setItem("is_manager", data["is_campaign_manager"]);
      localStorage.setItem("token", data["auth_token"]);
      localStorage.setItem("username", username);
      router.push("/");
    }
  };

  ////////// STYLES //////////
  const loginBoxStyle = {
    background: theme.palette.primary.main,
    flexDirection: "column",
    width: { xs: "100vw", sm: "550px", md: "550px", lg: "600px" },
    height: { xs: "calc(100vh - 80px)", sm: "550px", md: "550px", lg: "600px" },
    gap: { xs: "35px", lg: "40px" },
    border: "2px solid",
    borderColor: theme.palette.border.main,
    borderRadius: { xs: "0", sm: "15px" },
  };

  const loginButtonStyle = {
    background: "#8c52ff",
    fontSize: { lg: "18pt" },
    width: { xs: "150px", md: "190px" },
    height: { xs: "55px", md: "65px" },
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

  const textFieldStyle = {
    width: { xs: "250px", lg: "350px" },
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
  };

  ////////// USE EFFECTS //////////
  // Clear input on page render
  useEffect(() => {
    setUsername("");
    setPassword("");
    setShowPassword(false);
  }, []);

  // If user is already logged in, redirect to home page
  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (!token) {
      setHidden(false);
    }
  }, []);

  return (
    <>
      {!hidden && (
        <>
          <AlertBar
            isOpen={alertOpen}
            handleClose={() => {
              setAlertOpen(false);
            }}
            message={alertMessage}
          />
          <Nav toggleTheme={toggleTheme} />
          <Box
            className={styles.main}
            bgcolor={theme.palette.primary.main}
            sx={{
              color: theme.palette.text.main,
              marginTop: "80px",
              height: "calc(100vh - 80px)",
            }}
          >
            <Paper className="flex" elevation={0} sx={loginBoxStyle}>
              <Typography variant="h3">Login</Typography>

              <form
                onSubmit={(e) => {
                  handleUserLogin(e);
                }}
              >
                <Box
                  className="flex"
                  sx={{
                    flexDirection: "column",
                    gap: { xs: "20px", lg: "10px" },
                  }}
                >
                  <TextField
                    required
                    error={alertOpen}
                    label="Username"
                    value={username}
                    sx={textFieldStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircleIcon />
                        </InputAdornment>
                      ),
                    }}
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />

                  <TextField
                    required
                    error={alertOpen}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    sx={textFieldStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <KeyIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <Button
                    type="submit"
                    variant="outlined"
                    className={styles.scaleButton}
                    sx={loginButtonStyle}
                  >
                    <Typography variant="h6">Login</Typography>
                  </Button>
                </Box>
              </form>
              <Box
                className={styles.hoverPurple}
                component={Link}
                href="/register"
                sx={{
                  color: theme.palette.text.main,
                }}
              >
                <Typography>Don&apos;t have an account? Sign up</Typography>
              </Box>
            </Paper>
          </Box>
        </>
      )}
    </>
  );
};

export default Login;
