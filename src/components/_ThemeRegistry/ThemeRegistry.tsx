"use client";
import * as React from "react";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import { Experimental_CssVarsProvider as MaterialCssVarsProvider, THEME_ID as MATERIAL_THEME_ID } from "@mui/material/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import NextAppDirEmotionCacheProvider from "./EmotionCache";
import theme, { muiTheme } from "./theme";

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
	return (
		<NextAppDirEmotionCacheProvider options={{ key: "joy" }}>
			<MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: muiTheme }}>
				<JoyCssVarsProvider theme={theme}>
					<CssBaseline />
					{children}
				</JoyCssVarsProvider>
			</MaterialCssVarsProvider>
		</NextAppDirEmotionCacheProvider>
	);
}
