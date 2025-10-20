/**
 * Festival Fireworks Component
 * Canvas-based fireworks animation with sound effects
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { useFestival } from "@/hooks/useFestival";

interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	alpha: number;
	color: string;
	size: number;
	gravity: number;
}

interface Firework {
	x: number;
	y: number;
	targetY: number;
	vx: number;
	vy: number;
	color: string;
	exploded: boolean;
	particles: Particle[];
}

export default function FestivalFireworks() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationRef = useRef<number>();
	const fireworksRef = useRef<Firework[]>([]);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const { activeFestival, isActive, animationsEnabled } = useFestival();
	const [soundEnabled, setSoundEnabled] = useState(false);

	useEffect(() => {
		if (!isActive || !animationsEnabled || !canvasRef.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Set canvas size
		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};
		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		// Festival colors
		const colors = activeFestival
			? [
					activeFestival.colors.primary,
					activeFestival.colors.secondary,
					activeFestival.colors.accent,
					"#FFD700",
					"#FFA500",
					"#FF6600",
			  ]
			: ["#FF9933", "#FFD700", "#FF6600"];

		// Create firework
		const createFirework = () => {
			const x = Math.random() * canvas.width;
			const targetY = Math.random() * (canvas.height * 0.3) + 50;
			const color = colors[Math.floor(Math.random() * colors.length)];

			fireworksRef.current.push({
				x,
				y: canvas.height,
				targetY,
				vx: (Math.random() - 0.5) * 2,
				vy: -8 - Math.random() * 4,
				color,
				exploded: false,
				particles: [],
			});
		};

		// Create particles for explosion
		const createParticles = (firework: Firework) => {
			const particleCount = 30 + Math.random() * 20;
			for (let i = 0; i < particleCount; i++) {
				const angle = (Math.PI * 2 * i) / particleCount;
				const velocity = 2 + Math.random() * 3;
				firework.particles.push({
					x: firework.x,
					y: firework.y,
					vx: Math.cos(angle) * velocity,
					vy: Math.sin(angle) * velocity,
					alpha: 1,
					color: firework.color,
					size: 2 + Math.random() * 2,
					gravity: 0.05 + Math.random() * 0.05,
				});
			}

			// Play sound if enabled
			if (soundEnabled && audioRef.current) {
				audioRef.current.currentTime = 0;
				audioRef.current.play().catch(() => {
					// Ignore audio play errors
				});
			}
		};

		// Animation loop
		const animate = () => {
			ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Update and draw fireworks
			fireworksRef.current = fireworksRef.current.filter((firework) => {
				if (!firework.exploded) {
					// Update position
					firework.x += firework.vx;
					firework.y += firework.vy;
					firework.vy += 0.1; // Gravity

					// Draw trail
					ctx.beginPath();
					ctx.arc(firework.x, firework.y, 3, 0, Math.PI * 2);
					ctx.fillStyle = firework.color;
					ctx.fill();

					// Check if reached target
					if (firework.y <= firework.targetY) {
						firework.exploded = true;
						createParticles(firework);
					}

					return true;
				} else {
					// Update and draw particles
					let particlesAlive = false;

					firework.particles.forEach((particle) => {
						particle.x += particle.vx;
						particle.y += particle.vy;
						particle.vy += particle.gravity;
						particle.alpha -= 0.01;

						if (particle.alpha > 0) {
							particlesAlive = true;
							ctx.save();
							ctx.globalAlpha = particle.alpha;
							ctx.beginPath();
							ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
							ctx.fillStyle = particle.color;
							ctx.fill();
							ctx.restore();
						}
					});

					return particlesAlive;
				}
			});

			// Create new firework periodically
			if (Math.random() < 0.03) {
				createFirework();
			}

			animationRef.current = requestAnimationFrame(animate);
		};

		animate();

		// Cleanup
		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
			window.removeEventListener("resize", resizeCanvas);
		};
	}, [isActive, animationsEnabled, activeFestival, soundEnabled]);

	// Load sound
	useEffect(() => {
		if (typeof window !== "undefined") {
			audioRef.current = new Audio("/sounds/firework.wav");
			audioRef.current.volume = 0.3;
		}
	}, []);

	if (!isActive || !animationsEnabled) return null;

	return (
		<>
			<canvas
				ref={canvasRef}
				className="fixed inset-0 pointer-events-none z-[9995]"
				style={{ mixBlendMode: "screen" }}
			/>

			{/* Sound toggle button */}
			<button
				onClick={() => setSoundEnabled(!soundEnabled)}
				className="fixed bottom-6 right-6 z-[9999] bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
				aria-label="Toggle firework sounds"
			>
				{soundEnabled ? (
					<span className="text-xl">🔊</span>
				) : (
					<span className="text-xl">🔇</span>
				)}
			</button>
		</>
	);
}
