"use client";
import { useRequirementData } from "@/hooks/useRequirementData";
import ParsedRequirementText from "./parsed-requirement-text";
import RequirementFields from "@/components/ui/requirement-fields";
import { Requirement } from "@/types/requirement";
import { Button, IconButton, Stack, Typography } from "@mui/joy";
import { useState } from "react";
import { Icon } from "@iconify/react";

type RequirementCardProps = {
	initialRequirement: Requirement;
};

const RequirementCard = ({ initialRequirement }: RequirementCardProps) => {
	const { requirement, parsedText, updateRequirement } = useRequirementData(initialRequirement);

	const [edit, setEdit] = useState<boolean>(false);

	const handleSave = () => {
		console.log("Save requirement");
		setEdit(false);
	};

	const handleDelete = () => {
		console.log("Delete requirement");
	};

	return (
		<Stack gap={1}>
			<Stack direction="row" gap={1} justifyContent="space-between">
				<Stack gap={0.5} direction="row">
					<Typography level="title-lg" sx={{ fontWeight: 600, color: "text.tertiary" }}>{`[${initialRequirement.id}]`}</Typography>
					<Typography level="title-lg" sx={{ fontWeight: 600 }}>
						{initialRequirement.name}
					</Typography>
				</Stack>
				{!edit && (
					<Stack direction="row" gap={1}>
						<IconButton variant="soft" color="primary" onClick={() => setEdit(true)}>
							<Icon icon="ph:pencil-simple-fill" />
						</IconButton>
						<IconButton variant="soft" color="danger" onClick={handleDelete}>
							<Icon icon="ph:trash-fill" />
						</IconButton>
					</Stack>
				)}
				{edit && (
					<Stack direction="row" gap={1}>
						<Button variant="soft" color="primary" onClick={handleSave}>
							<Stack direction="row" gap={1} alignItems="center">
								Zapisz
								<Icon icon="ph:check-bold" />
							</Stack>
						</Button>
						<IconButton variant="soft" color="danger" onClick={() => setEdit(false)}>
							<Icon icon="ph:x-bold" />
						</IconButton>
					</Stack>
				)}
			</Stack>
			{edit && <RequirementFields requirement={requirement} updateRequirement={updateRequirement} />}
			<Typography level="body-md" sx={{ color: "text.secondary", fontWeight: 600 }}>
				Treść wymagania
			</Typography>
			<ParsedRequirementText parsedText={parsedText} color="neutral" />
		</Stack>
	);
};

export default RequirementCard;
