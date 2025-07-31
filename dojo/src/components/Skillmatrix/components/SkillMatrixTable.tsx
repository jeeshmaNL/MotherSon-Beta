// import React from 'react';
// import SkillPieChart from './SkillPiechart';
// import { Users, Calendar, FileText } from 'lucide-react';
// import { SkillMatrix, Operation, Section, MonthlySkill, Month } from '../api/types';
// import MonthPieChart from './MonthPieChart';

// interface SkillMatrixTableProps {
//     skillMatrices: SkillMatrix[];
//     selectedMatrix: SkillMatrix | null;
//     employees: any[];
//     operations: Operation[];
//     sections: Section[];
//     monthlySkills: MonthlySkill[];
//     months: Month[];
//     skillMatrixData?: any;
//     isLoading: boolean;
//     error: string | null;
//     onMatrixChange: (matrix: SkillMatrix) => void;
// }

// const SkillMatrixTable: React.FC<SkillMatrixTableProps> = ({
//     skillMatrices,
//     selectedMatrix,
//     employees,
//     operations,
//     sections,
//     monthlySkills,
//     months,
//     skillMatrixData,
//     isLoading,
//     error,
//     onMatrixChange,
// }) => {
//     const getDepartmentEmployees = (): any[] => {
//         if (!selectedMatrix) return [];

//         // Use automatic skill matrix data if available
//         if (skillMatrixData && skillMatrixData.employees) {
//             return skillMatrixData.employees.filter((emp: any) => {
//                 // Show employees who have skills in this department
//                 const departmentSkills = skillMatrixData.skills?.filter((skill: any) => skill.department === selectedMatrix.department) || [];
//                 const hasSkillsInDept = departmentSkills.some((skill: any) => emp.skills[skill.name] > 0);
//                 return hasSkillsInDept;
//             }).map((emp: any) => ({
//                 employee_code: emp.id.toString(),
//                 full_name: emp.name,
//                 designation: 'Employee', // Default designation
//                 date_of_join: '2024-01-01', // Default date
//                 department: emp.department,
//                 section: null
//             }));
//         }

//         // Fallback to old data
//         return employees.filter(emp => emp.department === selectedMatrix.department);
//     };

//     const getDepartmentOperations = (): Operation[] => {
//         if (!selectedMatrix) return [];

//         // Use automatic skill matrix data if available
//         if (skillMatrixData && skillMatrixData.skills) {
//             const departmentSkills = skillMatrixData.skills.filter((skill: any) => skill.department === selectedMatrix.department);
//             return departmentSkills.map((skill: any, index: number) => ({
//                 id: index + 1,
//                 name: skill.name,
//                 number: index + 1,
//                 matrix: selectedMatrix.id,
//                 section: 1, // Default section
//                 minimum_skill_required: 1 // Default minimum skill
//             }));
//         }

//         // Fallback to old data
//         return operations.filter(op => op.matrix === selectedMatrix.id);
//     };

//     const getUniqueSections = (): Section[] => {
//         const departmentOperations = getDepartmentOperations();
//         const sectionIds = [...new Set(departmentOperations.map(op => op.section))];
//         return sections.filter(section => sectionIds.includes(section.id));
//     };

//     const getEmployeeMonthlySkills = (employeeCode: string): MonthlySkill[] => {
//         if (!selectedMatrix) return [];

//         // Use automatic skill matrix data if available
//         if (skillMatrixData && skillMatrixData.employees) {
//             const employee = skillMatrixData.employees.find((emp: any) => emp.id.toString() === employeeCode);
//             if (employee) {
//                 const departmentSkills = skillMatrixData.skills?.filter((skill: any) => skill.department === selectedMatrix.department) || [];
//                 return departmentSkills.map((skill: any, index: number) => ({
//                     id: index + 1,
//                     employee_code: employeeCode,
//                     level: employee.skills[skill.name]?.toString() || '0',
//                     operation: (index + 1).toString(),
//                     operation_number: index + 1,
//                     department: selectedMatrix.department,
//                     date: new Date().toISOString(),
//                     full_name: employee.name,
//                     designation: 'Employee',
//                     section: selectedMatrix.department
//                 }));
//             }
//         }

//         // Fallback to old data
//         return monthlySkills.filter(ms =>
//             ms.employee_code === employeeCode &&
//             ms.department === selectedMatrix.department
//         );
//     };

//     const formatDate = (dateString: string): string => {
//         if (!dateString) return '-';
//         try {
//             const date = new Date(dateString);
//             return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('en-GB');
//         } catch {
//             return '-';
//         }
//     };

//     const getEmployeeSection = (employee: any): string => {
//         if (!employee) return selectedMatrix?.department || 'General';
//         if (employee.section) {
//             const section = sections.find(s => s.id === employee.section);
//             return section?.name || selectedMatrix?.department || 'General';
//         }
//         return selectedMatrix?.department || 'General';
//     };

//     const getOperationColor = (department: string, operationNumber: number): string => {
//         const colors = {
//             'Assembly': {
//                 1: '#FFF200', 2: '#F8B87A', 3: '#006B76', 4: '#708238', 5: '#B1C4CC',
//                 6: '#4D3E6C', 7: '#475A93', 8: '#854B07', 9: '#FFD300', 10: '#D01F1F',
//                 11: '#00A651', 12: '#662D91', 13: '#002663', 14: '#00CFFF', 15: '#A3D55C',
//                 16: '#3A3A3A', 17: '#C6BDD6', 18: '#902734', 19: '#98C4D4', 20: '#D2DFAA'
//             },
//             'Quality': { 1: '#00A94E', 2: '#00B7F1', 3: '#782D91', 4: '#FFC100' },
//             'Moulding': { 1: '#F47C26', 2: '#A8A8A8', 3: '#FFC400', 4: '#4A79C9', 5: '#4CAF50' },
//             'Surface Treatment': { 1: '#4682B4', 2: '#5F9EA0', 3: '#B0C4DE', 4: '#ADD8E6', 5: '#87CEEB' },
//         };
//         return (colors as any)[department]?.[operationNumber] || '#E5E7EB';
//     };

