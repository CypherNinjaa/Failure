"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
	Eye,
	EyeOff,
	Mail,
	Lock,
	LogIn,
	GraduationCap,
	Users,
	BookOpen,
	Settings,
} from "lucide-react";

export function LoginForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [selectedRole, setSelectedRole] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const roles = [
		{
			id: "student",
			name: "Student",
			icon: GraduationCap,
			emoji: "🎓",
			gradient: "from-blue-500 to-cyan-500",
		},
		{
			id: "teacher",
			name: "Teacher",
			icon: BookOpen,
			emoji: "👨‍🏫",
			gradient: "from-purple-500 to-pink-500",
		},
		{
			id: "parent",
			name: "Parent",
			icon: Users,
			emoji: "👨‍👩‍👧‍👦",
			gradient: "from-green-500 to-emerald-500",
		},
		{
			id: "admin",
			name: "Admin",
			icon: Settings,
			emoji: "⚙️",
			gradient: "from-orange-500 to-red-500",
		},
	];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !password || !selectedRole) {
			alert("Please fill in all fields and select a role");
			return;
		}

		setIsLoading(true);

		try {
			// TODO: Replace with actual API call to your backend
			// Example API call structure:
			/*
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role: selectedRole.toUpperCase(), // Convert to match enum format
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store auth token securely
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userRole', data.user.role);
        
        // Redirect to appropriate dashboard
        window.location.href = `/dashboard/${selectedRole}`;
      } else {
        alert(data.message || 'Login failed');
      }
      */

			// Temporary simulation - remove when backend is ready
			await new Promise((resolve) => setTimeout(resolve, 1500));

			console.log("Login attempt:", {
				email,
				role: selectedRole.toUpperCase(),
			});

			// Simulate successful login
			localStorage.setItem("userEmail", email);
			localStorage.setItem("userRole", selectedRole.toUpperCase());
			localStorage.setItem("authToken", `temp_token_${Date.now()}`);

			// Redirect based on role
			window.location.href = `/dashboard/${selectedRole}`;
		} catch (error) {
			console.error("Login error:", error);
			alert("Login failed. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-12"
				>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4">
						🔐 Welcome Back
					</h2>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
						Sign in to access your personalized dashboard and continue your
						educational journey.
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					viewport={{ once: true }}
					className="max-w-md mx-auto"
				>
					<div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-gray-200/50 dark:border-gray-700/50">
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Role Selection */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
									Select Your Role
								</label>
								<div className="grid grid-cols-2 gap-3">
									{roles.map((role) => (
										<motion.button
											key={role.id}
											type="button"
											onClick={() => setSelectedRole(role.id)}
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${
												selectedRole === role.id
													? `border-transparent bg-gradient-to-br ${role.gradient} text-white shadow-lg`
													: "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
											}`}
										>
											<div className="text-center">
												<div className="text-2xl mb-1">{role.emoji}</div>
												<div className="text-sm font-medium">{role.name}</div>
											</div>
										</motion.button>
									))}
								</div>
							</div>

							{/* Email Input */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
									Email Address
								</label>
								<div className="relative">
									<Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="Enter your email"
										className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
										required
									/>
								</div>
							</div>

							{/* Password Input */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
									Password
								</label>
								<div className="relative">
									<Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
									<input
										type={showPassword ? "text" : "password"}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="Enter your password"
										className="w-full pl-12 pr-12 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
										required
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
									>
										{showPassword ? (
											<EyeOff className="w-5 h-5" />
										) : (
											<Eye className="w-5 h-5" />
										)}
									</button>
								</div>
							</div>

							{/* Login Button */}
							<motion.button
								type="submit"
								disabled={isLoading || !email || !password || !selectedRole}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
							>
								{isLoading ? (
									<>
										<div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
										<span>Signing in...</span>
									</>
								) : (
									<>
										<LogIn className="w-5 h-5" />
										<span>Sign In</span>
									</>
								)}
							</motion.button>

							{/* Additional Links */}
							<div className="text-center space-y-3">
								<a
									href="/forgot-password"
									className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
								>
									Forgot your password?
								</a>
								<div className="text-sm text-gray-500 dark:text-gray-400">
									New to Happy Child School?{" "}
									<a
										href="/admissions"
										className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium"
									>
										Apply Now
									</a>
								</div>
							</div>
						</form>
					</div>
				</motion.div>

				{/* Security Notice */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					viewport={{ once: true }}
					className="text-center mt-8"
				>
					<p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
						🔒 Your data is protected with industry-standard encryption. We
						never store your password in plain text.
					</p>
				</motion.div>
			</div>
		</section>
	);
}
