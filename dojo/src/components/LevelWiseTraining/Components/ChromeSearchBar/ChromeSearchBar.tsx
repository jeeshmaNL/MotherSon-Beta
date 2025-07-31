// import { useEffect, useRef, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Search, ScanLine, X } from 'lucide-react';
// import { Html5Qrcode } from 'html5-qrcode';
// import Nav from '../../../HomeNav/nav';

// // Updated Type definitions for Operator Master
// interface OperatorMaster {
//   id: number;
//   sr_no: number;
//   employee_code: string;
//   full_name: string;
//   date_of_join: string | null;
//   employee_pattern_category: string;
//   designation: string;
//   department: string;
//   department_code: string;
// }

// interface LocationState {
//   lineId?: string;
//   lineName?: string;
//   prevpage?: string;
//   sectionTitle?:string;
// }

// interface ApiResponse {
//   results?: OperatorMaster[];
//   data?: OperatorMaster[];
// }

// const SearchBarWithQRScanner = () => {
//   const location = useLocation();
//   const { lineId, lineName, prevpage,sectionTitle } = (location.state as LocationState) || {};

//   console.log('Received state:', { lineId, lineName, prevpage,sectionTitle });

//   const [query, setQuery] = useState<string>('');
//   const [operators, setOperators] = useState<OperatorMaster[]>([]);
//   const [filteredOperators, setFilteredOperators] = useState<OperatorMaster[]>([]);
//   const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
//   const [selectedOperator, setSelectedOperator] = useState<OperatorMaster | null>(null);
//   const [showScanner, setShowScanner] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(false);

//   const scannerRef = useRef<HTMLDivElement>(null);
//   const qrCodeScannerRef = useRef<Html5Qrcode | null>(null);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const suggestionsRef = useRef<HTMLDivElement>(null);
//   const navigate = useNavigate();

//   // Fetch operators from API
//   useEffect(() => {
//     const fetchOperators = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch('http://127.0.0.1:8000/operators-master/');
//         if (response.ok) {
//           const data: ApiResponse = await response.json();
//           console.log('API Response:', data);
//           const operatorData = data.results || data.data || (Array.isArray(data) ? data : []);
//           setOperators(operatorData as OperatorMaster[]);
//         } else {
//           console.error('Failed to fetch operators');
//         }
//       } catch (error) {
//         console.error('Error fetching operators:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOperators();
//   }, []);

//   // Filter operators based on query - real-time like YouTube
//   useEffect(() => {
//     const debounceTimer = setTimeout(() => {
//       if (query.trim() && operators.length > 0) {
//         const filtered = operators.filter(operator =>
//           operator.full_name.toLowerCase().includes(query.toLowerCase()) ||
//           operator.employee_code.toLowerCase().includes(query.toLowerCase())
//         );
//         setFilteredOperators(filtered.slice(0, 10)); // Limit to 10 suggestions like YouTube
//         setShowSuggestions(true);
//       } else {
//         setFilteredOperators([]);
//         setShowSuggestions(false);
//       }
//     }, 150); // Small debounce for smooth typing

//     return () => clearTimeout(debounceTimer);
//   }, [query, operators]);

//   // Handle click outside to close suggestions
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         suggestionsRef.current &&
//         !suggestionsRef.current.contains(event.target as Node) &&
//         inputRef.current &&
//         !inputRef.current.contains(event.target as Node)
//       ) {
//         setShowSuggestions(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // const getTargetPage = () => {
//   //   switch (prevpage) {
//   //     case 'lvl2':
//   //       return '/CycleCheckSheet';
//   //     case 'QualityLevel2':
//   //       return '/Level2OjtQualityTable';
//   //     case 'Level 3':
//   //       return '/CycleCheckSheet';
//   //     case 'QualityLevel3':
//   //       return '/Level3OjtQualityTable';
//   //     default:
//   //       return '/level1ojttable';
//   //   }
//   // };
//   const getTargetPage = () => {
//   // If nextPath is provided in state, use it
//   if (location.state && (location.state as any).nextPath) {
//     return (location.state as any).nextPath;
//   }
//   // Otherwise, use your existing logic
//   switch (prevpage) {
//     case 'lvl2':
//       return '/CycleCheckSheet';
//     case 'QualityLevel2':
//       return '/Level2OjtTable';
//     case 'Level 3':
//       return '/CycleCheckSheet';
//     case 'QualityLevel3':
//       return '/Level3OjtQualityTable';
//     default:
//       return '/level1ojttable';
//   }
// };

