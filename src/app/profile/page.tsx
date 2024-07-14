"use client";
import { useUserContext } from "@/components/UserProvider";
import { Typography } from "@mui/joy";
import React from "react";

const Profile = () => {
	const { user } = useUserContext();
	return (
		<>
			<Typography level="h3">Profil</Typography>
			<Typography level="h4">{user?.name}</Typography>
		</>
	);
};

export default Profile;
