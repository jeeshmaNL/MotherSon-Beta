import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Link = {
  name: string;
  path: string;
  icon?: LucideIcon;
};

type Props = {
  title: string;
  links: Link[];
  icon?: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  borderTopColor?: string;
  disabled?: boolean;
};

const Tile: React.FC<Props> = ({
  title,
  links,
  icon: Icon,
  iconBgColor = "bg-gradient-to-br from-[#003DA5] to-[#002A75]",
  iconColor = "text-white",
  borderTopColor = "from-[#003DA5] to-[#E31E24]",
  disabled = false
}) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    if (disabled) return;
    navigate(path);
  };

  return (
    <div
      className={`
        relative bg-white rounded-xl overflow-hidden
        shadow-lg hover:shadow-2xl transition-all duration-300
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-1'}
        group
      `}
      style={{
        minHeight: "320px",
      }}
    >
      {/* Top Gradient Border */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${borderTopColor}`} />
      
      {/* Card Content */}
      <div className="p-6">
        {/* Header Section */}
        <div className="mb-6">
          {/* Icon */}
          {Icon && (
            <div className={`
              w-14 h-14 ${iconBgColor} rounded-xl 
              flex items-center justify-center shadow-lg
              transform transition-transform duration-300
              ${!disabled && 'group-hover:scale-110 group-hover:rotate-3'}
              mb-4
            `}>
              <Icon className={`w-7 h-7 ${iconColor}`} strokeWidth={1.5} />
            </div>
          )}
          
          {/* Title */}
          <h3 className="text-xl font-bold text-[#001A4D] mb-2">
            {title}
          </h3>
          
          {/* Decorative Line */}
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-8 bg-gradient-to-r from-[#E31E24] to-transparent rounded-full" />
            <div className="h-1 w-1 bg-[#E31E24] rounded-full" />
          </div>
        </div>

        {/* Links Grid */}
        <div className={`space-y-2 ${disabled ? 'pointer-events-none' : ''}`}>
          {links.map((link, index) => (
            link.name && (
              <button
                key={index}
                className={`
                  w-full group/link flex items-center gap-3 p-3 rounded-lg
                  transition-all duration-200 text-left
                  ${disabled 
                    ? 'bg-gray-50 text-gray-400' 
                    : 'bg-gray-50 hover:bg-gradient-to-r hover:from-[#003DA5]/5 hover:to-[#E31E24]/5 hover:shadow-md active:scale-[0.98]'
                  }
                `}
                onClick={() => !disabled && handleNavigation(link.path)}
                tabIndex={disabled ? -1 : 0}
                onKeyDown={e => {
                  if (!disabled && (e.key === 'Enter' || e.key === ' ')) handleNavigation(link.path);
                }}
                aria-disabled={disabled}
              >
                {/* Link Icon */}
                {link.icon && (
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    transition-all duration-200
                    ${disabled 
                      ? 'bg-gray-200' 
                      : 'bg-gradient-to-br from-[#003DA5]/10 to-[#E31E24]/10 group-hover/link:from-[#003DA5]/20 group-hover/link:to-[#E31E24]/20'
                    }
                  `}>
                    <link.icon className={`
                      w-5 h-5 transition-colors duration-200
                      ${disabled ? 'text-gray-400' : 'text-[#003DA5] group-hover/link:text-[#E31E24]'}
                    `} />
                  </div>
                )}
                
                {/* Link Text */}
                <div className="flex-1">
                  <span className={`
                    text-sm font-medium block
                    ${disabled ? 'text-gray-400' : 'text-gray-700 group-hover/link:text-[#001A4D]'}
                  `}>
                    {link.name}
                  </span>
                </div>
                
                {/* Arrow Icon */}
                {!disabled && (
                  <svg 
                    className="w-4 h-4 text-gray-400 group-hover/link:text-[#E31E24] transition-all duration-200 group-hover/link:translate-x-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            )
          ))}
        </div>
      </div>

      {/* Bottom Gradient Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#003DA5]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Corner Accent */}
      <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-[#E31E24]/10 to-[#003DA5]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
};

export default Tile;