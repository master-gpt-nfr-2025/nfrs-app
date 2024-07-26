"use client";
import { Stack } from "@mui/joy";
import React from "react";
import NavButton from "./nav-button";

const BottomNavButtons = () => {
	return (
		<Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
			<NavButton icon="ph:trash-fill" href="/trash" variant="plain" />
			<NavButton icon="ph:user-circle-fill" href="/profile" variant="plain" />
		</Stack>
	);
};

export default BottomNavButtons;
