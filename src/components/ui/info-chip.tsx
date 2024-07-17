"use client";
import { Chip, Stack, Tooltip } from "@mui/joy";
import { Icon } from "@iconify/react";
import React from "react";

type InfoChipProps = {
	content: string;
	tooltipText: string | React.ReactNode;
};

const InfoChip = ({ tooltipText, content }: InfoChipProps) => {
	return (
		<Chip>
			<Stack direction="row" gap={0.5} alignItems="center">
				{content}
				<Tooltip title={tooltipText} variant="plain" color="neutral" size="lg" placement="top" arrow>
					<Icon icon="ph:info-bold" height={18} />
				</Tooltip>
			</Stack>
		</Chip>
	);
};

export default InfoChip;
