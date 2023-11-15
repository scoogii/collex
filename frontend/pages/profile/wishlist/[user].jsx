import { Box, Grid } from "@mui/material";
import { useTheme } from "@emotion/react";
import Nav from "@/components/Nav";
import UserPanel from "@/components/user/UserPanel";
import WishlistPanel from "@/components/wishlist/WishlistPanel";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import EditModal from "@/components/wishlist/EditModal";

const ProfileWishlist = ({ toggleTheme }) => {
  ////////// STATE VARIABLES //////////
  const theme = useTheme();
  const router = useRouter();
  const [canEdit, setCanEdit] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [myWishlist, setMyWishlist] = useState([]);
  const [collectibles, setCollectibles] = useState([]);

  const getMyWishlist = async () => {
    const response = await fetch(
      `http://localhost:8080/wishlist/get_wishlist?username=${router.query.user}`,
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
      setMyWishlist(data["wishlist"]["collectibles"]);
    }
  };

  const getCollectibles = async () => {
    // Send request to backend for user's collectibles
    const response = await fetch(
      `http://localhost:8080/collection/get_collection?username=${router.query.user}`,
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
      setCollectibles(data["collection"]["collectibles"]);
    }
  };

  ////////// USE EFFECTS //////////
  useEffect(() => {
    if (router.query.user === localStorage.getItem("username")) {
      setCanEdit(true);
    }
  }, [router.query.user]);

  useEffect(() => {
    if (router.query.user) {
      getMyWishlist();
      getCollectibles();
    }
  }, [router.query.user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let isAdmin = localStorage.getItem("is_admin");
    if (parseInt(isAdmin) === 1) {
      router.push("/");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <EditModal
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        myWishlist={myWishlist}
        getMyWishlist={getMyWishlist}
        myCollectibles={collectibles}
      />
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
            <UserPanel />
          </Grid>
          <Grid item xs={12} sm={9}>
            <WishlistPanel
              canEdit={canEdit}
              setEditOpen={setEditOpen}
              myWishlist={myWishlist}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ProfileWishlist;
