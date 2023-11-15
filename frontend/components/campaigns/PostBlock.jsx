import { Box, Button, Divider, Typography } from "@mui/material";
import { useState } from "react";
import styles from "@/styles/Home.module.css";
import { useTheme } from "@emotion/react";
import ViewPostModal from "./ViewPostModal";

const PostBlock = ({ post, isAuthor, getCampaignPosts }) => {
  const [readOpen, setReadOpen] = useState(false);

  const theme = useTheme();

  ////////// STYLES //////////
  const postBlockStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: { xs: "100%", sm: "48%", md: "32%" },
    height: { xs: "150px", sm: "200px", md: "250px" },
    background: theme.palette.tertiary.main,
    border: "2px solid",
    borderRadius: "12px",
    background: theme.palette.primary.main,
    borderColor: theme.palette.border.main,
    color: theme.palette.text.main,
    textTransform: "none",
    padding: "10px",
    overflow: "auto",
  };

  return (
    <>
      <ViewPostModal
        post={post}
        isAuthor={isAuthor}
        readOpen={readOpen}
        setReadOpen={setReadOpen}
        getCampaignPosts={getCampaignPosts}
      />

      <Button
        className={styles.scaleButton}
        sx={postBlockStyle}
        onClick={() => {
          setReadOpen(true);
        }}
      >
        <Box
          sx={{
            display: "flex",
            height: "100%",
            flexDirection: "column",
            justifyContent: "space-evenly",
            overflow: "auto",
          }}
        >
          <Typography
            variant="h5"
            sx={{ textAlign: "center", fontWeight: "bold", color: "#8c52ff" }}
          >
            {post.post_title}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              fontStyle: "italic",
              marginBottom: "1vh",
            }}
          >
            {post.author_username}
          </Typography>

          <Typography sx={{ textAlign: "center", fontStyle: "italic" }}>
            {post.time_created}
          </Typography>

          <Divider
            sx={{ background: theme.palette.border.main, width: "100%" }}
          />

          <Typography
            sx={{
              textAlign: "center",
              overflowWrap: "anywhere",
              marginTop: "1vh",
            }}
          >
            {post.post_description}
          </Typography>
        </Box>
      </Button>
    </>
  );
};

export default PostBlock;