//     const getContrastColor = (hexColor: string): string => {
//         if (!hexColor) return '#000000';
//         const r = parseInt(hexColor.substring(1, 3), 16);
//         const g = parseInt(hexColor.substring(3, 5), 16);
//         const b = parseInt(hexColor.substring(5, 7), 16);
//         const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
//         return luminance > 0.5 ? '#000000' : '#FFFFFF';
//     };

//     const departmentEmployees = getDepartmentEmployees();
//     const departmentOperations = getDepartmentOperations();
//     const uniqueSections = getUniqueSections();

//     if (isLoading) {
//         return (
//             <div className="flex items-center justify-center h-64">
//                 <div className="text-lg">Loading skill matrix data...</div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="flex items-center justify-center h-64">
//                 <div className="text-red-600">Error: {error}</div>
//             </div>
//         );
//     }

//     if (!selectedMatrix) {
//         return (
//             <div className="flex items-center justify-center h-64">
//                 <div className="text-gray-600">No skill matrix found. Please create one first.</div>
//             </div>
//         );
//     }

//     return (
//         <div className="bg-gray-50 min-h-screen pt-2">
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//                 {/* Header */}
//                 <div className="border-b-2 border-gray-200 p-6 flex justify-between items-center bg-gray-50">
//                     <h1 className="text-2xl font-bold text-gray-800">Skill Matrix & Skill Upgradation Plan</h1>
//                     <div className="text-right">
//                         <div className="text-xl font-bold text-blue-600">IJL</div>
//                     </div>
//                 </div>

//                 {/* Legend */}
//                 <div className="p-2 border-t border-gray-200 bg-gray-50">
//                     <div className="text-lg font-semibold mb-2">Legend</div>
//                     <div className="mb-4">
//                         <div className="text-sm font-semibold mb-2">Skill Level Scale:</div>
//                         <div className="flex flex-wrap gap-x-2 gap-y-2 items-center">
//                             {/* <div className="text-sm font-semibold flex items-center space-x-2">
//                                 <SkillPieChart level={0} isRequired={false} />
//                                 <span>L1 - Basic Knowlegde Only,</span>
//                             </div> */}
//                             <div className="text-sm font-semibold flex items-center space-x-2">
//                                 <SkillPieChart level={1} isRequired={false} />
//                                 <span>L1 - Basic Knowlegde Only</span>
//                             </div>
//                             <div className="text-sm font-semibold flex items-center space-x-2">
//                                 <SkillPieChart level={2} isRequired={false} />
//                                 <span>L2 - Can Work Under Supervision</span>
//                             </div>
//                             <div className="text-sm font-semibold flex items-center space-x-2">
//                                 <SkillPieChart level={3} isRequired={false} />
//                                 <span>L3 - Can handle Independently</span>
//                             </div>
//                             <div className="text-sm font-semibold flex items-center space-x-2">
//                                 <SkillPieChart level={4} isRequired={false} />
//                                 <span>L4 - Can Train Others</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Matrix Info */}
//                 <div className="border-b border-gray-200 p-4 grid grid-cols-5 gap-4 text-sm bg-gray-50">
//                     <div className="flex items-center space-x-2">
//                         <Users className="w-4 h-4" />
//                         <span className="font-semibold">Department:</span>
//                         <select
//                             value={selectedMatrix.id}
//                             onChange={(e) => {
//                                 const matrix = skillMatrices.find(m => m.id === Number(e.target.value));
//                                 if (matrix) onMatrixChange(matrix);
//                             }}
//                             className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-600"
//                         >
//                             {skillMatrices.map(matrix => (
//                                 <option key={matrix.id} value={matrix.id}>{matrix.department}</option>
//                             ))}
//                         </select>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                         <Calendar className="w-4 h-4" />
//                         <span className="font-semibold">Updated:</span>
//                         <span>{formatDate(selectedMatrix.updated_on)}</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                         <Calendar className="w-4 h-4" />
//                         <span className="font-semibold">Next Review:</span>
//                         <span>{formatDate(selectedMatrix.next_review)}</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                         <span className="font-semibold">Prepared By:</span>
//                         <span>{selectedMatrix.prepared_by || 'Department Manager'}</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                         <FileText className="w-4 h-4" />
//                         <span className="font-semibold">Doc No:</span>
//                         <span>{selectedMatrix.doc_no}</span>
//                     </div>
//                 </div>

//                 {/* Employee Count */}
//                 <div className="px-4 py-2 bg-blue-50 text-sm text-blue-700">
//                     <span className="font-semibold">{departmentEmployees.length} employees</span> found in {selectedMatrix.department} department
//                 </div>

//                 {/* Main Table */}
//                 <div className="overflow-x-auto">
//                     <table className="w-full border-collapse text-xs">
//                         <thead>
//                             <tr>
//                                 <th className="border border-gray-300 p-2 w-12 bg-gray-100" rowSpan={selectedMatrix?.department === 'Assembly' ? 4 : 3}>Sl. No.</th>
//                                 <th className="border border-gray-300 p-2 w-16 bg-gray-100" rowSpan={selectedMatrix?.department === 'Assembly' ? 4 : 3}>CC No/EMP Code</th>
//                                 <th className="border border-gray-300 p-2 w-24 bg-gray-100" rowSpan={selectedMatrix?.department === 'Assembly' ? 4 : 3}>Designation</th>
//                                 <th className="border border-gray-300 p-2 w-32 bg-gray-100" rowSpan={selectedMatrix?.department === 'Assembly' ? 4 : 3}>Employee Name</th>
//                                 <th className="border border-gray-300 p-2 w-24 bg-gray-100" rowSpan={selectedMatrix?.department === 'Assembly' ? 4 : 3}>DOJ</th>
//                                 <th className="border border-gray-300 p-2 w-20 bg-gray-100" rowSpan={selectedMatrix?.department === 'Assembly' ? 4 : 3}>Section</th>
//                                 <th className="border border-gray-300 p-2 w-20 bg-gray-100" rowSpan={selectedMatrix?.department === 'Assembly' ? 4 : 3}>Photos</th>
//                                 <th className="border border-gray-300 p-2 w-20 bg-gray-100" rowSpan={selectedMatrix?.department === 'Assembly' ? 4 : 3}>operations</th>


