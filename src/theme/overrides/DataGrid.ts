import { Theme } from "@mui/material";

export const DataGrid = (theme: Theme) => {
  return {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "none",
          fontWeight: 500,
          "& .MuiDataGrid-columnSeparator": {
            visibility: "hidden",
          },
          "& .MuiDataGrid-columnHeader": {
            opacity: 0.5,
          },
          "& .MuiDataGrid-footerContainer": {
            minHeight: "70px",
          },
        },
      },
    },
  };
};
