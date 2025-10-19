"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
	CreditCard,
	DollarSign,
	CheckCircle,
	AlertCircle,
	Calculator,
	Calendar,
	BookOpen,
	Bus,
	Utensils,
	Shield,
	Gift,
	Info,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FeeBreakdown {
	class: string;
	admissionFee: number;
	tuitionFee: number;
	developmentFee: number;
	examFee: number;
	activityFee: number;
	labFee?: number;
	totalAnnualFee: number;
}

interface AdditionalFees {
	name: string;
	amount: number;
	description: string;
	optional: boolean;
	icon: React.ComponentType<{ className?: string }>;
}

const feeStructure: FeeBreakdown[] = [
	{
		class: "Nursery - UKG",
		admissionFee: 5000,
		tuitionFee: 12000,
		developmentFee: 2000,
		examFee: 500,
		activityFee: 1500,
		totalAnnualFee: 21000,
	},
	{
		class: "Class 1 - 5",
		admissionFee: 8000,
		tuitionFee: 18000,
		developmentFee: 3000,
		examFee: 1000,
		activityFee: 2000,
		labFee: 1000,
		totalAnnualFee: 33000,
	},
	{
		class: "Class 6 - 8",
		admissionFee: 10000,
		tuitionFee: 22000,
		developmentFee: 4000,
		examFee: 1500,
		activityFee: 2500,
		labFee: 2000,
		totalAnnualFee: 42000,
	},
	{
		class: "Class 9 - 10",
		admissionFee: 12000,
		tuitionFee: 28000,
		developmentFee: 5000,
		examFee: 2000,
		activityFee: 3000,
		labFee: 3000,
		totalAnnualFee: 53000,
	},
];

const additionalFees: AdditionalFees[] = [
	{
		name: "Transport Fee",
		amount: 8000,
		description: "Annual bus transportation (both ways)",
		optional: true,
		icon: Bus,
	},
	{
		name: "Lunch Program",
		amount: 6000,
		description: "Nutritious daily meals",
		optional: true,
		icon: Utensils,
	},
	{
		name: "Insurance",
		amount: 500,
		description: "Student accident insurance",
		optional: false,
		icon: Shield,
	},
	{
		name: "Uniform & Books",
		amount: 4000,
		description: "Complete uniform set and textbooks",
		optional: false,
		icon: BookOpen,
	},
];

