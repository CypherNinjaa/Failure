import { ModernHeader } from "@/components/ui/modern-header";
import { ModernFooter } from "@/components/ui/modern-footer";
import {
	Eye,
	Keyboard,
	MousePointer,
	Volume2,
	Type,
	Contrast,
	CheckCircle,
	AlertCircle,
} from "lucide-react";

export default function AccessibilityPage() {
	return (
		<div className="min-h-screen bg-background">
			<ModernHeader />

			<main className="pt-20">
				{/* Hero Section */}
				<section className="bg-gradient-to-br from-blue-600 via-green-600 to-purple-600 py-20">
					<div className="container mx-auto px-4">
						<div className="max-w-4xl mx-auto text-center text-white">
							<div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6">
								<Eye className="w-10 h-10" />
							</div>
							<h1 className="text-4xl md:text-6xl font-bold mb-6">
								Accessibility Statement
							</h1>
							<p className="text-xl text-white/90">
								Committed to providing an inclusive digital experience for all
								users.
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
										<CheckCircle className="w-6 h-6 text-blue-600" />
									</div>
									<h2 className="text-3xl font-bold text-foreground">
										Our Commitment
									</h2>
								</div>
								<p className="text-gray-600 leading-relaxed mb-4">
									Happy Child School is committed to ensuring digital
									accessibility for people with disabilities. We are continually
									improving the user experience for everyone and applying the
									relevant accessibility standards to ensure we provide equal
									access to all of our users.
								</p>
								<p className="text-gray-600 leading-relaxed">
									We believe that education should be accessible to all
									students, parents, and staff, regardless of their abilities or
									the technologies they use to access our website and online
									services.
								</p>
							</div>

							{/* Conformance Status */}
							<div className="mb-12">
								<h2 className="text-3xl font-bold text-foreground mb-4">
									Conformance Status
								</h2>
								<div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg mb-4">
									<div className="flex items-start gap-3">
										<CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
										<div>
											<h3 className="font-semibold text-green-900 mb-2">
												WCAG 2.1 Level AA Compliance
											</h3>
											<p className="text-green-800">
												Our website strives to conform to the Web Content
												Accessibility Guidelines (WCAG) 2.1 at Level AA. These
												guidelines explain how to make web content more
												accessible for people with disabilities and
												user-friendly for everyone.
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Accessibility Features */}
							<div className="mb-12">
								<h2 className="text-3xl font-bold text-foreground mb-6">
									Accessibility Features
								</h2>

								<div className="grid md:grid-cols-2 gap-6">
									{/* Screen Reader Support */}
									<div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
										<div className="flex items-center gap-3 mb-4">
											<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
												<Volume2 className="w-5 h-5 text-blue-600" />
											</div>
											<h3 className="text-xl font-semibold text-foreground">
												Screen Reader Support
											</h3>
										</div>
										<ul className="space-y-2 text-gray-600">
											<li className="flex items-start">
												<span className="text-blue-600 mr-2">•</span>
												<span>Semantic HTML for proper content structure</span>
											</li>
											<li className="flex items-start">
												<span className="text-blue-600 mr-2">•</span>
												<span>ARIA labels and landmarks</span>
											</li>
											<li className="flex items-start">
												<span className="text-blue-600 mr-2">•</span>
												<span>Alternative text for all images</span>
											</li>
											<li className="flex items-start">
												<span className="text-blue-600 mr-2">•</span>
												<span>Descriptive link text</span>
											</li>
										</ul>
									</div>

									{/* Keyboard Navigation */}
									<div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
										<div className="flex items-center gap-3 mb-4">
											<div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
												<Keyboard className="w-5 h-5 text-purple-600" />
											</div>
											<h3 className="text-xl font-semibold text-foreground">
												Keyboard Navigation
											</h3>
										</div>
										<ul className="space-y-2 text-gray-600">
											<li className="flex items-start">
												<span className="text-purple-600 mr-2">•</span>
												<span>Full keyboard accessibility</span>
											</li>
											<li className="flex items-start">
												<span className="text-purple-600 mr-2">•</span>
												<span>Visible focus indicators</span>
											</li>
											<li className="flex items-start">
												<span className="text-purple-600 mr-2">•</span>
												<span>Logical tab order</span>
											</li>
											<li className="flex items-start">
												<span className="text-purple-600 mr-2">•</span>
												<span>Skip navigation links</span>
											</li>
										</ul>
									</div>

									{/* Visual Design */}
									<div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
										<div className="flex items-center gap-3 mb-4">
											<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
												<Contrast className="w-5 h-5 text-green-600" />
											</div>
											<h3 className="text-xl font-semibold text-foreground">
												Visual Design
											</h3>
										</div>
										<ul className="space-y-2 text-gray-600">
											<li className="flex items-start">
												<span className="text-green-600 mr-2">•</span>
												<span>WCAG AA color contrast ratios</span>
											</li>
											<li className="flex items-start">
												<span className="text-green-600 mr-2">•</span>
												<span>Resizable text up to 200%</span>
											</li>
											<li className="flex items-start">
												<span className="text-green-600 mr-2">•</span>
												<span>No information conveyed by color alone</span>
											</li>
											<li className="flex items-start">
												<span className="text-green-600 mr-2">•</span>
												<span>Consistent and predictable layouts</span>
											</li>
										</ul>
									</div>

									{/* Interactive Elements */}
									<div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
										<div className="flex items-center gap-3 mb-4">
											<div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
												<MousePointer className="w-5 h-5 text-orange-600" />
											</div>
											<h3 className="text-xl font-semibold text-foreground">
												Interactive Elements
											</h3>
										</div>
										<ul className="space-y-2 text-gray-600">
											<li className="flex items-start">
												<span className="text-orange-600 mr-2">•</span>
												<span>Accessible forms with clear labels</span>
											</li>
											<li className="flex items-start">
												<span className="text-orange-600 mr-2">•</span>
												<span>Error identification and suggestions</span>
											</li>
											<li className="flex items-start">
												<span className="text-orange-600 mr-2">•</span>
												<span>Sufficient time for interactions</span>
											</li>
											<li className="flex items-start">
												<span className="text-orange-600 mr-2">•</span>
												<span>No flashing or seizure-inducing content</span>
											</li>
										</ul>
									</div>
								</div>
							</div>

							{/* Text Accessibility */}
							<div className="mb-12">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
										<Type className="w-6 h-6 text-purple-600" />
									</div>
									<h2 className="text-3xl font-bold text-foreground">
										Text and Content
									</h2>
								</div>
								<div className="space-y-3 text-gray-600">
									<ul className="list-disc list-inside space-y-2 ml-4">
										<li>
											All text content can be resized using browser zoom
											functionality
										</li>
										<li>
											Font sizes are specified in relative units for flexibility
										</li>
										<li>
											Content is written in clear, simple language where
											possible
										</li>
										<li>
											Headings and lists are properly structured for easy
											navigation
										</li>
										<li>
											All video content includes captions or transcripts (where
											applicable)
										</li>
										<li>
											PDF documents are made accessible or alternatives are
											provided
										</li>
									</ul>
								</div>
							</div>

							{/* Compatible Technologies */}
							<div className="mb-12">
								<h2 className="text-3xl font-bold text-foreground mb-4">
									Compatible Technologies
								</h2>
								<p className="text-gray-600 mb-4">
									Our website is designed to work with the following assistive
									technologies:
								</p>
								<div className="grid md:grid-cols-2 gap-4">
									<div className="bg-blue-50 rounded-lg p-4">
										<h3 className="font-semibold text-blue-900 mb-2">
											Screen Readers
										</h3>
										<ul className="text-blue-800 space-y-1 text-sm">
											<li>• JAWS (Job Access With Speech)</li>
											<li>• NVDA (NonVisual Desktop Access)</li>
											<li>• VoiceOver (macOS and iOS)</li>
											<li>• TalkBack (Android)</li>
										</ul>
									</div>
									<div className="bg-green-50 rounded-lg p-4">
										<h3 className="font-semibold text-green-900 mb-2">
											Browsers
										</h3>
										<ul className="text-green-800 space-y-1 text-sm">
											<li>• Google Chrome (latest version)</li>
											<li>• Mozilla Firefox (latest version)</li>
											<li>• Microsoft Edge (latest version)</li>
											<li>• Safari (latest version)</li>
										</ul>
									</div>
								</div>
							</div>

							{/* Known Limitations */}
							<div className="mb-12">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
										<AlertCircle className="w-6 h-6 text-yellow-600" />
									</div>
									<h2 className="text-3xl font-bold text-foreground">
										Known Limitations
									</h2>
								</div>
								<p className="text-gray-600 mb-4">
									Despite our best efforts, some limitations may exist:
								</p>
								<ul className="list-disc list-inside space-y-2 ml-4 text-gray-600">
									<li>
										Third-party content (embedded videos, social media feeds)
										may not be fully accessible
									</li>
									<li>
										Some older PDF documents may not meet current accessibility
										standards
									</li>
									<li>
										User-uploaded content may not always include proper
										alternative text
									</li>
									<li>
										Complex interactive features may require modern browser
										versions
									</li>
								</ul>
								<p className="text-gray-600 mt-4">
									We are actively working to address these limitations and
									improve accessibility across all areas of our website.
								</p>
							</div>

							{/* Feedback and Assistance */}
							<div className="mb-12">
								<h2 className="text-3xl font-bold text-foreground mb-4">
									Feedback and Assistance
								</h2>
								<div className="space-y-4 text-gray-600">
									<p>
										We welcome your feedback on the accessibility of our
										website. If you encounter any accessibility barriers or have
										suggestions for improvement, please contact us:
									</p>
									<div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 space-y-3">
										<h3 className="font-semibold text-foreground">
											Accessibility Coordinator
										</h3>
										<p>
											<strong>Email:</strong>{" "}
											<a
												href="mailto:accessibility@happychildschool.edu"
												className="text-blue-600 hover:underline"
											>
												accessibility@happychildschool.edu
											</a>
										</p>
										<p>
											<strong>Phone:</strong>{" "}
											<a
												href="tel:+919876543210"
												className="text-blue-600 hover:underline"
											>
												+91 98765 43210
											</a>
										</p>
										<p>
											<strong>Address:</strong> Happy Child School, 123
											Education Street, Learning City, 560001
										</p>
									</div>
									<p>
										We aim to respond to accessibility feedback within 5
										business days and will work to resolve any issues as quickly
										as possible.
									</p>
								</div>
							</div>

							{/* Accessibility Resources */}
							<div className="mb-12">
								<h2 className="text-3xl font-bold text-foreground mb-4">
									Accessibility Resources
								</h2>
								<p className="text-gray-600 mb-4">
									For more information about web accessibility, please visit:
								</p>
								<ul className="space-y-2 text-gray-600">
									<li className="flex items-start">
										<span className="text-blue-600 mr-2">→</span>
										<span>
											<a
												href="https://www.w3.org/WAI/"
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-600 hover:underline"
											>
												Web Accessibility Initiative (WAI)
											</a>
										</span>
									</li>
									<li className="flex items-start">
										<span className="text-blue-600 mr-2">→</span>
										<span>
											<a
												href="https://www.w3.org/WAI/WCAG21/quickref/"
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-600 hover:underline"
											>
												WCAG 2.1 Quick Reference
											</a>
										</span>
									</li>
									<li className="flex items-start">
										<span className="text-blue-600 mr-2">→</span>
										<span>
											<a
												href="https://webaim.org/"
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-600 hover:underline"
											>
												WebAIM (Web Accessibility In Mind)
											</a>
										</span>
									</li>
								</ul>
							</div>

							{/* Continuous Improvement */}
							<div className="mb-12">
								<h2 className="text-3xl font-bold text-foreground mb-4">
									Continuous Improvement
								</h2>
								<div className="space-y-3 text-gray-600">
									<p>Accessibility is an ongoing effort. We regularly:</p>
									<ul className="list-disc list-inside space-y-2 ml-4">
										<li>
											Conduct accessibility audits and testing with assistive
											technologies
										</li>
										<li>
											Provide accessibility training to our web development team
										</li>
										<li>
											Review and update content to maintain accessibility
											standards
										</li>
										<li>
											Incorporate user feedback to improve the experience for
											all
										</li>
										<li>
											Monitor changes in accessibility guidelines and best
											practices
										</li>
									</ul>
								</div>
							</div>

							{/* Formal Complaints */}
							<div className="bg-gray-50 rounded-2xl p-8">
								<h2 className="text-3xl font-bold text-foreground mb-4">
									Formal Complaints
								</h2>
								<p className="text-gray-600 mb-4">
									If you are not satisfied with our response to your
									accessibility concern, you have the right to file a formal
									complaint. Please submit your complaint in writing to:
								</p>
								<div className="bg-white rounded-lg p-4 border border-gray-200">
									<p className="text-gray-700">
										<strong>Principal, Happy Child School</strong>
										<br />
										123 Education Street
										<br />
										Learning City, 560001
										<br />
										Email: principal@happychildschool.edu
									</p>
								</div>
								<p className="text-gray-600 mt-4">
									We take all accessibility concerns seriously and will
									investigate and respond to formal complaints within 30 days.
								</p>
							</div>
						</div>
					</div>
				</section>
			</main>

			<ModernFooter />
		</div>
	);
}
