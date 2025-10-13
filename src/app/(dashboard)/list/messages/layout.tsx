"use client";

import { useEffect } from "react";

export default function MessagesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	useEffect(() => {
		// Add class to body to trigger CSS
		document.body.classList.add("messages-page-active");

		return () => {
			document.body.classList.remove("messages-page-active");
		};
	}, []);

	return <div className="messages-page h-screen">{children}</div>;
}
