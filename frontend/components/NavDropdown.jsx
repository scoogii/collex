import { ExpandMore } from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

const NavDropdown = ({ token, isAdmin }) => {
  ////////// STATE VARIABLES //////////
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

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <ExpandMore sx={{ width: 40, height: 40, color: "#8c52ff" }} />
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            router.push("/marketplace");
          }}
        >
          Marketplace
        </MenuItem>

        {token && (
          <MenuItem
            onClick={() => {
              router.push("/campaigns");
            }}
          >
            Campaigns
          </MenuItem>
        )}

        {token && (
          <MenuItem
            onClick={() => {
              router.push("/messages");
            }}
          >
            Messages
          </MenuItem>
        )}

        {token && !isAdmin && (
          <MenuItem
            onClick={() => {
              router.push(
                `/profile/trading/${localStorage.getItem("username")}`,
              );
            }}
          >
            My Trades
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default NavDropdown;
