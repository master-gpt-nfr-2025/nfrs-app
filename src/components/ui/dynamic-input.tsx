import React, { useState, useRef, useEffect } from "react";
import { Input, InputProps } from "@mui/joy";
import { styled } from "@mui/joy/styles";

const HiddenSpan = styled("span")({
	position: "absolute",
	top: "-9999px",
	left: "-9999px",
	visibility: "hidden",
	whiteSpace: "pre",
});

interface DynamicInputProps extends Omit<InputProps, "onChange"> {
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	minWidth?: number;
	maxWidth?: number;
}

const DynamicInput: React.FC<DynamicInputProps> = ({ onChange, minWidth = 100, maxWidth = 500, ...props }) => {
	const [inputValue, setInputValue] = useState("");
	const [inputWidth, setInputWidth] = useState(minWidth);
	const spanRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		if (spanRef.current) {
			const newWidth = Math.max(minWidth, Math.min(spanRef.current.offsetWidth + 10, maxWidth));
			setInputWidth(newWidth);
		}
	}, [inputValue, minWidth, maxWidth]);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		setInputValue(newValue);
		if (onChange) {
			onChange(event);
		}
	};

	return (
		<>
			<Input {...props} value={inputValue} onChange={handleInputChange} sx={{ width: `${inputWidth}px`, ...props.sx }} />
			<HiddenSpan ref={spanRef}>{inputValue}</HiddenSpan>
		</>
	);
};

export default DynamicInput;
