import CollectibleContainer from "@/components/CollectibleContainer";
import Nav from "@/components/Nav";
import { useTheme } from "@emotion/react";
import {
  Box,
  Divider,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import CreateCampaignPostModal from "@/components/campaigns/CreateCampaignPostModal";
import PostBlock from "@/components/campaigns/PostBlock";
import CampaignReviewSection from "@/components/campaigns/CampaignReviewSection";
import { Analytics } from "@mui/icons-material";
import CampaignAnalyticsModal from "@/components/campaigns/CampaignAnalyticsModal";

const CampaignPage = ({ toggleTheme }) => {
  ////////// STATE VARIABLES //////////
  const [username, setUsername] = useState("");
  const [campaign, setCampaign] = useState({});
  const [posts, setPosts] = useState([]);
  const [rating, setRating] = useState(0);
  const [numRatings, setNumRatings] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [collectibles, setCollectibles] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);

  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  const theme = useTheme();
  const router = useRouter();

  ////////// HANDLER //////////
  const getCampaignDetails = async () => {
    const response = await fetch(
      `http://localhost:8080/campaign/get_campaign?campaign_name=${router.query.campaign}`,
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
      setCollectibles(data["campaign"].series_collectibles);
      setCampaign(data["campaign"]);
    }
  };

  const getCampaignPosts = async () => {
    const response = await fetch(
      `http://localhost:8080/campaign/view_all_posts?campaign_name=${router.query.campaign}`,
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
      setPosts(data["posts"]);
    }
  };

  const getCampaignReviews = async () => {
    const response = await fetch(
      `http://localhost:8080/reputation/get_campaign_feedback?campaign_id=${campaign.id}`,
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
      setRating(data["reputation"]["average_rating"]);
      setNumRatings(data["reputation"]["number_of_ratings"]);

      let newReviews = data["reputation"]["reviews"];
      newReviews.reverse();
      setReviews(newReviews);
    }
  };

  ////////// STYLES //////////
  const containerStyle = {
    display: "flex",
    gap: "30px",
    padding: "15px",
    flexDirection: "column",
    alignItems: "center",
    color: theme.palette.text.main,
    minHeight: "calc(100vh - 80px)",
    marginTop: "80px",
    background: theme.palette.tertiary.main,
    width: "100%",
  };

  const contentBlockStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "25px",
    width: "90%",
    border: "2px solid",
    borderRadius: "12px",
    borderColor: theme.palette.border.main,
    background: theme.palette.primary.main,
    maxHeight: { xs: "400px", sm: "450px", md: "500px", lg: "600px" },
    overflow: "auto",
  };

  const postsSectionStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "10px",
    padding: "25px",
    width: "90%",
    height: { xs: "300px", md: "400px", lg: "500px" },
    border: "2px solid",
    borderRadius: "12px",
    borderColor: theme.palette.border.main,
    background: theme.palette.primary.main,
    maxHeight: { xs: "400px", sm: "450px", md: "500px", lg: "650px" },
    overflow: "auto",
  };

  const collectiblesContainerStyle = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid",
    borderColor: theme.palette.border.main,
    background: theme.palette.tertiary.main,
  };

  const imageStyle = {
    height: { xs: "80px", sm: "100px", md: "120px" },
    borderRadius: "12px",
  };

  ////////// USE EFFECTS //////////
  useEffect(() => {
    if (router.query.campaign) {
      getCampaignDetails();
      getCampaignPosts();
    }
  }, [router.query.campaign]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let name = localStorage.getItem("username");
    if (name) {
      setUsername(name);
    }
  }, [router.query.campaign]);

  useEffect(() => {
    if (campaign.id) {
      getCampaignReviews();
    }
  }, [campaign]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <CreateCampaignPostModal
        campaign={campaign}
        getCampaignPosts={getCampaignPosts}
        createOpen={createOpen}
        setCreateOpen={setCreateOpen}
      />

      <CampaignAnalyticsModal
        campaign={campaign}
        collectibles={collectibles}
        analyticsOpen={analyticsOpen}
        setAnalyticsOpen={setAnalyticsOpen}
      />

      <Nav toggleTheme={toggleTheme} />
      <Paper elevation={0} sx={containerStyle}>
        <Typography
          className="flex"
          variant="h2"
          sx={{ marginTop: "1vh", textAlign: "center" }}
        >
          {campaign.name}

          {campaign.campaign_manager_name === username && (
            <Tooltip title="Series Analytics">
              <IconButton
                size="large"
                onClick={() => {
                  setAnalyticsOpen(true);
                }}
              >
                <Analytics sx={{ width: 60, height: 60, color: "#eb8a4d" }} />
              </IconButton>
            </Tooltip>
          )}
        </Typography>

        <Paper elevation={0} sx={contentBlockStyle}>
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            {campaign.date_range}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              fontStyle: "italic",
              marginTop: "20px",
              color: theme.palette.text.main,
            }}
          >
            {campaign.num_participants === 1
              ? "1 participant"
              : `${campaign.num_participants} participants`}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              marginTop: "20px",
              marginBottom: "30px",
            }}
          >
            {campaign.description}
          </Typography>

          <Divider
            sx={{ width: "100%", background: theme.palette.border.main }}
          />

          <Typography
            className="flex"
            variant="h4"
            sx={{
              textAlign: "center",
              width: "100%",
              marginTop: "30px",
              marginBottom: "10px",
              fontWeight: "bold",
            }}
          >
            {campaign.series_name}
          </Typography>

          <Paper elevation={0} sx={collectiblesContainerStyle}>
            {collectibles.map((collectible, index) => (
              <CollectibleContainer
                key={index}
                collectible={collectible}
                imageStyle={imageStyle}
                isProfile={false}
              />
            ))}
          </Paper>
        </Paper>

        <Typography variant="h3" sx={{ textAlign: "center", marginTop: "3vh" }}>
          Posts
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "90%",
          }}
        >
          {campaign.campaign_manager_name === username && (
            <Tooltip title="Create a new post">
              <IconButton
                onClick={() => {
                  setCreateOpen(true);
                }}
              >
                <AddBoxRoundedIcon
                  sx={{
                    width: 35,
                    height: 35,
                    color: "#8c52ff",
                  }}
                />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Box sx={postsSectionStyle} style={{ marginTop: "-30px" }}>
          {posts.length === 0 && (
            <Box
              className="flex"
              sx={{ flexDirection: "column", width: "100%", height: "100%" }}
            >
              No current campaign posts.
            </Box>
          )}

          {posts.map((post, index) => (
            <PostBlock
              key={index}
              post={post}
              isAuthor={campaign.campaign_manager_name === username}
              getCampaignPosts={getCampaignPosts}
            />
          ))}
        </Box>

        <CampaignReviewSection
          getCampaignReviews={getCampaignReviews}
          rating={rating}
          numRatings={numRatings}
          reviews={reviews}
          managerName={campaign.campaign_manager_name}
          username={username}
        />
      </Paper>
    </>
  );
};

export default CampaignPage;
