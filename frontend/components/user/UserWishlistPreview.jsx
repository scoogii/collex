import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import CollectibleContainer from "../CollectibleContainer";
import styles from "@/styles/Home.module.css";

const UserWishlistPreview = ({ name }) => {
  ////////// STATE VARIABLES //////////
  const [wishlist, setWishlist] = useState([]);
  const theme = useTheme();

  ////////// HANDLERS //////////
  const getWishlist = async () => {
    const response = await fetch(
      `http://localhost:8080/wishlist/get_wishlist?username=${name}`,
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
      setWishlist(data["wishlist"]["collectibles"]);
    }
  };

  ////////// STYLES //////////
  const collectiblesPreviewStyle = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    height: "150px",
    width: { xs: "80%", md: "60%" },
    padding: "10px",
    gap: "10px",
    border: "2px solid",
    borderColor: theme.palette.border.main,
    borderRadius: "12px",
    background: theme.palette.primary.main,
    overflow: "auto",
  };

  const imageContainerStyle = {
    display: "flex",
    width: { xs: "100px", sm: "110px", md: "120px" },
    height: { xs: "100px", sm: "110px", md: "120px" },
    justifyContent: "center",
    alignItems: "center",
  };

  const imageStyle = {
    width: "100%",
    height: "auto",
    borderRadius: "18px",
  };

  ////////// USE EFFECTS //////////
  useEffect(() => {
    if (name) {
      getWishlist();
    }
  }, [name]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Box
        className="flex"
        sx={{ flexDirection: "column", width: "100%", gap: "20px" }}
      >
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.text.main,
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          Wishlist
        </Typography>

        <Box sx={collectiblesPreviewStyle}>
          {wishlist.map((collectible, index) => (
            <Box
              className={styles.scaleButton}
              sx={imageContainerStyle}
              key={index}
            >
              <CollectibleContainer
                collectible={collectible}
                imageStyle={imageStyle}
                isProfile={false}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default UserWishlistPreview;