//   const handleNavigation = (operator: OperatorMaster) => {
//     const targetPage = getTargetPage();

//     console.log('Navigating to:', targetPage, 'with operator:', operator);

//     navigate(targetPage, {
//       state: {
//         operatorId: operator.employee_code,
//         employeeName: operator.full_name || 'Unknown Operator',
//         operatorData: operator,
//         lineId,
//         lineName,
//         prevpage,
//         sectionTitle
//       }
//     });
//   };

//   const handleSearch = () => {
//     if (selectedOperator) {
//       handleNavigation(selectedOperator);
//     } else if (query.trim() && filteredOperators.length > 0) {
//       // If no specific operator selected, use the first match
//       handleNavigation(filteredOperators[0]);
//     }
//   };

//   const handleOperatorSelect = (operator: OperatorMaster) => {
//     setSelectedOperator(operator);
//     setQuery(operator.full_name || operator.employee_code);
//     setShowSuggestions(false);
//     // Navigate immediately when operator is selected from dropdown
//     setTimeout(() => {
//       handleNavigation(operator);
//     }, 100);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setQuery(value);
//     setSelectedOperator(null);

//     // If input is cleared, hide suggestions
//     if (!value.trim()) {
//       setShowSuggestions(false);
//       setFilteredOperators([]);
//     }
//   };

//   const handleInputFocus = () => {
//     // Show suggestions on focus if there's a query and results
//     if (query.trim() && filteredOperators.length > 0) {
//       setShowSuggestions(true);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       handleSearch();
//     } else if (e.key === 'Escape') {
//       setShowSuggestions(false);
//     }
//   };

//   const clearSearch = () => {
//     setQuery('');
//     setSelectedOperator(null);
//     setShowSuggestions(false);
//     inputRef.current?.focus();
//   };

//   const startScanner = async () => {
//     if (!scannerRef.current) return;

//     const scannerId = scannerRef.current.id;
//     const html5QrCode = new Html5Qrcode(scannerId);
//     qrCodeScannerRef.current = html5QrCode;

//     try {
//       await html5QrCode.start(
//         { facingMode: 'environment' },
//         { fps: 10, qrbox: 250 },
//         (decodedText: string) => {
//           stopScanner();
//           // Try to find operator by scanned code (employee_code)
//           const operator = operators.find(op => op.employee_code === decodedText);

//           if (operator) {
//             handleNavigation(operator);
//           } else {
//             // If no operator found, create a mock operator object with the scanned ID
//             const mockOperator: OperatorMaster = {
//               id: 0,
//               sr_no: 0,
//               employee_code: decodedText,
//               full_name: 'Unknown Operator',
//               date_of_join: null,
//               employee_pattern_category: '',
//               designation: '',
//               department: '',
//               department_code: ''
//             };
//             handleNavigation(mockOperator);
//           }
//         },
//         (error: string) => {
//           console.warn('QR scan error:', error);
//         }
//       );
//     } catch (err) {
//       console.error('Scanner error:', err);
//     }
//   };

//   const stopScanner = () => {
//     const scanner = qrCodeScannerRef.current;
//     if (scanner) {
//       scanner.stop().then(() => {
//         scanner.clear();
//         qrCodeScannerRef.current = null;
//         setShowScanner(false);
//       }).catch((error) => {
//         console.error('Error stopping scanner:', error);
//         qrCodeScannerRef.current = null;
//         setShowScanner(false);
//       });
//     } else {
//       setShowScanner(false);
//     }
//   };

//   useEffect(() => {
//     if (showScanner) {
//       startScanner();
//     }

//     return () => {
//       if (qrCodeScannerRef.current) {
//         qrCodeScannerRef.current.stop().then(() => {
//           qrCodeScannerRef.current?.clear();
//           qrCodeScannerRef.current = null;
//         }).catch((error) => {
//           console.error('Error cleaning up scanner:', error);
//           qrCodeScannerRef.current = null;
//         });
//       }
//     };
//   }, [showScanner]);

//   return (
//     <>
//       <Nav />
//       <div className="flex flex-col justify-center items-center h-screen bg-white relative">
//         <h1 className="text-3xl font-bold text-[#1c2a4d] mb-6">{lineName}</h1>

