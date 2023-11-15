import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import CollectiblesPreview from "../collection/CollectiblesPreview";
import { useTheme } from "@emotion/react";
import { useState } from "react";

const TradingCollectionContainer = ({
  wooliesSeries,
  colesSeries,
  collection,
  selectedCollectibles,
  handler,
}) => {
  const theme = useTheme();
  const [alignment, setAlignment] = useState("Woolworths");

  ////////// HANDLERS //////////
  const handleAlignmentChange = (e) => {
    setAlignment(e.target.value);
  };

  const getOwnedFromSeries = (collectibles) => {
    let ownedNames = collection.map((item) => item.name);
    let owned = [];

    for (const collectible of collectibles) {
      if (ownedNames.includes(collectible["name"])) {
        owned = [...owned, collectible];
      }
    }

    return owned;
  };

  ////////// STYLES //////////
  const collectibleContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    maxHeight: { xs: "75px", sm: "85px", md: "95px", lg: "100px" },
    background: theme.palette.tertiary.main,
    border: "1px solid",
    borderColor: theme.palette.border.main,
    overflow: "auto",
  };

  const providerStyle = {
    width: { xs: "70px", sm: "80px", md: "90px" },
  };

  const toggleStyle = {
    width: { xs: "100px", sm: "110px", md: "130px", lg: "150px" },
  };

  return (
    <>
      <Box className="flex" sx={{ flexDirection: "column" }}>
        <ToggleButtonGroup
          value={alignment}
          exclusive
          onChange={(e) => {
            handleAlignmentChange(e);
          }}
          sx={{ marginTop: "-2vh" }}
        >
          <ToggleButton value="Woolworths" sx={toggleStyle}>
            Woolworths
          </ToggleButton>

          <ToggleButton value="Coles" sx={toggleStyle}>
            Coles
          </ToggleButton>
        </ToggleButtonGroup>

        {alignment === "Woolworths" && (
          <>
            <Box component="img" src="/Woolworths.png" sx={providerStyle} />
            {wooliesSeries.map((series, index) => (
              <CollectiblesPreview
                key={index}
                series={series.series_name}
                collectibles={getOwnedFromSeries(series.collectibles)}
                handler={handler}
                buffer={selectedCollectibles}
                containerStyle={collectibleContainerStyle}
              />
            ))}
          </>
        )}

        {alignment === "Coles" && (
          <>
            <Box component="img" src="/coles.png" sx={providerStyle} />
            {colesSeries.map((series, index) => (
              <CollectiblesPreview
                key={index}
                series={series.series_name}
                collectibles={getOwnedFromSeries(series.collectibles)}
                handler={handler}
                buffer={selectedCollectibles}
                containerStyle={collectibleContainerStyle}
              />
            ))}
          </>
        )}
      </Box>
    </>
  );
};

export default TradingCollectionContainer;
