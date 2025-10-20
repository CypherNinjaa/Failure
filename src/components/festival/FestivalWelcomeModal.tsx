/**
 * Festival Welcome Modal
 * Immersive welcome popup with animations
 */

"use client";

import { useEffect, useState } from "react";
import { useFestival } from "@/hooks/useFestival";
import { X, Volume2, VolumeX, Sparkles } from "lucide-react";
import Image from "next/image";

export default function FestivalWelcomeModal() {
	const { activeFestival, isActive, isModalDismissed, dismissModal } =
		useFestival();
	const [showModal, setShowModal] = useState(false);
	const [soundEnabled, setSoundEnabled] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		if (isActive && !isModalDismissed) {
			// Show modal after short delay for better UX
			const timer = setTimeout(() => {
				setShowModal(true);
				setIsAnimating(true);

				// Play welcome sound if available
				if (typeof window !== "undefined") {
					const audio = new Audio("/sounds/welcome-bell.wav");
					audio.volume = 0.4;
					audio
						.play()
						.then(() => setSoundEnabled(true))
						.catch(() => {
							// Audio autoplay blocked, that's okay
						});
				}
			}, 1000);

			return () => clearTimeout(timer);
		}
	}, [isActive, isModalDismissed]);

	const handleClose = () => {
		setIsAnimating(false);
		setTimeout(() => {
			setShowModal(false);
			dismissModal();
		}, 300);
	};

	if (!showModal || !activeFestival) return null;

	return (
		<div
			className={`fixed inset-0 z-[10000] flex items-center justify-center p-4 transition-all duration-300 ${
				isAnimating ? "opacity-100" : "opacity-0"
			}`}
		>
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/60 backdrop-blur-sm"
				onClick={handleClose}
			/>

			{/* Modal */}
			<div
				className={`relative max-w-2xl w-full bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 ${
					isAnimating ? "scale-100 rotate-0" : "scale-50 rotate-12"
				}`}
			>
				{/* Decorative rangoli background pattern */}
				<div className="absolute inset-0 opacity-10">
					<Image
						src="/images/rangoli.svg"
						alt="Rangoli pattern"
						fill
						className="object-cover"
					/>
				</div>

				{/* Close button */}
				<button
					onClick={handleClose}
					className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
					aria-label="Close modal"
				>
					<X className="w-5 h-5 text-gray-700" />
				</button>

				{/* Sound toggle */}
				<button
					onClick={() => setSoundEnabled(!soundEnabled)}
					className="absolute top-4 left-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
					aria-label="Toggle sound"
				>
					{soundEnabled ? (
						<Volume2 className="w-5 h-5 text-gray-700" />
					) : (
						<VolumeX className="w-5 h-5 text-gray-700" />
					)}
				</button>

				{/* Header with gradient and banner image */}
				<div className="relative px-8 py-12 text-center overflow-hidden">
					{/* Background banner image */}
					<div className="absolute inset-0">
						<Image
							src="/images/banner-diwali.png"
							alt="Festival banner"
							fill
							className="object-cover opacity-20"
						/>
						<div
							className="absolute inset-0"
							style={{
								background: `linear-gradient(135deg, ${activeFestival.colors.primary}dd, ${activeFestival.colors.secondary}dd)`,
							}}
						/>
					</div>
					{/* Animated sparkles */}
					<div className="absolute inset-0 overflow-hidden">
						{[...Array(20)].map((_, i) => (
							<Sparkles
								key={i}
								className="absolute text-white/30 animate-twinkle"
								style={{
									left: `${Math.random() * 100}%`,
									top: `${Math.random() * 100}%`,
									width: `${16 + Math.random() * 16}px`,
									height: `${16 + Math.random() * 16}px`,
									animationDelay: `${Math.random() * 2}s`,
								}}
							/>
						))}
					</div>

					{/* Festival icon */}
					<div className="relative mb-6">
						<div className="inline-block relative">
							<div className="relative w-24 h-24 md:w-32 md:h-32">
								<Image
									src="/images/diya.svg"
									alt="Diya lamp"
									fill
									className="object-contain animate-bounce-slow drop-shadow-2xl"
								/>
							</div>
							<div
								className="absolute inset-0 blur-3xl opacity-50 animate-pulse"
								style={{ backgroundColor: activeFestival.colors.accent }}
							/>
						</div>
					</div>

					{/* Greeting */}
					<h2 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg animate-fade-in">
						{activeFestival.greeting}
					</h2>
					<p className="text-lg md:text-xl text-white/95 font-medium drop-shadow">
						{activeFestival.name} {new Date().getFullYear()}
					</p>
				</div>

				{/* Content */}
				<div className="relative px-8 py-8">
					{/* Message */}
					<div className="text-center mb-8">
						<p className="text-lg text-gray-700 leading-relaxed mb-6">
							{activeFestival.description}
						</p>

						<div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-full">
							<span className="text-2xl">✨</span>
							<p className="text-sm font-medium text-gray-700">
								Enjoy the festivities with special animations throughout the
								site!
							</p>
						</div>
					</div>

					{/* Decorative elements */}
					<div className="flex justify-center gap-8 mb-6">
						<div className="text-center">
							<div className="text-4xl mb-2 animate-bounce-slow">🎆</div>
							<p className="text-xs text-gray-600 font-medium">Fireworks</p>
						</div>
						<div className="text-center">
							<div className="text-4xl mb-2 animate-bounce-slow animation-delay-300">
								🎨
							</div>
							<p className="text-xs text-gray-600 font-medium">Decorations</p>
						</div>
						<div className="text-center">
							<div className="text-4xl mb-2 animate-bounce-slow animation-delay-600">
								🎵
							</div>
							<p className="text-xs text-gray-600 font-medium">Sound Effects</p>
						</div>
					</div>

					{/* CTA Button */}
					<button
						onClick={handleClose}
						className="w-full py-4 px-8 rounded-xl font-bold text-white text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
						style={{
							background: `linear-gradient(135deg, ${activeFestival.colors.primary}, ${activeFestival.colors.accent})`,
						}}
					>
						Let&apos;s Celebrate! 🎉
					</button>

					<p className="text-center text-xs text-gray-500 mt-4">
						You can toggle animations anytime from the settings
					</p>
				</div>

				{/* Bottom decorative wave */}
				<div
					className="h-2"
					style={{
						background: `linear-gradient(90deg, ${activeFestival.colors.accent}, ${activeFestival.colors.secondary}, ${activeFestival.colors.accent})`,
					}}
				/>
			</div>
		</div>
	);
}
