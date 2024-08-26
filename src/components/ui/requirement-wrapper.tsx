"use client";
import { useRequirementData } from "@/hooks/useRequirementData";
import ParsedRequirementText from "./parsed-requirement-text";
import RequirementFields from "@/components/ui/requirement-fields";
import { Requirement } from "@/types/requirement";
import { Button, Chip, Snackbar, Stack, Typography } from "@mui/joy";
import UseTemplateButton from "./use-template-button";
import { useState } from "react";
import { useRouter } from "next/navigation";

type RequirementWrapperProps = {
	initialRequirement: Requirement;
	useTemplateButton?: boolean;
	snackbarActive?: boolean;
};

const RequirementWrapper = ({ initialRequirement, useTemplateButton = true, snackbarActive = true }: RequirementWrapperProps) => {
	const { requirement, parsedText, updateRequirement } = useRequirementData(initialRequirement);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [requirementId, setRequirementId] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const router = useRouter();

	const handleGotoRequirement = () => {
		setLoading(true);
		setSnackbarOpen(false);
		if (requirementId) {
			router.push(`/requirements/${requirementId}`);
		}
		setLoading(false);
	};

	return (
		<>
			<Stack gap={2}>
				<Stack gap={1}>
					<Stack direction="row" gap={1} justifyContent="space-between" alignItems={"center"}>
						<Typography level="body-md" sx={{ color: "text.secondary", fontWeight: 600 }}>
							Uzupełnij szablon wymagania
						</Typography>
						{useTemplateButton && (
							<UseTemplateButton requirement={requirement} setReqId={setRequirementId} setSnackbar={setSnackbarOpen} />
						)}
					</Stack>
					<RequirementFields requirement={requirement} updateRequirement={updateRequirement} />
				</Stack>
				<Stack gap={1}>
					<Typography level="body-md" sx={{ color: "text.secondary", fontWeight: 600 }}>
						Wymaganie
					</Typography>
					<ParsedRequirementText parsedText={parsedText} />
				</Stack>
				<Stack gap={1}>
					<Typography level="body-md" sx={{ color: "text.secondary" }}>
						Legenda
					</Typography>
					<Stack direction="row" spacing={1}>
						<Chip color="neutral" variant="outlined">
							Pola obowiązkowe
						</Chip>
						<Chip color="neutral" variant="soft">
							Pola opcjonalne
						</Chip>
					</Stack>
				</Stack>
			</Stack>
			{snackbarActive && (
				<Snackbar
					open={snackbarOpen}
					variant="soft"
					color="success"
					onClose={() => setSnackbarOpen(false)}
					endDecorator={
						requirementId ? (
							<Button onClick={handleGotoRequirement} size="sm" variant="soft" color="success" loading={loading}>
								Zobacz
							</Button>
						) : null
					}
				>
					{`Wymaganie ${requirement.id} zostało utworzone`}
				</Snackbar>
			)}
		</>
	);
};

export default RequirementWrapper;
