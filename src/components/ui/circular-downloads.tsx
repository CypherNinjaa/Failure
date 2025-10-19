"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
	Download,
	File,
	FileText,
	Image,
	Video,
	Archive,
	Calendar,
	Eye,
	Clock,
	CheckCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DownloadItem {
	id: number;
	title: string;
	description: string;
	type: "pdf" | "image" | "video" | "archive" | "document";
	size: string;
	uploadDate: string;
	downloads: number;
	category: string;
	isNew: boolean;
	fileIcon: string;
}

const downloadItems: DownloadItem[] = [
	{
		id: 1,
		title: "Academic Calendar 2024-25",
		description: "Complete academic calendar with important dates and holidays",
		type: "pdf",
		size: "2.5 MB",
		uploadDate: "2024-03-20",
		downloads: 1247,
		category: "academics",
		isNew: true,
		fileIcon: "from-red-500 to-pink-600",
	},
	{
		id: 2,
		title: "Admission Form 2024",
		description: "Official admission form for new academic session",
		type: "pdf",
		size: "1.8 MB",
		uploadDate: "2024-03-18",
		downloads: 2156,
		category: "admissions",
		isNew: true,
		fileIcon: "from-blue-500 to-purple-600",
	},
	{
		id: 3,
		title: "Fee Structure Details",
		description: "Detailed fee structure for all classes and activities",
		type: "document",
		size: "950 KB",
		uploadDate: "2024-03-15",
		downloads: 1834,
		category: "fees",
		isNew: false,
		fileIcon: "from-green-500 to-teal-600",
	},
	{
		id: 4,
		title: "Sports Day Photos",
		description: "High-resolution photos from Annual Sports Day 2024",
		type: "archive",
		size: "125 MB",
		uploadDate: "2024-03-25",
		downloads: 456,
		category: "events",
		isNew: true,
		fileIcon: "from-orange-500 to-red-600",
	},
	{
		id: 5,
		title: "School Brochure",
		description: "Complete school brochure with facilities and curriculum",
		type: "pdf",
		size: "8.2 MB",
		uploadDate: "2024-03-10",
		downloads: 3421,
		category: "general",
		isNew: false,
		fileIcon: "from-purple-500 to-pink-600",
	},
	{
		id: 6,
		title: "Science Lab Manual",
		description: "Comprehensive science laboratory manual for grades 9-10",
		type: "pdf",
		size: "4.7 MB",
		uploadDate: "2024-03-12",
		downloads: 892,
		category: "academics",
		isNew: false,
		fileIcon: "from-teal-500 to-green-600",
	},
	{
		id: 7,
		title: "Cultural Fest Highlights",
		description: "Video compilation of cultural festival performances",
		type: "video",
		size: "87 MB",
		uploadDate: "2024-03-22",
		downloads: 678,
		category: "events",
		isNew: true,
		fileIcon: "from-pink-500 to-rose-600",
	},
	{
		id: 8,
		title: "Transport Routes",
		description: "Updated school bus routes and timings",
		type: "document",
		size: "1.2 MB",
		uploadDate: "2024-03-08",
		downloads: 1567,
		category: "transport",
		isNew: false,
		fileIcon: "from-indigo-500 to-blue-600",
	},
];

