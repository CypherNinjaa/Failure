"use client";

import { motion } from "framer-motion";
import {
	Users,
	GraduationCap,
	BookOpen,
	Mail,
	Star,
	Award,
} from "lucide-react";
import { useState } from "react";

interface Teacher {
	id?: string;
	name: string;
	subject: string;
	education: string;
	experience: string;
	specialization: string;
	achievements: string[];
	image: string;
	rating: number;
	email?: string;
	phone?: string;
}

interface NonTeachingStaff {
	name: string;
	role: string;
	department: string;
	education: string;
	experience: string;
	specialization: string;
	image: string;
}

interface StaffDirectoryClientProps {
	teachers: Teacher[];
	nonTeachingStaff: NonTeachingStaff[];
}

export function StaffDirectoryClient({
	teachers,
	nonTeachingStaff,
}: StaffDirectoryClientProps) {
	const [activeTab, setActiveTab] = useState("teachers");

	const FlipCard = ({
		person,
		isTeacher = true,
	}: {
		person: Teacher | NonTeachingStaff;
		isTeacher?: boolean;
	}) => {
		const [isFlipped, setIsFlipped] = useState(false);

		// Type guards
		const isTeacherPerson = (p: Teacher | NonTeachingStaff): p is Teacher => {
			return "subject" in p;
		};

		const teacher = isTeacher && isTeacherPerson(person) ? person : null;
		const staff =
			!isTeacher && !isTeacherPerson(person)
				? (person as NonTeachingStaff)
				: null;

		const handleCardClick = () => {
			setIsFlipped(!isFlipped);
		};

		return (
			<motion.div
				className="relative w-full h-80 mx-auto"
				style={{ perspective: "1000px" }}
				whileHover={{ y: -8 }}
			>
				<motion.div
					className="w-full h-full relative cursor-pointer"
					style={{
						transformStyle: "preserve-3d",
						zIndex: isFlipped ? 10 : 1,
					}}
					animate={{ rotateY: isFlipped ? 180 : 0 }}
					transition={{ duration: 0.6 }}
					onClick={handleCardClick}
				>
					{/* Front Side */}
					<div
						className="absolute inset-0 w-full h-full"
						style={{
							transform: "rotateY(0deg)",
							backfaceVisibility: "hidden",
							WebkitBackfaceVisibility: "hidden",
							zIndex: 2,
						}}
					>
						<div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 border border-border/50 shadow-lg h-full flex flex-col items-center justify-center text-center relative">
							{/* Small Contact Button - Top Right */}
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								className="absolute top-4 right-4 w-8 h-8 bg-primary/20 hover:bg-primary hover:text-white text-primary rounded-full flex items-center justify-center transition-all duration-300 shadow-md"
								onClick={(e) => {
									e.stopPropagation();
									if (teacher && teacher.email) {
										window.location.href = `mailto:${teacher.email}`;
									}
								}}
								title="Contact"
							>
								<Mail className="w-4 h-4" />
							</motion.button>

							{/* Avatar */}
							<div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
								{person.image}
							</div>

							{/* Name & Position */}
							<h3 className="text-lg font-bold text-foreground mb-2">
								{person.name}
							</h3>
							<p className="text-primary font-semibold mb-3">
								{teacher ? teacher.subject : staff ? staff.role : ""}
							</p>

							{/* Experience */}
							<div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
								<Award className="w-4 h-4" />
								{person.experience}
							</div>

							{/* Rating for teachers */}
							{teacher && teacher.rating && (
								<div className="flex items-center gap-1 mb-4">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`w-4 h-4 ${
												i < Math.floor(teacher.rating)
													? "fill-yellow-400 text-yellow-400"
													: "text-gray-300"
											}`}
										/>
									))}
									<span className="text-sm text-muted-foreground ml-1">
										{teacher.rating}
									</span>
								</div>
							)}

							{/* Click Indicator */}
							<div className="text-xs text-muted-foreground opacity-70">
								Click for details
							</div>
						</div>
					</div>

					{/* Back Side */}
					<div
						className="absolute inset-0 w-full h-full"
						style={{
							transform: "rotateY(180deg)",
							backfaceVisibility: "hidden",
							WebkitBackfaceVisibility: "hidden",
							zIndex: 3,
						}}
					>
						<div className="bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm rounded-3xl p-6 border border-primary/20 shadow-lg h-full relative flex flex-col">
							{/* Small Contact Button - Top Left */}
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								className="absolute top-4 left-4 w-8 h-8 bg-primary/20 hover:bg-primary hover:text-white text-primary rounded-full flex items-center justify-center transition-all duration-300 shadow-md"
								onClick={(e) => {
									e.stopPropagation();
									if (teacher && teacher.email) {
										window.location.href = `mailto:${teacher.email}`;
									}
								}}
								title="Contact"
							>
								<Mail className="w-4 h-4" />
							</motion.button>

							{/* Back indicator */}
							<div className="absolute top-4 right-4 z-10">
								<div className="text-xs text-muted-foreground opacity-70 bg-background/50 px-2 py-1 rounded">
									Click to return
								</div>
							</div>

							{/* Header */}
							<div className="text-center mb-4">
								<h3 className="text-lg font-bold text-foreground mb-1">
									{person.name}
								</h3>
								<p className="text-primary font-semibold text-sm">
									{teacher
										? teacher.subject
										: staff
										? `${staff.role} - ${staff.department}`
										: ""}
								</p>
							</div>

							{/* Details - with flex-1 to take available space */}
							<div className="space-y-3 text-sm flex-1">
								<div>
									<span className="font-semibold text-foreground">
										Education:
									</span>
									<p className="text-muted-foreground">{person.education}</p>
								</div>
								<div>
									<span className="font-semibold text-foreground">
										Experience:
									</span>
									<p className="text-muted-foreground">{person.experience}</p>
								</div>
								<div>
									<span className="font-semibold text-foreground">
										Specialization:
									</span>
									<p className="text-muted-foreground">
										{person.specialization}
									</p>
								</div>

								{/* Achievements for teachers */}
								{teacher && teacher.achievements && (
									<div>
										<span className="font-semibold text-foreground">
											Recent Achievements:
										</span>
										<ul className="text-muted-foreground mt-1 space-y-1">
											{teacher.achievements.map(
												(achievement: string, i: number) => (
													<li
														key={i}
														className="flex items-center gap-2 text-xs"
													>
														<div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
														{achievement}
													</li>
												)
											)}
										</ul>
									</div>
								)}
							</div>
						</div>
					</div>
				</motion.div>
			</motion.div>
		);
	};

	return (
		<section className="py-16 md:py-24 bg-muted/30">
			<div className="container px-4">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<div className="inline-flex items-center gap-2 px-6 py-3 bg-card/90 backdrop-blur-sm rounded-full shadow-lg border border-border mb-6">
						<Users className="w-4 h-4 text-primary" />
						<span className="text-sm font-semibold text-muted-foreground">
							Our Amazing Team
						</span>
					</div>
					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
						Staff <span className="text-gradient-primary">Directory</span>
					</h2>
					<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
						Meet our dedicated team of educators and support staff who make
						learning an inspiring journey.
					</p>
				</motion.div>

				{/* Tab Navigation */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="flex justify-center mb-12"
				>
					<div className="bg-card/80 backdrop-blur-sm rounded-2xl p-2 border border-border/50 shadow-lg">
						<div className="flex gap-2">
							<button
								onClick={() => setActiveTab("teachers")}
								className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
									activeTab === "teachers"
										? "bg-primary text-white shadow-lg"
										: "text-muted-foreground hover:text-foreground"
								}`}
							>
								<GraduationCap className="w-4 h-4" />
								Teachers
							</button>
							<button
								onClick={() => setActiveTab("staff")}
								className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
									activeTab === "staff"
										? "bg-primary text-white shadow-lg"
										: "text-muted-foreground hover:text-foreground"
								}`}
							>
								<BookOpen className="w-4 h-4" />
								Support Staff
							</button>
						</div>
					</div>
				</motion.div>

				{/* Staff Grid */}
				<motion.div
					key={activeTab}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto"
				>
					{(activeTab === "teachers" ? teachers : nonTeachingStaff).map(
						(person, index) => (
							<motion.div
								key={person.name}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
								viewport={{ once: true }}
								className="relative z-0 p-2"
								style={{ isolation: "isolate" }}
							>
								<FlipCard
									person={person}
									isTeacher={activeTab === "teachers"}
								/>
							</motion.div>
						)
					)}
				</motion.div>

				{/* Department Stats */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					viewport={{ once: true }}
					className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
				>
					{[
						{ number: "80+", label: "Total Staff", icon: "👥" },
						{ number: "60+", label: "Teachers", icon: "👩‍🏫" },
						{ number: "20+", label: "Support Staff", icon: "🔧" },
						{ number: "95%", label: "Retention Rate", icon: "📈" },
					].map((stat, index) => (
						<motion.div
							key={stat.label}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
							viewport={{ once: true }}
							whileHover={{ y: -4 }}
							className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 hover:shadow-lg transition-all duration-300"
						>
							<div className="text-3xl mb-2">{stat.icon}</div>
							<div className="text-2xl font-bold text-foreground mb-1">
								{stat.number}
							</div>
							<div className="text-sm text-muted-foreground">{stat.label}</div>
						</motion.div>
					))}
				</motion.div>

				{/* Join Team CTA */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.6 }}
					viewport={{ once: true }}
					className="text-center mt-16"
				>
					<div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 md:p-12 border border-border/50 max-w-4xl mx-auto">
						<h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
							Join Our Teaching Family
						</h3>
						<p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
							We&apos;re always looking for passionate educators and dedicated
							support staff to join our mission of inspiring young minds.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="bg-gradient-to-r from-primary to-secondary px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
							>
								View Open Positions
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="bg-card/80 backdrop-blur-sm text-foreground px-8 py-3 rounded-xl font-semibold border border-border hover:shadow-lg transition-all duration-300"
							>
								Submit Resume
							</motion.button>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}

