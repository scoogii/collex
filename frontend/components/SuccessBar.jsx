import { Alert, Snackbar } from "@mui/material";

const SuccessBar = ({ isOpen, handleClose, message }) => {
  return (
    <Snackbar open={isOpen} autoHideDuration={3000} onClose={handleClose}>
      <Alert
        variant="filled"
        severity="success"
        sx={{
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontSize: { lg: "12pt" },
          background: "#469c53",
          border: "1px solid #3d753d",
          color: "white",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SuccessBar;
