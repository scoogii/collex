import { useTheme } from "@emotion/react";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

const FilterSelect = ({
  disabled,
  title,
  options,
  choice,
  setChoice,
  choiceColours,
}) => {
  const theme = useTheme();

  ////////// STYLES //////////
  const selectStyle = {
    width: { xs: "100px", sm: "150px", md: "180px", lg: "220px" },
    "&.MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: theme.palette.tertiary.primary,
      },
      "&:hover fieldset": {
        borderColor: theme.palette.border.main,
      },
      "&.Mui-focused fieldset": {
        borderColor: "#8c52ff",
      },
    },
  };

  return (
    <FormControl>
      <InputLabel
        sx={{
          "&.Mui-focused": {
            color: "inherit",
          },
        }}
      >
        {title}
      </InputLabel>
      <Select
        disabled={disabled}
        value={choice}
        label={title}
        onChange={(e) => {
          setChoice(e.target.value);
        }}
        sx={selectStyle}
        renderValue={(choice) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Chip
              key={choice}
              label={choice}
              sx={{
                background: choiceColours[choice],
                color: "white",
                fontSize: "11pt",
              }}
            />
          </Box>
        )}
      >
        {options.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FilterSelect;
