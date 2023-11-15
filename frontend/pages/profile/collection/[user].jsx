import { Box, Grid } from "@mui/material";
import { useTheme } from "@emotion/react";
import Nav from "@/components/Nav";
import UserPanel from "@/components/user/UserPanel";
import CollectionPanel from "@/components/CollectionPanel";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import EditModal from "@/components/collection/EditModal";

const ProfileCollection = ({ toggleTheme }) => {
  ////////// STATE VARIABLES //////////
  const theme = useTheme();
  const router = useRouter();
  const [canEdit, setCanEdit] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [myCollectibles, setMyCollectibles] = useState([]);

  const getMyCollectibles = async () => {
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
      setMyCollectibles(data["collection"]["collectibles"]);
    }
  };

  ////////// USE EFFECTS //////////
  // If the logged in user views their profile, enable editing of their collection
  useEffect(() => {
    if (router.query.user === localStorage.getItem("username")) {
      setCanEdit(true);
    }
  }, [router.query.user]);

  // On render, load all of profile's collectibles
  useEffect(() => {
    if (router.query.user) {
      getMyCollectibles();
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
        myCollectibles={myCollectibles}
        getMyCollectibles={getMyCollectibles}
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
            <CollectionPanel
              canEdit={canEdit}
              setEditOpen={setEditOpen}
              myCollectibles={myCollectibles}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ProfileCollection;
