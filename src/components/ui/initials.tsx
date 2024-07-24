import { getInitials } from "@/lib/utils";
import { Avatar, Tooltip, Stack, Typography } from "@mui/joy";
import React from "react";

type InitialsProps = {
	name: string;
	subtitle?: string;
	iconVariant?: "solid" | "outlined";
	iconColor?: "neutral" | "primary" | "success" | "warning" | "danger";
	iconSize?: "sm" | "md" | "lg";
	tooltipVariant?: "plain" | "soft";
	tooltipColor?: "neutral" | "primary" | "success" | "warning" | "danger";
	tooltipSize?: "sm" | "md" | "lg";
	tooltipPlacement?: "top" | "bottom" | "left" | "right";
	arrow?: boolean;
};

const Initials = ({
	name,
	subtitle,
	iconVariant = "solid",
	iconColor = "primary",
	iconSize = "sm",
	tooltipVariant = "plain",
	tooltipColor = "neutral",
	tooltipSize = "md",
	tooltipPlacement = "top",
	arrow = true,
}: InitialsProps) => {
	return (
		<Tooltip
			title={
				!subtitle ? (
					name
				) : (
					<Stack gap={1}>
						<Typography level="title-sm" sx={{ fontWeight: 600 }}>
							{name}
						</Typography>
						<Typography>ID: {subtitle}</Typography>
					</Stack>
				)
			}
			variant={tooltipVariant}
			color={tooltipColor}
			size={tooltipSize}
			placement={tooltipPlacement}
			arrow={arrow}
		>
			<Avatar color={iconColor} variant={iconVariant} size={iconSize}>
				{getInitials(name)}
			</Avatar>
		</Tooltip>
	);
};

export default Initials;
