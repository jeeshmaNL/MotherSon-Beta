// import React from 'react';
// import Tile from './Tile';
// import { tiles } from './tileData';

// const Home: React.FC = () => {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <main className="pb-6">
//         {/* Header Section */}
//         <div className="bg-[#001740] text-white text-center py-4 md:py-6 px-4 mb-6">
//           <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2">
//             Digital Operations Excellence
//           </h1>
//           <h3 className="text-sm md:text-md font-semibold italic">
//             Empowering Industrial Excellence Through Digital Transformation
//           </h3>
//         </div>

//         {/* Tiles Section - always 2 columns for links */}
//         <div className="px-4 sm:px-6 lg:px-8 xl:px-24">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full max-w-[1800px] mx-auto">
//             {tiles.map(tile => (
//               <Tile
//                 key={tile.title}
//                 title={tile.title}
//                 links={tile.links}
//                 icon={tile.icon}
//                 iconBgColor={tile.iconBgColor}
//                 iconColor={tile.iconColor}
//                 statusText={tile.statusText}  
//                 borderTopColor={tile.borderTopColor}
//               />
//             ))}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Home;

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
    
    // Add scroll event listener for parallax effect
    const handleScroll = () => {
      const header = document.getElementById('header-section');
      if (header) {
        const scrollPosition = window.scrollY;
        header.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Nav />
      <main className="pt-1 pb-12 flex-grow w-full">
        {/* Header Section with improved design */}
        <div 
          id="header-section"
          className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mb-12 shadow-xl"
        >
          {/* Background pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMCAxLjEtLjkgMi0yIDJzLTItLjktMi0yIC45LTIgMi0yIDIgLjkgMiAyem0wLTE3YzAgMS4xLS45IDItMiAycy0yLS45LTItMiAuOS0yIDItMiAyIC45IDIgMnptMTcgMTdjMCAxLjEtLjkgMi0yIDJzLTItLjktMi0yIC45LTIgMi0yIDIgLjkgMiAyem0wLTE3YzAgMS4xLS45IDItMiAycy0yLS45LTItMiAuOS0yIDItMiAyIC45IDIgMnptMTcgMTdjMCAxLjEtLjkgMi0yIDJzLTItLjktMi0yIC45LTIgMi0yIDIgLjkgMiAyem0wLTE3YzAgMS4xLS45IDItMiAycy0yLS45LTItMiAuOS0yIDItMiAyIC45IDIgMnptMTcgMTdjMCAxLjEtLjkgMi0yIDJzLTItLjktMi0yIC45LTIgMi0yIDIgLjkgMiAyem0wLTE3YzAgMS4xLS45IDItMiAycy0yLS45LTItMiAuOS0yIDItMiAyIC45IDIgMnpNMTkgNTFjMCAxLjEtLjkgMi0yIDJzLTItLjktMi0yIC45LTIgMi0yIDIgLjkgMiAyem0wLTE3YzAgMS4xLS45IDItMiAycy0yLS45LTItMiAuOS0yIDItMiAyIC45IDIgMnptMC0xN2MwIDEuMS0uOSAyLTIgMnMtMi0uOS0yLTIgLjktMiAyLTIgMiAuOSAyIDJ6bTE3IDE3YzAgMS4xLS45IDItMiAycy0yLS45LTItMiAuOS0yIDItMiAyIC45IDIgMnptMC0xN2MwIDEuMS0uOSAyLTIgMnMtMi0uOS0yLTIgLjktMiAyLTIgMiAuOSAyIDJ6bTE3IDE3YzAgMS4xLS45IDItMiAycy0yLS45LTItMiAuOS0yIDItMiAyIC45IDIgMnptMC0xN2MwIDEuMS0uOSAyLTIgMnMtMi0uOS0yLTIgLjktMiAyLTIgMiAuOSAyIDJ6bTE3IDE3YzAgMS4xLS45IDItMiAycy0yLS45LTItMiAuOS0yIDItMiAyIC45IDIgMnptMC0xN2MwIDEuMS0uOSAyLTIgMnMtMi0uOS0yLTIgLjktMiAyLTIgMiAuOSAyIDJ6TTE5IDY4YzAgMS4xLS45IDItMiAycy0yLS45LTItMiAuOS0yIDItMiAyIC45IDIgMnptMTcgMGMwIDEuMS0uOSAyLTIgMnMtMi0uOS0yLTIgLjktMiAyLTIgMiAuOSAyIDJ6bTE3IDBjMCAxLjEtLjkgMi0yIDJzLTItLjktMi0yIC45LTIgMi0yIDIgLjkgMiAyem0xNyAwYzAgMS4xLS45IDItMiAycy0yLS45LTItMiAuOS0yIDItMiAyIC45IDIgMnoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
          
          {/* Accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          <div className={`relative py-16  flex flex-col items-center justify-center transition-all duration-1000 ease-out ${animateHeader ? 'opacity-100' : 'opacity-0 transform translate-y-4'}`}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center tracking-tight">
              Digital Operations Excellence
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mb-4 transition-all duration-700 ease-in-out"></div>
            <h2 className="text-xl md:text-2xl font-medium mb-2 text-gray-200 tracking-wide">
              Skill Development Platform
            </h2>
          </div>
        </div>

        {/* Tiles Section - enhanced with staggered animations */}
        <div className="px-4 sm:px-8 lg:px-12 xl:px-24 max-w-8xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {tiles.map((tile, index) => (
              <div 
                key={tile.title}
                className="tile-animation"
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
            transform: translateY(20px);
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