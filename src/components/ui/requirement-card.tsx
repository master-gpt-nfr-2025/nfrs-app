"use client";
import { useRequirementData } from "@/hooks/useRequirementData";
import ParsedRequirementText from "./parsed-requirement-text";
import RequirementFields from "@/components/ui/requirement-fields";
import { Requirement } from "@/types/requirement";
import { Button, IconButton, Snackbar, Stack, Typography } from "@mui/joy";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { moveToTrash, restoreFromTrash, updateRequirement as updateRequirementDB } from "@/lib/actions-requirement";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";

type RequirementCardProps = {
	initialRequirement: Requirement;
};

type SnackbarState = {
	message: string;
	color?: "success" | "warning" | "danger" | "neutral" | "primary";
	title?: string;
	startDecorator?: React.ReactNode;
	endDecorator?: React.ReactNode;
};

const RequirementCard = ({ initialRequirement }: RequirementCardProps) => {
	const { requirement, parsedText, updateRequirement, resetRequirement } = useRequirementData(initialRequirement);
	const { user } = useUser();

	const router = useRouter();

	const [edit, setEdit] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
	const [snackbarState, setSnackbarState] = useState<SnackbarState>({ message: "", color: "neutral" });

	const [confirmCancel, setConfirmCancel] = useState<boolean>(false);
	const [confirmTrash, setConfirmTrash] = useState<boolean>(false);

	const handleSave = async () => {
		setLoading(true);
		try {
			await updateRequirementDB(requirement);
			setSnackbarState({ message: "Wymaganie zostało zapisane", color: "success" });
			setSnackbarOpen(true);
		} catch (error) {
			console.error("Error while updating requirement: ", error);
			setSnackbarState({
				message: "Wystąpił błąd podczas aktualizacji wymagania",
				color: "danger",
				startDecorator: <Icon icon="ph:x-bold" width={24} />,
			});
		} finally {
			setEdit(false);
			setLoading(false);
		}
	};

	const handleRestore = async () => {
		setLoading(true);
		try {
			await restoreFromTrash(initialRequirement.id);
			setSnackbarState({ message: "Wymaganie zostało przywrócone", color: "success" });
			setSnackbarOpen(true);
			setTimeout(() => {
				router.replace(`/requirements/${initialRequirement._id}`);
			}, 2000);
		} catch (error) {
			console.error("Error while restoring requirement: ", error);
			setSnackbarState({
				message: "Wystąpił błąd podczas przywracania wymagania",
				color: "danger",
				startDecorator: <Icon icon="ph:x-bold" width={24} />,
			});
		} finally {
			setEdit(false);
			setLoading(false);
		}
	};

	const handleCancel = () => {
		resetRequirement();
		setConfirmCancel(true);
	};

	const handleTrash = async () => {
		setLoading(true);
		try {
			await moveToTrash(initialRequirement.id, user?.id);
			setSnackbarState({
				message: "Możesz je przywrócić w ciągu 30 dni od usunięcia",
				color: "warning",
				title: "Wymaganie zostało przeniesione do kosza",
			});
			setSnackbarOpen(true);
			setTimeout(() => {
				router.replace(`/requirements/`);
			}, 2000);
		} catch (error) {
			console.error("Error while moving requirement to trash: ", error);
			setSnackbarState({
				message: "Wystąpił błąd podczas przenoszenia wymagania do kosza",
				color: "danger",
				startDecorator: <Icon icon="ph:x-bold" width={24} />,
			});
			setSnackbarOpen(true);
		} finally {
			setLoading(false);
			setConfirmTrash(false);
		}
	};

	const Buttons = () => {
		return edit ? (
			<Stack direction="row" gap={1}>
				<Button variant="soft" color="primary" onClick={handleSave} loading={loading}>
					<Stack direction="row" gap={1} alignItems="center">
						Zapisz
						<Icon icon="ph:check-bold" />
					</Stack>
				</Button>
				<IconButton variant="soft" color="danger" onClick={handleCancel}>
					<Icon icon="ph:x-bold" />
				</IconButton>
			</Stack>
		) : (
			<Stack direction="row" gap={1}>
				<IconButton variant="soft" color="primary" onClick={() => setEdit(true)}>
					<Icon icon="ph:pencil-simple-fill" />
				</IconButton>
				{!confirmTrash ? (
					<IconButton variant="soft" color="danger" onClick={() => setConfirmTrash(true)}>
						<Icon icon="ph:trash-fill" />
					</IconButton>
				) : (
					<Button variant="soft" color="danger" onClick={handleTrash} loading={loading}>
						Na pewno?
					</Button>
				)}
			</Stack>
		);
	};

	return (
		<>
			<Stack gap={1}>
				<Stack direction="row" gap={1} justifyContent="space-between">
					<Stack gap={0.5} direction="row">
						{requirement.trashed && (
							<Typography level="title-lg" sx={{ fontWeight: 600 }} color="danger">
								{"W koszu".toUpperCase()}
							</Typography>
						)}
						<Typography level="title-lg" sx={{ fontWeight: 600, color: "text.tertiary" }}>{`[${initialRequirement.id}]`}</Typography>
						<Typography level="title-lg" sx={{ fontWeight: 600 }}>
							{initialRequirement.name}
						</Typography>
					</Stack>
					{requirement.trashed ? (
						<Button
							variant="soft"
							color="primary"
							onClick={handleRestore}
							endDecorator={<Icon icon="ph:arrows-counter-clockwise-fill" height={24} />}
						>
							Przywróć
						</Button>
					) : (
						<Buttons />
					)}
				</Stack>
				{edit && !requirement.trashed && <RequirementFields requirement={initialRequirement} updateRequirement={updateRequirement} />}
				<Typography level="body-md" sx={{ color: "text.secondary", fontWeight: 600 }}>
					Treść wymagania
				</Typography>
				<ParsedRequirementText parsedText={parsedText} color="neutral" />
				<Snackbar
					autoHideDuration={4000}
					open={snackbarOpen}
					variant="soft"
					color={snackbarState.color}
					onClose={() => {
						setSnackbarOpen(false);
					}}
					startDecorator={snackbarState.startDecorator}
					endDecorator={snackbarState.endDecorator}
				>
					{snackbarState.message}
				</Snackbar>
			</Stack>
			<Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				sx={{ maxWidth: 360, display: "flex", alignItems: "flex-start" }}
				open={confirmCancel}
				variant="soft"
				color="warning"
				startDecorator={<Icon icon="ph:warning-circle-fill" width={24} />}
				onClose={() => {
					setConfirmCancel(false);
				}}
			>
				<div>
					<Typography level="title-lg" sx={{ fontWeight: 600 }}>
						Chwilka, na pewno?
					</Typography>
					<Typography sx={{ mt: 1, mb: 2 }}>Wprowadzone zmiany zostaną utracone</Typography>

					<Stack direction="row" spacing={1}>
						<Button
							variant="solid"
							color="warning"
							onClick={() => {
								setEdit(false);
								setConfirmCancel(false);
							}}
						>
							Tak, na pewno
						</Button>
						<Button variant="outlined" color="warning" onClick={() => setConfirmCancel(false)}>
							Nie, zostaję
						</Button>
					</Stack>
				</div>
			</Snackbar>
		</>
	);
};

export default RequirementCard;