export function CircularDownloads() {
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [downloadProgress, setDownloadProgress] = useState<{
		[key: number]: number;
	}>({});
	const [completedDownloads, setCompletedDownloads] = useState<Set<number>>(
		new Set()
	);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const categories = [
		{ id: "all", name: "All Files", count: downloadItems.length },
		{
			id: "academics",
			name: "Academics",
			count: downloadItems.filter((item) => item.category === "academics")
				.length,
		},
		{
			id: "admissions",
			name: "Admissions",
			count: downloadItems.filter((item) => item.category === "admissions")
				.length,
		},
		{
			id: "events",
			name: "Events",
			count: downloadItems.filter((item) => item.category === "events").length,
		},
		{
			id: "general",
			name: "General",
			count: downloadItems.filter((item) => item.category === "general").length,
		},
	];

	const filteredItems =
		selectedCategory === "all"
			? downloadItems
			: downloadItems.filter((item) => item.category === selectedCategory);

	const getFileIcon = (type: string) => {
		switch (type) {
			case "pdf":
				return FileText;
			case "image":
				return Image;
			case "video":
				return Video;
			case "archive":
				return Archive;
			case "document":
				return File;
			default:
				return File;
		}
	};

	const simulateDownload = (itemId: number) => {
		if (downloadProgress[itemId] || completedDownloads.has(itemId)) return;

		setDownloadProgress((prev) => ({ ...prev, [itemId]: 0 }));

		const interval = setInterval(() => {
			setDownloadProgress((prev) => {
				const currentProgress = prev[itemId] || 0;
				const newProgress = currentProgress + Math.random() * 15 + 5;

				if (newProgress >= 100) {
					clearInterval(interval);
					setCompletedDownloads(
						(completed) => new Set([...Array.from(completed), itemId])
					);
					setTimeout(() => {
						setDownloadProgress((current) => {
							const updated = { ...current };
							delete updated[itemId];
							return updated;
						});
					}, 2000);
					return { ...prev, [itemId]: 100 };
				}

				return { ...prev, [itemId]: newProgress };
			});
		}, 200);
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	// Prevent hydration mismatch
	if (!isMounted) {
		return (
			<section className="py-16 lg:py-24">
				<div className="container">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
							Download Center
						</h2>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="py-16 lg:py-24">
			<div className="container">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-12"
				>
					<div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/10 text-secondary mb-6">
						<Download className="w-4 h-4 mr-2" />
						<span className="text-sm font-medium">Download Center</span>
					</div>

					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
						<span className="text-gradient-primary">Resource</span> Downloads
					</h2>

					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Access important documents, forms, and resources. All files are
						updated regularly and available for instant download with progress
						tracking.
					</p>
				</motion.div>

				{/* Category Filter */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="flex flex-wrap justify-center gap-3 mb-12"
				>
					{categories.map((category, index) => (
						<motion.button
							key={category.id}
							onClick={() => setSelectedCategory(category.id)}
							className={`flex items-center px-4 py-2 rounded-full font-medium transition-all duration-300 ${
								selectedCategory === category.id
									? "bg-secondary text-secondary-foreground shadow-lg scale-105"
									: "bg-card text-foreground hover:bg-muted border border-border"
							}`}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: 0.1 * index }}
						>
							{category.name}
							<span
								className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
									selectedCategory === category.id
										? "bg-white/20 text-white"
										: "bg-secondary/10 text-secondary"
								}`}
							>
								{category.count}
							</span>
						</motion.button>
					))}
				</motion.div>

				{/* Downloads Grid */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
				>
					{filteredItems.map((item, index) => {
						const FileIcon = getFileIcon(item.type);
						const isDownloading = downloadProgress[item.id] !== undefined;
						const isCompleted = completedDownloads.has(item.id);
						const progress = downloadProgress[item.id] || 0;

						return (
							<motion.div
								key={item.id}
								initial={{ opacity: 0, scale: 0.8 }}
								whileInView={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5, delay: 0.1 * index }}
								viewport={{ once: true }}
								className="group"
							>
								<Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 h-full">
									<CardContent className="p-6 flex flex-col h-full">
										{/* File Icon */}
										<div className="relative mb-4">
											<div
												className={`w-16 h-16 bg-gradient-to-br ${item.fileIcon} rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}
											>
												<FileIcon className="w-8 h-8 text-white" />
											</div>
											{item.isNew && (
												<div className="absolute -top-2 -right-2 w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-bold">
													N
												</div>
											)}
										</div>

										{/* File Info */}
										<div className="flex-1">
											<h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors duration-300">
												{item.title}
											</h3>
											<p className="text-sm text-muted-foreground mb-4 line-clamp-2">
												{item.description}
											</p>

											<div className="space-y-2 text-xs text-muted-foreground mb-4">
												<div className="flex items-center justify-between">
													<span className="flex items-center">
														<File className="w-3 h-3 mr-1" />
														{item.size}
													</span>
													<span className="flex items-center">
														<Eye className="w-3 h-3 mr-1" />
														{item.downloads}
													</span>
												</div>
												<div className="flex items-center">
													<Calendar className="w-3 h-3 mr-1" />
													{formatDate(item.uploadDate)}
												</div>
											</div>
										</div>

										{/* Download Button */}
										<div className="mt-auto">
											{isCompleted ? (
												<Button
													size="sm"
													className="w-full bg-green-500 hover:bg-green-600 text-white"
													disabled
												>
													<CheckCircle className="w-4 h-4 mr-2" />
													Downloaded
												</Button>
											) : isDownloading ? (
												<div className="space-y-2">
													<div className="w-full bg-muted rounded-full h-2">
														<motion.div
															className="bg-accent h-2 rounded-full"
															initial={{ width: 0 }}
															animate={{ width: `${progress}%` }}
															transition={{ duration: 0.2 }}
														/>
													</div>
													<div className="text-center text-xs text-muted-foreground">
														{Math.round(progress)}% downloaded
													</div>
												</div>
											) : (
												<Button
													size="sm"
													className="w-full bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground hover:from-secondary/90 hover:to-secondary/70"
													onClick={() => simulateDownload(item.id)}
												>
													<Download className="w-4 h-4 mr-2" />
													Download
												</Button>
											)}
										</div>
									</CardContent>
								</Card>
							</motion.div>
						);
					})}
				</motion.div>

				{/* Download Statistics */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
				>
					{[
						{ label: "Total Files", value: "50+", icon: File },
						{ label: "Downloads", value: "12K+", icon: Download },
						{ label: "Categories", value: "8", icon: Archive },
						{ label: "Updated", value: "Daily", icon: Clock },
					].map((stat, index) => {
						const StatIcon = stat.icon;
						return (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, scale: 0.8 }}
								whileInView={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5, delay: 0.1 * index }}
								viewport={{ once: true }}
							>
								<Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-muted/30">
									<CardContent className="p-4">
										<StatIcon className="w-8 h-8 text-secondary mx-auto mb-2" />
										<div className="text-2xl font-bold text-foreground mb-1">
											{stat.value}
										</div>
										<div className="text-sm text-muted-foreground">
											{stat.label}
										</div>
									</CardContent>
								</Card>
							</motion.div>
						);
					})}
				</motion.div>
			</div>
		</section>
	);
}
