import Nav from "@/components/Nav";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import styles from "@/styles/Home.module.css";
import { useTheme } from "@emotion/react";
import { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyIcon from "@mui/icons-material/Key";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import Link from "next/link";
import { useRouter } from "next/router";
import AlertBar from "@/components/AlertBar";

const Register = ({ toggleTheme }) => {
  ////////// STATE VARIABLES //////////
  const theme = useTheme();
  const [hidden, setHidden] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alignment, setAlignment] = useState("Collector");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const router = useRouter();

  ////////// HANDLERS //////////
  // Handlers for visibility of password
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleUserRegister = async (e) => {
    e.preventDefault();

    // Send request to backend for register
    const response = await fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        username: username,
        is_admin: alignment === "Admin" ? 1 : 0,
        is_campaign_manager: alignment === "Manager" ? 1 : 0,
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
      // If the register is successful, the user is also logged in and sent to home
      localStorage.setItem("is_admin", data["is_admin"]);
      localStorage.setItem("is_manager", data["is_campaign_manager"]);
      localStorage.setItem("token", data["auth_token"]);
      localStorage.setItem("username", username);
      router.push("/");
    }
  };

  const handleAlignmentChange = (e) => {
    setAlignment(e.target.value);
  };

  ////////// STYLES //////////
  const registerBoxStyle = {
    background: theme.palette.primary.main,
    flexDirection: "column",
    width: { xs: "100vw", sm: "550px", md: "550px", lg: "650px" },
    height: { xs: "calc(100vh - 80px)", sm: "550px", md: "550px", lg: "650px" },
    gap: { xs: "35px", lg: "40px" },
    border: "2px solid",
    borderColor: theme.palette.border.main,
    borderRadius: { xs: "0", sm: "15px" },
  };

  const registerButtonStyle = {
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

  const toggleStyle = {
    width: { xs: "90px", sm: "100px" },
  };

  ////////// USE EFFECTS //////////
  // Clear input on page render
  useEffect(() => {
    setUsername("");
    setPassword("");
    setEmail("");
    setShowPassword(false);
  }, []);

  // If user is already logged in, redirect to home page
  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
            <Paper className="flex" elevation={0} sx={registerBoxStyle}>
              <Typography variant="h4">Create an Account</Typography>

              <Box className="flex">
                <ToggleButtonGroup
                  value={alignment}
                  exclusive
                  onChange={(e) => {
                    handleAlignmentChange(e);
                  }}
                >
                  <ToggleButton value="Collector" sx={toggleStyle}>
                    Collector
                  </ToggleButton>

                  <ToggleButton value="Manager" sx={toggleStyle}>
                    Manager
                  </ToggleButton>

                  <ToggleButton value="Admin" sx={toggleStyle}>
                    Admin
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <form
                onSubmit={(e) => {
                  handleUserRegister(e);
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
                    label="Email"
                    type="email"
                    value={email}
                    sx={textFieldStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                    onChange={(e) => {
                      setEmail(e.target.value);
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
                    sx={registerButtonStyle}
                  >
                    <Typography variant="h6">Sign Up</Typography>
                  </Button>
                </Box>
              </form>
              <Box
                className={styles.hoverPurple}
                component={Link}
                href="/login"
                sx={{
                  color: theme.palette.text.main,
                }}
              >
                <Typography>Already a collector? Sign in</Typography>
              </Box>
            </Paper>
          </Box>
        </>
      )}
    </>
  );
};

export default Register;
