import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: "default" | "rounded" | "circle" | "text";
}

export function Skeleton({
	className,
	variant = "default",
	...props
}: SkeletonProps) {
	const variants = {
		default: "rounded-md",
		rounded: "rounded-lg",
		circle: "rounded-full",
		text: "rounded-sm h-4",
	};

	return (
		<div
			className={cn(
				"skeleton bg-muted animate-shimmer",
				variants[variant],
				className
			)}
			{...props}
		/>
	);
}
