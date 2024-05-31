import { Button, Snackbar, Stack, Typography } from "@mui/joy";
import React from "react";
import { Icon } from "@iconify/react";

type ConfirmSnackbarProps = {
	snackbarOpen: boolean;
	setSnackbarOpen: (snackbarOpen: boolean) => void;
	setOpen: (open: boolean) => void;
};

const ConfirmSnackbar = ({ snackbarOpen, setSnackbarOpen, setOpen }: ConfirmSnackbarProps) => {
	return (
		<Snackbar
			anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			sx={{ maxWidth: 360, display: "flex", alignItems: "flex-start" }}
			open={snackbarOpen}
			variant="soft"
			color="warning"
			startDecorator={<Icon icon="ph:warning-circle-fill" width={24} />}
			onClose={() => {
				setSnackbarOpen(false);
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
							setOpen(false);
							setSnackbarOpen(false);
						}}
					>
						Tak, na pewno
					</Button>
					<Button variant="outlined" color="warning" onClick={() => setSnackbarOpen(false)}>
						Nie, zostaję
					</Button>
				</Stack>
			</div>
		</Snackbar>
	);
};

export default ConfirmSnackbar;