export function FeeStructure() {
	const [isMounted, setIsMounted] = useState(false);
	const [selectedClass, setSelectedClass] = useState<string>("Class 1 - 5");
	const [includeAdditional, setIncludeAdditional] = useState<{
		[key: string]: boolean;
	}>({
		"Transport Fee": false,
		"Lunch Program": false,
		Insurance: true,
		"Uniform & Books": true,
	});

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Prevent hydration mismatch
	if (!isMounted) {
		return (
			<section className="py-16 lg:py-24 bg-muted/30">
				<div className="container">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
							Fee Structure
						</h2>
					</div>
				</div>
			</section>
		);
	}

	const selectedFeeData = feeStructure.find(
		(fee) => fee.class === selectedClass
	);

	const calculateTotal = () => {
		if (!selectedFeeData) return 0;
		let total = selectedFeeData.totalAnnualFee;

		additionalFees.forEach((fee) => {
			if (includeAdditional[fee.name]) {
				total += fee.amount;
			}
		});

		return total;
	};

	const toggleAdditionalFee = (feeName: string) => {
		setIncludeAdditional((prev) => ({
			...prev,
			[feeName]: !prev[feeName],
		}));
	};

	return (
		<section className="py-16 lg:py-24 bg-muted/30">
			<div className="container">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-12"
				>
					<div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
						<DollarSign className="w-4 h-4 mr-2" />
						<span className="text-sm font-medium">Transparent Pricing</span>
					</div>

					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
						<span className="text-gradient-primary">Fee</span> Structure
					</h2>

					<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
						Our fee structure is transparent and competitive, designed to
						provide excellent value for world-class education and facilities.
					</p>
				</motion.div>

				{/* Class Selection */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="flex flex-wrap justify-center gap-3 mb-12"
				>
					{feeStructure.map((fee, index) => (
						<motion.button
							key={fee.class}
							onClick={() => setSelectedClass(fee.class)}
							className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
								selectedClass === fee.class
									? "bg-accent text-accent-foreground shadow-lg scale-105"
									: "bg-card text-foreground hover:bg-muted border border-border"
							}`}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: 0.1 * index }}
						>
							{fee.class}
						</motion.button>
					))}
				</motion.div>

				{/* Fee Breakdown */}
				{selectedFeeData && (
					<motion.div
						key={selectedClass}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="grid lg:grid-cols-3 gap-8 mb-12"
					>
						{/* Main Fee Structure */}
						<Card className="lg:col-span-2">
							<CardContent className="p-6">
								<h3 className="text-xl font-bold text-foreground mb-6 flex items-center">
									<Calculator className="w-5 h-5 mr-2 text-accent" />
									{selectedClass} - Annual Fee Breakdown
								</h3>

								<div className="space-y-4">
									<div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
										<span className="font-medium">
											Admission Fee (One-time)
										</span>
										<span className="font-bold text-accent">
											₹{selectedFeeData.admissionFee.toLocaleString()}
										</span>
									</div>

									<div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
										<span className="font-medium">Tuition Fee</span>
										<span className="font-bold">
											₹{selectedFeeData.tuitionFee.toLocaleString()}
										</span>
									</div>

									<div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
										<span className="font-medium">Development Fee</span>
										<span className="font-bold">
											₹{selectedFeeData.developmentFee.toLocaleString()}
										</span>
									</div>

									<div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
										<span className="font-medium">Exam Fee</span>
										<span className="font-bold">
											₹{selectedFeeData.examFee.toLocaleString()}
										</span>
									</div>

									<div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
										<span className="font-medium">Activity Fee</span>
										<span className="font-bold">
											₹{selectedFeeData.activityFee.toLocaleString()}
										</span>
									</div>

									{selectedFeeData.labFee && (
										<div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
											<span className="font-medium">Lab Fee</span>
											<span className="font-bold">
												₹{selectedFeeData.labFee.toLocaleString()}
											</span>
										</div>
									)}

									<div className="border-t pt-4 mt-4">
										<div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
											<span className="font-bold text-lg">
												Annual Fee Total
											</span>
											<span className="font-bold text-xl text-accent">
												₹{selectedFeeData.totalAnnualFee.toLocaleString()}
											</span>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Fee Calculator */}
						<Card>
							<CardContent className="p-6">
								<h3 className="text-xl font-bold text-foreground mb-6 flex items-center">
									<CreditCard className="w-5 h-5 mr-2 text-accent" />
									Fee Calculator
								</h3>

								<div className="space-y-4 mb-6">
									<div className="p-3 bg-accent/10 rounded-lg">
										<div className="font-medium text-accent mb-1">
											Base Annual Fee
										</div>
										<div className="text-lg font-bold">
											₹{selectedFeeData.totalAnnualFee.toLocaleString()}
										</div>
									</div>

									{/* Additional Fees */}
									<div>
										<h4 className="font-semibold mb-3">Additional Services</h4>
										{additionalFees.map((fee) => {
											const FeeIcon = fee.icon;
											return (
												<div key={fee.name} className="mb-3">
													<label className="flex items-center space-x-3 cursor-pointer">
														<input
															type="checkbox"
															checked={includeAdditional[fee.name] || false}
															onChange={() => toggleAdditionalFee(fee.name)}
															disabled={!fee.optional}
															className="rounded border-gray-300 text-accent focus:ring-accent"
														/>
														<div className="flex-1">
															<div className="flex items-center">
																<FeeIcon className="w-4 h-4 mr-2 text-muted-foreground" />
																<span className="font-medium">{fee.name}</span>
																{!fee.optional && (
																	<span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
																		Required
																	</span>
																)}
															</div>
															<div className="text-sm text-muted-foreground">
																{fee.description}
															</div>
														</div>
														<span className="font-bold">
															₹{fee.amount.toLocaleString()}
														</span>
													</label>
												</div>
											);
										})}
									</div>
								</div>

								<div className="border-t pt-4">
									<div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
										<span className="font-bold text-green-800 dark:text-green-200">
											Total Annual Cost
										</span>
										<span className="font-bold text-xl text-green-600">
											₹{calculateTotal().toLocaleString()}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				)}

				{/* Payment Information */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
				>
					<Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
						<CardContent className="p-6 text-center">
							<Calendar className="w-8 h-8 text-blue-600 mx-auto mb-3" />
							<h3 className="font-bold text-foreground mb-2">Payment Terms</h3>
							<p className="text-sm text-muted-foreground mb-2">
								Quarterly installments available
							</p>
							<div className="text-blue-600 font-medium">Flexible Options</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
						<CardContent className="p-6 text-center">
							<Gift className="w-8 h-8 text-green-600 mx-auto mb-3" />
							<h3 className="font-bold text-foreground mb-2">
								Early Bird Discount
							</h3>
							<p className="text-sm text-muted-foreground mb-2">
								5% discount on full year payment
							</p>
							<div className="text-green-600 font-medium">Save More</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
						<CardContent className="p-6 text-center">
							<CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-3" />
							<h3 className="font-bold text-foreground mb-2">
								Scholarship Program
							</h3>
							<p className="text-sm text-muted-foreground mb-2">
								Merit-based fee concessions available
							</p>
							<div className="text-purple-600 font-medium">Up to 50%</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Important Notes */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="grid md:grid-cols-2 gap-6 mb-12"
				>
					<Card className="border-yellow-200 dark:border-yellow-800">
						<CardContent className="p-6">
							<div className="flex items-start space-x-3">
								<AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
								<div>
									<h3 className="font-bold text-foreground mb-2">
										Payment Policies
									</h3>
									<ul className="text-sm text-muted-foreground space-y-1">
										<li>• Admission fee is non-refundable</li>
										<li>• Late payment charges apply after due date</li>
										<li>• No admission without fee clearance</li>
										<li>• Refund policy as per school guidelines</li>
									</ul>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="border-blue-200 dark:border-blue-800">
						<CardContent className="p-6">
							<div className="flex items-start space-x-3">
								<Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
								<div>
									<h3 className="font-bold text-foreground mb-2">
										Payment Methods
									</h3>
									<ul className="text-sm text-muted-foreground space-y-1">
										<li>• Online payment gateway</li>
										<li>• Bank transfer/NEFT</li>
										<li>• Demand Draft</li>
										<li>• Cash (at school office only)</li>
									</ul>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Call to Action */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center"
				>
					<Card className="max-w-2xl mx-auto">
						<CardContent className="p-8 bg-gradient-to-r from-accent/5 to-secondary/5">
							<h3 className="text-2xl font-bold text-foreground mb-4">
								Questions About Fees?
							</h3>
							<p className="text-muted-foreground mb-6">
								Our admission counselors are here to help you understand our fee
								structure and available payment options. Contact us for
								personalized assistance.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button
									size="lg"
									className="bg-accent hover:bg-accent/90 text-accent-foreground"
								>
									Schedule Fee Consultation
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
								>
									Download Fee Structure
								</Button>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</section>
	);
}
