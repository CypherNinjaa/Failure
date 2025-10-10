"use client";

import { useEffect } from "react";

const Confetti = () => {
	useEffect(() => {
		// Simple confetti animation using CSS
		const duration = 3000;
		const animationEnd = Date.now() + duration;
		const colors = ["#bb0000", "#ffffff", "#00bb00", "#0000bb", "#ff00ff"];

		function randomInRange(min: number, max: number) {
			return Math.random() * (max - min) + min;
		}

		const interval = setInterval(() => {
			const timeLeft = animationEnd - Date.now();

			if (timeLeft <= 0) {
				return clearInterval(interval);
			}

			const particleCount = 3;

			for (let i = 0; i < particleCount; i++) {
				const particle = document.createElement("div");
				particle.style.position = "fixed";
				particle.style.width = "10px";
				particle.style.height = "10px";
				particle.style.backgroundColor =
					colors[Math.floor(randomInRange(0, colors.length))];
				particle.style.left = randomInRange(0, window.innerWidth) + "px";
				particle.style.top = "-20px";
				particle.style.opacity = "1";
				particle.style.pointerEvents = "none";
				particle.style.zIndex = "9999";
				particle.style.borderRadius = "50%";

				document.body.appendChild(particle);

				const animation = particle.animate(
					[
						{
							transform: `translate(0, 0) rotate(0deg)`,
							opacity: 1,
						},
						{
							transform: `translate(${randomInRange(-100, 100)}px, ${
								window.innerHeight + 20
							}px) rotate(${randomInRange(0, 720)}deg)`,
							opacity: 0,
						},
					],
					{
						duration: randomInRange(2000, 4000),
						easing: "cubic-bezier(0, 0.5, 0.5, 1)",
					}
				);

				animation.onfinish = () => {
					particle.remove();
				};
			}
		}, 50);

		return () => clearInterval(interval);
	}, []);

	return null;
};

export default Confetti;
