"use client";
import { Icon } from "@iconify/react";
import { Box, Card, Typography } from "@mui/joy";
import React, { useState } from "react";
import ICONS from "@/data/icons/phosphor-fill.json";

type SubcategoryTileType = {
	subcategory: {
		_id: string;
		subcategoryName: string;
		subcategoryId: string;
		description: string;
		icon: string;
	};
	selected: boolean;
	onClick: (subcategoryId: string) => void;
};

const SubcategoryTile = ({ subcategory, selected, onClick }: SubcategoryTileType) => {
	const handleClick = (event: React.MouseEvent) => {
		event.stopPropagation();
		onClick(subcategory.subcategoryId);
	};

	return (
		<Card
			key={subcategory._id}
			variant={selected ? "solid" : "outlined"}
			color={"primary"}
			onClick={handleClick}
			sx={{
				position: "relative",
				cursor: "pointer",
				overflow: "hidden",
				maxWidth: 200,
				minWidth: 140,
				minHeight: 125,
				border: selected ? "1px solid transparent" : "",
				"&:hover": {
					"& .blur-overlay": {
						opacity: 1,
					},
					"& .description": {
						opacity: 1,
					},
					"& .original-content": {
						opacity: 0.2,
					},
				},
			}}
		>
			<Box
				className="original-content"
				sx={{
					transition: "opacity 0.2s",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					textAlign: "center",
					gap: "0.5rem",
				}}
			>
				<Icon icon={ICONS[subcategory.icon as keyof typeof ICONS]} height={44}></Icon>
				<Typography fontSize="sm" fontWeight="lg" textColor={"inherit"}>
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
				textColor={"inherit"}
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
				{subcategory.description}
			</Typography>
		</Card>
	);
};

export default SubcategoryTile;
