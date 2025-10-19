"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Mail, Phone, Book } from "lucide-react";

export function PrincipalMessage() {
	const [isPlaying, setIsPlaying] = useState(false);

	return (
		<section className="py-16 md:py-24 bg-muted/30">
			<div className="container px-4">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-12"
				>
					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
						Principal&apos;s{" "}
						<span className="text-gradient-primary">Message</span>
					</h2>
					<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
						Guiding our students towards excellence with wisdom and compassion
					</p>
				</motion.div>

				<div className="grid lg:grid-cols-2 gap-8 items-center">
					{/* Video/Audio Section */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						viewport={{ once: true }}
						className="relative"
					>
						<div className="relative bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 shadow-lg border border-primary/20">
							<div className="relative z-10">
								<div className="flex items-center space-x-4 mb-6">
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={() => setIsPlaying(!isPlaying)}
										className="w-16 h-16 bg-primary-foreground/20 backdrop-blur-sm rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/30 transition-colors"
									>
										<Play className="w-6 h-6 ml-1" />
									</motion.button>
									<div>
										<h3 className="text-xl font-semibold text-primary-foreground">
											Welcome Message
										</h3>
										<p className="text-primary-foreground/80">
											From our Principal
										</p>
									</div>
								</div>

								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: isPlaying ? 1 : 0.7 }}
									className="space-y-4"
								>
									<p className="text-primary-foreground/90 leading-relaxed">
										&ldquo;At Happy Child School, we believe every child has the
										potential to shine. Our mission is to nurture not just
										academic excellence, but to develop confident,
										compassionate, and creative individuals who will make a
										positive impact on the world.&rdquo;
									</p>

									<div className="flex items-center space-x-4 pt-4 border-t border-primary-foreground/20">
										<div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center">
											<Book className="w-6 h-6 text-primary-foreground" />
										</div>
										<div>
											<p className="font-medium text-primary-foreground">
												Duration: 3:45 minutes
											</p>
											<p className="text-sm text-primary-foreground/70">
												Inspirational Message
											</p>
										</div>
									</div>
								</motion.div>
							</div>

							{/* Floating elements */}
							<motion.div
								animate={{
									y: [0, -10, 0],
									rotate: [0, 5, 0],
								}}
								transition={{
									duration: 6,
									repeat: Infinity,
									ease: "easeInOut",
								}}
								className="absolute top-4 right-4 w-8 h-8 bg-primary-foreground/10 rounded-lg"
							/>
							<motion.div
								animate={{
									y: [0, 15, 0],
									rotate: [0, -5, 0],
								}}
								transition={{
									duration: 4,
									repeat: Infinity,
									ease: "easeInOut",
									delay: 1,
								}}
								className="absolute bottom-4 left-4 w-6 h-6 bg-primary-foreground/10 rounded-full"
							/>
						</div>
					</motion.div>

					{/* Principal Info */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						viewport={{ once: true }}
						className="space-y-6"
					>
						<div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-border/50">
							<div className="flex items-start space-x-4 mb-6">
								<div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold">
									Dr. SK
								</div>
								<div>
									<h3 className="text-2xl font-bold text-foreground">
										Dr. Sarah Kumar
									</h3>
									<p className="text-primary font-medium">Principal</p>
									<p className="text-muted-foreground text-sm">
										M.Ed, Ph.D. in Educational Leadership
									</p>
								</div>
							</div>

							<div className="space-y-4">
								<p className="text-muted-foreground leading-relaxed">
									With over 20 years of experience in education, Dr. Kumar has
									dedicated her career to fostering innovative learning
									environments and empowering students to reach their full
									potential.
								</p>

								<div className="flex flex-wrap gap-3">
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										className="flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors"
									>
										<Mail className="w-4 h-4" />
										<span className="text-sm">principal@happychild.edu</span>
									</motion.button>
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										className="flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-lg hover:bg-accent/20 transition-colors"
									>
										<Phone className="w-4 h-4" />
										<span className="text-sm">Schedule Meeting</span>
									</motion.button>
								</div>
							</div>
						</div>

						{/* Philosophy Cards */}
						<div className="grid grid-cols-2 gap-4">
							{[
								{
									title: "Innovation",
									description: "Embracing new teaching methods",
									color: "from-primary to-secondary",
								},
								{
									title: "Excellence",
									description: "Striving for the highest standards",
									color: "from-secondary to-accent",
								},
								{
									title: "Compassion",
									description: "Caring for every student",
									color: "from-accent to-primary",
								},
								{
									title: "Growth",
									description: "Continuous improvement mindset",
									color: "from-primary/80 to-secondary/80",
								},
							].map((philosophy, index) => (
								<motion.div
									key={philosophy.title}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
									viewport={{ once: true }}
									className="relative overflow-hidden rounded-xl p-4 bg-card/80 shadow-md border border-border/50 hover:shadow-lg transition-shadow"
								>
									<div
										className={`absolute inset-0 bg-gradient-to-r ${philosophy.color} opacity-20`}
									/>
									<div className="relative z-10">
										<h4 className="font-semibold text-foreground text-sm">
											{philosophy.title}
										</h4>
										<p className="text-xs text-muted-foreground mt-1">
											{philosophy.description}
										</p>
									</div>
								</motion.div>
							))}
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
