import { IconButton, Tooltip } from "@mui/joy";
import { Icon } from "@iconify/react";
import React from "react";
import styles from "@/styles/root";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavButtonProps {
	icon: string;
	href: string;
	variant?: "solid" | "soft" | "plain";
	color?: "primary" | "neutral";
	title?: string;
}

const NavButton = ({ icon, href, variant = "soft", color = "primary", title }: NavButtonProps) => {
	const pathname = usePathname();
	const page = "/" + pathname.split("/")[1];

	const buttonStyles = {
		soft: {
			default: { ...styles.transition },
			active: { border: "1px solid", borderColor: `${color}.soft.Color`, ...styles.transition },
		},
	};

	return (
		<Link href={href}>
			<Tooltip title={title} placement="right" color={color} variant={variant} arrow>
				<IconButton
					color={color}
					variant={variant === "plain" ? (page === href ? "outlined" : variant) : variant}
					sx={page === href && variant === "soft" ? buttonStyles.soft.active : buttonStyles.soft.default}
				>
					<Icon icon={icon} />
				</IconButton>
			</Tooltip>
		</Link>
	);
};

export default NavButton;
