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
			<Link href="/requirements/create">
				<IconButton color="primary" variant="solid" sx={styles.transition}>
					<Icon icon="ph:plus-bold" />
				</IconButton>
			</Link>
			<NavButton icon="ph:list-checks-bold" href="/requirements" />
			<NavButton icon="ph:diamonds-four-bold" href="/templates" />
		</Stack>
	);
};

export default TopNavButtons;
