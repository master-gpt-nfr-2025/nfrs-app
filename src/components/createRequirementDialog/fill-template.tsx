"use client";
import { Requirement } from "@/types/requirement";
import { Chip, FormControl, FormHelperText, FormLabel, Input, Stack, Typography } from "@mui/joy";
import React, { useState } from "react";
import { useUserContext } from "../UserProvider";
import { saveRequirement } from "@/lib/actions-requirement";
import ParsedRequirementText from "../ui/parsed-requirement-text";
import RequirementFields from "../ui/requirement-fields";
import { useRequirementData } from "@/hooks/useRequirementData";
import DialogNavigationButtons from "../ui/dialog-navigation-buttons";
import { useRouter } from "next/navigation";

type FillTemplateProps = {
	initialRequirement: Requirement;
};

const FillTemplate = ({ initialRequirement }: FillTemplateProps) => {
	const { requirement, parsedText, updateRequirement } = useRequirementData(initialRequirement);
	const { user } = useUserContext();
	const router = useRouter();

	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const [errorText, setErrorText] = useState<string>("");

	const [name, setName] = useState<string>(requirement.name);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
		setErrorText("");
		setError(false);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		if (!name) {
			setError(true);
			setErrorText("Nazwa wymagania jest obowiązkowa!");
			return;
		}
		requirement.name = name;
		requirement.createdAt = new Date();
		requirement.createdThrough = "creator";
		if (user) {
			requirement.createdBy = user.id;
		}
		console.log(requirement);

		try {
			const createdRequirementID = await saveRequirement(requirement);
			if (!createdRequirementID) {
				setError(true);
				setErrorText("Wymaganie o podanej nazwie już istnieje!");
				return;
			} else {
				setError(false);
				setErrorText("");
			}
			setLoading(false);
			router.push(`/requirements/${createdRequirementID}`);
		} catch (error) {
			console.error(error);
			setError(true);
			setErrorText("Wystąpił błąd podczas tworzenia wymagania!");
		}
	};

	return (
		<>
			<Stack gap={2}>
				<Stack direction="row" gap={1} justifyContent="space-between">
					<Stack direction="row" spacing={1}>
						<Chip color="neutral" variant="outlined">
							Pola obowiązkowe
						</Chip>
						<Chip color="neutral" variant="soft">
							Pola opcjonalne
						</Chip>
					</Stack>
				</Stack>
				<Stack gap={1}>
					<Typography level="body-md" sx={{ color: "text.secondary", fontWeight: 600 }}>
						Dostępne pola
					</Typography>
					<RequirementFields requirement={requirement} updateRequirement={updateRequirement} />
				</Stack>
				<Stack gap={1}>
					<Typography level="body-md" sx={{ color: "text.secondary", fontWeight: 600 }}>
						Treść wymagania
					</Typography>
					<ParsedRequirementText parsedText={parsedText} />
				</Stack>
			</Stack>
			<form onSubmit={handleSubmit}>
				<FormControl error={error} sx={{ mb: "1rem" }}>
					<FormLabel sx={{ fontWeight: "600" }} htmlFor="requirement-name">
						Nazwa wymagania
					</FormLabel>
					<Input placeholder="Nazwa wymagania" variant="soft" value={name} onChange={handleChange} />
					<FormHelperText>{errorText}</FormHelperText>
				</FormControl>
				<DialogNavigationButtons submit />
			</form>
		</>
	);
};

export default FillTemplate;
