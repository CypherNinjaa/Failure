"use client";

import { useEffect, useState } from "react";

interface Location {
	id: number;
	name: string;
	latitude: number;
	longitude: number;
	radius: number;
	isActive: boolean;
}

interface LocationVerificationProps {
	onLocationVerified: (
		locationId: number,
		coords: GeolocationCoordinates
	) => void;
	onLocationFailed: (reason: string) => void;
}

const LocationVerification = ({
	onLocationVerified,
	onLocationFailed,
}: LocationVerificationProps) => {
	const [checking, setChecking] = useState(true);
	const [currentDistance, setCurrentDistance] = useState<number | null>(null);
	const [nearestLocation, setNearestLocation] = useState<string>("");

	useEffect(() => {
		checkLocation();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Calculate distance between two coordinates using Haversine formula
	const calculateDistance = (
		lat1: number,
		lon1: number,
		lat2: number,
		lon2: number
	): number => {
		const R = 6371e3; // Earth's radius in meters
		const φ1 = (lat1 * Math.PI) / 180;
		const φ2 = (lat2 * Math.PI) / 180;
		const Δφ = ((lat2 - lat1) * Math.PI) / 180;
		const Δλ = ((lon2 - lon1) * Math.PI) / 180;

		const a =
			Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
			Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return R * c; // Distance in meters
	};

	const checkLocation = async () => {
		try {
			// Check if geolocation is available
			if (!navigator.geolocation) {
				onLocationFailed(
					"Geolocation is not supported by your browser. Please use a modern browser."
				);
				return;
			}

			// Get current position
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					const userLat = position.coords.latitude;
					const userLon = position.coords.longitude;

					try {
						// Fetch allowed locations from server
						const response = await fetch("/api/locations/active");
						const locations: Location[] = await response.json();

						if (locations.length === 0) {
							onLocationFailed(
								"No active locations configured. Please contact admin."
							);
							return;
						}

						// Find nearest location within radius
						let nearestValidLocation: Location | null = null;
						let minDistance = Infinity;

						for (const location of locations) {
							const distance = calculateDistance(
								userLat,
								userLon,
								location.latitude,
								location.longitude
							);

							if (distance < minDistance) {
								minDistance = distance;
								nearestValidLocation = location;
								setNearestLocation(location.name);
								setCurrentDistance(Math.round(distance));
							}

							// Check if within radius
							if (distance <= location.radius && location.isActive) {
								setChecking(false);
								onLocationVerified(location.id, position.coords);
								return;
							}
						}

						// No valid location found
						if (nearestValidLocation) {
							const distanceKm = (minDistance / 1000).toFixed(2);
							onLocationFailed(
								`You are ${distanceKm} km away from ${nearestValidLocation.name}. Please move closer to mark attendance.`
							);
						} else {
							onLocationFailed(
								"You are not within any allowed location radius. Please contact admin."
							);
						}
					} catch (error) {
						console.error("Error fetching locations:", error);
						onLocationFailed(
							"Failed to fetch allowed locations. Please try again."
						);
					}
				},
				(error) => {
					let errorMessage = "";
					switch (error.code) {
						case error.PERMISSION_DENIED:
							errorMessage =
								"Location permission denied. Please enable location access in your browser settings.";
							break;
						case error.POSITION_UNAVAILABLE:
							errorMessage =
								"Location information is unavailable. Please check your device settings.";
							break;
						case error.TIMEOUT:
							errorMessage = "Location request timed out. Please try again.";
							break;
						default:
							errorMessage =
								"An unknown error occurred while getting location.";
							break;
					}
					onLocationFailed(errorMessage);
				},
				{
					enableHighAccuracy: true,
					timeout: 10000,
					maximumAge: 0,
				}
			);
		} catch (error) {
			console.error("Location check error:", error);
			onLocationFailed(
				"Failed to verify location. Please ensure location services are enabled."
			);
		}
	};

	if (!checking) return null;

	return (
		<div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 flex items-center justify-center z-10 rounded-lg">
			<div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full mx-4">
				<div className="text-center">
					{/* Icon */}
					<div className="mb-4 flex justify-center">
						<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
							<svg
								className="w-8 h-8 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
						</div>
					</div>

					{/* Text */}
					<h3 className="text-2xl font-bold text-gray-800 mb-2">
						Verifying Location
					</h3>
					<p className="text-gray-600 mb-4">
						Checking if you are within an allowed location...
					</p>

					{currentDistance !== null && nearestLocation && (
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
							<p className="text-sm text-blue-800">
								Distance to {nearestLocation}:{" "}
								<span className="font-semibold">{currentDistance}m</span>
							</p>
						</div>
					)}

					{/* Spinner */}
					<div className="flex justify-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
					</div>

					<p className="text-xs text-gray-500 mt-4">
						Please ensure location services are enabled
					</p>
				</div>
			</div>
		</div>
	);
};

export default LocationVerification;
