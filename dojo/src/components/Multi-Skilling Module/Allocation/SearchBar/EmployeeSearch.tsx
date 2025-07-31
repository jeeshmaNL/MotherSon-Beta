import { useState } from 'react';
import AddSkill from '../addSkill/addSkill';

interface Skill {
  skill: string;
  skill_level: string;
  start_date: string;
  end_date: string;
  notes: string;
  status: string;
}

interface Employee {
   id: number; // Add this
  sr_no: number;
  employee_code: string;
  employee_id: number;
  full_name: string;
  date_of_join: string;
  employee_pattern_category: string;
  designation: string;
  department: string | null;
  department_code: string | null;
  skills: Skill[];
}

const EmployeeSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    console.log('Search term:', term);

    if (term.length >= 2) {
      try {
        setIsLoading(true);
        // console.log('Fetching employees for:', term);

        const response = await fetch(
          `http://127.0.0.1:8000/employees-with-active-skills/?name=${encodeURIComponent(term)}`
        );

        if (response.ok) {
          const data = await response.json();
          // console.log('Fetched employee data:', data);

          setFilteredEmployees(data);
          setError(data.length ? '' : 'No matching employees found');
        } else {
          console.error('Fetch failed with status:', response.status);
          setFilteredEmployees([]);
          setError('Error searching for employees');
        }
      } catch (err) {
        console.error('Search error:', err);
        setError('Error searching for employees');
        setFilteredEmployees([]);
      } finally {
        setIsLoading(false);
        // console.log('Search loading finished');
      }
    } else {
      console.log('Search term too short');
      setFilteredEmployees([]);
      setError(term.length ? 'Type at least 2 characters' : '');
    }
  };

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
    setSearchTerm(employee.full_name);
    setFilteredEmployees([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Employee Skill Management</h1>
          <p className="text-gray-600 text-lg">Search and manage employee skills</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by employee name..."
              className="w-full p-4 pl-12 bg-white border-2 border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 text-lg"
              value={searchTerm}
              onChange={handleSearch}
            />
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {isLoading && (
            <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl overflow-hidden p-4">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            </div>
          )}

          {error && !isLoading && (
            <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl overflow-hidden p-4 text-red-500">
              {error}
            </div>
          )}

          {filteredEmployees.length > 0 && !isLoading && (
            <ul className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
              {filteredEmployees.map(emp => (
                <li
                  key={emp.employee_code}
                  className="p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all duration-200 border-b border-gray-100 last:border-0"
                  onClick={() => handleEmployeeSelect(emp)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">{emp.full_name}</span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{emp.department || 'No department'}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">ID: {emp.employee_code}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Employee Details and AddSkill */}
        {selectedEmployee && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Employee Information */}
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Employee Information</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                    <span className="font-semibold text-gray-700 w-32">Name:</span>
                    <span className="text-gray-800 font-medium">{selectedEmployee.full_name}</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                    <span className="font-semibold text-gray-700 w-32">Employee Code:</span>
                    <span className="text-gray-800 font-medium">{selectedEmployee.employee_code}</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                    <span className="font-semibold text-gray-700 w-32">Department:</span>
                    <span className="text-gray-800 font-medium">{selectedEmployee.department || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                    <span className="font-semibold text-gray-700 w-32">Designation:</span>
                    <span className="text-gray-800 font-medium">{selectedEmployee.designation}</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                    <span className="font-semibold text-gray-700 w-32">Join Date:</span>
                    <span className="text-gray-800 font-medium">{selectedEmployee.date_of_join}</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                    <span className="font-semibold text-gray-700 w-32">Pattern Category:</span>
                    <span className="text-gray-800 font-medium">{selectedEmployee.employee_pattern_category}</span>
                  </div>
                  {selectedEmployee.department_code && (
                    <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                      <span className="font-semibold text-gray-700 w-32">Dept Code:</span>
                      <span className="text-gray-800 font-medium">{selectedEmployee.department_code}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Current Skills */}
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Current Skills</h3>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedEmployee.skills?.length ? (
                    selectedEmployee.skills.map((skill, index) => (
                      <div key={index} className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border-l-4 border-blue-500 hover:shadow-md transition-all duration-200">
                        <p className="font-bold text-gray-800 text-lg mb-2">
                          {skill.skill} - Level {skill.skill_level}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="flex gap-4">
                            <p>
                              <span className="text-gray-600">Start:</span> {skill.start_date}
                            </p>
                            <p>
                              <span className="text-gray-600">End:</span> {skill.end_date}
                            </p>
                          </div>
                          <p className="col-span-2">
                            <span className="text-gray-600">Status:</span> {skill.status}
                          </p>
                          {skill.notes && (
                            <p className="col-span-2">
                              <span className="text-gray-600">Notes:</span> {skill.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No current skills found
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* AddSkill component */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Add New Skill</h3>
              </div>
              <AddSkill
                employeeID={selectedEmployee.employee_id} 
                employee={selectedEmployee}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeSearch;