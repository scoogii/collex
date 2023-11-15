import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/router";

const NavMenu = () => {
  ////////// STATE VARIABLES //////////
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  ////////// HANDLERS //////////
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    router.push(`/profile/${localStorage.getItem("username")}`);
    handleClose();
  };

  const handleCampaignClick = () => {
    router.push(`/mycampaigns/${localStorage.getItem("username")}`);
    handleClose();
  };

  const handleLogout = () => {
    localStorage.clear();
    if (router.pathname === "/") {
      router.reload();
    } else {
      router.push("/");
    }
    handleClose();
  };

  ////////// USE EFFECTS //////////
  useEffect(() => {
    let is_manager = parseInt(localStorage.getItem("is_manager"));
    if (is_manager === 1) {
      setIsShown(true);
    }

    let is_admin = parseInt(localStorage.getItem("is_admin"));
    if (is_admin === 1) {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <AccountCircle sx={{ width: 40, height: 40 }} />
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {isLoggedIn && (
          <Box>
            <MenuItem
              onClick={() => {
                handleProfileClick();
              }}
            >
              {isAdmin ? "Dashboard" : "Profile"}
            </MenuItem>

            {isShown && (
              <MenuItem
                onClick={() => {
                  handleCampaignClick();
                }}
              >
                My Campaigns
              </MenuItem>
            )}

            <Divider />

            <MenuItem
              onClick={() => {
                handleLogout();
              }}
            >
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Box>
        )}

        {!isLoggedIn && (
          <Box>
            <MenuItem
              onClick={() => {
                router.push("/login");
              }}
            >
              Sign In
            </MenuItem>

            <MenuItem
              onClick={() => {
                router.push("/register");
              }}
            >
              Register
            </MenuItem>
          </Box>
        )}
      </Menu>
    </>
  );
};

export default NavMenu;
