"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, ExternalLink, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ContactMap() {
	const [isLoading, setIsLoading] = useState(true);

	// School location details
	const schoolLocation = {
		name: "Happy Child School",
		address: "123 Education Street, New Delhi, India 110001",
		coordinates: { lat: 28.6139, lng: 77.209 }, // Delhi coordinates
		googleMapsUrl: "https://goo.gl/maps/example",
		directions: "https://goo.gl/maps/directions-example",
	};

	const handleMapLoad = () => {
		setIsLoading(false);
	};

	const handleGetDirections = () => {
		window.open(schoolLocation.directions, "_blank");
	};

	const handleViewOnGoogleMaps = () => {
		window.open(schoolLocation.googleMapsUrl, "_blank");
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6 }}
			className="space-y-6"
		>
			{/* Map Header */}
			<Card className="p-6 bg-card border-border">
				<div className="flex items-center mb-4">
					<div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center mr-4">
						<MapPin className="w-6 h-6 text-white" />
					</div>
					<div>
						<h3 className="text-xl font-bold text-foreground">Our Location</h3>
						<p className="text-muted-foreground">Visit our beautiful campus</p>
					</div>
				</div>

				<div className="space-y-2 text-sm">
					<p className="text-foreground font-medium">{schoolLocation.name}</p>
					<p className="text-muted-foreground">{schoolLocation.address}</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-3 mt-4">
					<Button
						onClick={handleGetDirections}
						variant="outline"
						className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
					>
						<Navigation className="w-4 h-4 mr-2" />
						Get Directions
					</Button>
					<Button
						onClick={handleViewOnGoogleMaps}
						variant="outline"
						className="flex-1"
					>
						<ExternalLink className="w-4 h-4 mr-2" />
						View on Google Maps
					</Button>
				</div>
			</Card>

			{/* Interactive Map */}
			<Card className="overflow-hidden bg-card border-border">
				<div className="relative h-96 w-full">
					{isLoading && (
						<div className="absolute inset-0 flex items-center justify-center bg-muted">
							<div className="text-center">
								<Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-primary" />
								<p className="text-sm text-muted-foreground">Loading map...</p>
							</div>
						</div>
					)}

					{/* Embedded Google Map */}
					<iframe
						src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.2416097784157!2d77.20689731508227!3d28.613938982422853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd368f3e0091%3A0x8b8b8b8b8b8b8b8b!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin`}
						width="100%"
						height="100%"
						style={{ border: 0 }}
						allowFullScreen
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
						onLoad={handleMapLoad}
						className="w-full h-full"
						title="Happy Child School Location"
					/>
				</div>
			</Card>

			{/* Additional Location Info */}
			<Card className="p-6 bg-card border-border">
				<h4 className="text-lg font-semibold text-foreground mb-4">
					Getting Here
				</h4>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<h5 className="font-medium text-foreground mb-2">By Metro</h5>
						<ul className="text-sm text-muted-foreground space-y-1">
							<li>• Nearest Metro: Rajiv Chowk (5 min walk)</li>
							<li>• Central Secretariat (8 min walk)</li>
							<li>• Both Blue & Yellow Line connectivity</li>
						</ul>
					</div>

					<div>
						<h5 className="font-medium text-foreground mb-2">By Bus</h5>
						<ul className="text-sm text-muted-foreground space-y-1">
							<li>• Bus Stop: Education Street (2 min walk)</li>
							<li>• Routes: 101, 102, 205, 301</li>
							<li>• DTC & Private buses available</li>
						</ul>
					</div>

					<div>
						<h5 className="font-medium text-foreground mb-2">By Car</h5>
						<ul className="text-sm text-muted-foreground space-y-1">
							<li>• Free parking available on campus</li>
							<li>• 24/7 security & CCTV monitoring</li>
							<li>• Valet parking for special events</li>
						</ul>
					</div>

					<div>
						<h5 className="font-medium text-foreground mb-2">Landmarks</h5>
						<ul className="text-sm text-muted-foreground space-y-1">
							<li>• Near Connaught Place</li>
							<li>• Opposite Central Park</li>
							<li>• Next to City Hospital</li>
						</ul>
					</div>
				</div>
			</Card>
		</motion.div>
	);
}
