"use client";
import { IconButton, Stack } from "@mui/joy";
import { Icon } from "@iconify/react";
import React from "react";
import styles from "@/styles/root";
import NavButton from "./nav-button";
import Link from "next/link";

const TopNavButtons = () => {
	return (
		<Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
			<NavButton icon="ph:list-checks-bold" href="/requirements" />
			<NavButton icon="ph:book-open-text-bold" href="/templates" />
			<Link href="/requirements/create">
				<IconButton color="primary" variant="soft" sx={styles.transition}>
					<Icon icon="ph:magic-wand-bold" />
				</IconButton>
			</Link>
		</Stack>
	);
};

export default TopNavButtons;
