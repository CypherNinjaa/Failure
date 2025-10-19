"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface FormData {
	name: string;
	email: string;
	phone: string;
	subject: string;
	message: string;
	type: string;
}

interface FormErrors {
	[key: string]: string;
}

export function ContactForm() {
	const [formData, setFormData] = useState<FormData>({
		name: "",
		email: "",
		phone: "",
		subject: "",
		message: "",
		type: "general",
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// Simulate initial loading
	useEffect(() => {
		setIsLoading(true);
		const timer = setTimeout(() => setIsLoading(false), 1500);
		return () => clearTimeout(timer);
	}, []);

	const inquiryTypes = [
		{ value: "general", label: "General Inquiry" },
		{ value: "admissions", label: "Admissions" },
		{ value: "academics", label: "Academic Information" },
		{ value: "facilities", label: "Facilities & Infrastructure" },
		{ value: "support", label: "Technical Support" },
		{ value: "other", label: "Other" },
	];

	const validateForm = (): boolean => {
		const newErrors: FormErrors = {};

		if (!formData.name.trim()) {
			newErrors.name = "Name is required";
		} else if (formData.name.length < 2) {
			newErrors.name = "Name must be at least 2 characters";
		}

		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Please enter a valid email address";
		}

		if (!formData.phone.trim()) {
			newErrors.phone = "Phone number is required";
		} else if (!/^[+]?[\d\s-()]{10,}$/.test(formData.phone)) {
			newErrors.phone = "Please enter a valid phone number";
		}

		if (!formData.subject.trim()) {
			newErrors.subject = "Subject is required";
		} else if (formData.subject.length < 5) {
			newErrors.subject = "Subject must be at least 5 characters";
		}

		if (!formData.message.trim()) {
			newErrors.message = "Message is required";
		} else if (formData.message.length < 10) {
			newErrors.message = "Message must be at least 10 characters";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);

		// Simulate API call
		try {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			setIsSubmitted(true);
			setFormData({
				name: "",
				email: "",
				phone: "",
				subject: "",
				message: "",
				type: "general",
			});
		} catch (error) {
			console.error("Form submission error:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		// Clear error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

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

	if (isSubmitted) {
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
						onClick={() => setIsSubmitted(false)}
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

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Inquiry Type */}
					<div>
						<label className="block text-sm font-medium text-foreground mb-2">
							Inquiry Type
						</label>
						<select
							name="type"
							value={formData.type}
							onChange={handleChange}
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
								value={formData.name}
								onChange={handleChange}
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
								value={formData.email}
								onChange={handleChange}
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
								value={formData.phone}
								onChange={handleChange}
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
								value={formData.subject}
								onChange={handleChange}
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
							value={formData.message}
							onChange={handleChange}
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
						disabled={isSubmitting}
						className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
					>
						{isSubmitting ? (
							<>
								<Loader2 className="w-5 h-5 mr-2 animate-spin" />
								Sending Message...
							</>
						) : (
							<>
								<Send className="w-5 h-5 mr-2" />
								Send Message
							</>
						)}
					</Button>
				</form>
			</Card>
		</motion.div>
	);
}
