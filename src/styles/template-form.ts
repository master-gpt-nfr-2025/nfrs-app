const styles = {
	removeButton: {
		width: "1.3rem",
		height: "1.3rem",
		position: "absolute",
		zIndex: 2,
		top: "-8px",
		right: "-8px",
		color: "danger.softColor",
		backgroundColor: "danger.softBg",
		borderRadius: "6px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		transition: "all 0.2s",
		cursor: "pointer",
		opacity: 0.0,
		"&:hover": { backgroundColor: "danger.softHoverBg" },
	},

	optionalField: {
		display: "flex",
		flexWrap: "wrap",
		gap: "0.8rem",
		alignItems: "center",
		position: "relative",
		borderRadius: "6px",
		"&::before": {
			content: '""',
			position: "absolute",
			top: "-0.5rem",
			left: "-0.5rem",
			width: "calc(100% + 1rem)",
			height: "calc(100% + 1rem)",
			borderRadius: "6px",
			backgroundColor: "transparent",
			transition: "all 0.2s",
		},
		"&:hover::before": {
			backgroundColor: "neutral.softHoverBg",
			opacity: 0.4,
		},
		"&:hover .remove-button": {
			opacity: 1,
		},
	},
	horizontal: { display: "flex", flexWrap: "wrap", gap: "0.8rem", alignItems: "center" },

	transition: {
		transition: "all 0.2s",
	},
};

export default styles;