//                                 <th
//                                     className="border border-gray-300 p-2 text-center font-bold bg-blue-100"
//                                     colSpan={departmentOperations.length}
//                                 >
//                                     Training Points
//                                 </th>
//                                 <th
//                                     className="border border-gray-300 p-2 text-center font-bold bg-green-100"
//                                     colSpan={months.length}
//                                 >
//                                     Skill Matrix & Skill Upgradation Plan
//                                 </th>
//                                 <th className="border border-gray-300 p-2 text-center font-bold bg-gray-100" rowSpan={selectedMatrix?.department === 'Assembly' ? 4 : 3}>
//                                     Remarks
//                                 </th>
//                             </tr>

//                             {selectedMatrix?.department === 'Assembly' && (
//                                 <tr>
//                                     {uniqueSections.map(section => {
//                                         const sectionOps = departmentOperations.filter(op => op.section === section.id);
//                                         return (
//                                             <th key={section.id} className="border border-gray-300 p-2 text-center font-bold bg-blue-50"
//                                                 colSpan={sectionOps.length}>
//                                                 {section.name}
//                                             </th>
//                                         );
//                                     })}
//                                     {departmentOperations.length === 0 && (
//                                         <th className="border border-gray-300 p-2 text-center font-bold bg-blue-50">
//                                             No Operations
//                                         </th>
//                                     )}
//                                     <th className="border border-gray-300 p-2 text-center font-bold bg-green-50" colSpan={months.length} rowSpan={2}>
//                                         Monthly Plan
//                                     </th>
//                                 </tr>
//                             )}
//                             <tr>
//                                 {departmentOperations.length > 0 &&
//                                     departmentOperations.map(op => (
//                                         <th
//                                             key={op.id}
//                                             className="border border-gray-300 p-1 text-center text-xs font-bold bg-yellow-100"
//                                         >
//                                             {op.number}
//                                         </th>
//                                     ))}
//                                 {selectedMatrix?.department !== 'Assembly' && (
//                                     <th className="border border-gray-300 p-2 text-center font-bold bg-green-50" colSpan={months.length}>
//                                         Monthly Plan
//                                     </th>
//                                 )}
//                             </tr>
//                             <tr>
//                                 {departmentOperations.length > 0 ? (
//                                     departmentOperations.map(op => (
//                                         <th
//                                             key={op.id}
//                                             className="border border-gray-300 p-1 text-center text-xs font-bold h-20"
//                                             style={{
//                                                 backgroundColor: getOperationColor(selectedMatrix.department, op.number),
//                                                 color: getContrastColor(getOperationColor(selectedMatrix.department, op.number))
//                                             }}
//                                         >
//                                             <div className="flex flex-col items-center justify-center h-full">
//                                                 {op.name.split(' ').map((word, wordIndex) => (
//                                                     <div key={wordIndex} className="leading-tight">{word}</div>
//                                                 ))}
//                                             </div>
//                                         </th>
//                                     ))
//                                 ) : (
//                                     <th className="border border-gray-300 p-1 text-center text-xs font-bold bg-gray-50 h-20">
//                                         <div className="flex flex-col items-center justify-center h-full">
//                                             No Operations
//                                         </div>
//                                     </th>
//                                 )}
//                                 {months.map(month => (
//                                     <th
//                                         key={month.id}
//                                         className="border border-gray-300 p-1 text-center text-xs font-bold bg-green-50"
//                                         style={{
//                                             height: '80px',
//                                             width: '24px'
//                                         }}
//                                     >
//                                         <div
//                                             style={{
//                                                 writingMode: 'vertical-rl',
//                                                 transform: 'rotate(180deg)',
//                                                 textAlign: 'center',
//                                                 width: '100%',
//                                                 height: '100%',
//                                                 display: 'flex',
//                                                 alignItems: 'center',
//                                                 justifyContent: 'center'
//                                             }}
//                                         >
//                                             {month.displayName}
//                                         </div>
//                                     </th>
//                                 ))}
//                             </tr>

//                             <tr className="bg-gray-100">
//                                 <td className="border border-gray-300 p-2 text-center font-bold" colSpan={6}>Required Level</td>
//                                 {departmentOperations.length > 0 ? (
//                                     departmentOperations.map(op => (
//                                         <td key={op.id} className="border border-gray-300 p-1 text-center font-bold">
//                                             <SkillPieChart level={op.minimum_skill_required} isRequired={true} />
//                                         </td>
//                                     ))
//                                 ) : (
//                                     <td className="border border-gray-300 p-1 text-center font-bold">
//                                         -
//                                     </td>
//                                 )}
//                                 <td className="border border-gray-300 p-1 text-center font-bold bg-gray-100" colSpan={months.length + 1}>
//                                 </td>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {departmentEmployees.map((employee, index) => {
//                                 const employeeMonthlySkills = getEmployeeMonthlySkills(employee.employee_code);

//                                 return (
//                                     <tr key={employee.employee_code} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                                         <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
//                                         <td className="border border-gray-300 p-2 text-center font-mono">{employee.employee_code || '-'}</td>
//                                         <td className="border border-gray-300 p-2 text-center">{employee.designation || '-'}</td>
//                                         <td className="border border-gray-300 p-2">{employee.full_name || '-'}</td>
//                                         <td className="border border-gray-300 p-2 text-center">{formatDate(employee.date_of_join)}</td>
//                                         <td className="border border-gray-300 p-2 text-center">{getEmployeeSection(employee)}</td>

