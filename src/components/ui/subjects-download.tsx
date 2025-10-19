"use client";

import { motion } from "framer-motion";
import {
	Download,
	FileText,
	BookOpen,
	Calculator,
	Microscope,
	Globe,
	Palette,
	Music,
	Users,
	Brain,
	Languages,
	Trophy,
	Search,
	Filter,
	Eye,
} from "lucide-react";
import { useState } from "react";

export function SubjectsDownload() {
	const [selectedLevel, setSelectedLevel] = useState("all");
	const [searchTerm, setSearchTerm] = useState("");

	const subjectCategories = [
		{
			level: "primary",
			title: "Primary Level (1st-5th)",
			color: "from-blue-500 to-blue-600",
			subjects: [
				{
					name: "English Language & Literature",
					description:
						"Reading, writing, grammar, and storytelling fundamentals",
					icon: BookOpen,
					size: "2.4 MB",
					format: "PDF",
					downloads: 1250,
				},
				{
					name: "Mathematics",
					description: "Basic arithmetic, geometry, and problem-solving",
					icon: Calculator,
					size: "3.1 MB",
					format: "PDF",
					downloads: 1180,
				},
				{
					name: "Environmental Science",
					description: "Nature study, basic science concepts, and ecology",
					icon: Microscope,
					size: "4.2 MB",
					format: "PDF",
					downloads: 890,
				},
				{
					name: "Social Studies",
					description: "Community, history, geography basics",
					icon: Globe,
					size: "2.8 MB",
					format: "PDF",
					downloads: 760,
				},
				{
					name: "Arts & Crafts",
					description: "Creative expression, drawing, and handicrafts",
					icon: Palette,
					size: "5.1 MB",
					format: "PDF",
					downloads: 920,
				},
				{
					name: "Music & Dance",
					description: "Rhythms, songs, and basic musical instruments",
					icon: Music,
					size: "1.9 MB",
					format: "PDF",
					downloads: 680,
				},
			],
		},
		{
			level: "middle",
			title: "Middle School (6th-8th)",
			color: "from-purple-500 to-purple-600",
			subjects: [
				{
					name: "Advanced English",
					description:
						"Literature analysis, advanced grammar, creative writing",
					icon: BookOpen,
					size: "4.3 MB",
					format: "PDF",
					downloads: 1050,
				},
				{
					name: "Algebra & Geometry",
					description: "Advanced mathematical concepts and problem-solving",
					icon: Calculator,
					size: "3.8 MB",
					format: "PDF",
					downloads: 980,
				},
				{
					name: "Physics & Chemistry",
					description: "Scientific principles, experiments, and applications",
					icon: Microscope,
					size: "5.4 MB",
					format: "PDF",
					downloads: 840,
				},
				{
					name: "History & Geography",
					description: "World history, cultures, and geographical studies",
					icon: Globe,
					size: "4.1 MB",
					format: "PDF",
					downloads: 720,
				},
				{
					name: "Computer Science",
					description: "Programming basics, digital literacy, and technology",
					icon: Brain,
					size: "3.2 MB",
					format: "PDF",
					downloads: 1120,
				},
				{
					name: "Physical Education",
					description: "Sports, fitness, and health awareness",
					icon: Users,
					size: "2.1 MB",
					format: "PDF",
					downloads: 560,
				},
			],
		},
		{
			level: "high",
			title: "High School (9th-10th)",
			color: "from-green-500 to-green-600",
			subjects: [
				{
					name: "Literature & Advanced English",
					description:
						"Critical analysis, advanced composition, research skills",
					icon: BookOpen,
					size: "5.2 MB",
					format: "PDF",
					downloads: 1340,
				},
				{
					name: "Advanced Mathematics",
					description:
						"Trigonometry, calculus preparation, statistical analysis",
					icon: Calculator,
					size: "4.6 MB",
					format: "PDF",
					downloads: 1230,
				},
				{
					name: "Physics, Chemistry & Biology",
					description:
						"Advanced scientific concepts, laboratory work, research",
					icon: Microscope,
					size: "6.8 MB",
					format: "PDF",
					downloads: 1180,
				},
				{
					name: "Social Sciences",
					description: "Economics, political science, sociology fundamentals",
					icon: Globe,
					size: "4.9 MB",
					format: "PDF",
					downloads: 890,
				},
				{
					name: "Information Technology",
					description: "Advanced programming, database, web development",
					icon: Brain,
					size: "5.1 MB",
					format: "PDF",
					downloads: 1450,
				},
				{
					name: "Second Language",
					description: "Hindi, regional languages, communication skills",
					icon: Languages,
					size: "3.4 MB",
					format: "PDF",
					downloads: 670,
				},
			],
		},
	];

	const filteredSubjects = subjectCategories
		.filter(
			(category) => selectedLevel === "all" || category.level === selectedLevel
		)
		.map((category) => ({
			...category,
			subjects: category.subjects.filter(
				(subject) =>
					subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					subject.description.toLowerCase().includes(searchTerm.toLowerCase())
			),
		}))
		.filter((category) => category.subjects.length > 0);

	const totalDownloads = subjectCategories.reduce(
		(total, category) =>
			total +
			category.subjects.reduce(
				(catTotal, subject) => catTotal + subject.downloads,
				0
			),
		0
	);

	return (
		<section className="py-16 md:py-24 bg-gradient-to-b from-muted/20 to-background">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="text-center mb-16"
				>
					<div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
						<Download className="w-4 h-4" />
						Subject Resources
					</div>
					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
						Downloadable
						<span className="text-gradient-accent"> Subject Lists</span>
					</h2>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
						Access comprehensive syllabi, curriculum guides, and subject details
						for all academic levels. Everything you need to understand our
						educational framework.
					</p>
				</motion.div>

				{/* Stats Banner */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-2xl p-6 md:p-8 mb-12 border border-border"
				>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
						<div className="space-y-2">
							<div className="text-3xl md:text-4xl font-bold text-primary">
								{filteredSubjects.reduce(
									(total, cat) => total + cat.subjects.length,
									0
								)}
							</div>
							<div className="text-muted-foreground font-medium">
								Total Subjects
							</div>
						</div>
						<div className="space-y-2">
							<div className="text-3xl md:text-4xl font-bold text-secondary">
								{totalDownloads.toLocaleString()}+
							</div>
							<div className="text-muted-foreground font-medium">Downloads</div>
						</div>
						<div className="space-y-2">
							<div className="text-3xl md:text-4xl font-bold text-accent">
								3
							</div>
							<div className="text-muted-foreground font-medium">
								Academic Levels
							</div>
						</div>
					</div>
				</motion.div>

				{/* Controls */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="flex flex-col md:flex-row gap-4 mb-12"
				>
					{/* Search */}
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
						<input
							type="text"
							placeholder="Search subjects..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
						/>
					</div>

					{/* Filter */}
					<div className="flex items-center gap-2">
						<Filter className="w-5 h-5 text-muted-foreground" />
						<select
							value={selectedLevel}
							onChange={(e) => setSelectedLevel(e.target.value)}
							className="px-4 py-3 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
						>
							<option value="all">All Levels</option>
							<option value="primary">Primary Level</option>
							<option value="middle">Middle School</option>
							<option value="high">High School</option>
						</select>
					</div>
				</motion.div>

				{/* Subject Categories */}
				<div className="space-y-12">
					{filteredSubjects.map((category, categoryIndex) => (
						<motion.div
							key={category.level}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
							className="space-y-6"
						>
							{/* Category Header */}
							<div className="flex items-center gap-4 mb-8">
								<div
									className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center`}
								>
									<Trophy className="w-6 h-6 text-white" />
								</div>
								<div>
									<h3 className="text-2xl md:text-3xl font-bold text-foreground">
										{category.title}
									</h3>
									<p className="text-muted-foreground">
										{category.subjects.length} subjects available for download
									</p>
								</div>
							</div>

							{/* Subjects Grid */}
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{category.subjects.map((subject, subjectIndex) => (
									<motion.div
										key={subjectIndex}
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ duration: 0.5, delay: subjectIndex * 0.1 }}
										className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
									>
										{/* Subject Header */}
										<div className="flex items-start gap-4 mb-4">
											<div
												className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
											>
												<subject.icon className="w-6 h-6 text-white" />
											</div>
											<div className="flex-1 min-w-0">
												<h4 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
													{subject.name}
												</h4>
												<p className="text-sm text-muted-foreground line-clamp-2">
													{subject.description}
												</p>
											</div>
										</div>

										{/* Subject Details */}
										<div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
											<div className="flex items-center gap-4">
												<span className="flex items-center gap-1">
													<FileText className="w-4 h-4" />
													{subject.format}
												</span>
												<span>{subject.size}</span>
											</div>
											<span className="text-primary font-medium">
												{subject.downloads.toLocaleString()} downloads
											</span>
										</div>

										{/* Action Buttons */}
										<div className="flex gap-2">
											<button className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
												<Download className="w-4 h-4" />
												Download
											</button>
											<button className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-colors duration-300">
												<Eye className="w-4 h-4 text-muted-foreground" />
											</button>
										</div>
									</motion.div>
								))}
							</div>
						</motion.div>
					))}
				</div>

				{/* Bottom CTA */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, delay: 0.3 }}
					className="text-center mt-16"
				>
					<div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 md:p-12 border border-border">
						<div className="max-w-3xl mx-auto">
							<h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
								Need More Information?
							</h3>
							<p className="text-muted-foreground mb-8 text-lg">
								Contact our academic counselors for detailed curriculum
								discussions or to schedule a personalized academic consultation.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<button className="bg-gradient-to-r from-primary to-secondary px-8 py-4 rounded-xl font-medium hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-2">
									<Users className="w-5 h-5" />
									Academic Counseling
								</button>
								<button className="border border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 inline-flex items-center gap-2">
									<BookOpen className="w-5 h-5" />
									Download All Syllabi
								</button>
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
