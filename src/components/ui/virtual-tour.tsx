"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
	Navigation,
	RotateCcw,
	RotateCw,
	ZoomIn,
	ZoomOut,
	Maximize2,
	Home,
	MapPin,
	Camera,
	Info,
	Play,
	VolumeX,
	Volume2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function VirtualTour() {
	const [selectedLocation, setSelectedLocation] = useState(0);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [soundEnabled, setSoundEnabled] = useState(true);
	const [showInfo, setShowInfo] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const tourLocations = [
		{
			id: 0,
			name: "Main Entrance & Reception",
			description: "Welcome to Happy Child School - Your journey begins here",
			hotspots: 8,
			details:
				"Our grand entrance showcases the school's commitment to excellence with modern architecture and welcoming spaces.",
			background: "from-blue-500 to-purple-600",
			coordinates: { x: 50, y: 60 },
		},
		{
			id: 1,
			name: "Smart Classrooms",
			description: "Technology-enhanced learning environments",
			hotspots: 12,
			details:
				"Interactive whiteboards, digital projectors, and collaborative learning spaces designed for 21st-century education.",
			background: "from-green-500 to-teal-600",
			coordinates: { x: 25, y: 40 },
		},
		{
			id: 2,
			name: "Science Laboratory",
			description: "State-of-the-art research and experimentation facilities",
			hotspots: 15,
			details:
				"Fully equipped physics, chemistry, and biology labs with safety-first design and modern equipment.",
			background: "from-purple-500 to-pink-600",
			coordinates: { x: 75, y: 25 },
		},
		{
			id: 3,
			name: "Library & Reading Hall",
			description:
				"Knowledge hub with vast collection of books and digital resources",
			hotspots: 10,
			details:
				"Over 50,000 books, digital terminals, quiet study areas, and collaborative learning zones.",
			background: "from-orange-500 to-red-600",
			coordinates: { x: 20, y: 75 },
		},
		{
			id: 4,
			name: "Sports Complex",
			description: "Indoor and outdoor sports facilities",
			hotspots: 18,
			details:
				"Multi-purpose courts, swimming pool, gymnasium, and outdoor fields for various sports activities.",
			background: "from-teal-500 to-green-600",
			coordinates: { x: 80, y: 70 },
		},
		{
			id: 5,
			name: "Cafeteria & Dining Hall",
			description: "Nutritious meals in a vibrant social space",
			hotspots: 9,
			details:
				"Spacious dining area serving healthy, balanced meals with options for special dietary requirements.",
			background: "from-yellow-500 to-orange-600",
			coordinates: { x: 60, y: 45 },
		},
		{
			id: 6,
			name: "Art & Music Studios",
			description: "Creative spaces for artistic expression",
			hotspots: 14,
			details:
				"Dedicated spaces for visual arts, music practice rooms, and performance areas to nurture creativity.",
			background: "from-pink-500 to-rose-600",
			coordinates: { x: 40, y: 20 },
		},
		{
			id: 7,
			name: "Playground & Gardens",
			description: "Outdoor recreational and learning spaces",
			hotspots: 11,
			details:
				"Eco-friendly gardens, playground equipment, and outdoor classrooms for nature-based learning.",
			background: "from-indigo-500 to-blue-600",
			coordinates: { x: 45, y: 85 },
		},
	];

	const tourControls = [
		{
			icon: RotateCcw,
			label: "Rotate Left",
			action: () => console.log("Rotate left"),
		},
		{
			icon: RotateCw,
			label: "Rotate Right",
			action: () => console.log("Rotate right"),
		},
		{ icon: ZoomIn, label: "Zoom In", action: () => console.log("Zoom in") },
		{ icon: ZoomOut, label: "Zoom Out", action: () => console.log("Zoom out") },
		{
			icon: Maximize2,
			label: "Fullscreen",
			action: () => setIsFullscreen(!isFullscreen),
		},
	];

	const nextLocation = () => {
		setSelectedLocation((prev) => (prev + 1) % tourLocations.length);
	};

	const prevLocation = () => {
		setSelectedLocation(
			(prev) => (prev - 1 + tourLocations.length) % tourLocations.length
		);
	};

	// Prevent hydration mismatch
	if (!isMounted) {
		return (
			<section className="py-16 lg:py-24">
				<div className="container">
					<div className="text-center mb-12">
						<div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
							<Navigation className="w-4 h-4 mr-2" />
							<span className="text-sm font-medium">Virtual Tour</span>
						</div>
						<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
							<span className="text-gradient-primary">Explore Our</span>
							<br />
							Campus Virtually
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Take an immersive 360° virtual tour of our campus.
						</p>
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
					<div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
						<Navigation className="w-4 h-4 mr-2" />
						<span className="text-sm font-medium">Virtual Tour</span>
					</div>

					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
						<span className="text-gradient-primary">Explore Our</span>
						<br />
						Campus Virtually
					</h2>

					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Take an immersive 360° virtual tour of our campus. Navigate through
						our facilities and experience the environment that nurtures young
						minds.
					</p>
				</motion.div>

				{/* Main Virtual Tour Viewer */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className={`relative rounded-2xl overflow-hidden shadow-2xl ${
						isFullscreen ? "fixed inset-4 z-50" : "aspect-video"
					}`}
				>
					{/* 360° Viewer */}
					<div
						className={`relative w-full h-full bg-gradient-to-br ${tourLocations[selectedLocation].background} flex items-center justify-center`}
					>
						{/* Simulated 360° Background */}
						<div className="absolute inset-0 bg-black/20"></div>

						{/* Interactive Hotspots */}
						{tourLocations.map((location, index) => (
							<motion.button
								key={location.id}
								className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-lg ${
									index === selectedLocation
										? "bg-accent scale-150"
										: "bg-white/50 hover:bg-white/80"
								} transition-all duration-300`}
								style={{
									left: `${location.coordinates.x}%`,
									top: `${location.coordinates.y}%`,
								}}
								onClick={() => setSelectedLocation(index)}
								whileHover={{ scale: 1.2 }}
								whileTap={{ scale: 0.9 }}
								initial={{ opacity: 0, scale: 0 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.1 * index }}
							>
								<span className="sr-only">{location.name}</span>
							</motion.button>
						))}

						{/* Center Content */}
						<div className="text-center text-white z-10">
							<motion.div
								key={selectedLocation}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5 }}
								className="mb-8"
							>
								<div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
									<Navigation className="w-12 h-12 text-white" />
								</div>
								<h3 className="text-2xl font-bold mb-2">
									{tourLocations[selectedLocation].name}
								</h3>
								<p className="text-white/90 mb-4">
									{tourLocations[selectedLocation].description}
								</p>
								<div className="flex items-center justify-center space-x-4 text-sm">
									<span className="flex items-center bg-white/20 px-3 py-1 rounded-full">
										<MapPin className="w-4 h-4 mr-1" />
										{tourLocations[selectedLocation].hotspots} hotspots
									</span>
								</div>
							</motion.div>

							{/* Navigation Hint */}
							<motion.div
								animate={{ y: [0, -10, 0] }}
								transition={{ duration: 2, repeat: Infinity }}
								className="text-white/60 text-sm"
							>
								Click hotspots to explore • Use controls to navigate
							</motion.div>
						</div>

						{/* Top Controls */}
						<div className="absolute top-4 left-4 right-4 flex justify-between items-center">
							<div className="flex items-center space-x-2">
								<Button
									size="sm"
									variant="secondary"
									className="bg-black/50 text-white border-white/20 hover:bg-black/70"
									onClick={() => setShowInfo(!showInfo)}
								>
									<Info className="w-4 h-4 mr-1" />
									Info
								</Button>
								<Button
									size="sm"
									variant="secondary"
									className="bg-black/50 text-white border-white/20 hover:bg-black/70"
									onClick={() => setSoundEnabled(!soundEnabled)}
								>
									{soundEnabled ? (
										<Volume2 className="w-4 h-4" />
									) : (
										<VolumeX className="w-4 h-4" />
									)}
								</Button>
							</div>

							<div className="flex items-center space-x-2">
								{tourControls.map((control, index) => {
									const ControlIcon = control.icon;
									return (
										<Button
											key={index}
											size="sm"
											variant="secondary"
											className="bg-black/50 text-white border-white/20 hover:bg-black/70"
											onClick={control.action}
											title={control.label}
										>
											<ControlIcon className="w-4 h-4" />
										</Button>
									);
								})}
							</div>
						</div>

						{/* Bottom Navigation */}
						<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
							<div className="flex items-center space-x-3 bg-black/50 backdrop-blur rounded-full px-4 py-2">
								<Button
									size="sm"
									variant="ghost"
									className="text-white hover:bg-white/20"
									onClick={prevLocation}
								>
									<Navigation className="w-4 h-4 rotate-180" />
								</Button>

								<span className="text-white text-sm px-3">
									{selectedLocation + 1} / {tourLocations.length}
								</span>

								<Button
									size="sm"
									variant="ghost"
									className="text-white hover:bg-white/20"
									onClick={nextLocation}
								>
									<Navigation className="w-4 h-4" />
								</Button>
							</div>
						</div>

						{/* Info Panel */}
						{showInfo && (
							<motion.div
								initial={{ opacity: 0, x: 300 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 300 }}
								className="absolute top-16 right-4 bg-card/95 backdrop-blur rounded-lg p-4 w-80 shadow-lg border border-border"
							>
								<h4 className="font-semibold text-foreground mb-2">
									{tourLocations[selectedLocation].name}
								</h4>
								<p className="text-sm text-muted-foreground mb-3">
									{tourLocations[selectedLocation].details}
								</p>
								<div className="flex items-center justify-between text-xs text-muted-foreground">
									<span className="flex items-center">
										<Camera className="w-3 h-3 mr-1" />
										360° View
									</span>
									<span className="flex items-center">
										<MapPin className="w-3 h-3 mr-1" />
										{tourLocations[selectedLocation].hotspots} hotspots
									</span>
								</div>
							</motion.div>
						)}
					</div>
				</motion.div>

				{/* Location Quick Access */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="mt-8"
				>
					<h3 className="text-xl font-bold text-foreground mb-4 text-center">
						Quick Navigation
					</h3>

					<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
						{tourLocations.map((location, index) => (
							<motion.button
								key={location.id}
								onClick={() => setSelectedLocation(index)}
								className={`p-3 rounded-lg text-center transition-all duration-300 ${
									selectedLocation === index
										? "bg-accent text-accent-foreground shadow-lg scale-105"
										: "bg-card text-foreground hover:bg-muted border border-border"
								}`}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: 0.1 * index }}
							>
								<div
									className={`w-8 h-8 rounded-full bg-gradient-to-br ${location.background} mx-auto mb-2 flex items-center justify-center`}
								>
									<Home className="w-4 h-4 text-white" />
								</div>
								<div className="text-xs font-medium line-clamp-2">
									{location.name}
								</div>
							</motion.button>
						))}
					</div>
				</motion.div>

				{/* Tour Statistics */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
				>
					{[
						{ label: "Locations", value: "8", icon: MapPin },
						{ label: "Hotspots", value: "97", icon: Navigation },
						{ label: "360° Views", value: "50+", icon: Camera },
						{ label: "HD Quality", value: "4K", icon: Play },
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
										<StatIcon className="w-8 h-8 text-accent mx-auto mb-2" />
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

				{/* Start Tour CTA */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="text-center mt-12"
				>
					<Button
						size="lg"
						className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground hover:from-accent/90 hover:to-accent/70"
						onClick={() => setSelectedLocation(0)}
					>
						<Navigation className="w-4 h-4 mr-2" />
						Start Complete Tour
					</Button>
					<p className="text-sm text-muted-foreground mt-2">
						Experience all 8 locations with guided navigation
					</p>
				</motion.div>
			</div>
		</section>
	);
}