//         <div className="relative w-[600px]">
//           <div className="flex items-center bg-white px-4 py-3 rounded-[15px] shadow-md border transition-all duration-200">
//             <Search
//               className="text-gray-500 mr-3 cursor-pointer hover:text-blue-500 transition-colors"
//               size={20}
//               onClick={handleSearch}
//             />
//             <input
//               ref={inputRef}
//               type="text"
//               placeholder="Search by operator name or employee code"
//               className="flex-1 outline-none bg-transparent text-gray-800 text-base"
//               value={query}
//               onChange={handleInputChange}
//               onFocus={handleInputFocus}
//               onKeyDown={handleKeyDown}
//               autoComplete="off"
//             />
//             {query && (
//               <button
//                 onClick={clearSearch}
//                 className="p-1 text-gray-400 hover:text-gray-600 transition-colors mr-2"
//               >
//                 <X size={16} />
//               </button>
//             )}
//             <div className="border-l border-gray-300 pl-3 ml-2">
//               <button
//                 onClick={() => setShowScanner(true)}
//                 className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
//                 title="Scan QR Code"
//               >
//                 <ScanLine size={20} />
//               </button>
//             </div>
//           </div>

//           {/* YouTube-style Suggestions Dropdown */}
//           {showSuggestions && (
//             <div
//               ref={suggestionsRef}
//               className="absolute left-0 right-0 mt-[5px] bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-40"
//             >
//               {loading ? (
//                 <div className="p-4 text-center text-gray-500 flex items-center justify-center">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
//                   Loading operators...
//                 </div>
//               ) : filteredOperators.length > 0 ? (
//                 filteredOperators.map((operator, index) => (
//                   <div
//                     key={`${operator.id}-${index}`}
//                     className="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 group"
//                     onClick={() => handleOperatorSelect(operator)}
//                   >
//                     <Search className="text-gray-400 mr-3 flex-shrink-0" size={16} />
//                     <div className="flex-1 min-w-0">
//                       <div className="font-medium text-gray-900 truncate">
//                         {operator.full_name || 'No name available'}
//                       </div>
//                       <div className="text-sm text-gray-600 truncate">
//                         {operator.employee_code} • {operator.department || 'No department'}
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : query.trim() ? (
//                 <div className="p-4 text-center text-gray-500">
//                   <div className="text-sm">No operators found for "{query}"</div>
//                 </div>
//               ) : null}
//             </div>
//           )}
//         </div>

//         {/* QR Scanner Modal */}
//         {showScanner && (
//           <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50">
//             <div className="bg-white p-4 rounded-lg shadow-lg relative">
//               <button
//                 onClick={stopScanner}
//                 className="absolute top-1 right-2 text-red-600 font-bold text-lg"
//               >
//                 ✕
//               </button>
//               <div id="qr-reader" ref={scannerRef} className="w-[300px] h-[300px]" />
//               <p className="text-center mt-2 text-sm text-gray-600">Scan a QR code</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default SearchBarWithQRScanner;  



//styled searchbar 
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ScanLine, X } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import Nav from '../../../HomeNav/nav';

interface OperatorMaster {
  id: number;
  sr_no: number;
  employee_code: string;
  full_name: string;
  date_of_join: string | null;
  employee_pattern_category: string;
  designation: string;
  department: string;
  department_code: string;
}

interface LocationState {
  lineId?: string;
  lineName?: string;
  prevpage?: string;
  sectionTitle?: string;
}

interface ApiResponse {
  results?: OperatorMaster[];
  data?: OperatorMaster[];
}