//                                         {departmentOperations.length > 0 ? (
//                                             departmentOperations.map(op => {
//                                                 const monthlySkill = employeeMonthlySkills.find(ms =>
//                                                     (ms.operation && op.id.toString() === ms.operation) ||
//                                                     (ms.operation_number && ms.operation_number === op.number)
//                                                 );

//                                                 return (
//                                                     <td key={op.id} className="border border-gray-300 p-1 text-center">
//                                                         {monthlySkill ? (
//                                                             <SkillPieChart
//                                                                 level={parseInt(monthlySkill.level) || 0}
//                                                                 isRequired={false} />
//                                                         ) : (
//                                                             <SkillPieChart level={0} isRequired={false} />
//                                                         )}
//                                                     </td>
//                                                 );
//                                             })
//                                         ) : (
//                                             <td className="border border-gray-300 p-1 text-center">
//                                                 <SkillPieChart level={0} isRequired={false} />
//                                             </td>
//                                         )}

//                                         {months.map(month => {
//                                             const monthMonthlySkills = employeeMonthlySkills.filter(ms => {
//                                                 if (!ms.date) return false;
//                                                 try {
//                                                     const msDate = new Date(ms.date);
//                                                     return msDate.getMonth() + 1 === month.id &&
//                                                         msDate.getFullYear() === month.year;
//                                                 } catch {
//                                                     return false;
//                                                 }
//                                             });

//                                             return (
//                                                 <td
//                                                     key={month.id}
//                                                     className="border border-gray-300 p-1 text-center"
//                                                     style={{ width: '24px' }}
//                                                 >
//                                                     {monthMonthlySkills.length > 0 ? (
//                                                         <div className="flex flex-col items-center justify-center h-full space-y-1">
//                                                             {monthMonthlySkills.map(ms => {
//                                                                 const operation = operations.find(op =>
//                                                                     op.id.toString() === ms.operation ||
//                                                                     op.number === ms.operation_number
//                                                                 );
//                                                                 const operationNumber = operation?.number || ms.operation_number;
//                                                                 const department = ms.department || selectedMatrix?.department || 'Assembly';
//                                                                 const skillLevel = parseInt(ms.skill_level) || 0;

//                                                                 return (
//                                                                     <div key={ms.id || `${ms.employee_code}-${ms.operation}-${ms.date}`}>
//                                                                         <MonthPieChart
//                                                                             operationNumber={operationNumber || 0}
//                                                                             skillLevel={skillLevel}
//                                                                             department={department}
//                                                                             size={24}
//                                                                             title={`${operation?.name || 'Unknown'} - Level ${skillLevel}`}
//                                                                         />
//                                                                     </div>
//                                                                 );
//                                                             })}
//                                                         </div>
//                                                     ) : (
//                                                         <div className="text-xs text-gray-400">-</div>
//                                                     )}
//                                                 </td>
//                                             );
//                                         })}
//                                         <td className="border border-gray-300 p-2 text-xs">
//                                             {employeeMonthlySkills.length > 0
//                                                 ? employeeMonthlySkills[0].remarks || '-'
//                                                 : '-'}
//                                         </td>
//                                     </tr>
//                                 );
//                             })}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div >
//     );
// };

// export default SkillMatrixTable;  




// new 
// import React, { useState } from 'react';
// import SkillPieChart from './SkillPiechart'; // You must provide this component

// // --- Data ---
// const employees = [
//   { id: 1, code: 'EMP001', name: 'John Doe', photo: '', section: 'Line 1', department: 'Production' },
//   { id: 2, code: 'EMP002', name: 'Jane Smith', photo: '', section: 'Line 1', department: 'Production' },
//   { id: 3, code: 'EMP003', name: 'Mike Johnson', photo: '', section: 'Line 2', department: 'Production' },
//   { id: 4, code: 'EMP004', name: 'Sarah Wilson', photo: '', section: 'Line 1', department: 'Production' },
// ];

// const operations = [
//   { id: 1, name: 'Stove & Silicon tube cutting', minLevel: 2 },
//   { id: 2, name: 'Clip terminal to lead wire crimping', minLevel: 2 },
//   { id: 3, name: 'Lead wire sealing', minLevel: 2 },
//   { id: 4, name: 'Diode Bonding', minLevel: 1 },
//   { id: 5, name: 'TPS Cutting & Crimping', minLevel: 2 },
//   { id: 6, name: 'Diode lead splice', minLevel: 1 },
//   { id: 7, name: 'TPS & Diode Bonding', minLevel: 1 },
  
// ];

// const months = [
//   { id: 4, display: 'Apr-24' }, { id: 5, display: 'May-24' }, { id: 6, display: 'Jun-24' },
//   { id: 7, display: 'Jul-24' }, { id: 8, display: 'Aug-24' }, { id: 9, display: 'Sep-24' },
//   { id: 10, display: 'Oct-24' }, { id: 11, display: 'Nov-24' }, { id: 12, display: 'Dec-24' },
//   { id: 1, display: 'Jan-25' }, { id: 2, display: 'Feb-25' }, { id: 3, display: 'Mar-25' },
// ];

