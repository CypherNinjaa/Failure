import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?:
		| "default"
		| "secondary"
		| "success"
		| "warning"
		| "destructive"
		| "outline";
	size?: "sm" | "md" | "lg";
}

export function Badge({
	className,
	variant = "default",
	size = "md",
	...props
}: BadgeProps) {
	const variants = {
		default: "bg-primary text-primary-foreground",
		secondary: "bg-secondary text-secondary-foreground",
		success: "bg-success text-success-foreground",
		warning: "bg-warning text-warning-foreground",
		destructive: "bg-destructive text-destructive-foreground",
		outline: "border border-border bg-transparent text-foreground",
	};

	const sizes = {
		sm: "px-2 py-1 text-xs",
		md: "px-3 py-1 text-sm",
		lg: "px-4 py-2 text-base",
	};

	return (
		<div
			className={cn(
				"inline-flex items-center rounded-full font-medium transition-colors",
				variants[variant],
				sizes[size],
				className
			)}
			{...props}
		/>
	);
}
