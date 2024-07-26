import { Card, Typography } from "@mui/joy";
import React from "react";

type CreateRequirementBackgroundProps = {
	children: React.ReactNode;
};

const CreateRequirementBackground = ({ children }: CreateRequirementBackgroundProps) => {
	return (
		<>
			<Card variant="plain" sx={{ flex: 1, minHeight: "60vh" }}>
				<Typography>Utwórz nowe wymaganie</Typography>
			</Card>
			{children}
		</>
	);
};

export default CreateRequirementBackground;