const SearchBarWithQRScanner = () => {
  const location = useLocation();
  const { lineId, lineName, prevpage, sectionTitle } = (location.state as LocationState) || {};

  const [query, setQuery] = useState<string>('');
  const [operators, setOperators] = useState<OperatorMaster[]>([]);
  const [filteredOperators, setFilteredOperators] = useState<OperatorMaster[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectedOperator, setSelectedOperator] = useState<OperatorMaster | null>(null);
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const scannerRef = useRef<HTMLDivElement>(null);
  const qrCodeScannerRef = useRef<Html5Qrcode | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOperators = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/operators-master/');
        if (response.ok) {
          const data: ApiResponse = await response.json();
          const operatorData = data.results || data.data || (Array.isArray(data) ? data : []);
          setOperators(operatorData as OperatorMaster[]);
        }
      } catch (error) {
        // error
      } finally {
        setLoading(false);
      }
    };
    fetchOperators();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.trim() && operators.length > 0) {
        const filtered = operators.filter(operator =>
          operator.full_name.toLowerCase().includes(query.toLowerCase()) ||
          operator.employee_code.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredOperators(filtered.slice(0, 10));
        setShowSuggestions(true);
      } else {
        setFilteredOperators([]);
        setShowSuggestions(false);
      }
    }, 150);
    return () => clearTimeout(debounceTimer);
  }, [query, operators]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTargetPage = () => {
    if (location.state && (location.state as any).nextPath) {
      return (location.state as any).nextPath;
    }
    switch (prevpage) {
      case 'lvl2':
        return '/CycleCheckSheet';
      case 'QualityLevel2':
        return '/Level2OjtTable';
      case 'Level 3':
        return '/CycleCheckSheet';
      case 'QualityLevel3':
        return '/Level3OjtQualityTable';
      default:
        return '/level1ojttable';
    }
  };

  const handleNavigation = (operator: OperatorMaster) => {
    const targetPage = getTargetPage();
    navigate(targetPage, {
      state: {
        operatorId: operator.employee_code,
        employeeName: operator.full_name || 'Unknown Operator',
        operatorData: operator,
        lineId,
        lineName,
        prevpage,
        sectionTitle
      }
    });
  };

  const handleSearch = () => {
    if (selectedOperator) {
      handleNavigation(selectedOperator);
    } else if (query.trim() && filteredOperators.length > 0) {
      handleNavigation(filteredOperators[0]);
    }
  };

  const handleOperatorSelect = (operator: OperatorMaster) => {
    setSelectedOperator(operator);
    setQuery(operator.full_name || operator.employee_code);
    setShowSuggestions(false);
    setTimeout(() => {
      handleNavigation(operator);
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedOperator(null);
    if (!value.trim()) {
      setShowSuggestions(false);
      setFilteredOperators([]);
    }
  };

  const handleInputFocus = () => {
    if (query.trim() && filteredOperators.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSelectedOperator(null);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const startScanner = async () => {
    if (!scannerRef.current) return;
    const scannerId = scannerRef.current.id;
    const html5QrCode = new Html5Qrcode(scannerId);
    qrCodeScannerRef.current = html5QrCode;
    try {
      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        (decodedText: string) => {
          stopScanner();
          const operator = operators.find(op => op.employee_code === decodedText);
          if (operator) {
            handleNavigation(operator);
          } else {
            const mockOperator: OperatorMaster = {
              id: 0,
              sr_no: 0,
              employee_code: decodedText,
              full_name: 'Unknown Operator',
              date_of_join: null,
              employee_pattern_category: '',
              designation: '',
              department: '',
              department_code: ''
            };
            handleNavigation(mockOperator);
          }
        },
        (error: string) => {
          // scan error
        }
      );
    } catch (err) {
      // scanner error
    }
  };

  const stopScanner = () => {
    const scanner = qrCodeScannerRef.current;
    if (scanner) {
      scanner.stop().then(() => {
        scanner.clear();
        qrCodeScannerRef.current = null;
        setShowScanner(false);
      }).catch(() => {
        qrCodeScannerRef.current = null;
        setShowScanner(false);
      });
    } else {
      setShowScanner(false);
    }
  };

  useEffect(() => {
    if (showScanner) {
      startScanner();
    }
    return () => {
      if (qrCodeScannerRef.current) {
        qrCodeScannerRef.current.stop().then(() => {
          qrCodeScannerRef.current?.clear();
          qrCodeScannerRef.current = null;
        }).catch(() => {
          qrCodeScannerRef.current = null;
        });
      }
    };
  }, [showScanner]);

  return (
     <>
      <Nav />
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-white to-[#e0e7ef] relative px-2 overflow-hidden">
        {/* Floating background icons */}
        <div className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden z-0">
          {/* Diamond shapes */}
          <svg className="absolute top-10 left-10 w-16 h-16 animate-float-slow" viewBox="0 0 100 100">
            <rect x="25" y="25" width="50" height="50" fill="blue" transform="rotate(45 50 50)" />
          </svg>
          <svg className="absolute bottom-20 right-20 w-20 h-20  animate-float-medium" viewBox="0 0 100 100">
            <rect x="20" y="20" width="60" height="60" fill="#3b82f6" transform="rotate(45 50 50)" />
          </svg>
          <svg className="absolute top-1/2 left-1/4 w-16 h-16 animate-float-fast" viewBox="0 0 100 100">
            <rect x="30" y="30" width="50" height="50" fill="#2563eb" transform="rotate(45 50 50)" />
          </svg>
          {/* Search icons */}
          <div className="absolute top-1/4 right-10  animate-float-medium">
            <Search size={48} className="text-blue-400" />
          </div>
          <div className="absolute bottom-10 left-1/3  animate-float-slow">
            <Search size={36} className="text-blue-400" />
          </div>
          <div className="absolute bottom-1/3 right-1/4 animate-float-fast">
            <Search size={40} className="text-blue-400" />
          </div>
        </div>
        {/* Main content */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1c2a4d] mb-8 tracking-tight drop-shadow-sm text-center z-10">
          {lineName}
        </h1>
        <div className="relative w-full max-w-xl z-10">
          <div className="flex items-center bg-white/60 backdrop-blur border border-blue-100 px-2 py-2 rounded-full shadow-lg transition-all duration-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-200/60 mr-2">
              <Search className="text-blue-500" size={28} />
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by operator name or employee code"
              className="flex-1 outline-none bg-transparent text-blue-900 text-lg placeholder-blue-400 font-medium"
              value={query}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              spellCheck={false}
              style={{ minHeight: 48 }}
            />
            {query && (
              <button
                onClick={clearSearch}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors mr-1"
                aria-label="Clear search"
              >
                <X size={20} />
              </button>
            )}
            <button
              onClick={() => setShowScanner(true)}
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-500 hover:text-blue-700 transition-colors shadow-sm ml-1"
              title="Scan QR Code"
              aria-label="Scan QR Code"
            >
              <ScanLine size={22} />
            </button>
            {/* <div className="border-l border-gray-200 pl-3 ml-2">
              <button
                onClick={() => setShowScanner(true)}
                className="p-2 rounded-full bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-500 transition-colors shadow-sm"
                title="Scan QR Code"
                aria-label="Scan QR Code"
              >
                <ScanLine size={22} />
              </button>
            </div> */}
          </div>
          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <div
              ref={suggestionsRef}
              className="absolute left-0 right-0 mt-3 bg-white/70 backdrop-blur border border-blue-100 rounded-3xl shadow-xl max-h-80 overflow-y-auto z-40 animate-fade-in"
              style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}
            >
              {loading ? (
                <div className="p-8 flex flex-col items-center justify-center text-blue-400">
                  <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-400 mb-3"></div>
                  <span className="text-base font-medium">Loading operators...</span>
                </div>
              ) : filteredOperators.length > 0 ? (
                filteredOperators.map((operator, index) => (
                  <div
                    key={`${operator.id}-${index}`}
                    className="flex items-center px-5 py-4 hover:bg-blue-100/60 cursor-pointer transition-colors border-b border-blue-50 last:border-b-0 group rounded-2xl mx-2 my-1"
                    onClick={() => handleOperatorSelect(operator)}
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100/60 mr-3">
                      <Search className="text-blue-400" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-blue-900 truncate group-hover:text-blue-700">
                        {operator.full_name || 'No name available'}
                      </div>
                      <div className="text-sm text-blue-500 truncate">
                        {operator.employee_code}
                        <span className="mx-1 text-blue-200">•</span>
                        {operator.department || 'No department'}
                      </div>
                    </div>
                  </div>
                ))
              ) : query.trim() ? (
                <div className="p-8 text-center text-blue-300">
                  <div className="text-base font-medium">
                    No operators found for "<span className="font-semibold">{query}</span>"
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
        {/* QR Scanner Modal */}
        {showScanner && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-white p-6 rounded-2xl shadow-2xl relative w-[340px] max-w-full flex flex-col items-center">
              <button
                onClick={stopScanner}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors text-2xl font-bold focus:outline-none"
                aria-label="Close QR Scanner"
              >
                <X size={28} />
              </button>
              <div id="qr-reader" ref={scannerRef} className="w-[280px] h-[280px] rounded-lg border-2 border-blue-100 shadow-inner bg-gray-50" />
              <p className="text-center mt-4 text-sm text-gray-500">Scan a QR code</p>
            </div>
          </div>
        )}
      </div>
      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 0.25s ease;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px);}
            to { opacity: 1; transform: translateY(0);}
          }
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
    </>
  );
};

export default SearchBarWithQRScanner;