// const employeeSkills = [
//   { code: 'EMP001', op: 1, level: 2 }, { code: 'EMP001', op: 2, level: 1 }, { code: 'EMP001', op: 3, level: 3 },
//   { code: 'EMP001', op: 4, level: 2 }, { code: 'EMP001', op: 5, level: 1 }, { code: 'EMP001', op: 6, level: 2 },
//   { code: 'EMP002', op: 1, level: 3 }, { code: 'EMP002', op: 2, level: 4 }, { code: 'EMP002', op: 3, level: 3 },
//   { code: 'EMP002', op: 4, level: 2 }, { code: 'EMP002', op: 5, level: 3 }, { code: 'EMP002', op: 6, level: 2 },
//   { code: 'EMP003', op: 1, level: 1 }, { code: 'EMP003', op: 2, level: 1 }, { code: 'EMP003', op: 3, level: 2 },
//   { code: 'EMP003', op: 4, level: 1 }, { code: 'EMP003', op: 5, level: 1 }, { code: 'EMP003', op: 6, level: 1 },
//   { code: 'EMP004', op: 1, level: 4 }, { code: 'EMP004', op: 2, level: 3 }, { code: 'EMP004', op: 3, level: 4 },
//   { code: 'EMP004', op: 4, level: 3 }, { code: 'EMP004', op: 5, level: 2 }, { code: 'EMP004', op: 6, level: 3 },
// ];

// // --- Helpers ---
// const getSkill = (code, opId) => {
//   const skill = employeeSkills.find(s => s.code === code && s.op === opId);
//   return skill ? skill.level : 0;
// };

// const getAvatar = (name, photo) =>
//   photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

// const lines = ['Line 1', 'Line 2', 'Line 3', 'Offline'];

// // --- Main Component ---
// const SkillMatrix = () => {
//   const [search, setSearch] = useState('');
//   const [selectedLine, setSelectedLine] = useState('Line 1');

//   // Filter employees by line and search
//   const filteredEmployees = employees.filter(emp =>
//     emp.section === selectedLine &&
//     (emp.name.toLowerCase().includes(search.toLowerCase()) ||
//       emp.code.toLowerCase().includes(search.toLowerCase()))
//   );

//   return (
//     <div className="bg-gray-50 min-h-screen p-4">
//       <div className="max-w-7xl mx-auto bg-white rounded-lg shadow p-6">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
//           <h1 className="text-2xl font-bold text-center md:text-left">Skill Matrix & Skill Upgradation Plan</h1>
//           <div className="flex gap-2">
//             <input
//               type="text"
//               placeholder="Search by name/code..."
//               value={search}
//               onChange={e => setSearch(e.target.value)}
//               className="border px-3 py-2 rounded w-56"
//             />
//             <select
//               value={selectedLine}
//               onChange={e => setSelectedLine(e.target.value)}
//               className="border px-3 py-2 rounded"
//             >
//               {lines.map(line => (
//                 <option key={line} value={line}>{line}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Legend */}
//         <div className="flex flex-wrap gap-6 mb-6">
//           <div className="flex items-center gap-2">
//             <SkillPieChart level={1} /> <span className="text-xs">L1: Basic</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <SkillPieChart level={2} /> <span className="text-xs">L2: Supervised</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <SkillPieChart level={3} /> <span className="text-xs">L3: Independent</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <SkillPieChart level={4} /> <span className="text-xs">L4: Trainer</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="w-4 h-4 rounded-full border-2 border-red-500 inline-block"></span>
//             <span className="text-xs">Below minimum</span>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full border border-gray-300 bg-white text-xs">
//             <thead>
//               <tr>
//                 <th className="sticky top-0 bg-gray-100 p-2 border" rowSpan={3}>S.No</th>
//                 <th className="sticky top-0 bg-gray-100 p-2 border" rowSpan={3}>Phone</th>

//                 <th className="sticky top-0 bg-gray-100 p-2 border" rowSpan={3}>Name</th>
//                 <th className="sticky top-0 bg-gray-100 p-2 border" rowSpan={3}>Code</th>
//                 <th className="sticky top-0 bg-gray-100 p-2 border" rowSpan={2}>Operations
//                 </th>
//                 <th className="sticky top-0 bg-blue-100 p-2 border" colSpan={operations.length}>Training Points</th>
//                 <th className="sticky top-0 bg-gray-100 p-2 border" rowSpan={3}>Total</th>
//                 <th className="sticky top-0 bg-green-100 p-2 border" colSpan={months.length}>Monthly Plan</th>
//                 <th className="sticky top-0 bg-gray-100 p-2 border" rowSpan={3}>Remarks</th>
//               </tr>
//               <tr>
//                 {operations.map(op => (
//                   <th key={op.id} className="bg-yellow-100 border p-1">{op.name}</th>
                  
