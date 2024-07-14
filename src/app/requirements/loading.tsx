import { CircularProgress } from "@mui/joy";
import { Box } from "@mui/material";
import React from "react";

const LoadingCategories = () => {
	return (
		<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
			<CircularProgress />
		</Box>
	);
};

export default LoadingCategories;
