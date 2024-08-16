import { Add } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/joy";
import Link from "next/link";
import React from "react";

const Templates = () => {
	return (
		<Box sx={{ textAlign: "center" }}>
			<Typography level="body-md" sx={{ color: "text.tertiary", mb: "1rem" }}>
				Wybierz wymaganie z widoku po lewej aby zobaczyć jego szczegóły. Jeśli nie widzisz żadnych wymagań możesz je dodać
			</Typography>
			<Link href={"/create-requirement"}>
				<Button startDecorator={<Add />}>Dodaj wymaganie</Button>
			</Link>
		</Box>
	);
};

export default Templates;
