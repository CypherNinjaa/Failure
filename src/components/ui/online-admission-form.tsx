"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
	User,
	Upload,
	FileText,
	CheckCircle,
	ArrowRight,
	ArrowLeft,
	Users,
	GraduationCap,
	AlertCircle,
	Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FormData {
	// Student Information
	studentName: string;
	dateOfBirth: string;
	gender: string;
	bloodGroup: string;
	admissionClass: string;
	previousSchool: string;
	// Parent Information
	fatherName: string;
	motherName: string;
	guardianPhone: string;
	guardianEmail: string;
	address: string;
	city: string;
	pincode: string;
	// Documents
	birthCertificate: File | null;
	transferCertificate: File | null;
	marksheet: File | null;
	photograph: File | null;
	// Additional
	medicalConditions: string;
	specialRequirements: string;
}

const initialFormData: FormData = {
	studentName: "",
	dateOfBirth: "",
	gender: "",
	bloodGroup: "",
	admissionClass: "",
	previousSchool: "",
	fatherName: "",
	motherName: "",
	guardianPhone: "",
	guardianEmail: "",
	address: "",
	city: "",
	pincode: "",
	birthCertificate: null,
	transferCertificate: null,
	marksheet: null,
	photograph: null,
	medicalConditions: "",
	specialRequirements: "",
};

