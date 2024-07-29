"use client";
import { Icon } from "@iconify/react";
import { Box, Card, Typography } from "@mui/joy";
import React, { useState } from "react";

type SubcategoryTileType = {
	subcategory: {
		_id: string;
		subcategoryName: string;
		subcategoryId: string;
		subcategoryDescription: string;
		icon?: string;
	};
};

const SubcategoryTile = ({ subcategory }: SubcategoryTileType) => {
	return (
		<Card
			key={subcategory._id}
			variant="outlined"
			color={"primary"}
			sx={{
				position: "relative",
				cursor: "pointer",
				overflow: "hidden",
				"&:hover": {
					"& .blur-overlay": {
						opacity: 1,
					},
					"& .description": {
						opacity: 1,
					},
					"& .original-content": {
						opacity: 0.3,
					},
				},
			}}
		>
			<Box className="original-content" sx={{ transition: "opacity 0.3s", textAlign: "center" }}>
				<Icon icon={"ph:chart-pie-slice-fill"} height={44}></Icon>
				<Typography fontSize="sm" fontWeight="lg" textColor={"primary.500"}>
					{subcategory.subcategoryName}
				</Typography>
			</Box>
			<Box
				className="blur-overlay"
				sx={{
					position: "absolute",
					top: 1,
					left: 1,
					right: 1,
					bottom: 1,
					backdropFilter: "blur(6px)",
					opacity: 0,
					transition: "opacity 0.2s",
				}}
			/>

			{/* Description text */}
			<Typography
				className="description"
				fontSize={"sm"}
				textColor={"primary.500"}
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					textAlign: "center",
					width: "100%",
					opacity: 0,
					transition: "opacity 0.2s",
					zIndex: 1,
				}}
			>
				{subcategory.subcategoryDescription}
			</Typography>
		</Card>
	);
};

export default SubcategoryTile;
