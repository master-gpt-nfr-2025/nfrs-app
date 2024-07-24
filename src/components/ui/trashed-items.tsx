"use client";
import { TrashedItemType } from "@/app/trash/page";
import { restoreFromTrash } from "@/lib/actions-requirement";
import { Icon } from "@iconify/react";
import { Button, Stack, Table, Typography, IconButton, Snackbar } from "@mui/joy";
import React, { useState } from "react";

type TrashedItemsProps = {
	items: TrashedItemType[];
};

type SnackbarState = {
	message: string;
	color?: "success" | "warning" | "danger" | "neutral" | "primary";
	title?: string;
	startDecorator?: React.ReactNode;
	endDecorator?: React.ReactNode;
};

const TrashedItems = ({ items }: TrashedItemsProps) => {
	const TrashedActions = ({ itemId }: { itemId: string }) => {
		const [loading, setLoading] = useState<boolean>(false);

		const handleRestore = async () => {
			try {
				await restoreFromTrash(itemId);
				setSnackbarState({
					message: "Wymaganie zostało przywrócone",
					color: "success",
					startDecorator: <Icon icon="ph:check-circle-fill" width={24} />,
				});
				setSnackbarOpen(true);
				// setTrashed(false);
			} catch (error) {
				console.error("Error while restoring requirement: ", error);
				setSnackbarState({
					message: "Wystąpił błąd podczas przywracania wymagania",
					color: "danger",
					startDecorator: <Icon icon="ph:x-bold" width={24} />,
				});
			} finally {
				// setEdit(false);
			}
		};

		const handleDelete = async () => {
			setSnackbarState({
				message: "Wymaganie zostało usunięte",
				color: "warning",
				startDecorator: <Icon icon="ph:info-fill" width={24} />,
			});
			setSnackbarOpen(true);
		};

		return (
			<Stack direction={"row"} gap={2}>
				<Button variant="soft" color="primary" onClick={() => {}} endDecorator={<Icon icon="ph:arrows-counter-clockwise-fill" height={24} />}>
					Przywróć
				</Button>
				<IconButton variant="soft" color="danger" onClick={handleDelete} loading={loading}>
					<Icon icon="ph:trash-fill" />
				</IconButton>
			</Stack>
		);
	};

	const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
	const [snackbarState, setSnackbarState] = useState<SnackbarState>({ message: "", color: "neutral" });

	return (
		<>
			<Table>
				<thead>
					<tr>
						<th style={{ width: "40%" }}>Nazwa</th>
						<th>Typ</th>
						<th>Utworzono</th>
						<th>Usunięto</th>
						<th>Akcje</th>
					</tr>
				</thead>
				<tbody>
					{items.map((row) => (
						<tr key={row.id}>
							<td>
								<Stack direction={"row"} gap={1}>
									<Typography sx={{ color: "text.tertiary", fontWeight: 600 }}>[{row.id}]</Typography>
									<Typography>{row.name}</Typography>
								</Stack>
							</td>
							<td>{"Wymaganie"}</td>
							<td>{row.createdAt ? row.createdAt.toLocaleDateString() : "-"}</td>
							<td>{new Date(row.trashedAt).toLocaleDateString()}</td>
							<td>
								<TrashedActions itemId={row._id} />
							</td>
						</tr>
					))}
				</tbody>
			</Table>
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
				<Stack direction="column" gap={1}>
					{snackbarState.title && <span>{snackbarState.title}</span>}
					<span>{snackbarState.message}</span>
				</Stack>
			</Snackbar>
		</>
	);
};

export default TrashedItems;
