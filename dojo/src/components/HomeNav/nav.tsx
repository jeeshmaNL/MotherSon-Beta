import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { logout } from "../Login/Slice/LoginSlice";
import { useNavigate } from "react-router-dom";

interface CompanyLogo {
	id: number;
	name: string;
	logo: string;
	uploaded_at: string;
}

export default function Nav() {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const userData = useSelector((state: RootState) => state.LoginData.user);
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const [companyLogo, setCompanyLogo] = useState<CompanyLogo | null>(null);
	const [logoLoading, setLogoLoading] = useState(true);
	const goToTermsAndConditions = () => navigate("/TermsAndConditions");
	const goToPrivacyPolicy = () => navigate("/PrivacyPolicy");
	const goToVersionControl = () => navigate("/VersionControl");

	const getInitial = () => {
		if (!userData?.first_name) return "U";
		return userData.first_name.charAt(0).toUpperCase();
	};

	const handleLogout = () => {
		dispatch(logout({ navigate }))
			.unwrap()
			.then((response: any) => {
				navigate("/");
			})
			.catch((error: any) => {
				console.error("Logout failed:", error);
			});
	};

	if (!userData) {
		return null;
	}

	useEffect(() => {
		const fetchCompanyLogo = async () => {
			try {
				const response = await fetch("http://127.0.0.1:8000/logos/");
				const data = await response.json();

				if (data && data.length > 0) {
					setCompanyLogo(data[0]);
				}
			} catch (error) {
				console.error("Error fetching company logo:", error);
			} finally {
				setLogoLoading(false);
			}
		};

		fetchCompanyLogo();
	}, []);

	return (
		<nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-[#003DA5] to-[#002A75] backdrop-blur-md shadow-lg px-6 py-3 flex justify-between items-center text-white z-50">
			{/* Left: Brand and navigation buttons */}
			<div className="flex items-center gap-6">
				<div className="flex items-center gap-4">
					{logoLoading ? (
						<div className="h-12 w-40 bg-white/20 rounded-lg animate-pulse" />
					) : companyLogo ? (
						<div className="bg-white rounded-lg px-3 py-2 shadow-md">
							<img
								src={companyLogo.logo}
								alt={companyLogo.name}
								className="h-10 w-auto max-w-[160px] object-contain"
							/>
						</div>
					) : (
						<div className="bg-white rounded-lg px-4 py-2 shadow-md">
							<span className="text-2xl font-bold text-[#E31E24] tracking-tight">MOTHERSON</span>
						</div>
					)}
				</div>
			</div>

			{/* Center: Platform Title */}
			<div className="absolute left-1/2 transform -translate-x-1/2 text-center">
				<h1 className="text-2xl md:text-3xl font-bold tracking-wide">
					DOJO 2.0
				</h1>
				<div className="h-0.5 w-24 mx-auto mt-1 bg-gradient-to-r from-transparent via-[#E31E24] to-transparent"></div>
			</div>

			{/* Right: Navigation Icons and User */}
			<div className="flex items-center gap-3">
				{/* Navigation Icons */}
				<div className="hidden md:flex items-center gap-2">
					<button
						onClick={() => navigate(-1)}
						className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-105"
						aria-label="Go back"
						title="Go back"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
					</button>

					<button
						onClick={() => navigate("/home")}
						className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-105"
						aria-label="Go home"
						title="Home"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
							/>
						</svg>
					</button>

					<button
						onClick={() => navigate("/notification")}
						className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-105"
						aria-label="Notifications"
						title="Notifications"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
							/>
						</svg>
					</button>
				</div>

				{/* User Avatar and Dropdown */}
				<div className="relative">
					<button
						onClick={() => setDropdownOpen(!dropdownOpen)}
						className="focus:outline-none group"
					>
						<div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E31E24] to-[#FF6B6B] flex items-center justify-center text-white font-semibold shadow-lg ring-2 ring-white/30 hover:ring-4 hover:ring-white/50 transition-all duration-200 group-hover:scale-105">
							{getInitial()}
						</div>
					</button>
					{dropdownOpen && (
						<div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeInDown">
							{/* Dropdown Header with Gradient */}
							<div className="bg-gradient-to-r from-[#003DA5] to-[#002A75] px-6 pt-4 pb-6 relative">
								<button
									onClick={() => setDropdownOpen(false)}
									className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
								<div className="flex flex-col items-center">
									<div className="w-16 h-16 rounded-full bg-white flex items-center justify-center font-bold text-2xl text-[#003DA5] shadow-lg mb-3">
										{getInitial()}
										{userData.last_name?.charAt(0).toUpperCase() || ""}
									</div>
									<p className="text-xl font-semibold text-white">
										Hi, {userData.first_name}!
									</p>
									<p className="text-sm text-white/80 mt-1">
										{userData.email}
									</p>
								</div>
							</div>

							{/* Dropdown Body */}
							<div className="px-6 py-4">
								<button
									onClick={handleLogout}
									className="w-full flex items-center justify-center gap-2 text-white bg-gradient-to-r from-[#E31E24] to-[#FF6B6B] rounded-lg py-3 font-medium shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M17 16l4-4m0 0l-4-4m4 4H7"
										/>
									</svg>
									Sign Out
								</button>
							</div>

							{/* Dropdown Footer */}
							<div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
								<div className="flex justify-center gap-3 text-xs text-gray-600">
									<span
										onClick={goToPrivacyPolicy}
										className="hover:text-[#003DA5] cursor-pointer transition-colors"
									>
										Privacy Policy
									</span>
									<span className="text-gray-400">•</span>
									<span
										onClick={goToTermsAndConditions}
										className="hover:text-[#003DA5] cursor-pointer transition-colors"
									>
										Terms of Service
									</span>
									<span className="text-gray-400">•</span>
									<span
										onClick={goToVersionControl}
										className="hover:text-[#003DA5] cursor-pointer transition-colors"
									>
										Version
									</span>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
			{/* Animation for dropdown */}
			<style>{`
				@keyframes fadeInDown {
					from { 
						opacity: 0; 
						transform: translateY(-10px);
					}
					to { 
						opacity: 1; 
						transform: translateY(0);
					}
				}
				.animate-fadeInDown {
					animation: fadeInDown 0.3s cubic-bezier(0.23, 1, 0.32, 1) both;
				}
			`}</style>
		</nav>
	);
}