export function OnlineAdmissionForm() {
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState<FormData>(initialFormData);
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const steps = [
		{
			id: 1,
			title: "Student Details",
			icon: User,
			description: "Basic student information",
		},
		{
			id: 2,
			title: "Parent Details",
			icon: Users,
			description: "Guardian information",
		},
		{
			id: 3,
			title: "Documents",
			icon: FileText,
			description: "Upload required documents",
		},
		{
			id: 4,
			title: "Review & Submit",
			icon: CheckCircle,
			description: "Confirm your application",
		},
	];

	const handleInputChange = (field: keyof FormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleFileUpload = (field: keyof FormData, file: File | null) => {
		setFormData((prev) => ({ ...prev, [field]: file }));
	};

	const handleNext = () => {
		if (currentStep < steps.length) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handlePrevious = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleSubmit = async () => {
		setIsLoading(true);
		// Simulate form submission
		await new Promise((resolve) => setTimeout(resolve, 2000));
		setIsLoading(false);
		setIsSubmitted(true);
	};

	const validateStep = (step: number): boolean => {
		switch (step) {
			case 1:
				return !!(
					formData.studentName &&
					formData.dateOfBirth &&
					formData.gender &&
					formData.admissionClass
				);
			case 2:
				return !!(
					formData.fatherName &&
					formData.motherName &&
					formData.guardianPhone &&
					formData.guardianEmail
				);
			case 3:
				return !!(formData.birthCertificate && formData.photograph);
			default:
				return true;
		}
	};

	// Skeleton loader for initial render
	if (!isMounted) {
		return (
			<section className="py-16 lg:py-24 bg-background">
				<div className="container">
					<div className="max-w-4xl mx-auto">
						<div className="animate-pulse space-y-8">
							<div className="h-12 bg-muted rounded-lg"></div>
							<div className="grid grid-cols-4 gap-4">
								{Array.from({ length: 4 }).map((_, i) => (
									<div key={i} className="h-20 bg-muted rounded-lg"></div>
								))}
							</div>
							<div className="h-96 bg-muted rounded-lg"></div>
						</div>
					</div>
				</div>
			</section>
		);
	}

	if (isSubmitted) {
		return (
			<section className="py-16 lg:py-24 bg-background">
				<div className="container">
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.8 }}
						className="max-w-2xl mx-auto text-center"
					>
						<Card className="border-2 border-green-500/20 bg-green-50 dark:bg-green-950/20">
							<CardContent className="p-8">
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ duration: 0.5, delay: 0.2 }}
									className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
								>
									<CheckCircle className="w-10 h-10 text-white" />
								</motion.div>

								<h2 className="text-3xl font-bold text-foreground mb-4">
									Application Submitted Successfully!
								</h2>

								<p className="text-lg text-muted-foreground mb-6">
									Thank you for your interest in Happy Child School. Your
									application has been received and is under review. We will
									contact you within 3-5 working days.
								</p>

								<div className="bg-accent/10 rounded-lg p-4 mb-6">
									<p className="text-sm font-medium text-foreground">
										Application ID:{" "}
										<span className="text-accent font-mono">HCS2024001234</span>
									</p>
									<p className="text-sm text-muted-foreground mt-1">
										Please save this ID for future reference
									</p>
								</div>

								<div className="flex flex-col sm:flex-row gap-3 justify-center">
									<Button variant="outline" className="flex items-center">
										<Download className="w-4 h-4 mr-2" />
										Download Receipt
									</Button>
									<Button
										onClick={() => {
											setIsSubmitted(false);
											setCurrentStep(1);
											setFormData(initialFormData);
										}}
										className="flex items-center"
									>
										Submit Another Application
									</Button>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</section>
		);
	}

	return (
		<section className="py-16 lg:py-24 bg-background">
			<div className="container">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-12"
				>
					<div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
						<GraduationCap className="w-4 h-4 mr-2" />
						<span className="text-sm font-medium">Online Application</span>
					</div>

					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
						<span className="text-gradient-primary">Admission</span> Application
						Form
					</h2>

					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Complete your admission application in just a few simple steps. All
						information is secure and encrypted.
					</p>
				</motion.div>

				<div className="max-w-4xl mx-auto">
					{/* Progress Steps */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className="flex justify-between items-center mb-12 relative"
					>
						{/* Progress Line */}
						<div className="absolute top-8 left-0 right-0 h-0.5 bg-muted z-0">
							<motion.div
								className="h-full bg-accent"
								initial={{ width: "0%" }}
								animate={{
									width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
								}}
								transition={{ duration: 0.5 }}
							/>
						</div>

						{steps.map((step, index) => {
							const StepIcon = step.icon;
							const isActive = currentStep === step.id;
							const isCompleted = currentStep > step.id;

							return (
								<motion.div
									key={step.id}
									className="flex flex-col items-center relative z-10"
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.3, delay: 0.1 * index }}
								>
									<div
										className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
											isCompleted
												? "bg-green-500 text-white"
												: isActive
												? "bg-accent text-accent-foreground"
												: "bg-muted text-muted-foreground"
										}`}
									>
										{isCompleted ? (
											<CheckCircle className="w-6 h-6" />
										) : (
											<StepIcon className="w-6 h-6" />
										)}
									</div>
									<div className="text-center">
										<h3
											className={`text-sm font-medium ${
												isActive ? "text-foreground" : "text-muted-foreground"
											}`}
										>
											{step.title}
										</h3>
										<p className="text-xs text-muted-foreground mt-1 hidden sm:block">
											{step.description}
										</p>
									</div>
								</motion.div>
							);
						})}
					</motion.div>

					{/* Form Content */}
					<motion.div
						key={currentStep}
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.5 }}
					>
						<Card className="shadow-lg">
							<CardHeader>
								<CardTitle className="text-2xl text-center">
									{steps[currentStep - 1].title}
								</CardTitle>
							</CardHeader>
							<CardContent className="p-8">
								{/* Step 1: Student Details */}
								{currentStep === 1 && (
									<div className="grid md:grid-cols-2 gap-6">
										<div className="space-y-4">
											<div>
												<label className="block text-sm font-medium text-foreground mb-2">
													Full Name *
												</label>
												<Input
													type="text"
													placeholder="Enter student's full name"
													value={formData.studentName}
													onChange={(e) =>
														handleInputChange("studentName", e.target.value)
													}
													className="w-full"
												/>
											</div>

											<div>
												<label className="block text-sm font-medium text-foreground mb-2">
													Date of Birth *
												</label>
												<Input
													type="date"
													value={formData.dateOfBirth}
													onChange={(e) =>
														handleInputChange("dateOfBirth", e.target.value)
													}
													className="w-full"
												/>
											</div>

											<div>
												<label className="block text-sm font-medium text-foreground mb-2">
													Gender *
												</label>
												<select
													value={formData.gender}
													onChange={(e) =>
														handleInputChange("gender", e.target.value)
													}
													className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
												>
													<option value="">Select Gender</option>
													<option value="male">Male</option>
													<option value="female">Female</option>
													<option value="other">Other</option>
												</select>
											</div>
										</div>

										<div className="space-y-4">
											<div>
												<label className="block text-sm font-medium text-foreground mb-2">
													Blood Group
												</label>
												<select
													value={formData.bloodGroup}
													onChange={(e) =>
														handleInputChange("bloodGroup", e.target.value)
													}
													className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
												>
													<option value="">Select Blood Group</option>
													<option value="A+">A+</option>
													<option value="A-">A-</option>
													<option value="B+">B+</option>
													<option value="B-">B-</option>
													<option value="AB+">AB+</option>
													<option value="AB-">AB-</option>
													<option value="O+">O+</option>
													<option value="O-">O-</option>
												</select>
											</div>

											<div>
												<label className="block text-sm font-medium text-foreground mb-2">
													Admission Class *
												</label>
												<select
													value={formData.admissionClass}
													onChange={(e) =>
														handleInputChange("admissionClass", e.target.value)
													}
													className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
												>
													<option value="">Select Class</option>
													<option value="nursery">Nursery</option>
													<option value="kg1">KG1</option>
													<option value="kg2">KG2</option>
													<option value="1">Class 1</option>
													<option value="2">Class 2</option>
													<option value="3">Class 3</option>
													<option value="4">Class 4</option>
													<option value="5">Class 5</option>
													<option value="6">Class 6</option>
													<option value="7">Class 7</option>
													<option value="8">Class 8</option>
													<option value="9">Class 9</option>
													<option value="10">Class 10</option>
												</select>
											</div>

											<div>
												<label className="block text-sm font-medium text-foreground mb-2">
													Previous School
												</label>
												<Input
													type="text"
													placeholder="Name of previous school (if any)"
													value={formData.previousSchool}
													onChange={(e) =>
														handleInputChange("previousSchool", e.target.value)
													}
													className="w-full"
												/>
											</div>
										</div>
									</div>
								)}

								{/* Step 2: Parent Details */}
								{currentStep === 2 && (
									<div className="grid md:grid-cols-2 gap-6">
										<div className="space-y-4">
											<div>
												<label className="block text-sm font-medium text-foreground mb-2">
													Father&apos;s Name *
												</label>
												<Input
													type="text"
													placeholder="Enter father's full name"
													value={formData.fatherName}
													onChange={(e) =>
														handleInputChange("fatherName", e.target.value)
													}
													className="w-full"
												/>
											</div>

											<div>
												<label className="block text-sm font-medium text-foreground mb-2">
													Mother&apos;s Name *
												</label>
												<Input
													type="text"
													placeholder="Enter mother's full name"
													value={formData.motherName}
													onChange={(e) =>
														handleInputChange("motherName", e.target.value)
													}
													className="w-full"
												/>
											</div>

											<div>
												<label className="block text-sm font-medium text-foreground mb-2">
													Guardian Phone *
												</label>
												<Input
													type="tel"
													placeholder="+91 XXXXX XXXXX"
													value={formData.guardianPhone}
													onChange={(e) =>
														handleInputChange("guardianPhone", e.target.value)
													}
													className="w-full"
												/>
											</div>

											<div>
												<label className="block text-sm font-medium text-foreground mb-2">
													Guardian Email *
												</label>
												<Input
													type="email"
													placeholder="guardian@example.com"
													value={formData.guardianEmail}
													onChange={(e) =>
														handleInputChange("guardianEmail", e.target.value)
													}
													className="w-full"
												/>
											</div>
										</div>

										<div className="space-y-4">
											<div>
												<label className="block text-sm font-medium text-foreground mb-2">
													Address *
												</label>
												<textarea
													placeholder="Enter complete address"
													value={formData.address}
													onChange={(e) =>
														handleInputChange("address", e.target.value)
													}
													className="w-full p-3 border border-border rounded-lg bg-background text-foreground h-24 resize-none"
												/>
											</div>

											<div className="flex space-x-4">
												<div className="flex-1">
													<label className="block text-sm font-medium text-foreground mb-2">
														City *
													</label>
													<Input
														type="text"
														placeholder="City"
														value={formData.city}
														onChange={(e) =>
															handleInputChange("city", e.target.value)
														}
														className="w-full"
													/>
												</div>

												<div className="flex-1">
													<label className="block text-sm font-medium text-foreground mb-2">
														PIN Code *
													</label>
													<Input
														type="text"
														placeholder="PIN Code"
														value={formData.pincode}
														onChange={(e) =>
															handleInputChange("pincode", e.target.value)
														}
														className="w-full"
													/>
												</div>
											</div>
										</div>
									</div>
								)}

								{/* Step 3: Documents */}
								{currentStep === 3 && (
									<div className="space-y-6">
										<div className="grid md:grid-cols-2 gap-6">
											{[
												{
													key: "birthCertificate",
													label: "Birth Certificate",
													required: true,
												},
												{
													key: "transferCertificate",
													label: "Transfer Certificate",
													required: false,
												},
												{
													key: "marksheet",
													label: "Previous Marksheet",
													required: false,
												},
												{
													key: "photograph",
													label: "Passport Size Photo",
													required: true,
												},
											].map((doc) => (
												<div key={doc.key} className="space-y-2">
													<label className="block text-sm font-medium text-foreground">
														{doc.label} {doc.required && "*"}
													</label>
													<div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition-colors duration-300">
														<Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
														<p className="text-sm text-muted-foreground mb-2">
															Click to upload or drag and drop
														</p>
														<input
															type="file"
															accept=".pdf,.jpg,.jpeg,.png"
															onChange={(e) =>
																handleFileUpload(
																	doc.key as keyof FormData,
																	e.target.files?.[0] || null
																)
															}
															className="hidden"
															id={doc.key}
														/>
														<label htmlFor={doc.key} className="cursor-pointer">
															<Button type="button" variant="outline" size="sm">
																Choose File
															</Button>
														</label>
														{formData[doc.key as keyof FormData] && (
															<p className="text-xs text-green-600 mt-2">
																✓ File uploaded successfully
															</p>
														)}
													</div>
												</div>
											))}
										</div>

										<div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
											<div className="flex items-start">
												<AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
												<div>
													<h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
														Document Requirements
													</h4>
													<ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
														<li>
															• All documents should be in PDF, JPG, or PNG
															format
														</li>
														<li>• Maximum file size: 5MB per document</li>
														<li>• Documents should be clear and legible</li>
														<li>
															• Birth Certificate and Photograph are mandatory
														</li>
													</ul>
												</div>
											</div>
										</div>
									</div>
								)}

								{/* Step 4: Review & Submit */}
								{currentStep === 4 && (
									<div className="space-y-6">
										<div className="bg-muted/30 rounded-lg p-6">
											<h3 className="text-lg font-semibold text-foreground mb-4">
												Application Summary
											</h3>

											<div className="grid md:grid-cols-2 gap-6 text-sm">
												<div>
													<h4 className="font-medium text-foreground mb-2">
														Student Information
													</h4>
													<div className="space-y-1 text-muted-foreground">
														<p>Name: {formData.studentName}</p>
														<p>Date of Birth: {formData.dateOfBirth}</p>
														<p>Gender: {formData.gender}</p>
														<p>Class: {formData.admissionClass}</p>
													</div>
												</div>

												<div>
													<h4 className="font-medium text-foreground mb-2">
														Parent Information
													</h4>
													<div className="space-y-1 text-muted-foreground">
														<p>Father: {formData.fatherName}</p>
														<p>Mother: {formData.motherName}</p>
														<p>Phone: {formData.guardianPhone}</p>
														<p>Email: {formData.guardianEmail}</p>
													</div>
												</div>
											</div>
										</div>

										<div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
											<div className="flex items-start">
												<CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
												<div>
													<h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
														Ready to Submit
													</h4>
													<p className="text-xs text-green-700 dark:text-green-300">
														Please review all information carefully before
														submitting. You will receive a confirmation email
														after submission.
													</p>
												</div>
											</div>
										</div>
									</div>
								)}

								{/* Navigation Buttons */}
								<div className="flex justify-between mt-8 pt-6 border-t border-border">
									<Button
										variant="outline"
										onClick={handlePrevious}
										disabled={currentStep === 1}
										className="flex items-center"
									>
										<ArrowLeft className="w-4 h-4 mr-2" />
										Previous
									</Button>

									{currentStep === steps.length ? (
										<Button
											onClick={handleSubmit}
											disabled={isLoading || !validateStep(currentStep)}
											className="flex items-center bg-green-600 hover:bg-green-700"
										>
											{isLoading ? (
												<>
													<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
													Submitting...
												</>
											) : (
												<>
													Submit Application
													<CheckCircle className="w-4 h-4 ml-2" />
												</>
											)}
										</Button>
									) : (
										<Button
											onClick={handleNext}
											disabled={!validateStep(currentStep)}
											className="flex items-center"
										>
											Next
											<ArrowRight className="w-4 h-4 ml-2" />
										</Button>
									)}
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
