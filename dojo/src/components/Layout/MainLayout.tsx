import { Outlet } from "react-router-dom";
import Nav from "../HomeNav/nav";
import { useEffect, useState } from "react";
import ScrollToTop from "../General/ScrollToTop";

interface CompanyLogo {
	id: number;
	name: string;
	logo: string;
	uploaded_at: string;
}

type SizeOption = "small" | "medium" | "large";

interface MainLayoutProps {
	size?: SizeOption;
}

const MainLayout = ({ size = "medium" }: MainLayoutProps) => {
	const [companyLogo, setCompanyLogo] = useState<CompanyLogo | null>(null);
	const [logoLoading, setLogoLoading] = useState(true);

	useEffect(() => {
		const fetchCompanyLogo = async () => {
			try {
				const response = await fetch("http://127.0.0.1:8000/api/logo/");
				const data = await response.json();
				console.log(data);

				if (data && data.logo_url) {
					setCompanyLogo({
						id: 1,
						name: "Motherson",
						logo: data.logo_url,
						uploaded_at: "",
					});
				}
			} catch (error) {
				console.error("Error fetching company logo:", error);
			} finally {
				setLogoLoading(false);
			}
		};

		fetchCompanyLogo();
	}, []);

	const sizeClasses = {
		small: "text-sm px-2 py-1",
		medium: "text-base",
		large: "text-lg px-6 py-4",
	};

	return (
		<div className={`min-h-screen flex flex-col bg-white ${sizeClasses[size]}`}>
			<Nav />
			<ScrollToTop />
			
			<div className='pt-20 flex-grow'>
				<Outlet />
			</div>

			{/* Premium Footer */}
			<footer className='relative bg-gradient-to-r from-[#001A4D] via-[#002A75] to-[#003DA5] text-white overflow-hidden'>
				{/* Background Pattern */}
				<div className="absolute inset-0 opacity-5">
					<div className="absolute inset-0" style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
					}} />
				</div>

				{/* Bottom Bar */}
				<div className='relative border-t border-white/10 bg-black/20'>
					<div className='px-6 md:px-12 lg:px-20 py-4'>
						<div className='max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4'>
							<div className='text-sm text-white/60 text-center md:text-left'>
								© 2025{' '}
								<a
									href='https://www.motherson.com/'
									target='_blank'
									rel='noopener noreferrer'
									className='text-white/80 hover:text-white transition-colors duration-200 font-medium'
								>
									NL Technologies
								</a>
								. All rights reserved.
							</div>
							
							<div className='flex items-center gap-6 text-sm'>
								<a href='#' className='text-white/60 hover:text-white transition-colors duration-200'>
									Privacy Policy
								</a>
								<span className='text-white/40'>•</span>
								<a href='#' className='text-white/60 hover:text-white transition-colors duration-200'>
									Terms of Service
								</a>
								<span className='text-white/40'>•</span>
								<a href='#' className='text-white/60 hover:text-white transition-colors duration-200'>
									Cookie Policy
								</a>
							</div>
						</div>
					</div>
				</div>

				{/* Accent Line */}
				<div className='h-1 bg-gradient-to-r from-[#E31E24] via-[#FF6B6B] to-[#E31E24]' />
			</footer>
		</div>
	);
};

export default MainLayout;