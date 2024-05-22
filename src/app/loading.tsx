import { Box, CircularProgress } from "@mui/joy";
import React from "react";

const Loading = () => {
	return (
		<Box sx={{ display: "flex", width: "100%", height: "100%", justifyContent: "center", alignContent: "center" }}>
			<CircularProgress />
		</Box>
	);
};

export default Loading;
