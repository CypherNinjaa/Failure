"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { createTestimonial } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Star, Send, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SubmitTestimonialPage() {
	const [state, formAction] = useFormState(createTestimonial, {
		success: false,
		error: false,
	});
	const [rating, setRating] = useState(5);
	const [hoveredRating, setHoveredRating] = useState(0);
	const router = useRouter();

	// Handle success
	if (state.success) {
		toast.success(
			"Thank you! Your testimonial has been submitted for review. 🎉"
		);
		setTimeout(() => {
			router.push("/");
		}, 2000);
	}

	// Handle error
	if (state.error) {
		toast.error("Failed to submit testimonial. Please try again.");
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 py-12 px-4">
			<div className="container mx-auto max-w-3xl">
				{/* Back Button */}
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-foreground hover:text-blue-600 transition-colors mb-8"
				>
					<ArrowLeft className="w-5 h-5" />
					Back to Home
				</Link>

				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center mb-8"
				>
					<h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">
						✨ Share Your Experience
					</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						We&apos;d love to hear about your experience with Happy Child
						School. Your feedback helps us grow and inspires others!
					</p>
				</motion.div>

				{/* Form Card */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-2xl"
				>
					<form action={formAction} className="space-y-6">
						{/* Name & Role */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-semibold text-foreground mb-2">
									Your Name <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									name="name"
									required
									placeholder="John Doe"
									className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
								/>
							</div>

							<div>
								<label className="block text-sm font-semibold text-foreground mb-2">
									Your Role <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									name="role"
									required
									placeholder="Parent - Grade 8"
									className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
								/>
							</div>
						</div>

						{/* Email & Phone */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-semibold text-foreground mb-2">
									Email (Optional)
								</label>
								<input
									type="email"
									name="email"
									placeholder="john@example.com"
									className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
								/>
							</div>

							<div>
								<label className="block text-sm font-semibold text-foreground mb-2">
									Phone (Optional)
								</label>
								<input
									type="tel"
									name="phone"
									placeholder="+1 234 567 8900"
									className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
								/>
							</div>
						</div>

						{/* Rating */}
						<div>
							<label className="block text-sm font-semibold text-foreground mb-2">
								Rate Your Experience <span className="text-red-500">*</span>
							</label>
							<div className="flex items-center gap-2">
								{[1, 2, 3, 4, 5].map((star) => (
									<button
										key={star}
										type="button"
										onClick={() => setRating(star)}
										onMouseEnter={() => setHoveredRating(star)}
										onMouseLeave={() => setHoveredRating(0)}
										className="transition-transform hover:scale-125"
									>
										<Star
											className={`w-10 h-10 ${
												star <= (hoveredRating || rating)
													? "fill-yellow-400 text-yellow-400"
													: "text-gray-300"
											}`}
										/>
									</button>
								))}
								<span className="ml-3 text-lg font-semibold text-foreground">
									{rating} {rating === 1 ? "Star" : "Stars"}
								</span>
							</div>
							<input type="hidden" name="rating" value={rating} />
						</div>

						{/* Avatar/Emoji */}
						<div>
							<label className="block text-sm font-semibold text-foreground mb-2">
								Choose an Avatar <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								name="avatar"
								required
								placeholder="👨‍👩‍👧 or 🎓 or 📚"
								maxLength={2}
								className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-3xl text-center"
							/>
							<p className="text-xs text-muted-foreground mt-2">
								Enter an emoji (e.g., 👨‍👩‍👧, 🎓, 📚, 👨‍🎓, 👩‍🎓)
							</p>
						</div>

						{/* Testimonial Content */}
						<div>
							<label className="block text-sm font-semibold text-foreground mb-2">
								Your Testimonial <span className="text-red-500">*</span>
							</label>
							<textarea
								name="content"
								required
								rows={6}
								minLength={10}
								maxLength={500}
								placeholder="Share your experience with Happy Child School..."
								className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
							/>
							<p className="text-xs text-muted-foreground mt-2">
								10-500 characters
							</p>
						</div>

						{/* Gradient Selection */}
						<div>
							<label className="block text-sm font-semibold text-foreground mb-2">
								Choose a Color Theme <span className="text-red-500">*</span>
							</label>
							<select
								name="gradient"
								required
								className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
							>
								<option value="from-blue-500 to-cyan-500">
									🔵 Blue to Cyan
								</option>
								<option value="from-purple-500 to-pink-500">
									💜 Purple to Pink
								</option>
								<option value="from-green-500 to-emerald-500">
									💚 Green to Emerald
								</option>
								<option value="from-orange-500 to-red-500">
									🧡 Orange to Red
								</option>
								<option value="from-pink-500 to-rose-500">
									💗 Pink to Rose
								</option>
								<option value="from-indigo-500 to-purple-500">
									💙 Indigo to Purple
								</option>
							</select>
						</div>

						{/* Hidden Display Order */}
						<input type="hidden" name="displayOrder" value="0" />

						{/* Submit Button */}
						<motion.button
							type="submit"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
						>
							<Send className="w-5 h-5" />
							Submit Testimonial
						</motion.button>

						<p className="text-xs text-center text-muted-foreground">
							Your testimonial will be reviewed by our team before being
							published on the website.
						</p>
					</form>
				</motion.div>
			</div>
		</div>
	);
}
