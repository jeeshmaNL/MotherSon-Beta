import React, { useState, useEffect } from 'react';
import SkillMatrixTable from '../components/SkillMatrixTable';
import { fetchSkillMatrices, fetchOperations, fetchSections, fetchMonthlySkill, fetchSkillMatrixData } from '../api/api';
import { SkillMatrix, Operation, Section, MonthlySkill, Month, months } from '../api/types';

const SkillMatrixPage: React.FC = () => {
  const [skillMatrices, setSkillMatrices] = useState<SkillMatrix[]>([]);
  const [selectedMatrix, setSelectedMatrix] = useState<SkillMatrix | null>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [monthlySkills, setMonthlySkills] = useState<MonthlySkill[]>([]);
  const [skillMatrixData, setSkillMatrixData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch new skill matrix data with automatic updates
        const newSkillMatrixData = await fetchSkillMatrixData();
        console.log('New Skill Matrix Data:', newSkillMatrixData);

        setSkillMatrixData(newSkillMatrixData);

        // Set employees from the new API
        if (newSkillMatrixData && newSkillMatrixData.employees) {
          setEmployees(newSkillMatrixData.employees);
        }

        // Create skill matrices from departments
        if (newSkillMatrixData && newSkillMatrixData.departments) {
          const matrices = newSkillMatrixData.departments.map((dept: any, index: number) => ({
            id: index + 1,
            department: dept.name,
            created_on: new Date().toISOString(),
            updated_on: new Date().toISOString()
          }));
          setSkillMatrices(matrices);

          if (matrices.length > 0) {
            setSelectedMatrix(matrices[0]);
          }
        }

        // Also fetch the old data for compatibility
        const [operationsData, sectionsData, monthlySkillsData] = await Promise.all([
          fetchOperations(),
          fetchSections(),
          fetchMonthlySkill()
        ]);

        setOperations(operationsData);
        setSections(sectionsData);
        setMonthlySkills(monthlySkillsData);

      } catch (err) {
        console.error('Error loading initial data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleMatrixChange = (matrix: SkillMatrix) => {
    setSelectedMatrix(matrix);
  };

  return (
    <>
      <SkillMatrixTable
        skillMatrices={skillMatrices}
        selectedMatrix={selectedMatrix}
        employees={employees}
        operations={operations}
        sections={sections}
        monthlySkills={monthlySkills}
        months={months}
        skillMatrixData={skillMatrixData}
        isLoading={isLoading}
        error={error}
        onMatrixChange={handleMatrixChange}
      />
    </>
  );
};

export default SkillMatrixPage;