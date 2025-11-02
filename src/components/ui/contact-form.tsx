"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { createContactSubmission } from "@/lib/actions";

interface FormErrors {
	[key: string]: string;
}

export function ContactForm() {
	const [state, formAction] = useFormState(createContactSubmission, {
		success: false,
		error: false,
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const [isLoading, setIsLoading] = useState(false);

	// Simulate initial loading
	useEffect(() => {
		setIsLoading(true);
		const timer = setTimeout(() => setIsLoading(false), 1500);
		return () => clearTimeout(timer);
	}, []);

	// Handle success state
	useEffect(() => {
		if (state.success) {
			// Form will be reset automatically
			setErrors({});
		}
	}, [state]);

	const inquiryTypes = [
		{ value: "general", label: "General Inquiry" },
		{ value: "admissions", label: "Admissions" },
		{ value: "academics", label: "Academic Information" },
		{ value: "facilities", label: "Facilities & Infrastructure" },
		{ value: "support", label: "Technical Support" },
		{ value: "other", label: "Other" },
	];

	// Skeleton loader component
	const SkeletonLoader = () => (
		<div className="space-y-6">
			<div className="space-y-4">
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<div key={i} className="space-y-2">
						<div className="h-4 bg-muted rounded-md w-20 skeleton" />
						<div className="h-10 bg-muted rounded-md skeleton" />
					</div>
				))}
			</div>
			<div className="h-32 bg-muted rounded-md skeleton" />
			<div className="h-10 bg-muted rounded-md w-32 skeleton" />
		</div>
	);

	if (isLoading) {
		return (
			<Card className="p-6 md:p-8 bg-card border-border">
				<div className="mb-6">
					<div className="h-8 bg-muted rounded-md w-48 skeleton mb-2" />
					<div className="h-4 bg-muted rounded-md w-64 skeleton" />
				</div>
				<SkeletonLoader />
			</Card>
		);
	}

	if (state.success) {
		return (
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
			>
				<Card className="p-8 text-center bg-card border-border">
					<div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
						<CheckCircle className="w-8 h-8 text-white" />
					</div>
					<h3 className="text-2xl font-bold text-foreground mb-2">
						Message Sent Successfully!
					</h3>
					<p className="text-muted-foreground mb-6">
						Thank you for contacting us. We&apos;ll get back to you within 24
						hours.
					</p>
					<Button
						onClick={() => window.location.reload()}
						className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
					>
						Send Another Message
					</Button>
				</Card>
			</motion.div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6 }}
		>
			<Card className="p-6 md:p-8 bg-card border-border">
				<div className="mb-6">
					<h3 className="text-2xl font-bold text-foreground mb-2">
						Send us a Message
					</h3>
					<p className="text-muted-foreground">
						Fill out the form below and we&apos;ll get back to you as soon as
						possible.
					</p>
				</div>

				<form action={formAction} className="space-y-6">
					{/* Inquiry Type */}
					<div>
						<label className="block text-sm font-medium text-foreground mb-2">
							Inquiry Type
						</label>
						<select
							name="type"
							defaultValue="general"
							className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
						>
							{inquiryTypes.map((type) => (
								<option key={type.value} value={type.value}>
									{type.label}
								</option>
							))}
						</select>
					</div>

					{/* Name and Email */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-foreground mb-2">
								Full Name *
							</label>
							<Input
								type="text"
								name="name"
								required
								placeholder="Enter your full name"
								className={`${errors.name ? "border-destructive" : ""}`}
							/>
							{errors.name && (
								<div className="flex items-center mt-1 text-sm text-destructive">
									<AlertCircle className="w-4 h-4 mr-1" />
									{errors.name}
								</div>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-foreground mb-2">
								Email Address *
							</label>
							<Input
								type="email"
								name="email"
								required
								placeholder="Enter your email"
								className={`${errors.email ? "border-destructive" : ""}`}
							/>
							{errors.email && (
								<div className="flex items-center mt-1 text-sm text-destructive">
									<AlertCircle className="w-4 h-4 mr-1" />
									{errors.email}
								</div>
							)}
						</div>
					</div>

					{/* Phone and Subject */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-foreground mb-2">
								Phone Number *
							</label>
							<Input
								type="tel"
								name="phone"
								required
								placeholder="+91 98765 43210"
								className={`${errors.phone ? "border-destructive" : ""}`}
							/>
							{errors.phone && (
								<div className="flex items-center mt-1 text-sm text-destructive">
									<AlertCircle className="w-4 h-4 mr-1" />
									{errors.phone}
								</div>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-foreground mb-2">
								Subject *
							</label>
							<Input
								type="text"
								name="subject"
								required
								placeholder="What is this about?"
								className={`${errors.subject ? "border-destructive" : ""}`}
							/>
							{errors.subject && (
								<div className="flex items-center mt-1 text-sm text-destructive">
									<AlertCircle className="w-4 h-4 mr-1" />
									{errors.subject}
								</div>
							)}
						</div>
					</div>

					{/* Message */}
					<div>
						<label className="block text-sm font-medium text-foreground mb-2">
							Message *
						</label>
						<textarea
							name="message"
							required
							rows={6}
							placeholder="Tell us more about your inquiry..."
							className={`w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-vertical ${
								errors.message ? "border-destructive" : ""
							}`}
						/>
						{errors.message && (
							<div className="flex items-center mt-1 text-sm text-destructive">
								<AlertCircle className="w-4 h-4 mr-1" />
								{errors.message}
							</div>
						)}
					</div>

					{/* Submit Button */}
					<Button
						type="submit"
						className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
					>
						<Send className="w-5 h-5 mr-2" />
						Send Message
					</Button>
				</form>
			</Card>
		</motion.div>
	);
}
