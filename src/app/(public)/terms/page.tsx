import { ModernHeader } from "@/components/ui/modern-header";
import { ModernFooter } from "@/components/ui/modern-footer";
import {
	FileText,
	Scale,
	AlertCircle,
	CheckCircle,
	XCircle,
	UserX,
} from "lucide-react";

export default function TermsOfServicePage() {
	return (
		<div className="min-h-screen bg-background">
			<ModernHeader />

			<main className="pt-20">
				{/* Hero Section */}
				<section className="bg-gradient-to-br from-purple-600 via-blue-600 to-green-600 py-20">
					<div className="container mx-auto px-4">
						<div className="max-w-4xl mx-auto text-center text-white">
							<div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6">
								<Scale className="w-10 h-10" />
							</div>
							<h1 className="text-4xl md:text-6xl font-bold mb-6">
								Terms of Service
							</h1>
							<p className="text-xl text-white/90">
								Please read these terms carefully before using our services.
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
									Welcome to Happy Child School. These Terms of Service
									(&quot;Terms&quot;) govern your access to and use of our
									website, online portals, and related services (collectively,
									the &quot;Services&quot;). By accessing or using our Services,
									you agree to be bound by these Terms. If you do not agree with
									these Terms, please do not use our Services.
								</p>
							</div>

							{/* Acceptance of Terms */}
							<div className="mb-12">
								<h2 className="text-3xl font-bold text-foreground mb-4">
									1. Acceptance of Terms
								</h2>
								<div className="space-y-3 text-gray-600">
									<p>
										By registering for an account, accessing our website, or
										using any of our Services, you acknowledge that you have
										read, understood, and agree to be bound by these Terms and
										our Privacy Policy.
									</p>
									<p>
										If you are accessing our Services on behalf of a minor (as a
										parent or guardian), you represent that you have the
										authority to bind that minor to these Terms.
									</p>
								</div>
							</div>

							{/* User Accounts */}
							<div className="mb-12">
								<h2 className="text-3xl font-bold text-foreground mb-4">
									2. User Accounts and Registration
								</h2>
								<div className="space-y-4 text-gray-600">
									<div>
										<h3 className="text-xl font-semibold text-foreground mb-3">
											2.1 Account Creation
										</h3>
										<ul className="list-disc list-inside space-y-2 ml-4">
											<li>
												You must provide accurate, current, and complete
												information during registration
											</li>
											<li>
												You are responsible for maintaining the confidentiality
												of your account credentials
											</li>
											<li>
												You must notify us immediately of any unauthorized
												access to your account
											</li>
											<li>
												One account per user; creating multiple accounts is
												prohibited
											</li>
										</ul>
									</div>

									<div>
										<h3 className="text-xl font-semibold text-foreground mb-3">
											2.2 User Categories
										</h3>
										<p>We provide different types of accounts:</p>
										<ul className="list-disc list-inside space-y-2 ml-4 mt-2">
											<li>
												<strong>Student Accounts:</strong> For enrolled students
												to access academic resources
											</li>
											<li>
												<strong>Parent Accounts:</strong> For parents/guardians
												to monitor student progress
											</li>
											<li>
												<strong>Teacher Accounts:</strong> For faculty to manage
												classes and student records
											</li>
											<li>
												<strong>Admin Accounts:</strong> For administrative
												staff to manage school operations
											</li>
											<li>
												<strong>Media Coordinator Accounts:</strong> For
												managing school media and content
											</li>
										</ul>
									</div>

									<div>
										<h3 className="text-xl font-semibold text-foreground mb-3">
											2.3 Account Responsibilities
										</h3>
										<ul className="list-disc list-inside space-y-2 ml-4">
											<li>
												You are responsible for all activities that occur under
												your account
											</li>
											<li>
												You must be at least 13 years old to create an account
												(students under 13 require parental consent)
											</li>
											<li>
												Sharing account credentials is strictly prohibited
											</li>
											<li>
												We reserve the right to suspend or terminate accounts
												that violate these Terms
											</li>
										</ul>
									</div>
								</div>
							</div>

							{/* Acceptable Use */}
							<div className="mb-12">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
										<CheckCircle className="w-6 h-6 text-green-600" />
									</div>
									<h2 className="text-3xl font-bold text-foreground">
										3. Acceptable Use Policy
									</h2>
								</div>
								<div className="space-y-4 text-gray-600">
									<p>
										You agree to use our Services only for lawful purposes and
										in accordance with these Terms. You agree NOT to:
									</p>
									<ul className="list-disc list-inside space-y-2 ml-4">
										<li>
											Violate any applicable laws, regulations, or third-party
											rights
										</li>
										<li>
											Upload or transmit viruses, malware, or any harmful code
										</li>
										<li>
											Attempt to gain unauthorized access to our systems or
											networks
										</li>
										<li>Harass, bully, threaten, or intimidate other users</li>
										<li>
											Post offensive, inappropriate, or discriminatory content
										</li>
										<li>
											Impersonate any person or entity, or falsely represent
											your affiliation
										</li>
										<li>Interfere with or disrupt the Services or servers</li>
										<li>
											Scrape, copy, or download content without authorization
										</li>
										<li>
											Use the Services for any commercial purpose without our
											consent
										</li>
										<li>
											Share examination questions, answers, or engage in
											academic dishonesty
										</li>
									</ul>
								</div>
							</div>

							{/* Academic Integrity */}
							<div className="mb-12">
								<h2 className="text-3xl font-bold text-foreground mb-4">
									4. Academic Integrity
								</h2>
								<div className="space-y-3 text-gray-600">
									<p>
										Students using our Services must adhere to academic
										integrity standards:
									</p>
									<ul className="list-disc list-inside space-y-2 ml-4">
										<li>All submitted work must be original and your own</li>
										<li>
											Plagiarism, cheating, or any form of academic dishonesty
											is prohibited
										</li>
										<li>
											Online examinations must be completed individually without
											unauthorized assistance
										</li>
										<li>
											Anti-cheating measures (browser monitoring, time limits)
											are in place for online tests
										</li>
										<li>
											Violations may result in disciplinary action, including
											account suspension or expulsion
										</li>
									</ul>
								</div>
							</div>

							{/* Fees and Payments */}
							<div className="mb-12">
								<h2 className="text-3xl font-bold text-foreground mb-4">
									5. Fees and Payments
								</h2>
								<div className="space-y-4 text-gray-600">
									<div>
										<h3 className="text-xl font-semibold text-foreground mb-3">
											5.1 Tuition and Fees
										</h3>
										<ul className="list-disc list-inside space-y-2 ml-4">
											<li>
												Tuition fees and payment schedules are set by the school
												administration
											</li>
											<li>
												Fees must be paid by the due date to avoid late charges
											</li>
											<li>
												Payment can be made through online portals or offline
												methods
											</li>
											<li>
												Refund policies are subject to school regulations and
												applicable laws
											</li>
										</ul>
									</div>

									<div>
										<h3 className="text-xl font-semibold text-foreground mb-3">
											5.2 Payment Methods
										</h3>
										<p>
											We accept payments through various methods including
											credit cards, debit cards, bank transfers, and cash
											(offline). All online transactions are processed through
											secure payment gateways.
										</p>
									</div>

									<div>
										<h3 className="text-xl font-semibold text-foreground mb-3">
											5.3 Late Payments
										</h3>
										<p>
											Late payment charges may apply as per school policy.
											Continued non-payment may result in suspension of Services
											or other actions as per school regulations.
										</p>
									</div>
								</div>
							</div>

							{/* Content and Intellectual Property */}
							<div className="mb-12">
								<h2 className="text-3xl font-bold text-foreground mb-4">
									6. Intellectual Property Rights
								</h2>
								<div className="space-y-4 text-gray-600">
									<div>
										<h3 className="text-xl font-semibold text-foreground mb-3">
											6.1 School Content
										</h3>
										<p>
											All content on our website and Services, including text,
											graphics, logos, images, videos, software, and design
											elements, are the property of Happy Child School or its
											licensors and are protected by copyright, trademark, and
											other intellectual property laws.
										</p>
									</div>

									<div>
										<h3 className="text-xl font-semibold text-foreground mb-3">
											6.2 User Content
										</h3>
										<ul className="list-disc list-inside space-y-2 ml-4">
											<li>
												You retain ownership of content you submit (assignments,
												projects, testimonials)
											</li>
											<li>
												By submitting content, you grant us a non-exclusive
												license to use, display, and distribute it for
												educational purposes
											</li>
											<li>
												You represent that you have the rights to any content
												you submit
											</li>
											<li>
												We reserve the right to remove any content that violates
												these Terms
											</li>
										</ul>
									</div>

									<div>
										<h3 className="text-xl font-semibold text-foreground mb-3">
											6.3 License to Use Services
										</h3>
										<p>
											We grant you a limited, non-exclusive, non-transferable
											license to access and use the Services for your personal,
											educational use only. You may not reproduce, distribute,
											modify, or create derivative works without our written
											permission.
										</p>
									</div>
								</div>
							</div>

							{/* Prohibited Activities */}
							<div className="mb-12">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
										<XCircle className="w-6 h-6 text-red-600" />
									</div>
									<h2 className="text-3xl font-bold text-foreground">
										7. Prohibited Activities
									</h2>
								</div>
								<div className="space-y-3 text-gray-600">
									<p>The following activities are strictly prohibited:</p>
									<ul className="list-disc list-inside space-y-2 ml-4">
										<li>
											Hacking, reverse engineering, or attempting to breach
											security
										</li>
										<li>
											Using automated systems (bots, scripts) without
											authorization
										</li>
										<li>Distributing spam or unsolicited messages</li>
										<li>Uploading harmful content (viruses, malware)</li>
										<li>Infringing on intellectual property rights</li>
										<li>Collecting personal information of other users</li>
										<li>
											Using the Services to promote competing educational
											institutions
										</li>
										<li>Engaging in any fraudulent or illegal activities</li>
									</ul>
								</div>
							</div>

							{/* Privacy and Data Protection */}
							<div className="mb-12">
								<h2 className="text-3xl font-bold text-foreground mb-4">
									8. Privacy and Data Protection
								</h2>
								<div className="space-y-3 text-gray-600">
									<p>
										Your use of the Services is also governed by our Privacy
										Policy. By using our Services, you consent to the
										collection, use, and disclosure of your information as
										described in the Privacy Policy.
									</p>
									<p>
										We are committed to protecting student data and comply with
										all applicable data protection laws, including special
										protections for children&apos;s information.
									</p>
								</div>
							</div>

							{/* Disclaimer of Warranties */}
							<div className="mb-12">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
										<AlertCircle className="w-6 h-6 text-yellow-600" />
									</div>
									<h2 className="text-3xl font-bold text-foreground">
										9. Disclaimer of Warranties
									</h2>
								</div>
								<div className="space-y-3 text-gray-600">
									<p>
										THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS
										AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER
										EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES
										OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR
										NON-INFRINGEMENT.
									</p>
									<p>We do not warrant that:</p>
									<ul className="list-disc list-inside space-y-2 ml-4">
										<li>The Services will be uninterrupted or error-free</li>
										<li>Defects will be corrected</li>
										<li>
											The Services are free from viruses or harmful components
										</li>
										<li>
											Results obtained from using the Services will be accurate
											or reliable
										</li>
									</ul>
								</div>
							</div>

							{/* Limitation of Liability */}
							<div className="mb-12">
								<h2 className="text-3xl font-bold text-foreground mb-4">
									10. Limitation of Liability
								</h2>
								<div className="space-y-3 text-gray-600">
									<p>
										TO THE MAXIMUM EXTENT PERMITTED BY LAW, HAPPY CHILD SCHOOL
										SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
										CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS
										OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY
										LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
									</p>
									<p>
										Our total liability to you for all claims arising out of or
										related to the Services shall not exceed the amount you have
										paid us in the past 12 months.
									</p>
								</div>
							</div>

							{/* Termination */}
							<div className="mb-12">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
										<UserX className="w-6 h-6 text-purple-600" />
									</div>
									<h2 className="text-3xl font-bold text-foreground">
										11. Termination
									</h2>
								</div>
								<div className="space-y-4 text-gray-600">
									<div>
										<h3 className="text-xl font-semibold text-foreground mb-3">
											11.1 Termination by You
										</h3>
										<p>
											You may terminate your account at any time by contacting
											us. Upon termination, you will lose access to the
											Services.
										</p>
									</div>

									<div>
										<h3 className="text-xl font-semibold text-foreground mb-3">
											11.2 Termination by Us
										</h3>
										<p>
											We reserve the right to suspend or terminate your access
											to the Services at any time, with or without notice, for:
										</p>
										<ul className="list-disc list-inside space-y-2 ml-4 mt-2">
											<li>Violation of these Terms</li>
											<li>Fraudulent or illegal activities</li>
											<li>Non-payment of fees</li>
											<li>Withdrawal from school</li>
											<li>Any other reason we deem necessary</li>
										</ul>
									</div>

									<div>
										<h3 className="text-xl font-semibold text-foreground mb-3">
											11.3 Effect of Termination
										</h3>
										<p>
											Upon termination, your right to access the Services will
											cease immediately. Provisions that should survive
											termination (such as intellectual property rights,
											disclaimers, and limitations of liability) will continue
											to apply.
										</p>
									</div>
								</div>
							</div>

							{/* Changes to Terms */}
							<div className="mb-12">
								<h2 className="text-3xl font-bold text-foreground mb-4">
									12. Changes to Terms
								</h2>
								<div className="space-y-3 text-gray-600">
									<p>
										We reserve the right to modify these Terms at any time. We
										will notify you of material changes by posting the updated
										Terms on our website and updating the &quot;Last
										Updated&quot; date.
									</p>
									<p>
										Your continued use of the Services after changes take effect
										constitutes acceptance of the revised Terms. If you do not
										agree to the changes, you must stop using the Services.
									</p>
								</div>
							</div>

							{/* Governing Law */}
							<div className="mb-12">
								<h2 className="text-3xl font-bold text-foreground mb-4">
									13. Governing Law and Dispute Resolution
								</h2>
								<div className="space-y-3 text-gray-600">
									<p>
										These Terms shall be governed by and construed in accordance
										with the laws of India, without regard to conflict of law
										principles.
									</p>
									<p>
										Any disputes arising out of or related to these Terms or the
										Services shall be resolved through good faith negotiation.
										If negotiation fails, disputes shall be subject to the
										exclusive jurisdiction of the courts in Learning City,
										India.
									</p>
								</div>
							</div>

							{/* Miscellaneous */}
							<div className="mb-12">
								<h2 className="text-3xl font-bold text-foreground mb-4">
									14. Miscellaneous
								</h2>
								<div className="space-y-3 text-gray-600">
									<ul className="list-disc list-inside space-y-2 ml-4">
										<li>
											<strong>Entire Agreement:</strong> These Terms constitute
											the entire agreement between you and Happy Child School
										</li>
										<li>
											<strong>Severability:</strong> If any provision is found
											invalid, the remaining provisions continue in full effect
										</li>
										<li>
											<strong>Waiver:</strong> Our failure to enforce any right
											does not constitute a waiver
										</li>
										<li>
											<strong>Assignment:</strong> You may not assign these
											Terms; we may assign them to any successor
										</li>
										<li>
											<strong>Force Majeure:</strong> We are not liable for
											delays or failures due to circumstances beyond our control
										</li>
									</ul>
								</div>
							</div>

							{/* Contact */}
							<div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8">
								<h2 className="text-3xl font-bold text-foreground mb-4">
									Contact Us
								</h2>
								<p className="text-gray-600 mb-4">
									If you have any questions about these Terms of Service, please
									contact us:
								</p>
								<div className="space-y-2 text-gray-600">
									<p>
										<strong>Happy Child School</strong>
									</p>
									<p>123 Education Street, Learning City, 560001</p>
									<p>
										Email:{" "}
										<a
											href="mailto:legal@happychildschool.edu"
											className="text-blue-600 hover:underline"
										>
											legal@happychildschool.edu
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
