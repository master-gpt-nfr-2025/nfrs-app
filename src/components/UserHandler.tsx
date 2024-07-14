// components/UserHandler.tsx
"use client";

import React, { useEffect, useState } from "react";
import { UserProvider } from "./UserProvider";
import { NamePopup } from "./ui/name-popup";

export function UserHandler({ children }: { children: React.ReactNode }) {
	const [showPopup, setShowPopup] = useState(false);

	useEffect(() => {
		const userId = localStorage.getItem("userId");
		if (!userId) {
			setShowPopup(true);
		}
	}, []);

	return (
		<UserProvider>
			{showPopup && <NamePopup onComplete={() => setShowPopup(false)} />}
			{children}
		</UserProvider>
	);
}
