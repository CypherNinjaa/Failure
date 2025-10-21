export default function SignInLoading() {
	return (
		<div className="h-screen flex items-center justify-center bg-lamaSkyLight">
			<div className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2 w-full max-w-md">
				<div className="flex items-center gap-2 mb-2">
					<div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
					<div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
				</div>
				<div className="w-48 h-5 bg-gray-200 rounded animate-pulse mb-4"></div>

				{/* Username field skeleton */}
				<div className="flex flex-col gap-2 mb-4">
					<div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
					<div className="w-full h-10 bg-gray-100 rounded-md border border-gray-200 animate-pulse"></div>
				</div>

				{/* Password field skeleton */}
				<div className="flex flex-col gap-2 mb-4">
					<div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
					<div className="w-full h-10 bg-gray-100 rounded-md border border-gray-200 animate-pulse"></div>
				</div>

				{/* Button skeleton */}
				<div className="w-full h-10 bg-blue-200 rounded-md animate-pulse"></div>

				<p className="text-xs text-gray-400 text-center mt-4">
					Loading sign in...
				</p>
			</div>
		</div>
	);
}