//                 ))}
//                 {months.map(month => (
//                   <th key={month.id} className="bg-green-50 border p-1" style={{ writingMode: 'vertical-rl', height: 60 }}>
//                     {month.display}
//                   </th>
//                 ))}
//               </tr>
//               <tr>
//                 <th className="sticky top-0 bg-gray-100 p-2 border" >Mininum Skill Level Required</th>
//                 {operations.map(op => (
//                   <th key={op.id} className="bg-yellow-200 border p-1 text-center">
//                     <SkillPieChart level={op.minLevel} isRequired={true} size={24} />
//                   </th>
//                 ))}
//                 {months.map(month => (
//                   <th key={month.id} className="bg-yellow-200 border p-1 text-center">
//                     <span className="text-gray-400">-</span>
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {filteredEmployees.map((emp, idx) => (
//                 <React.Fragment key={emp.code}>
//                   {/* PLAN Row */}
//                   <tr className="hover:bg-blue-50">
//                     <td className="border text-center" rowSpan={3}>{idx + 1}</td>
//                     <td className="border text-center" rowSpan={3}>
//                       <img
//                         src={getAvatar(emp.name, emp.photo)}
//                         alt={emp.name}
//                         className="w-8 h-8 rounded-full mx-auto border"
//                       />
//                     </td>
//                     <td className="border" rowSpan={3}>{emp.name}</td>
//                     <td className="border font-mono" rowSpan={3}>{emp.code}</td>
//                     <td className="border text-center font-semibold" >Actuall Skill Level</td>
                    
//                     {operations.map(op => (
//                       <td key={op.id} className="border text-center">
//                         <SkillPieChart level={getSkill(emp.code, op.id)} isRequired={false} size={24} />
//                       </td>
//                     ))}
//                     {months.map(month => (
//                       <td key={month.id} className="border text-center">
//                         <span className="text-gray-400">-</span>
//                       </td>
//                     ))}
                    
//                   </tr>
//                   {/* MINIMUM Row */}
//                   <tr className="bg-yellow-100">
//                     <td className="border text-center font-bold" >Actual Skill Level</td>
//                     {operations.map(op => (
//                       <td key={op.id} className="border text-center">
//                         <SkillPieChart level={op.minLevel} isRequired={true} size={24} />
//                       </td>
//                     ))}
//                     {months.map(month => (
//                       <td key={month.id} className="border text-center">
//                         <span className="text-gray-400">-</span>
//                       </td>
//                     ))}
//                     <td className="border">-</td>
//                   </tr>
//                   {/* ACTUAL Row */}
//                   <tr className="hover:bg-blue-50">
//                     <td className="border text-center font-semibold" >Actual Skill Level</td>
//                     {operations.map(op => {
//                       const actual = getSkill(emp.code, op.id);
//                       return (
//                         <td key={op.id} className={`border text-center ${actual < op.minLevel ? 'border-2 border-red-500' : ''}`}>
//                           <SkillPieChart level={actual} isRequired={false} size={24} />
//                         </td>
//                       );
//                     })}
//                     {months.map(month => (
//                       <td key={month.id} className="border text-center">
//                         <span className="text-gray-400">-</span>
//                       </td>
//                     ))}
//                     <td className="border">-</td>
//                   </tr>
//                 </React.Fragment>
//               ))}
//               {filteredEmployees.length === 0 && (
//                 <tr>
//                   <td colSpan={7 + operations.length + months.length} className="p-4 text-center text-gray-400">
//                     No employees found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SkillMatrix;

// new skill matrix

// import React, { useState } from 'react';
// import SkillPieChart from './SkillPiechart'; // You must provide this component

// // --- Data ---
// const employees = [
//   { id: 1, code: 'EMP001', name: 'John Doe', photo: '', section: 'Line 1', department: 'Production' },
//   { id: 2, code: 'EMP002', name: 'Jane Smith', photo: '', section: 'Line 1', department: 'Production' },
//   { id: 3, code: 'EMP003', name: 'Mike Johnson', photo: '', section: 'Line 2', department: 'Production' },
//   { id: 4, code: 'EMP004', name: 'Sarah Wilson', photo: '', section: 'Line 1', department: 'Production' },
// ];

// const operations = [
//   { id: 1, name: 'Stove & Silicon tube cutting', minLevel: 2 },
//   { id: 2, name: 'Clip terminal to lead wire crimping', minLevel: 2 },
//   { id: 3, name: 'Lead wire sealing', minLevel: 2 },
//   { id: 4, name: 'Diode Bonding', minLevel: 1 },
//   { id: 5, name: 'TPS Cutting & Crimping', minLevel: 2 },
//   { id: 6, name: 'Diode lead splice', minLevel: 1 },
//   { id: 7, name: 'TPS & Diode Bonding', minLevel: 1 },
// ];

// const months = [
//   { id: 4, display: 'Apr-24' }, { id: 5, display: 'May-24' }, { id: 6, display: 'Jun-24' },
//   { id: 7, display: 'Jul-24' }, { id: 8, display: 'Aug-24' }, { id: 9, display: 'Sep-24' },
//   { id: 10, display: 'Oct-24' }, { id: 11, display: 'Nov-24' }, { id: 12, display: 'Dec-24' },
//   { id: 1, display: 'Jan-25' }, { id: 2, display: 'Feb-25' }, { id: 3, display: 'Mar-25' },
// ];

// const employeeSkills = [
//   { code: 'EMP001', op: 1, level: 2 }, { code: 'EMP001', op: 2, level: 1 }, { code: 'EMP001', op: 3, level: 3 },
//   { code: 'EMP001', op: 4, level: 2 }, { code: 'EMP001', op: 5, level: 1 }, { code: 'EMP001', op: 6, level: 2 },
//   { code: 'EMP002', op: 1, level: 3 }, { code: 'EMP002', op: 2, level: 4 }, { code: 'EMP002', op: 3, level: 3 },
//   { code: 'EMP002', op: 4, level: 2 }, { code: 'EMP002', op: 5, level: 3 }, { code: 'EMP002', op: 6, level: 2 },
//   { code: 'EMP003', op: 1, level: 1 }, { code: 'EMP003', op: 2, level: 1 }, { code: 'EMP003', op: 3, level: 2 },
//   { code: 'EMP003', op: 4, level: 1 }, { code: 'EMP003', op: 5, level: 1 }, { code: 'EMP003', op: 6, level: 1 },
//   { code: 'EMP004', op: 1, level: 4 }, { code: 'EMP004', op: 2, level: 3 }, { code: 'EMP004', op: 3, level: 4 },
//   { code: 'EMP004', op: 4, level: 3 }, { code: 'EMP004', op: 5, level: 2 }, { code: 'EMP004', op: 6, level: 3 },
// ];

// // --- Helpers ---
// const getSkill = (code, opId) => {
//   const skill = employeeSkills.find(s => s.code === code && s.op === opId);
//   return skill ? skill.level : "Plan";
// };

// const getAvatar = (name, photo) =>
//   photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

// const lines = ['Line 1', 'Line 2', 'Line 3', 'Offline'];

// // --- Main Component ---
// const SkillMatrix = () => {
//   const [search, setSearch] = useState('');
//   const [selectedLine, setSelectedLine] = useState('Line 1');

//   // Filter employees by line and search
//   const filteredEmployees = employees.filter(emp =>
//     emp.section === selectedLine &&
//     (emp.name.toLowerCase().includes(search.toLowerCase()) ||
//       emp.code.toLowerCase().includes(search.toLowerCase()))
//   );

//   return (
//     <div className="bg-gray-50 min-h-screen p-4">
//       <div className="max-w-7xl mx-auto bg-white rounded-lg shadow p-6">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
//           <h1 className="text-2xl font-bold text-center md:text-left">Skill Matrix & Skill Upgradation Plan</h1>
//           <div className="flex gap-2">
//             <input
//               type="text"
//               placeholder="Search by name/code..."
//               value={search}
//               onChange={e => setSearch(e.target.value)}
//               className="border px-3 py-2 rounded w-56"
//             />
//             <select
//               value={selectedLine}
//               onChange={e => setSelectedLine(e.target.value)}
//               className="border px-3 py-2 rounded"
//             >
//               {lines.map(line => (
//                 <option key={line} value={line}>{line}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Legend */}
//         <div className="flex flex-wrap gap-6 mb-6">
//           <div className="flex items-center gap-2">
//             <SkillPieChart level={1} /> <span className="text-xs">L1: Basic</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <SkillPieChart level={2} /> <span className="text-xs">L2: Supervised</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <SkillPieChart level={3} /> <span className="text-xs">L3: Independent</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <SkillPieChart level={4} /> <span className="text-xs">L4: Trainer</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="w-4 h-4 rounded-full border-2 border-red-500 inline-block"></span>
//             <span className="text-xs">Below minimum</span>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full border border-gray-300 bg-white text-xs">
//             <thead>
//               <tr>
//                 <th className="sticky top-0 bg-gray-100 p-2 border">S.No</th>
//                 <th className="sticky top-0 bg-gray-100 p-2 border">Photo</th>
//                 <th className="sticky top-0 bg-gray-100 p-2 border">Name</th>
//                 <th className="sticky top-0 bg-gray-100 p-2 border">Code</th>
//                 <th className="sticky top-0 bg-gray-100 p-2 border">Skill Level</th>
                
//                 {operations.map(op => (
//                   <th key={op.id} className="bg-yellow-100 border p-1">{op.name}</th>
//                 ))}
//                 <th className="sticky top-0 bg-gray-100 p-2 border">Month</th>
//                 {months.map(month => (
//                   <th key={month.id} className="bg-green-50 border p-1" style={{ writingMode: 'vertical-rl', height: 60 }}>
//                     {month.display}
//                   </th>
//                 ))}
//                 <th className="sticky top-0 bg-gray-100 p-2 border">Remarks</th>
//               </tr>
//               <tr>
//                 <th colSpan={4}></th>
//                 <th className="sticky top-0 bg-gray-100 p-2 border">Minimun Skill Required</th>
//                 {operations.map(op => (
//                   <th key={op.id} className="bg-yellow-200 border p-1 text-center">
//                     <SkillPieChart level={op.minLevel} isRequired={true} size={24} />
//                   </th>
//                 ))}
//                 <th className="sticky top-0 bg-gray-100 p-2 border"></th>
//                 {months.map(month => (
//                   <th key={month.id} className="bg-yellow-200 border p-1 text-center">
//                     <span className="text-gray-400">-</span>
//                   </th>
//                 ))}
//                 <th></th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredEmployees.map((emp, idx) => (
//                 <tr key={emp.code} className="hover:bg-blue-50">
//                   <td className="border text-center">{idx + 1}</td>
//                   <td className="border text-center">
//                     <img
//                       src={getAvatar(emp.name, emp.photo)}
//                       alt={emp.name}
//                       className="w-8 h-8 rounded-full mx-auto border"
//                     />
//                   </td>
//                   <td className="border">{emp.name}</td>
//                   <td className="border font-mono">{emp.code}</td>
//                   <td className="border text-center font-semibold">Skill Level</td>
//                   {operations.map(op => {
//                     const actual = getSkill(emp.code, op.id);
//                     return (
//                       <td
//                         key={op.id}
//                         className={`border text-center ${actual < op.minLevel ? 'border-2 border-red-500' : ''}`}
//                         title={actual < op.minLevel ? 'Below minimum required' : ''}
//                       >
//                         <SkillPieChart level={actual} isRequired={false} size={24} />
//                       </td>
//                     );
//                   })}
//                   <td className="border text-center"> 
                  
//                     plan
//                     {/* {operations.reduce((sum, op) => sum + getSkill(emp.code, op.id), 0)} */}
//                   </td>
//                   {months.map(month => (
//                     <td key={month.id} className="border text-center">
//                       <span className="text-gray-400">-</span>
//                     </td>
//                   ))}
//                   <td className="border">-</td>
//                 </tr>
//               ))}
//               {filteredEmployees.length === 0 && (
//                 <tr>
//                   <td colSpan={7 + operations.length + months.length} className="p-4 text-center text-gray-400">
//                     No employees found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SkillMatrix;  


import React, { useState } from 'react';
import SkillPieChart from './SkillPiechart'; // You must provide this component

// --- Data ---
const employees = [
  { id: 1, code: 'EMP001', name: 'John Doe', photo: '', section: 'Line 1', department: 'Production' },
  { id: 2, code: 'EMP002', name: 'Jane Smith', photo: '', section: 'Line 1', department: 'Production' },
  { id: 3, code: 'EMP003', name: 'Mike Johnson', photo: '', section: 'Line 2', department: 'Production' },
  { id: 4, code: 'EMP004', name: 'Sarah Wilson', photo: '', section: 'Line 1', department: 'Production' },
];

const operations = [
  { id: 1, name: 'Stove & Silicon tube cutting', minLevel: 2 },
  { id: 2, name: 'Clip terminal to lead wire crimping', minLevel: 2 },
  { id: 3, name: 'Lead wire sealing', minLevel: 2 },
  { id: 4, name: 'Diode Bonding', minLevel: 1 },
  { id: 5, name: 'TPS Cutting & Crimping', minLevel: 2 },
  { id: 6, name: 'Diode lead splice', minLevel: 1 },
  { id: 7, name: 'TPS & Diode Bonding', minLevel: 1 },
];

const months = [
  { id: 4, display: 'Apr-24' }, { id: 5, display: 'May-24' }, { id: 6, display: 'Jun-24' },
  { id: 7, display: 'Jul-24' }, { id: 8, display: 'Aug-24' }, { id: 9, display: 'Sep-24' },
  { id: 10, display: 'Oct-24' }, { id: 11, display: 'Nov-24' }, { id: 12, display: 'Dec-24' },
  { id: 1, display: 'Jan-25' }, { id: 2, display: 'Feb-25' }, { id: 3, display: 'Mar-25' },
];

const employeeSkills = [
  { code: 'EMP001', op: 1, level: 2 }, { code: 'EMP001', op: 2, level: 1 }, { code: 'EMP001', op: 3, level: 3 },
  { code: 'EMP001', op: 4, level: 2 }, { code: 'EMP001', op: 5, level: 1 }, { code: 'EMP001', op: 6, level: 2 },
  { code: 'EMP002', op: 1, level: 3 }, { code: 'EMP002', op: 2, level: 4 }, { code: 'EMP002', op: 3, level: 3 },
  { code: 'EMP002', op: 4, level: 2 }, { code: 'EMP002', op: 5, level: 3 }, { code: 'EMP002', op: 6, level: 2 },
  { code: 'EMP003', op: 1, level: 1 }, { code: 'EMP003', op: 2, level: 1 }, { code: 'EMP003', op: 3, level: 2 },
  { code: 'EMP003', op: 4, level: 1 }, { code: 'EMP003', op: 5, level: 1 }, { code: 'EMP003', op: 6, level: 1 },
  { code: 'EMP004', op: 1, level: 4 }, { code: 'EMP004', op: 2, level: 3 }, { code: 'EMP004', op: 3, level: 4 },
  { code: 'EMP004', op: 4, level: 3 }, { code: 'EMP004', op: 5, level: 2 }, { code: 'EMP004', op: 6, level: 3 },
];

// --- Helpers ---
const getSkill = (code, opId) => {
  const skill = employeeSkills.find(s => s.code === code && s.op === opId);
  return skill ? skill.level : 0;
};

const getAvatar = (name, photo) =>
  photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

const lines = ['Line 1', 'Line 2', 'Line 3', 'Offline'];

// --- Main Component ---
const SkillMatrix = () => {
  const [search, setSearch] = useState('');
  const [selectedLine, setSelectedLine] = useState('Line 1');

  // Filter employees by line and search
  const filteredEmployees = employees.filter(emp =>
    emp.section === selectedLine &&
    (emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.code.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-center md:text-left">Skill Matrix & Skill Upgradation Plan</h1>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by name/code..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border px-3 py-2 rounded w-56"
            />
            <select
              value={selectedLine}
              onChange={e => setSelectedLine(e.target.value)}
              className="border px-3 py-2 rounded"
            >
              {lines.map(line => (
                <option key={line} value={line}>{line}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex items-center gap-2">
            <SkillPieChart level={1} /> <span className="text-xs">L1: Basic</span>
          </div>
          <div className="flex items-center gap-2">
            <SkillPieChart level={2} /> <span className="text-xs">L2: Supervised</span>
          </div>
          <div className="flex items-center gap-2">
            <SkillPieChart level={3} /> <span className="text-xs">L3: Independent</span>
          </div>
          <div className="flex items-center gap-2">
            <SkillPieChart level={4} /> <span className="text-xs">L4: Trainer</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border-2 border-red-500 inline-block"></span>
            <span className="text-xs">Below minimum</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-white text-xs">
            <thead>
              <tr>
                <th className="border p-2 " >S.No</th>
                
                <th className="border p-2" >Photo</th>
                <th className="border p-2" >Name</th>
                <th className="border p-2" >Code</th>
                {/* Add more info columns here if needed */}
               <tr>
                 <th className="border p-3">Operations</th>
                 
               </tr> 
               <tr>
                <th className="border p-3">Required Skill Level</th>
               </tr>
                {operations.map(op => (
                  <th key={op.id} className="bg-yellow-100 border p-1" rowSpan={2}>{op.name}</th>
                ))}
                <th className="border p-2" rowSpan={2}>Month</th>
                {/* Months header: each month is a column */}
                {months.map(month => (
                  <th
                    key={month.id}
                    className="bg-green-50 border p-1 text-center"
                    style={{ writingMode: 'vertical-rl', height: 80 }}
                    rowSpan={2}
                  >
                    {month.display}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp, idx) => (
                <React.Fragment key={emp.code}>
                  {/* PLAN row */}
                  <tr>
                    <td className="border text-center" rowSpan={2}>{idx + 1}</td>
                    <td className="border text-center" rowSpan={2}>
                      <img
                        src={getAvatar(emp.name, emp.photo)}
                        alt={emp.name}
                        className="w-8 h-8 rounded-full mx-auto border"
                      />
                    </td>
                    <td className="border" rowSpan={2}>{emp.name}</td>
                    <td className="border font-mono" rowSpan={2}>{emp.code}</td>
                    <td className="border text-center font-bold" rowSpan={2}>Actuall Skill Required</td>
                    {operations.map(op => (
                      <td key={op.id} className="border text-center" rowSpan={2}>
                        {/* You can show skill plan here if needed */}
                        {/* <SkillPieChart level={getSkill(emp.code, op.id)} isRequired={false} size={24} /> */}
                      </td>
                    ))}
                    <td className="border">PLAN</td>
                    {months.map(month => (
                      <td key={month.id} className="border text-center"></td>
                    ))}
                  </tr>
                  {/* ACTUAL row */}
                  <tr>
                    {/* <td className="border text-center font-bold">ACTUAL</td> */}
                    <td className="border">ACTUAL</td>
                    {months.map(month => (
                      <td key={month.id} className="border text-center"></td>
                    ))}
                  </tr>
                </React.Fragment>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={7 + operations.length + months.length} className="p-4 text-center text-gray-400">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SkillMatrix;