// Backward compatibility: Export the client component with default hardcoded data
export function StaffDirectory() {
	const defaultTeachers = [
		{
			name: "Ms. Jennifer Adams",
			subject: "Mathematics",
			education: "M.Sc. Mathematics, UCLA",
			experience: "12 Years",
			specialization: "Advanced Calculus, Statistics",
			achievements: [
				"Math Excellence Award 2023",
				"Student Choice Teacher 2022",
			],
			image: "JA",
			rating: 4.9,
		},
		{
			name: "Dr. Robert Wilson",
			subject: "Physics",
			education: "Ph.D. Physics, MIT",
			experience: "15 Years",
			specialization: "Quantum Mechanics, Astrophysics",
			achievements: [
				"Science Innovation Award 2023",
				"Research Excellence 2021",
			],
			image: "RW",
			rating: 4.8,
		},
		{
			name: "Ms. Lisa Thompson",
			subject: "English Literature",
			education: "M.A. English, Oxford University",
			experience: "10 Years",
			specialization: "Creative Writing, World Literature",
			achievements: [
				"Literary Excellence Award 2023",
				"Creative Teaching Award 2022",
			],
			image: "LT",
			rating: 4.9,
		},
	];

	const defaultNonTeachingStaff = [
		{
			name: "Mr. James Parker",
			role: "IT Administrator",
			department: "Technology",
			education: "B.Tech Computer Engineering",
			experience: "7 Years",
			specialization: "Network Management, System Security",
			image: "JP",
		},
		{
			name: "Ms. Maria Gonzalez",
			role: "School Nurse",
			department: "Health Services",
			education: "B.Sc. Nursing, RN License",
			experience: "11 Years",
			specialization: "Child Health, Emergency Care",
			image: "MG",
		},
	];

	return (
		<StaffDirectoryClient
			teachers={defaultTeachers}
			nonTeachingStaff={defaultNonTeachingStaff}
		/>
	);
}
