"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LoginPage = () => {
	const { isLoaded, isSignedIn, user } = useUser();
	const router = useRouter();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Automatic redirect based on role - this triggers AFTER successful login
	useEffect(() => {
		if (isSignedIn && user) {
			const role = user?.publicMetadata.role as string;
			if (role) {
				router.push(`/${role}`);
			}
		}
	}, [isSignedIn, user, router]);

	// Show loading skeleton immediately
	if (!mounted || !isLoaded) {
		return (
			<div className="h-screen flex items-center justify-center bg-lamaSkyLight">
				<div className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2 w-full max-w-md">
					<div className="flex items-center gap-2 mb-2">
						<div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
						<div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
					</div>
					<div className="w-48 h-5 bg-gray-200 rounded animate-pulse mb-4"></div>
					<div className="w-full h-10 bg-gray-200 rounded animate-pulse mb-2"></div>
					<div className="w-full h-10 bg-gray-200 rounded animate-pulse mb-2"></div>
					<div className="w-full h-10 bg-blue-200 rounded animate-pulse"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="h-screen flex items-center justify-center bg-lamaSkyLight">
			<SignIn.Root>
				<SignIn.Step
					name="start"
					className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2 relative"
				>
					{/* Loading Progress Bar - shows when user is being redirected */}
					{isSignedIn && (
						<div className="absolute top-0 left-0 right-0 h-1 bg-blue-100 rounded-t-md overflow-hidden">
							<div className="h-full bg-blue-500 animate-progress-bar"></div>
						</div>
					)}

					<h1 className="text-xl font-bold flex items-center gap-2">
						<Image
							src="/logo.png"
							alt="HCS Logo"
							width={24}
							height={24}
							priority
							className="w-auto h-auto"
						/>
						HCS
					</h1>
					<h2 className="text-gray-400">Sign in to your account</h2>

					{/* Global Error Display */}
					<Clerk.GlobalError className="text-sm text-red-400" />

					{/* Username Field */}
					<Clerk.Field name="identifier" className="flex flex-col gap-2">
						<Clerk.Label className="text-xs text-gray-500">
							Username
						</Clerk.Label>
						<Clerk.Input
							type="text"
							required
							className="p-2 rounded-md ring-1 ring-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
						<Clerk.FieldError className="text-xs text-red-400" />
					</Clerk.Field>

					{/* Password Field */}
					<Clerk.Field name="password" className="flex flex-col gap-2">
						<Clerk.Label className="text-xs text-gray-500">
							Password
						</Clerk.Label>
						<Clerk.Input
							type="password"
							required
							className="p-2 rounded-md ring-1 ring-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
						<Clerk.FieldError className="text-xs text-red-400" />
					</Clerk.Field>

					{/* Submit Button with Loading State */}
					<SignIn.Action submit asChild>
						<button
							disabled={isSignedIn}
							className="group bg-blue-500 text-white my-1 rounded-md text-sm p-[10px] hover:bg-blue-600 hover:shadow-lg active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 relative overflow-hidden"
						>
							{isSignedIn ? (
								<>
									<svg
										className="animate-spin h-5 w-5 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									<span className="animate-pulse">Redirecting...</span>
								</>
							) : (
								<>
									<span>Sign In</span>
									<svg
										className="w-4 h-4 transition-transform group-hover:translate-x-1"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M13 7l5 5m0 0l-5 5m5-5H6"
										/>
									</svg>
								</>
							)}
						</button>
					</SignIn.Action>
				</SignIn.Step>
			</SignIn.Root>
		</div>
	);
};

export default LoginPage;
