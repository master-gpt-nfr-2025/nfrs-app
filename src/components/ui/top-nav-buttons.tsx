"use client";
import { IconButton, Stack } from "@mui/joy";
import { Icon } from "@iconify/react";
import React from "react";
import styles from "@/styles/root";
import NavButton from "./nav-button";

const TopNavButtons = () => {
	return (
		<Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
			<IconButton color="primary" variant="solid" sx={styles.transition}>
				<Icon icon="ph:plus-bold" />
			</IconButton>
			<NavButton icon="ph:list-checks-bold" href="/requirements" />
			<NavButton icon="ph:diamonds-four-bold" href="/templates" />
		</Stack>
	);
};

export default TopNavButtons;
