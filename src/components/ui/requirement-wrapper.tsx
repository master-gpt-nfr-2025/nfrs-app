"use client";
import { useRequirementData } from "@/hooks/useRequirementData";
import ParsedRequirementText from "./parsed-requirement-text";
import RequirementFields from "@/components/ui/requirement-fields";
import { Requirement } from "@/types/requirement";
import { Button, Chip, Divider, FormControl, FormHelperText, FormLabel, Input, Stack, Typography } from "@mui/joy";
import UseTemplateButton from "./use-template-button";
import { useState } from "react";

const RequirementWrapper = ({ initialRequirement }: { initialRequirement: Requirement }) => {
	const { requirement, parsedText, updateRequirement } = useRequirementData(initialRequirement);

	const [name, setName] = useState<string>("");
	const [error, setError] = useState<boolean>(false);
	const [errorText, setErrorText] = useState<string>("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
		setErrorText("");
		setError(false);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!name) {
			setError(true);
			setErrorText("Nazwa wymagania jest obowiązkowa!");
			return;
		}
		requirement.name = name;
		console.log("Submitted: ", requirement);
	};

	return (
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
				<UseTemplateButton requirement={requirement} />
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
				{/* <Divider />
				<form onSubmit={handleSubmit}>
					<FormControl error={error}>
						<Stack gap={1} direction={"column"} alignItems={"flex-start"}>
							<FormLabel>Nazwa wymagania</FormLabel>
							<Input placeholder="Nazwa wymagania" variant="soft" value={name} onChange={handleChange} fullWidth={true} />
							<FormHelperText>{errorText}</FormHelperText>
							<Button variant="solid" color="primary" type="submit" sx={{ mt: 1 }}>
								Zapisz
							</Button>
						</Stack>
					</FormControl>
				</form> */}
			</Stack>
		</Stack>
	);
};

export default RequirementWrapper;
