import { ModernHeader } from "@/components/ui/modern-header";
import { ModernFooter } from "@/components/ui/modern-footer";
import { Shield, Lock, Eye, Database, UserCheck, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
	return (
		<div className="min-h-screen bg-background">
			<ModernHeader />

			<main className="pt-20">
				{/* Hero Section */}
				<section className="bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 py-20">
					<div className="container mx-auto px-4">
						<div className="max-w-4xl mx-auto text-center text-white">
							<div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6">
								<Shield className="w-10 h-10" />
							</div>
							<h1 className="text-4xl md:text-6xl font-bold mb-6">
								Privacy Policy
							</h1>
							<p className="text-xl text-white/90">
								Your privacy is important to us. Learn how we protect your
								personal information.
							</p>
							<p className="text-sm text-white/70 mt-4">
								Last Updated: October 24, 2025
							</p>
						</div>
					</div>
				</section>

				{/* Content Section */}
				<section className="py-16 lg:py-24">
					<div className="container mx-auto px-4">
						<div className="max-w-4xl mx-auto">
							{/* Introduction */}
							<div className="mb-12">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
										<FileText className="w-6 h-6 text-blue-600" />
									</div>
									<h2 className="text-3xl font-bold text-foreground">
										Introduction
									</h2>
								</div>
								<p className="text-gray-600 leading-relaxed">
									Happy Child School (&quot;we,&quot; &quot;our,&quot; or
									&quot;us&quot;) is committed to protecting the privacy and
									security of personal information provided by students,
									parents, teachers, and visitors to our website. This Privacy
									Policy explains how we collect, use, disclose, and safeguard
									your information when you visit our website or use our
									services.
								</p>
							</div>

							{/* Information We Collect */}
							<div className="mb-12">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
										<Database className="w-6 h-6 text-purple-600" />
									</div>
									<h2 className="text-3xl font-bold text-foreground">
										Information We Collect
									</h2>
								</div>
								<div className="space-y-6">
									<div>
										<h3 className="text-xl font-semibold text-foreground mb-3">
											Personal Information
										</h3>
										<ul className="list-disc list-inside space-y-2 text-gray-600">
											<li>
												Student information: Name, date of birth, class, parent
												contact details
											</li>
											<li>
												Parent/Guardian information: Name, email address, phone
												number, address
											</li>
											<li>
												Teacher/Staff information: Name, email, phone number,
												employment details
											</li>
											<li>
												Login credentials: Username, encrypted password for
												portal access
											</li>
											<li>
												Academic records: Grades, attendance, exam results,
												assignments
											</li>
										</ul>
									</div>

									<div>
										<h3 className="text-xl font-semibold text-foreground mb-3">
											Technical Information
										</h3>
										<ul className="list-disc list-inside space-y-2 text-gray-600">
											<li>IP address, browser type, and operating system</li>
											<li>
												Pages visited, time spent on pages, and click data
											</li>
											<li>Device information and unique device identifiers</li>
											<li>Cookies and similar tracking technologies</li>
										</ul>
									</div>

									<div>
										<h3 className="text-xl font-semibold text-foreground mb-3">
											Media and Content
										</h3>
										<ul className="list-disc list-inside space-y-2 text-gray-600">
											<li>
												Photos and videos from school events and activities
											</li>
											<li>Testimonials and feedback submitted voluntarily</li>
											<li>
												Gallery images and videos uploaded by media coordinators
											</li>
										</ul>
									</div>
								</div>
							</div>

							{/* How We Use Information */}
							<div className="mb-12">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
										<UserCheck className="w-6 h-6 text-green-600" />
									</div>
									<h2 className="text-3xl font-bold text-foreground">
										How We Use Your Information
									</h2>
								</div>
								<div className="space-y-3 text-gray-600">
									<p>
										We use the collected information for the following purposes:
									</p>
									<ul className="list-disc list-inside space-y-2 ml-4">
										<li>
											To provide educational services and manage student records
										</li>
										<li>
											To communicate with parents, students, and staff regarding
											school activities
										</li>
										<li>
											To process admissions, fee payments, and maintain
											financial records
										</li>
										<li>
											To send notifications, announcements, and updates about
											school events
										</li>
										<li>
											To improve our website functionality and user experience
										</li>
										<li>To ensure the safety and security of our students</li>
										<li>
											To comply with legal obligations and regulatory
											requirements
										</li>
										<li>
											To showcase school achievements and events in our gallery
											(with appropriate consent)
										</li>
									</ul>
								</div>
							</div>

							{/* Information Sharing */}
							<div className="mb-12">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
										<Eye className="w-6 h-6 text-orange-600" />
									</div>
									<h2 className="text-3xl font-bold text-foreground">
										Information Sharing and Disclosure
									</h2>
								</div>
								<div className="space-y-4 text-gray-600">
									<p>
										We do not sell, trade, or rent your personal information to
										third parties. We may share information only in the
										following circumstances:
									</p>
									<ul className="list-disc list-inside space-y-2 ml-4">
										<li>
											<strong>With Parents/Guardians:</strong> Student academic
											performance, attendance, and school-related updates
										</li>
										<li>
											<strong>With Educational Authorities:</strong> When
											required by law or for regulatory compliance
										</li>
										<li>
											<strong>With Service Providers:</strong> Third-party
											services that help us operate our website (e.g.,
											Cloudinary for media storage, payment processors)
										</li>
										<li>
											<strong>For Legal Purposes:</strong> When necessary to
											protect our rights, comply with legal processes, or ensure
											student safety
										</li>
										<li>
											<strong>With Consent:</strong> Any other disclosure will
											be made only with your explicit consent
										</li>
									</ul>
								</div>
							</div>

							{/* Data Security */}
							<div className="mb-12">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
										<Lock className="w-6 h-6 text-red-600" />
									</div>
									<h2 className="text-3xl font-bold text-foreground">
										Data Security
									</h2>
								</div>
								<div className="space-y-4 text-gray-600">
									<p>
										We implement appropriate technical and organizational
										security measures to protect your personal information:
									</p>
									<ul className="list-disc list-inside space-y-2 ml-4">
										<li>
											Encrypted data transmission using HTTPS/SSL protocols
										</li>
										<li>
											Secure authentication systems with password encryption
										</li>
										<li>
											Regular security audits and vulnerability assessments
										</li>
										<li>
											Access controls limiting data access to authorized
											personnel only
										</li>
										<li>Regular backups to prevent data loss</li>
										<li>
											Secure cloud storage with industry-standard providers
										</li>
									</ul>
									<p className="mt-4">
										While we strive to protect your information, no method of
										transmission over the internet is 100% secure. We cannot
										guarantee absolute security but are committed to maintaining
										industry best practices.
									</p>
								</div>
							</div>

							{/* Your Rights */}
							<div className="mb-12">
								<h2 className="text-3xl font-bold text-foreground mb-4">
									Your Rights and Choices
								</h2>
								<div className="space-y-3 text-gray-600">
									<p>
										You have the following rights regarding your personal
										information:
									</p>
									<ul className="list-disc list-inside space-y-2 ml-4">
										<li>
											<strong>Access:</strong> Request access to the personal
											information we hold about you
										</li>
										<li>
											<strong>Correction:</strong> Request correction of
											inaccurate or incomplete information
										</li>
										<li>
											<strong>Deletion:</strong> Request deletion of your
											personal information (subject to legal retention
											requirements)
										</li>
										<li>
											<strong>Opt-out:</strong> Unsubscribe from marketing
											communications at any time
										</li>
										<li>
											<strong>Data Portability:</strong> Request a copy of your
											data in a structured format
										</li>
										<li>
											<strong>Consent Withdrawal:</strong> Withdraw consent for
											photo/video usage in gallery or promotional materials
										</li>
									</ul>
									<p className="mt-4">
										To exercise any of these rights, please contact us at{" "}
										<a
											href="mailto:privacy@happychildschool.edu"
											className="text-blue-600 hover:underline"
										>
											privacy@happychildschool.edu
										</a>
									</p>
								</div>
							</div>

							{/* Children's Privacy */}
							<div className="mb-12">
								<h2 className="text-3xl font-bold text-foreground mb-4">
									Children&apos;s Privacy
								</h2>
								<div className="space-y-3 text-gray-600">
									<p>
										Happy Child School is committed to protecting the privacy of
										children. We comply with all applicable laws regarding
										children&apos;s online privacy:
									</p>
									<ul className="list-disc list-inside space-y-2 ml-4">
										<li>
											We only collect information from students with parental
											consent
										</li>
										<li>
											Parents have the right to review their child&apos;s
											information
										</li>
										<li>
											Photos/videos of students are published only with explicit
											parental permission
										</li>
										<li>
											We do not knowingly collect data from children for
											marketing purposes
										</li>
										<li>
											Parents can request deletion of their child&apos;s
											information at any time
										</li>
									</ul>
								</div>
							</div>

							{/* Cookies */}
							<div className="mb-12">
								<h2 className="text-3xl font-bold text-foreground mb-4">
									Cookies and Tracking Technologies
								</h2>
								<div className="space-y-3 text-gray-600">
									<p>
										We use cookies and similar technologies to enhance your
										experience:
									</p>
									<ul className="list-disc list-inside space-y-2 ml-4">
										<li>
											<strong>Essential Cookies:</strong> Required for website
											functionality and authentication
										</li>
										<li>
											<strong>Analytics Cookies:</strong> Help us understand how
											visitors use our website
										</li>
										<li>
											<strong>Preference Cookies:</strong> Remember your
											settings and preferences
										</li>
									</ul>
									<p className="mt-4">
										You can control cookies through your browser settings. Note
										that disabling cookies may affect website functionality.
									</p>
								</div>
							</div>

							{/* Changes to Policy */}
							<div className="mb-12">
								<h2 className="text-3xl font-bold text-foreground mb-4">
									Changes to This Privacy Policy
								</h2>
								<p className="text-gray-600">
									We may update this Privacy Policy from time to time to reflect
									changes in our practices or legal requirements. We will notify
									you of any material changes by posting the new Privacy Policy
									on this page and updating the &quot;Last Updated&quot; date.
									We encourage you to review this policy periodically.
								</p>
							</div>

							{/* Contact */}
							<div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
								<h2 className="text-3xl font-bold text-foreground mb-4">
									Contact Us
								</h2>
								<p className="text-gray-600 mb-4">
									If you have any questions or concerns about this Privacy
									Policy or our data practices, please contact us:
								</p>
								<div className="space-y-2 text-gray-600">
									<p>
										<strong>Happy Child School</strong>
									</p>
									<p>123 Education Street, Learning City, 560001</p>
									<p>
										Email:{" "}
										<a
											href="mailto:privacy@happychildschool.edu"
											className="text-blue-600 hover:underline"
										>
											privacy@happychildschool.edu
										</a>
									</p>
									<p>
										Phone:{" "}
										<a
											href="tel:+919876543210"
											className="text-blue-600 hover:underline"
										>
											+91 98765 43210
										</a>
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>

			<ModernFooter />
		</div>
	);
}
