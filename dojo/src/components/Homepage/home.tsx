import React, { useState, useEffect } from "react";
import Nav from "../HomeNav/nav";
import Tile from "./Tile";
import { tiles } from "./tileData";

interface CompanyLogo {
  id: number;
  name: string;
  logo: string;
  uploaded_at: string;
}

const Home: React.FC = () => {
  const [companyLogo, setCompanyLogo] = useState<CompanyLogo | null>(null);
  const [logoLoading, setLogoLoading] = useState(true);
  const [animateHeader, setAnimateHeader] = useState(false);

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
    
    // Trigger header animation after a small delay
    setTimeout(() => setAnimateHeader(true), 100);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Nav />
      <main className=" pb-12 flex-grow w-full">
        {/* Hero Section with Premium Design */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#003DA5] via-[#002A75] to-[#001A4D] mb-16">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#001A4D]/50 to-transparent" />

          {/* Content */}
          <div className={`relative py-20 px-6 transition-all duration-1000 ease-out ${animateHeader ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                Digital Operations Excellence
              </h1>
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-1 w-24 bg-gradient-to-r from-transparent to-[#E31E24]" />
                <div className="h-2 w-2 bg-[#E31E24] rounded-full" />
                <div className="h-1 w-24 bg-gradient-to-l from-transparent to-[#E31E24]" />
              </div>
              <p className="text-xl md:text-2xl text-white/90 font-light">
                Empowering Skills, Driving Innovation
              </p>
            </div>
          </div>

          {/* Bottom Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
            </svg>
          </div>
        </div>

        {/* Tiles Grid with Enhanced Styling */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tiles.map((tile, index) => (
              <div 
                key={tile.title}
                className="transform transition-all duration-500 ease-out"
                style={{ 
                  opacity: 0,
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <Tile
                  title={tile.title}
                  links={tile.links}
                  icon={tile.icon}
                  iconBgColor={tile.iconBgColor}
                  iconColor={tile.iconColor}
                  borderTopColor={tile.borderTopColor}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
      
      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;