import React from "react";
import { RequirementModel } from "@/models/requirement.model";
import User from "@/models/user.model";
import { Avatar, Button, Card, Chip, Stack, Tooltip, Typography } from "@mui/joy";
import { checkConnection } from "@/config/db";
import { Requirement } from "@/types/requirement";
import { User as UserType } from "@/types/user";
import InfoChip from "@/components/ui/info-chip";
import Link from "next/link";
import RequirementCard from "@/components/ui/requirement-card";

function getInitials(input: string): string {
	const words = input.trim().split(/\s+/);

	if (words.length === 1) {
		return words[0].substring(0, 2).toUpperCase();
	}

	return (words[0][0] + words[1][0]).toUpperCase();
}

interface IParams {
	params: {
		id: string;
	};
}

async function RequirementDetails({ params }: IParams) {
	const fetchRequirement = async () => {
		"use server";
		await checkConnection();
		await User.findOne();
		const requirement = await RequirementModel.findById(params.id).populate("createdBy");
		return requirement.toJSON();
	};

	const requirementDetails: Requirement = await fetchRequirement();

	const createdBy: UserType = requirementDetails.createdBy as UserType;

	return (
		<>
			<Card variant="plain" sx={{ flex: 3, minHeight: "60vh" }}>
				<RequirementCard initialRequirement={JSON.parse(JSON.stringify(requirementDetails))} />
			</Card>
			<Card variant="plain" sx={{ flex: 1, minHeight: "20vh" }}>
				<Stack gap={1}>
					<Stack direction="row" gap={1} justifyContent="space-between">
						<Typography>Utworzone przez</Typography>
						<Tooltip title={createdBy.name} variant="plain" color="neutral" size="lg" placement="top" arrow>
							<Avatar color="primary" variant="solid" size="sm">
								{getInitials(createdBy.name)}
							</Avatar>
						</Tooltip>
					</Stack>
					<Stack direction="row" gap={1} justifyContent="space-between">
						<Typography>Użyty szablon</Typography>
						<Link href={`/templates/${requirementDetails.templateId}`} style={{ textDecoration: "none" }}>
							<InfoChip
								content={`${requirementDetails.categoryId}/${requirementDetails.subcategoryId}/${requirementDetails.templateId}`.toUpperCase()}
								tooltipText={"Przejdź do szablonu"}
							/>
						</Link>
					</Stack>
				</Stack>
			</Card>
		</>
	);
}

export default RequirementDetails;
