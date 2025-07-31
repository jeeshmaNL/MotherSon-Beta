

// import { useLocation, useNavigate } from "react-router-dom";
// import { CheckCircle, GraduationCap, CalendarCheck } from "lucide-react";
// import Nav from "../../../../../HomeNav/nav";
// import FileUploadComponent from "./FileUpload/FileUpload";


// interface LocationState {
//   lineId?: string;
//   lineName?: string;
//   prevpage?: string;
//   sectionTitle?: string;
//   questionPaperId?: number;
//   skillId?: number;
//   skillName?: string;
// }


// const TrainingOptionsPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   // const { lineId, lineName, prevpage,sectionTitle } = (location.state as LocationState) || {};
//   const { lineId, lineName, prevpage, sectionTitle, questionPaperId, skillId, skillName } = (location.state as LocationState) || {};

//   console.log('Received state:', { lineId, lineName, prevpage, sectionTitle, questionPaperId, skillId, skillName });
//   // Training Option Handlers
//   // const handleEvaluationTestClick = () => navigate("/");
//   const handleEvaluationTestClick = () => {
//     navigate("/assign-remote", {
//       state: {
//         lineId,
//         lineName,
//         prevpage,
//         sectionTitle,
//         questionPaperId,  // <-- pass questionPaperId forward
//         skillId,
//         levelId: 2, // Level 2 training
//         fromNavigation: true,
//         skillName: skillName || lineName, // Use the actual topic name as skill name
//         levelName: 'Level 2'
//       }
//     });
//   };
//   const handleOJTClick = () => {
//   navigate("/SearchBar", {
//     state: {
//       lineId,
//       lineName,
//       prevpage,
//       sectionTitle,
//       from: "OJT", // <-- Add this
//       nextPath: "/Level2OjtTable" // <-- Add this
//     }
//   });
// };
//   // const handleTenCycleClick = () => navigate("/SearchBar");
//   const handleTenCycleClick = () => {
//     navigate("/SearchBar", {
//       state: {
//         lineId,
//         lineName,
//         prevpage,
//         sectionTitle
//       }
//     });
//   };

//   // Render functions
//   const renderTrainingOptions = () => (
//     <div className="p-4 bg-gray-50 rounded-lg mx-auto mb-12">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div 
//           className="flex flex-col items-center p-6 bg-white rounded-lg hover:bg-blue-50 hover:border-blue-200 border-2 border-transparent transition-all duration-200 cursor-pointer shadow-sm"
//           onClick={handleEvaluationTestClick}
//         >
//           <CheckCircle className="w-10 h-10 text-blue-500 mb-4" />
//           <span className="text-gray-700 font-medium text-lg text-center">Evaluation Test</span>
//         </div>
        
//         <div 
//           className="flex flex-col items-center p-6 bg-white rounded-lg hover:bg-green-50 hover:border-green-200 border-2 border-transparent transition-all duration-200 cursor-pointer shadow-sm"
//           onClick={handleOJTClick}
//         >
//           <GraduationCap className="w-10 h-10 text-green-500 mb-4" />
//           <span className="text-gray-700 font-medium text-lg text-center">On-Job Training</span>
//         </div>
        
//         <div 
//           className="flex flex-col items-center p-6 bg-white rounded-lg hover:bg-purple-50 hover:border-purple-200 border-2 border-transparent transition-all duration-200 cursor-pointer shadow-sm"
//           onClick={handleTenCycleClick}
//         >
//           <CalendarCheck className="w-10 h-10 text-purple-500 mb-4" />
//           <span className="text-gray-700 font-medium text-lg text-center">10 Cycle</span>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <Nav />
//       <div className="mx-auto p-6 pt-20">
//         {renderTrainingOptions()}
//         <FileUploadComponent />
//       </div>
//     </>
//   );
// };

// export default TrainingOptionsPage; 



// styled version 

import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, GraduationCap, CalendarCheck } from "lucide-react";
import Nav from "../../../../../HomeNav/nav";
import FileUploadComponent from "./FileUpload/FileUpload";

interface LocationState {
  lineId?: string;
  lineName?: string;
  prevpage?: string;
  sectionTitle?: string;
  questionPaperId?: number;
  skillId?: number;
  skillName?: string;
}

const TrainingOptionsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lineId, lineName, prevpage, sectionTitle, questionPaperId, skillId, skillName } = (location.state as LocationState) || {};

  // Handlers (unchanged)
  const handleEvaluationTestClick = () => {
    navigate("/assign-remote", {
      state: {
        lineId,
        lineName,
        prevpage,
        sectionTitle,
        questionPaperId,
        skillId,
        levelId: 2,
        fromNavigation: true,
        skillName: skillName || lineName,
        levelName: 'Level 2'
      }
    });
  };
  const handleOJTClick = () => {
    navigate("/SearchBar", {
      state: {
        lineId,
        lineName,
        prevpage,
        sectionTitle,
        from: "OJT",
        nextPath: "/Level2OjtTable"
      }
    });
  };
  const handleTenCycleClick = () => {
    navigate("/SearchBar", {
      state: {
        lineId,
        lineName,
        prevpage,
        sectionTitle
      }
    });
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-100 flex flex-col items-center justify-start pt-24 px-0 relative">
        {/* Floating background shapes */}
        <div className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden z-0">
          <svg className="absolute top-10 left-10 w-24 h-24 opacity-10 blur-md animate-float-slow" viewBox="0 0 100 100">
            <rect x="25" y="25" width="50" height="50" fill="#a5b4fc" transform="rotate(45 50 50)" />
          </svg>
          <svg className="absolute bottom-20 right-20 w-32 h-32 opacity-10 blur-lg animate-float-medium" viewBox="0 0 100 100">
            <rect x="20" y="20" width="60" height="60" fill="#f0abfc" transform="rotate(45 50 50)" />
          </svg>
          <svg className="absolute top-1/2 left-1/4 w-16 h-16 opacity-10 blur-sm animate-float-fast" viewBox="0 0 100 100">
            <rect x="30" y="30" width="40" height="40" fill="#6ee7b7" transform="rotate(45 50 50)" />
          </svg>
        </div>
        {/* Main content */}
        <div className="w-full max-w-7xl mx-auto rounded-3xl bg-white/60 backdrop-blur shadow-2xl border border-blue-100 p-8 mt-4 z-10">
          {/* Section Title */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-blue-900 mb-2 tracking-tight">
              {sectionTitle || "Select Training Option"}
            </h2>
            <div className="mx-auto w-16 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 rounded-full opacity-40" />
            {lineName && (
              <div className="mt-2 text-blue-500 font-medium text-lg">{lineName}</div>
            )}
          </div>
          {/* Full-width Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full">
            {/* Evaluation Test */}
            <div
              className="flex flex-col items-center p-10 bg-white/80 rounded-2xl border border-blue-100 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer group w-full"
              onClick={handleEvaluationTestClick}
            >
              <CheckCircle className="w-16 h-16 text-blue-500 mb-4 group-hover:text-blue-600 transition-colors" />
              <span className="text-blue-900 font-semibold text-xl text-center">Evaluation Test</span>
            </div>
            {/* On-Job Training */}
            <div
              className="flex flex-col items-center p-10 bg-white/80 rounded-2xl border border-green-100 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer group w-full"
              onClick={handleOJTClick}
            >
              <GraduationCap className="w-16 h-16 text-green-500 mb-4 group-hover:text-green-600 transition-colors" />
              <span className="text-green-900 font-semibold text-xl text-center">On-Job Training</span>
            </div>
            {/* 10 Cycle */}
            <div
              className="flex flex-col items-center p-10 bg-white/80 rounded-2xl border border-purple-100 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer group w-full"
              onClick={handleTenCycleClick}
            >
              <CalendarCheck className="w-16 h-16 text-purple-500 mb-4 group-hover:text-purple-600 transition-colors" />
              <span className="text-purple-900 font-semibold text-xl text-center">10 Cycle</span>
            </div>
          </div>
        </div>
        {/* File Upload Section */}
        <div className="w-full max-w-7xl mx-auto mt-10 z-10 px-2">
          <FileUploadComponent />
        </div>
        {/* Animations */}
        <style>
          {`
            .animate-float-slow {
              animation: floatY 8s ease-in-out infinite alternate;
            }
            .animate-float-medium {
              animation: floatY 6s ease-in-out infinite alternate;
            }
            .animate-float-fast {
              animation: floatY 4s ease-in-out infinite alternate;
            }
            @keyframes floatY {
              from { transform: translateY(0px);}
              to { transform: translateY(-30px);}
            }
          `}
        </style>
      </div>
    </>
  );
};

export default TrainingOptionsPage;