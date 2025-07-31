// import React, { useEffect, useState } from 'react'
// import { useLocation } from 'react-router-dom'
// import axios from 'axios'
// import logo from '../../assets/logo.png'
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// interface TraineeInfo {
//   id?: number
//   traineeId: string
//   trainee_name: string
//   trainer_name: string
//   line_name: string
//   revision_date: string
//   DOJ: string
//   station: {
//     id: number
//     name: string
//   } | null
//   line?: number
// }

// interface LocationState {
//   operatorId?: string
//   employeeName?: string
//   employeeData?: any
//   lineId?: string | number
//   lineName?: string
//   prevpage?: string
// }

// interface OJTDay {
//   id: number
//   name: string
//   day_number?: number
// }

// interface DailyScore {
//   day: number
//   date: string
//   plan: string
//   actual: string
//   production_marks: number
//   rejections: string
//   quality_marks: number
//   submitted?: boolean
// }

// const OnJobTraining = () => {
//   const location = useLocation()
//   const { operatorId, employeeName, employeeData, lineId, lineName, prevpage } = (location.state as LocationState) || {}

//   console.log('Received OJT state:', { operatorId, employeeName, lineId, lineName, prevpage })

//   const [trainee, setTrainee] = useState<TraineeInfo | null>(null)
//   const [ojtDays, setOjtDays] = useState<OJTDay[]>([])
//   const [loading, setLoading] = useState(false)
//   const [submitError, setSubmitError] = useState('')
//   const [selectedStationId, setSelectedStationId] = useState<number | null>(null)
//   const [engineerJudge, setEngineerJudge] = useState('')
//   const [lines, setLines] = useState<any[]>([])
//   const [stations, setStations] = useState<any[]>([])
//   const [preparedBy, setPreparedBy] = useState('')
//   const [approvedBy, setApprovedBy] = useState('')



//   // Helper function to convert date from yyyy-mm-dd to dd/mm/yyyy for display
//   const formatDateForDisplay = (dateString: string): string => {
//     if (!dateString) return ''
//     if (dateString.includes('/')) return dateString // Already in dd/mm/yyyy format
//     const [year, month, day] = dateString.split('-')
//     return `${day}/${month}/${year}`
//   }

//   // Helper function to convert date from dd/mm/yyyy to yyyy-mm-dd for API
//   const formatDateForAPI = (dateString: string): string => {
//     if (!dateString) return ''
//     if (dateString.includes('-')) return dateString // Already in yyyy-mm-dd format
//     const [day, month, year] = dateString.split('/')
//     return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
//   }

//   // Helper function to convert date from yyyy-mm-dd to yyyy-mm-dd for date input (no conversion needed)
//   const formatDateForInput = (dateString: string): string => {
//     if (!dateString) return ''
//     if (dateString.includes('-')) return dateString // Already in yyyy-mm-dd format
//     const [day, month, year] = dateString.split('/')
//     return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
//   }

//   // Fetch OJT Days and create them if they don't exist
//   useEffect(() => {
//     const fetchOrCreateOJTDays = async () => {
//       try {
//         const response = await axios.get('http://localhost:8000/leveltwo-days/')

//         if (response.data.length === 0) {
//           // Create default OJT days if none exist
//           const daysToCreate = [
//             { name: 'Day 1', day_number: 1 },
//             { name: 'Day 2', day_number: 2 },
//             { name: 'Day 3', day_number: 3 },
//             { name: 'Day 4', day_number: 4 },
//             { name: 'Day 5', day_number: 5 },
//             { name: 'Day 6', day_number: 6 }
//           ]

//           const createdDays = []
//           for (const day of daysToCreate) {
//             try {
//               const createResponse = await axios.post('http://localhost:8000/leveltwo-days/', day)
//               createdDays.push(createResponse.data)
//             } catch (createErr) {
//               console.error('Failed to create OJT day:', day, createErr)
//             }
//           }
//           setOjtDays(createdDays)
//         } else {
//           setOjtDays(response.data)
//         }
//       } catch (err) {
//         console.error('Failed to fetch OJT days:', err)
//       }
//     }

//     fetchOrCreateOJTDays()
//   }, [])

//   // Create or fetch trainee
//   useEffect(() => {
//     const createOrFetchTrainee = async () => {
//       if (operatorId && employeeName && lineName) {
//         try {
//           // Clean the operator ID by trimming spaces
//           const cleanOperatorId = operatorId.trim()
//           console.log('Creating trainee with cleaned ID:', cleanOperatorId)

//           const traineeInfo: TraineeInfo = {
//             traineeId: cleanOperatorId,
//             trainee_name: employeeName,
//             trainer_name: '', // Will be filled by user
//             line_name: lineName,
//             revision_date: new Date().toISOString().split('T')[0],
//             DOJ: employeeData?.joining_date || '',
//             station: null,
//             line: Number(lineId) || undefined
//           }
//           setTrainee(traineeInfo)
//         } catch (error) {
//           console.error('Error handling trainee:', error)
//           // Fallback to creating trainee info locally
//           const cleanOperatorId = operatorId?.trim() || ''
//           const traineeInfo: TraineeInfo = {
//             traineeId: cleanOperatorId,
//             trainee_name: employeeName,
//             trainer_name: '',
//             line_name: lineName,
//             revision_date: new Date().toISOString().split('T')[0],
//             DOJ: employeeData?.joining_date || '',
//             station: null,
//             line: Number(lineId) || undefined
//           }
//           setTrainee(traineeInfo)
//         }
//       }
//     }

//     createOrFetchTrainee()
//   }, [operatorId, employeeName, lineName, employeeData, lineId])

//   // Load existing scores for the trainee
//   useEffect(() => {
//     const loadExistingScores = async () => {
//       if (trainee?.traineeId && selectedStationId && ojtDays.length > 0) {
//         try {
//           console.log('Loading existing scores for trainee:', trainee.traineeId, 'station:', selectedStationId)

//           // First get the trainee with database ID and existing scores
//           const traineeResponse = await axios.get(`http://localhost:8000/trainee/${trainee.traineeId.trim()}/${selectedStationId}/`)
//           const traineeData = traineeResponse.data

//           console.log('Trainee data with scores:', traineeData)

//           // Update trainee with database ID and trainer_name
//           setTrainee(prev => prev ? { 
//             ...prev, 
//             id: traineeData.id,
//             trainer_name: traineeData.trainer_name || prev.trainer_name 
//           } : null)

//           if (traineeData.ojtscores && traineeData.ojtscores.length > 0) {
//             console.log('Found existing scores:', traineeData.ojtscores)

//             setDailyScores(prev => prev.map(score => {
//               const existingScore = traineeData.ojtscores.find((es: any) => {
//                 const dayMatch = ojtDays.find(d => d.id === es.day_id)
//                 return dayMatch && (dayMatch.day_number === score.day || dayMatch.name === `Day ${score.day}`)
//               })

//               if (existingScore) {
//                 console.log(`Loading data for Day ${score.day}:`, existingScore)
//                 return {
//                   ...score,
//                   date: formatDateForDisplay(existingScore.date || ''),
//                   plan: existingScore.production_plan?.toString() || '',
//                   actual: existingScore.production_actual?.toString() || '',
//                   production_marks: existingScore.production_marks || 0,
//                   rejections: existingScore.quality_no_of_rejection?.toString() || '',
//                   quality_marks: existingScore.quality_marks || 0,
//                   submitted: true
//                 }
//               }
//               return score
//             }))

//             // Set the form fields from the first existing score
//             const firstScore = traineeData.ojtscores[0]
//             if (firstScore) {
//               setPreparedBy(firstScore.prepared_by || '')
//               setApprovedBy(firstScore.approved_by || '')
//               setEngineerJudge(firstScore.Engineer_judge || '')
//             }
//           } else {
//             console.log('No existing scores found for this trainee')
//           }
//         } catch (error) {
//           console.error('Failed to load existing scores:', error)
//         }
//       }
//     }

//     // Load scores when we have all required data
//     if (trainee?.traineeId && selectedStationId && ojtDays.length > 0) {
//       loadExistingScores()
//     }
//   }, [trainee?.traineeId, selectedStationId, ojtDays])

//   // Helper function to get today's date in dd/mm/yyyy format
//   const getTodayDate = (): string => {
//     const today = new Date();
//     const day = today.getDate().toString().padStart(2, '0');
//     const month = (today.getMonth() + 1).toString().padStart(2, '0');
//     const year = today.getFullYear().toString();
//     return `${day}/${month}/${year}`;
//   };

//   const [dailyScores, setDailyScores] = useState<DailyScore[]>([
//     { day: 1, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//     { day: 2, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//     { day: 3, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//     { day: 4, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//     { day: 5, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//     { day: 6, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false }
//   ])

//   const handleExportExcel = () => {
//   // Prepare data for export
//   const exportData = dailyScores.map((row, idx) => ({
//     Day: row.day,
//     Date: row.date,
//     Plan: row.plan,
//     Actual: row.actual,
//     "Production Marks": row.production_marks,
//     "Rejections": row.rejections,
//     "Quality Marks": row.quality_marks,
//   }));

//   // Add trainee info as the first row
//   exportData.unshift({
//     Day: "Trainee Name",
//     Date: trainee?.trainee_name || "",
//     Plan: "Trainer",
//     Actual: trainee?.trainer_name || "",
//     "Production Marks": "Line",
//     "Rejections": trainee?.line_name || "",
//     "Quality Marks": "",
//   });

//   // Create worksheet and workbook
//   const ws = XLSX.utils.json_to_sheet(exportData, { skipHeader: false });
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, "OJT Sheet");

//   // Export to file
//   const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//   saveAs(new Blob([wbout], { type: "application/octet-stream" }), "OJT_Sheet.xlsx");
// };

// const handleExportPDF = () => {
//   const doc = new jsPDF();

//   // Title
//   doc.setFontSize(16);
//   doc.text("ON JOB TRAINING SHEET", 14, 16);

//   // Trainee Info
//   doc.setFontSize(10);
//   doc.text(`Trainee Name: ${trainee?.trainee_name || ""}`, 14, 26);
//   doc.text(`Trainer: ${trainee?.trainer_name || ""}`, 14, 32);
//   doc.text(`Line: ${trainee?.line_name || ""}`, 14, 38);

//   // Table
//   const tableColumn = [
//     "Day",
//     "Date",
//     "Plan",
//     "Actual",
//     "Production Marks",
//     "Rejections",
//     "Quality Marks",
//   ];
//   const tableRows = dailyScores.map((row) => [
//     row.day,
//     row.date,
//     row.plan,
//     row.actual,
//     row.production_marks,
//     row.rejections,
//     row.quality_marks,
//   ]);

//   autoTable(doc, {
//   head: [tableColumn],
//   body: tableRows,
//   startY: 45,
//   theme: "grid",
//   headStyles: { fillColor: [30, 64, 175] },
// });

//   doc.save("OJT_Sheet.pdf");
// };

//   // Submit all data
//   const handleSubmit = async () => {
//     setLoading(true)
//     setSubmitError('')

//     try {
//       // Validation
//       const filledRows = dailyScores.filter(row =>
//         row.date && row.plan && row.actual && row.rejections
//       )

//       if (filledRows.length === 0) {
//         setSubmitError('Please fill at least one day\'s data')
//         setLoading(false)
//         return
//       }

//       // Validate date format for filled rows
//       const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
//       const invalidDates = filledRows.filter(row => !dateRegex.test(row.date))
//       if (invalidDates.length > 0) {
//         setSubmitError('Please enter dates in DD/MM/YYYY format')
//         setLoading(false)
//         return
//       }

//       if (!selectedStationId) {
//         setSubmitError('Please select a process/station')
//         setLoading(false)
//         return
//       }

//       if (!preparedBy.trim() || !approvedBy.trim() || !engineerJudge.trim()) {
//         setSubmitError('Please fill in Prepared By, Approved By, and Engineer Judge fields')
//         setLoading(false)
//         return
//       }

//       // Ensure trainee exists in database and get the database ID
//       let traineeDbId = trainee?.id
//       if (!traineeDbId && trainee) {
//         try {
//           // First, try to create the trainee with cleaned ID
//           const cleanTraineeId = trainee.traineeId.trim()
//           const traineePayload = {
//             traineeId: cleanTraineeId,
//             trainee_name: trainee.trainee_name,
//             trainer_name: trainee.trainer_name || 'Default Trainer',
//             line: trainee.line || Number(lineId),
//             station: selectedStationId,
//             revision_date: trainee.revision_date,
//             DOJ: trainee.DOJ
//           }

//           await axios.post('http://localhost:8000/leveltwo-trainees/', traineePayload)
//           console.log('Trainee created successfully with ID:', cleanTraineeId)
//         } catch (traineeErr: any) {
//           console.error('Trainee creation failed (may already exist):', traineeErr)
//           // Continue - trainee might already exist
//         }

//         // Now get the trainee with database ID using the specific endpoint
//         try {
//           // Trim the trainee ID to remove any extra spaces
//           const cleanTraineeId = trainee.traineeId.trim()
//           console.log('Looking for trainee:', cleanTraineeId, 'at station:', selectedStationId)

//           const traineeResponse = await axios.get(`http://localhost:8000/trainee/${cleanTraineeId}/${selectedStationId}/`)
//           traineeDbId = traineeResponse.data.id
//           console.log('Got trainee database ID:', traineeDbId)

//           // Update the trainee state with the database ID
//           setTrainee(prev => prev ? { ...prev, id: traineeDbId, traineeId: cleanTraineeId } : null)
//         } catch (fetchErr: any) {
//           console.error('Failed to fetch trainee ID:', fetchErr)
//           console.error('Error details:', fetchErr.response?.data)
//           setSubmitError(`Failed to get trainee database ID. Trainee '${trainee.traineeId.trim()}' not found at station ${selectedStationId}.`)
//           setLoading(false)
//           return
//         }
//       }

//       // Submit only filled rows
//       for (const row of filledRows) {
//         // Find the corresponding OJT day
//         const ojtDay = ojtDays.find(d => d.day_number === row.day || d.name === `Day ${row.day}`)
//         if (!ojtDay) {
//           console.warn(`OJT Day ${row.day} not found, skipping`)
//           continue
//         }

//         const payload = {
//           trainee: traineeDbId,
//           day: ojtDay.id,
//           date: formatDateForAPI(row.date),
//           production_plan: parseInt(row.plan) || 0,
//           production_actual: parseInt(row.actual) || 0,
//           production_marks: row.production_marks,
//           quality_no_of_rejection: parseInt(row.rejections) || 0,
//           quality_marks: row.quality_marks,
//           Engineer_judge: engineerJudge,
//           prepared_by: preparedBy,
//           approved_by: approvedBy
//         }

//         console.log("Payload being sent:", payload)

//         try {
//           await axios.post('http://localhost:8000/leveltwo-scores/', payload)
//         } catch (submitErr: any) {
//           console.error('Individual submission error:', submitErr)
//           console.error('Error response:', submitErr.response?.data)
//           throw submitErr
//         }
//       }

//       alert('Data submitted successfully!')

//       // Mark submitted rows
//       setDailyScores(prev => prev.map(score => {
//         const isSubmitted = filledRows.some(fr => fr.day === score.day)
//         return isSubmitted ? { ...score, submitted: true } : score
//       }))

//     } catch (err: any) {
//       console.error('Submission failed:', err)
//       let errorMessage = 'Submission failed!'

//       if (err.response?.data) {
//         if (typeof err.response.data === 'string') {
//           errorMessage = err.response.data
//         } else if (err.response.data.detail) {
//           errorMessage = err.response.data.detail
//         } else if (err.response.data.message) {
//           errorMessage = err.response.data.message
//         } else {
//           errorMessage = JSON.stringify(err.response.data)
//         }
//       }

//       setSubmitError(errorMessage)
//       alert(errorMessage)
//     } finally {
//       setLoading(false)
//     }
//   }



//   useEffect(() => {
//     axios.get('http://localhost:8000/leveltwo-lines/')
//       .then((res) => setLines(res.data))
//       .catch((err) => console.error('Failed to fetch lines:', err));

//     axios.get('http://localhost:8000/substations/')
//       .then((res) => setStations(res.data))
//       .catch((err) => console.error('Failed to fetch stations:', err));
//   }, []);

//   // Load existing scores when station is selected
//   useEffect(() => {
//     const loadScoresForStation = async () => {
//       if (trainee?.traineeId && selectedStationId && ojtDays.length > 0) {
//         try {
//           console.log('Station selected, loading scores for trainee:', trainee.traineeId, 'station:', selectedStationId)

//           // Get the trainee with database ID and existing scores
//           const traineeResponse = await axios.get(`http://localhost:8000/trainee/${trainee.traineeId.trim()}/${selectedStationId}/`)
//           const traineeData = traineeResponse.data

//           console.log('Trainee data with scores:', traineeData)

//           // Update trainee with database ID and trainer_name
//           setTrainee(prev => prev ? { 
//             ...prev, 
//             id: traineeData.id,
//             trainer_name: traineeData.trainer_name || prev.trainer_name 
//           } : null)

//           if (traineeData.ojtscores && traineeData.ojtscores.length > 0) {
//             console.log('Found existing scores:', traineeData.ojtscores)

//             setDailyScores(prev => prev.map(score => {
//               const existingScore = traineeData.ojtscores.find((es: any) => {
//                 const dayMatch = ojtDays.find(d => d.id === es.day_id)
//                 return dayMatch && (dayMatch.day_number === score.day || dayMatch.name === `Day ${score.day}`)
//               })

//               if (existingScore) {
//                 console.log(`Loading data for Day ${score.day}:`, existingScore)
//                 return {
//                   ...score,
//                   date: formatDateForDisplay(existingScore.date || ''),
//                   plan: existingScore.production_plan?.toString() || '',
//                   actual: existingScore.production_actual?.toString() || '',
//                   production_marks: existingScore.production_marks || 0,
//                   rejections: existingScore.quality_no_of_rejection?.toString() || '',
//                   quality_marks: existingScore.quality_marks || 0,
//                   submitted: true
//                 }
//               }
//               return score
//             }))

//             // Set the form fields from the first existing score
//             const firstScore = traineeData.ojtscores[0]
//             if (firstScore) {
//               setPreparedBy(firstScore.prepared_by || '')
//               setApprovedBy(firstScore.approved_by || '')
//               setEngineerJudge(firstScore.Engineer_judge || '')
//             }

//             console.log('Successfully loaded existing data for trainee')
//           } else {
//             console.log('No existing scores found for this trainee at this station')
//             // Reset the form if no scores found for this station
//             setDailyScores([
//               { day: 1, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//               { day: 2, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//               { day: 3, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//               { day: 4, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//               { day: 5, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//               { day: 6, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false }
//             ])
//             setPreparedBy('')
//             setApprovedBy('')
//             setEngineerJudge('')
//           }
//         } catch (error) {
//           console.error('Failed to load existing scores for station:', error)
//           // If trainee doesn't exist for this station, reset the form
//           setDailyScores([
//             { day: 1, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//             { day: 2, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//             { day: 3, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//             { day: 4, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//             { day: 5, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//             { day: 6, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false }
//           ])
//         }
//       }
//     }

//     loadScoresForStation()
//   }, [selectedStationId, trainee?.traineeId, ojtDays]);

//   // Use the lineId passed from previous component to find matching line
//   const matchingLine = lines.find((line) => 
//     line.name === trainee?.line_name || line.id === Number(lineId)
//   );
  
//   const filteredStations = stations.filter(
//     (station) => station.line === matchingLine?.id
//   );

//   const calculateProductionMarks = (plan: number, actual: number): number => {
//     if (plan === 0) return 0;
//     const percentage = (actual / plan) * 100;

//     if (percentage >= 90) return 4;
//     if (percentage >= 80) return 2;
//     if (percentage >= 70) return 1;
//     return 0;
//   };

//   const calculateQualityMarks = (rejections: number): number => {
//     if (rejections === 0) return 4;
//     if (rejections === 1) return 2;
//     if (rejections === 2) return 1;
//     return 0;
//   };

//   const handleInputChange = (index: number, field: string, value: string | number) => {
//     setDailyScores((prevScores) => {
//       return prevScores.map((row, i) => {
//         if (i !== index) return row;

//         const updatedRow = {
//           ...row,
//           [field]: value,
//         };

//         const plan = Number(updatedRow.plan);
//         const actual = Number(updatedRow.actual);
//         const rejections = Number(updatedRow.rejections);

//         return {
//           ...updatedRow,
//           production_marks: calculateProductionMarks(plan, actual),
//           quality_marks: calculateQualityMarks(rejections),
//         };
//       });
//     });

    
//   };

// import React, { useEffect, useState } from 'react'
// import { useLocation } from 'react-router-dom'
// import axios from 'axios'

// interface TraineeInfo {
//   id?: number
//   traineeId: string
//   trainee_name: string
//   trainer_name: string
//   line_name: string
//   revision_date: string
//   DOJ: string
//   station: {
//     id: number
//     name: string
//   } | null
//   line?: number
// }

// interface LocationState {
//   operatorId?: string
//   employeeName?: string
//   employeeData?: any
//   lineId?: string | number
//   lineName?: string
//   prevpage?: string
// }

// interface OJTDay {
//   id: number
//   name: string
//   day_number?: number
// }

// interface DailyScore {
//   day: number
//   date: string
//   plan: string
//   actual: string
//   production_marks: number
//   rejections: string
//   quality_marks: number
//   submitted?: boolean
// }

// const OnJobTraining = () => {
//   const location = useLocation()
//   const { operatorId, employeeName, employeeData, lineId, lineName, prevpage } = (location.state as LocationState) || {}

//   const [trainee, setTrainee] = useState<TraineeInfo | null>(null)
//   const [ojtDays, setOjtDays] = useState<OJTDay[]>([])
//   const [loading, setLoading] = useState(false)
//   const [submitError, setSubmitError] = useState('')
//   const [selectedStationId, setSelectedStationId] = useState<number | null>(null)
//   const [engineerJudge, setEngineerJudge] = useState('')
//   const [lines, setLines] = useState<any[]>([])
//   const [stations, setStations] = useState<any[]>([])
//   const [preparedBy, setPreparedBy] = useState('')
//   const [approvedBy, setApprovedBy] = useState('')

//   // Helper function to convert date from yyyy-mm-dd to dd/mm/yyyy for display
//   const formatDateForDisplay = (dateString: string): string => {
//     if (!dateString) return ''
//     if (dateString.includes('/')) return dateString // Already in dd/mm/yyyy format
//     const [year, month, day] = dateString.split('-')
//     return `${day}/${month}/${year}`
//   }

//   // Helper function to convert date from dd/mm/yyyy to yyyy-mm-dd for API
//   const formatDateForAPI = (dateString: string): string => {
//     if (!dateString) return ''
//     if (dateString.includes('-')) return dateString // Already in yyyy-mm-dd format
//     const [day, month, year] = dateString.split('/')
//     return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
//   }

//   // Helper function to convert date from yyyy-mm-dd to yyyy-mm-dd for date input (no conversion needed)
//   const formatDateForInput = (dateString: string): string => {
//     if (!dateString) return ''
//     if (dateString.includes('-')) return dateString // Already in yyyy-mm-dd format
//     const [day, month, year] = dateString.split('/')
//     return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
//   }

//   // Fetch OJT Days and create them if they don't exist
//   useEffect(() => {
//     const fetchOrCreateOJTDays = async () => {
//       try {
//         const response = await axios.get('http://localhost:8000/leveltwo-days/')
//         if (response.data.length === 0) {
//           // Create default OJT days if none exist
//           const daysToCreate = [
//             { name: 'Day 1', day_number: 1 },
//             { name: 'Day 2', day_number: 2 },
//             { name: 'Day 3', day_number: 3 },
//             { name: 'Day 4', day_number: 4 },
//             { name: 'Day 5', day_number: 5 },
//             { name: 'Day 6', day_number: 6 }
//           ]
//           const createdDays = []
//           for (const day of daysToCreate) {
//             try {
//               const createResponse = await axios.post('http://localhost:8000/leveltwo-days/', day)
//               createdDays.push(createResponse.data)
//             } catch (createErr) {
//               console.error('Failed to create OJT day:', day, createErr)
//             }
//           }
//           setOjtDays(createdDays)
//         } else {
//           setOjtDays(response.data)
//         }
//       } catch (err) {
//         console.error('Failed to fetch OJT days:', err)
//       }
//     }
//     fetchOrCreateOJTDays()
//   }, [])

//   // Create or fetch trainee
//   useEffect(() => {
//     const createOrFetchTrainee = async () => {
//       if (operatorId && employeeName && lineName) {
//         try {
//           const cleanOperatorId = operatorId.trim()
//           const traineeInfo: TraineeInfo = {
//             traineeId: cleanOperatorId,
//             trainee_name: employeeName,
//             trainer_name: '',
//             line_name: lineName,
//             revision_date: new Date().toISOString().split('T')[0],
//             DOJ: employeeData?.joining_date || '',
//             station: null,
//             line: Number(lineId) || undefined
//           }
//           setTrainee(traineeInfo)
//         } catch (error) {
//           const cleanOperatorId = operatorId?.trim() || ''
//           const traineeInfo: TraineeInfo = {
//             traineeId: cleanOperatorId,
//             trainee_name: employeeName,
//             trainer_name: '',
//             line_name: lineName,
//             revision_date: new Date().toISOString().split('T')[0],
//             DOJ: employeeData?.joining_date || '',
//             station: null,
//             line: Number(lineId) || undefined
//           }
//           setTrainee(traineeInfo)
//         }
//       }
//     }
//     createOrFetchTrainee()
//   }, [operatorId, employeeName, lineName, employeeData, lineId])

//   // --- CHANGED: Only one effect to load scores for selected process ---
//  useEffect(() => {
//   const ensureTraineeProcessExistsAndLoadScores = async () => {
//     if (trainee?.traineeId && selectedStationId && ojtDays.length > 0) {
//       let traineeDbId = null;
//       try {
//         // Try to fetch the trainee-process record
//         const traineeResponse = await axios.get(
//           `http://localhost:8000/trainee/${trainee.traineeId.trim()}/${selectedStationId}/`
//         );
//         const traineeData = traineeResponse.data;
//         traineeDbId = traineeData.id;
//         setTrainee(prev => prev ? { 
//           ...prev, 
//           id: traineeDbId,
//           trainer_name: traineeData.trainer_name || prev.trainer_name 
//         } : null);

//         // If OJT scores exist, load them into the form
//         if (traineeData.ojtscores && traineeData.ojtscores.length > 0) {
//           setDailyScores(prev => prev.map(score => {
//             const existingScore = traineeData.ojtscores.find((es: any) => {
//               // Match by day_number or name
//               const dayMatch = ojtDays.find(d => d.id === es.day || d.id === es.day_id);
//               return dayMatch && (dayMatch.day_number === score.day || dayMatch.name === `Day ${score.day}`);
//             });
//             if (existingScore) {
//               return {
//                 ...score,
//                 date: formatDateForDisplay(existingScore.date || ''),
//                 plan: existingScore.production_plan?.toString() || '',
//                 actual: existingScore.production_actual?.toString() || '',
//                 production_marks: existingScore.production_marks || 0,
//                 rejections: existingScore.quality_no_of_rejection?.toString() || '',
//                 quality_marks: existingScore.quality_marks || 0,
//                 submitted: true
//               }
//             }
//             return score;
//           }));
//           // Set form fields from first score
//           const firstScore = traineeData.ojtscores[0];
//           if (firstScore) {
//             setPreparedBy(firstScore.prepared_by || '');
//             setApprovedBy(firstScore.approved_by || '');
//             setEngineerJudge(firstScore.Engineer_judge || '');
//           }
//         } else {
//           // No scores for this process, reset form
//           setDailyScores([
//             { day: 1, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//             { day: 2, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//             { day: 3, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//             { day: 4, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//             { day: 5, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//             { day: 6, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false }
//           ]);
//           setPreparedBy('');
//           setApprovedBy('');
//           setEngineerJudge('');
//         }
//       } catch (error: any) {
//         // If not found, create the trainee-process record, then fetch again
//         if (error.response && error.response.status === 404) {
//           try {
//             const traineePayload = {
//               traineeId: trainee.traineeId.trim(),
//               trainee_name: trainee.trainee_name,
//               trainer_name: trainee.trainer_name || 'Default Trainer',
//               line: trainee.line || Number(lineId),
//               station: selectedStationId,
//               revision_date: trainee.revision_date,
//               DOJ: trainee.DOJ
//             }
//             await axios.post('http://localhost:8000/leveltwo-trainees/', traineePayload);
//             // Now fetch again
//             const traineeResponse = await axios.get(
//               `http://localhost:8000/trainee/${trainee.traineeId.trim()}/${selectedStationId}/`
//             );
//             const traineeData = traineeResponse.data;
//             setTrainee(prev => prev ? { 
//               ...prev, 
//               id: traineeData.id,
//               trainer_name: traineeData.trainer_name || prev.trainer_name 
//             } : null);
//             setDailyScores([
//               { day: 1, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//               { day: 2, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//               { day: 3, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//               { day: 4, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//               { day: 5, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//               { day: 6, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false }
//             ]);
//             setPreparedBy('');
//             setApprovedBy('');
//             setEngineerJudge('');
//           } catch (createErr) {
//             setSubmitError('Failed to create trainee-process record');
//           }
//         }
//       }
//     }
//   };
//   ensureTraineeProcessExistsAndLoadScores();
// }, [trainee?.traineeId, selectedStationId, ojtDays]);

 
//   // --- END CHANGED ---

//   const [dailyScores, setDailyScores] = useState<DailyScore[]>([
//     { day: 1, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//     { day: 2, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//     { day: 3, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//     { day: 4, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//     { day: 5, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//     { day: 6, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false }
//   ])

//   // ... (Export Excel/PDF code unchanged) ...

//   // Submit all data
//   const handleSubmit = async () => {
//     setLoading(true)
//     setSubmitError('')

//     try {
//       // Validation
//       const filledRows = dailyScores.filter(row =>
//         row.date && row.plan && row.actual && row.rejections
//       )

//       if (filledRows.length === 0) {
//         setSubmitError('Please fill at least one day\'s data')
//         setLoading(false)
//         return
//       }

//       // Validate date format for filled rows
//       const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
//       const invalidDates = filledRows.filter(row => !dateRegex.test(row.date))
//       if (invalidDates.length > 0) {
//         setSubmitError('Please enter dates in DD/MM/YYYY format')
//         setLoading(false)
//         return
//       }

//       if (!selectedStationId) {
//         setSubmitError('Please select a process/station')
//         setLoading(false)
//         return
//       }

//       if (!preparedBy.trim() || !approvedBy.trim() || !engineerJudge.trim()) {
//         setSubmitError('Please fill in Prepared By, Approved By, and Engineer Judge fields')
//         setLoading(false)
//         return
//       }

//       // Ensure trainee exists in database and get the database ID
//       let traineeDbId = trainee?.id
//       if (!traineeDbId && trainee) {
//         try {
//           // First, try to create the trainee with cleaned ID
//           const cleanTraineeId = trainee.traineeId.trim()
//           const traineePayload = {
//             traineeId: cleanTraineeId,
//             trainee_name: trainee.trainee_name,
//             trainer_name: trainee.trainer_name || 'Default Trainer',
//             line: trainee.line || Number(lineId),
//             station: selectedStationId,
//             revision_date: trainee.revision_date,
//             DOJ: trainee.DOJ
//           }
//           await axios.post('http://localhost:8000/leveltwo-trainees/', traineePayload)
//         } catch (traineeErr: any) {
//           // Continue - trainee might already exist
//         }
//         // Now get the trainee with database ID using the specific endpoint
//         try {
//           const cleanTraineeId = trainee.traineeId.trim()
//           const traineeResponse = await axios.get(`http://localhost:8000/trainee/${cleanTraineeId}/${selectedStationId}/`)
//           traineeDbId = traineeResponse.data.id
//           setTrainee(prev => prev ? { ...prev, id: traineeDbId, traineeId: cleanTraineeId } : null)
//         } catch (fetchErr: any) {
//           setSubmitError(`Failed to get trainee database ID. Trainee '${trainee.traineeId.trim()}' not found at station ${selectedStationId}.`)
//           setLoading(false)
//           return
//         }
//       }

//       // Submit only filled rows
//       for (const row of filledRows) {
//         // Find the corresponding OJT day
//         const ojtDay = ojtDays.find(d => d.day_number === row.day || d.name === `Day ${row.day}`)
//         if (!ojtDay) continue

//         const payload = {
//           trainee: traineeDbId,
//           day: ojtDay.id,
//           date: formatDateForAPI(row.date),
//           production_plan: parseInt(row.plan) || 0,
//           production_actual: parseInt(row.actual) || 0,
//           production_marks: row.production_marks,
//           quality_no_of_rejection: parseInt(row.rejections) || 0,
//           quality_marks: row.quality_marks,
//           Engineer_judge: engineerJudge,
//           prepared_by: preparedBy,
//           approved_by: approvedBy
//         }
//         try {
//           await axios.post('http://localhost:8000/leveltwo-scores/', payload)
//         } catch (submitErr: any) {
//           throw submitErr
//         }
//       }

//       alert('Data submitted successfully!')

//       // Mark submitted rows
//       setDailyScores(prev => prev.map(score => {
//         const isSubmitted = filledRows.some(fr => fr.day === score.day)
//         return isSubmitted ? { ...score, submitted: true } : score
//       }))

//     } catch (err: any) {
//       let errorMessage = 'Submission failed!'
//       if (err.response?.data) {
//         if (typeof err.response.data === 'string') {
//           errorMessage = err.response.data
//         } else if (err.response.data.detail) {
//           errorMessage = err.response.data.detail
//         } else if (err.response.data.message) {
//           errorMessage = err.response.data.message
//         } else {
//           errorMessage = JSON.stringify(err.response.data)
//         }
//       }
//       setSubmitError(errorMessage)
//       alert(errorMessage)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     axios.get('http://localhost:8000/leveltwo-lines/')
//       .then((res) => setLines(res.data))
//       .catch((err) => console.error('Failed to fetch lines:', err));

//     axios.get('http://localhost:8000/substations/')
//       .then((res) => setStations(res.data))
//       .catch((err) => console.error('Failed to fetch stations:', err));
//   }, []);

//   // Use the lineId passed from previous component to find matching line
//   const matchingLine = lines.find((line) => 
//     line.name === trainee?.line_name || line.id === Number(lineId)
//   );
//   const filteredStations = stations.filter(
//     (station) => station.line === matchingLine?.id
//   );

//   const calculateProductionMarks = (plan: number, actual: number): number => {
//     if (plan === 0) return 0;
//     const percentage = (actual / plan) * 100;
//     if (percentage >= 90) return 4;
//     if (percentage >= 80) return 2;
//     if (percentage >= 70) return 1;
//     return 0;
//   };

//   const calculateQualityMarks = (rejections: number): number => {
//     if (rejections === 0) return 4;
//     if (rejections === 1) return 2;
//     if (rejections === 2) return 1;
//     return 0;
//   };

//   const handleInputChange = (index: number, field: string, value: string | number) => {
//     setDailyScores((prevScores) => {
//       return prevScores.map((row, i) => {
//         if (i !== index) return row;
//         const updatedRow = {
//           ...row,
//           [field]: value,
//         };
//         const plan = Number(updatedRow.plan);
//         const actual = Number(updatedRow.actual);
//         const rejections = Number(updatedRow.rejections);
//         return {
//           ...updatedRow,
//           production_marks: calculateProductionMarks(plan, actual),
//           quality_marks: calculateQualityMarks(rejections),
//         };
//       });
//     });
//   };

//   return (
//    <div className="p-4 text-sm bg-white min-h-screen">
    
//     {/* <div className="flex justify-end mb-2">
//   <button
//     onClick={handleExportExcel}
//     className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-green-700 transition"
//   >
//     Export to Excel
//   </button>
//   <button
//   onClick={handleExportPDF}
//   className="bg-red-600 text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-red-700 transition ml-2"
// >
//   Export to PDF
// </button>
// </div> */}
//   <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-4 md:p-8 border border-gray-200">
//     <table className="w-full border border-gray-300 rounded-xl overflow-hidden text-center">
//       <tbody>
//         {/* Row 1: Logo + Title + Details */}
//         <tr>
//           {/* Logo */}
//           <td rowSpan={4} className="border border-gray-300 w-32 p-2 bg-white align-middle">
//             <img src={logo} alt="Logo" className="w-24 h-24 object-contain mx-auto" />
//           </td>
//           {/* Title */}
//           <td rowSpan={4} colSpan={2} className="border border-gray-300 bg-white">
//             <div className="flex flex-col justify-center h-full items-center">
//               <h1 className="text-2xl font-extrabold text-blue-900 tracking-wide">ON JOB TRAINING</h1>
//               <h1 className="text-2xl font-extrabold text-blue-900 tracking-wide">SHEET</h1>
//             </div>
//           </td>
//           {/* Revision Date */}
//           <td className="border border-gray-300 font-semibold bg-gray-80">Revision Date</td>
//           <td className="border border-gray-300 bg-white" colSpan={1}>
//             {trainee?.revision_date || ''}
//           </td>
//           <td className="border border-gray-300 bg-white" colSpan={3}></td>
//         </tr>
//         <tr>
//           <td className="border border-gray-300 font-semibold bg-gray-80">TRAINEE NAME :</td>
//           <td className="border border-gray-300 bg-white">{trainee?.trainee_name || ''}</td>
//           <td className="border border-gray-300 font-semibold bg-gray-80">TRAINER :</td>
//           <td className="border border-gray-300 bg-white">{trainee?.trainer_name || ''}</td>
//         </tr>
//         <tr>
//           <td className="border border-gray-300 font-semibold bg-gray-80">EMP NO. :</td>
//           <td className="border border-gray-300 bg-white">{trainee?.traineeId || ''}</td>
//           <td className="border border-gray-300 font-semibold bg-gray-80">LINE :</td>
//           <td className="border border-gray-300 bg-white">{trainee?.line_name || ''}</td>
//         </tr>
//         <tr>
//           <td className="border border-gray-300 font-semibold bg-gray-80">D.O.J. :</td>
//           <td className="border border-gray-300 bg-white" colSpan={1}>
//             {trainee?.DOJ || ''}
//           </td>
//         </tr>

//         {/* Process Name */}
//         <tr>
//           <td className="border border-gray-300 text-center font-semibold p-1 bg-gray-80" colSpan={7}>
//             <select
//               value={selectedStationId ?? ''}
//               onChange={(e) => setSelectedStationId(Number(e.target.value))}
//               className="border border-gray-400 p-2 rounded focus:ring-2 focus:ring-blue-400"
//             >
//               <option value="">Select Process</option>
//               {filteredStations.map((station) => (
//                 <option key={station.id} value={station.id}>
//                   {station.name}
//                 </option>
//               ))}
//             </select>
//           </td>
//         </tr>

//         {/* Table Header Rows */}
//         <tr className="bg-blue-50">
//           <th className="border border-gray-300" rowSpan={2}>DAYS</th>
//           <th className="border border-gray-300" rowSpan={2}>DATE</th>
//           <th className="border border-gray-300 text-blue-900" colSpan={3}>Production</th>
//           <th className="border border-gray-300 text-blue-900" colSpan={2}>QUALITY</th>
//         </tr>
//         <tr className="bg-gray-80">
//           <th className="border border-gray-300">PLAN</th>
//           <th className="border border-gray-300">ACT.</th>
//           <th className="border border-gray-300">Marks</th>
//           <th className="border border-gray-300">NO. OF REJ.</th>
//           <th className="border border-gray-300">Marks</th>
//         </tr>

//         {/* Table Rows */}
//         {[1, 2, 3, 4, 5, 6].map((day, index) => (
//           <tr key={day} className={index % 2 === 0 ? "bg-white" : "bg-gray-80"}>
//             <td className="border border-gray-300">{day}</td>
//             {/* Date */}
//             <td className="border border-gray-300">
//               <input
//                 type="date"
//                 value={formatDateForInput(dailyScores[index].date)}
//                 onChange={(e) => {
//                   const selectedDate = e.target.value;
//                   const displayDate = formatDateForDisplay(selectedDate);
//                   handleInputChange(index, 'date', displayDate);
//                 }}
//                 className="w-full p-1 rounded border focus:ring-2 focus:ring-blue-400"
//               />
//               {dailyScores[index].date && (
//                 <div className="text-xs text-gray-600 mt-1">
//                   {dailyScores[index].date}
//                 </div>
//               )}
//             </td>
//             {/* Plan */}
//             <td className="border border-gray-300">
//               <input
//                 type="number"
//                 value={dailyScores[index].plan}
//                 onChange={(e) => handleInputChange(index, 'plan', e.target.value)}
//                 className="w-full p-1 rounded border focus:ring-2 focus:ring-blue-400"
//               />
//             </td>
//             {/* Actual */}
//             <td className="border border-gray-300">
//               <input
//                 type="number"
//                 value={dailyScores[index].actual}
//                 onChange={(e) => handleInputChange(index, 'actual', e.target.value)}
//                 className="w-full p-1 rounded border focus:ring-2 focus:ring-blue-400"
//               />
//             </td>
//             {/* Production Marks */}
//             <td className="border border-gray-300 font-semibold text-blue-700">
//               {dailyScores[index].production_marks}
//             </td>
//             {/* Rejections */}
//             <td className="border border-gray-300">
//               <input
//                 type="number"
//                 value={dailyScores[index].rejections}
//                 onChange={(e) => handleInputChange(index, 'rejections', e.target.value)}
//                 className="w-full p-1 rounded border focus:ring-2 focus:ring-blue-400"
//               />
//             </td>
//             {/* Quality Marks */}
//             <td className="border border-gray-300 font-semibold text-blue-700">
//               {dailyScores[index].quality_marks}
//             </td>
//           </tr>
//         ))}

//         {/* Marks Footer */}
//         <tr className="bg-gray-80 font-semibold">
//           <td className="border border-gray-300" colSpan={4} style={{ paddingRight: '10px', textAlign: 'right' }}>
//             Marks
//           </td>
//           <td className="border border-gray-300 text-blue-700">{dailyScores.reduce((sum, row) => sum + Number(row.production_marks || 0), 0)}</td>
//           <td className="border border-gray-300" style={{ paddingRight: '10px', textAlign: 'right' }}>
//             Marks
//           </td>
//           <td className="border border-gray-300 text-blue-700">{dailyScores.reduce((sum, row) => sum + Number(row.quality_marks || 0), 0)}</td>
//         </tr>

//         {/* Engineer Signatures */}
//         <tr>
//           <td className="border border-gray-300 font-semibold align-top p-1" rowSpan={4}></td>
//           <td colSpan={6} className="border border-gray-300 font-semibold text-left p-1 bg-gray-80">
//             ENGINEER JUDGE
//             <input
//               type="text"
//               value={engineerJudge}
//               onChange={(e) => setEngineerJudge(e.target.value)}
//               placeholder="Engineer Judge"
//               className="border p-1 w-full rounded focus:ring-2 focus:ring-blue-400 mt-1"
//             />
//           </td>
//         </tr>
//         <tr>
//           <td colSpan={6} className="border border-gray-300 font-semibold text-left p-1">SIGN</td>
//         </tr>
//         <tr>
//           <td colSpan={6} className="border border-gray-300 font-semibold text-left p-1">APR. BY</td>
//         </tr>

//         {/* Marking Scheme Header */}
//         <tr>
//           <td colSpan={7} className="border border-gray-300 text-center font-bold bg-blue-50">MARKING SCHEME</td>
//         </tr>

//         {/* Marking Scheme Details */}
//         <tr>
//           <td rowSpan={5} colSpan={2} className="border border-gray-300 font-semibold align-top p-2 bg-gray-80">
//             Legends (Actual<br />Production):
//           </td>
//           <td className="border border-gray-300 text-center bg-gray-80">Production Quantity</td>
//           <td className="border border-gray-300 text-center bg-gray-80">Marks</td>
//           <td rowSpan={5} className="border border-gray-300 text-center bg-gray-80">Legend (Rejection Quantity):</td>
//           <td className="border border-gray-300 text-center bg-gray-80">Number of Rejections</td>
//           <td className="border border-gray-300 text-center bg-gray-80">Marks</td>
//         </tr>
//         <tr>
//           <td className="border border-gray-300 text-center">90%-100%</td>
//           <td className="border border-gray-300 text-center">4</td>
//           <td className="border border-gray-300 text-center">0</td>
//           <td className="border border-gray-300 text-center">4</td>
//         </tr>
//         <tr>
//           <td className="border border-gray-300 text-center">80%-90%</td>
//           <td className="border border-gray-300 text-center">2</td>
//           <td className="border border-gray-300 text-center">1</td>
//           <td className="border border-gray-300 text-center">2</td>
//         </tr>
//         <tr>
//           <td className="border border-gray-300 text-center">70%-80%</td>
//           <td className="border border-gray-300 text-center">1</td>
//           <td className="border border-gray-300 text-center">2</td>
//           <td className="border border-gray-300 text-center">1</td>
//         </tr>
//         <tr>
//           <td className="border border-gray-300 text-center">&lt;70%</td>
//           <td className="border border-gray-300 text-center">0</td>
//           <td className="border border-gray-300 text-center">&gt;=3</td>
//           <td className="border border-gray-300 text-center">0</td>
//         </tr>

//         {/* Note */}
//         <tr>
//           <td colSpan={7} className="border border-gray-300 italic text-sm p-1 bg-gray-80">
//             NOTE:- Minimum 70% marks required in Production and in Quality.
//           </td>
//         </tr>

//         {/* Prepared By / Approved By */}
//         <tr>
//           <td colSpan={4} className="border border-gray-300 text-sm p-1 bg-white">
//             PREPARED BY:
//             <input
//               type="text"
//               className="w-full p-1 text-sm rounded border focus:ring-2 focus:ring-blue-400 mt-1"
//               placeholder="Prepared by"
//               value={preparedBy}
//               onChange={(e) => setPreparedBy(e.target.value)}
//             />
//           </td>
//           <td colSpan={3} className="border border-gray-300 text-sm p-1 bg-white">
//             APPROVED BY:
//             <input
//               type="text"
//               className="w-full p-1 text-sm rounded border focus:ring-2 focus:ring-blue-400 mt-1"
//               placeholder="Approved by"
//               value={approvedBy}
//               onChange={(e) => setApprovedBy(e.target.value)}
//             />
//           </td>
//         </tr>
//         <tr>
//           <td className="border border-gray-300 text-xs p-1 bg-gray-80">FM-PRD-16</td>
//           <td className="border border-gray-300 text-xs p-1 bg-gray-80">Rev:00</td>
//           <td colSpan={5} className="border border-gray-300 text-xs p-1 bg-gray-80">Origin: 20-05-2021</td>
//         </tr>
//       </tbody>
//     </table>

//     {/* Error Display */}
//     {submitError && (
//       <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//         {submitError}
//       </div>
//     )}

//     {/* Submit Button */}
//     <div className="mt-4 flex justify-center">
//       <button
//         onClick={handleSubmit}
//         disabled={loading}
//         type="submit"
//         className="bg-blue-600 text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-blue-700 transition disabled:bg-gray-400"
//       >
//         {loading ? 'Submitting...' : 'Submit'}
//       </button>
//     </div>

//     {/* Instructions */}
//     <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded">
//       <p className="text-sm text-blue-800">
//         <strong>Instructions:</strong> Fill in the data for the days you want to submit and click the "Submit" button.
//         You can fill partial data (e.g., just Day 1) and submit, then come back later to fill and submit additional days.
//       </p>
//     </div>
//   </div>
// </div>
//   )
// };

// export default OnJobTraining

import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

// --- Interfaces ---
interface TraineeInfo {
  id?: number
  traineeId: string
  trainee_name: string
  trainer_name: string
  line_name: string
  revision_date: string
  DOJ: string
  station: {
    id: number
    title: string
  } | null
  line?: number
}

interface LocationState {
  operatorId?: string
  employeeName?: string
  employeeData?: any
  lineId?: string | number
  lineName?: string
  prevpage?: string
}

interface OJTDay {
  id: number
  name: string
  day_number?: number
}

interface DailyScore {
  day: number
  date: string
  plan: string
  actual: string
  production_marks: number
  rejections: string
  quality_marks: number
  submitted?: boolean
}

// --- Main Component ---
const OnJobTraining = () => {
  const location = useLocation()
  const { operatorId, employeeName, employeeData, lineId, lineName, prevpage } = (location.state as LocationState) || {}

  const [trainee, setTrainee] = useState<TraineeInfo | null>(null)
  const [ojtDays, setOjtDays] = useState<OJTDay[]>([])
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [selectedStationId, setSelectedStationId] = useState<number | null>(null)
  const [engineerJudge, setEngineerJudge] = useState('')
  const [lines, setLines] = useState<any[]>([])
  const [stations, setStations] = useState<any[]>([])
  const [preparedBy, setPreparedBy] = useState('')
  const [approvedBy, setApprovedBy] = useState('')

  // Helper: yyyy-mm-dd -> dd/mm/yyyy
  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return ''
    if (dateString.includes('/')) return dateString
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
  }
  // Helper: dd/mm/yyyy -> yyyy-mm-dd
  const formatDateForAPI = (dateString: string): string => {
    if (!dateString) return ''
    if (dateString.includes('-')) return dateString
    const [day, month, year] = dateString.split('/')
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }
  // Helper: for <input type="date">
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return ''
    if (dateString.includes('-')) return dateString
    const [day, month, year] = dateString.split('/')
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  // --- Fetch OJT Days ---
  useEffect(() => {
    const fetchOrCreateOJTDays = async () => {
      try {
        const response = await axios.get('http://localhost:8000/leveltwo-days/')
        if (response.data.length === 0) {
          const daysToCreate = [
            { name: 'Day 1', day_number: 1 },
            { name: 'Day 2', day_number: 2 },
            { name: 'Day 3', day_number: 3 },
            { name: 'Day 4', day_number: 4 },
            { name: 'Day 5', day_number: 5 },
            { name: 'Day 6', day_number: 6 }
          ]
          const createdDays = []
          for (const day of daysToCreate) {
            try {
              const createResponse = await axios.post('http://localhost:8000/leveltwo-days/', day)
              createdDays.push(createResponse.data)
            } catch (createErr) {
              console.error('Failed to create OJT day:', day, createErr)
            }
          }
          setOjtDays(createdDays)
        } else {
          setOjtDays(response.data)
        }
      } catch (err) {
        console.error('Failed to fetch OJT days:', err)
      }
    }
    fetchOrCreateOJTDays()
  }, [])

  // --- Create or fetch trainee ---
  useEffect(() => {
    const createOrFetchTrainee = async () => {
      if (operatorId && employeeName && lineName) {
        try {
          const cleanOperatorId = operatorId.trim()
          const traineeInfo: TraineeInfo = {
            traineeId: cleanOperatorId,
            trainee_name: employeeName,
            trainer_name: '',
            line_name: lineName,
            revision_date: new Date().toISOString().split('T')[0],
            DOJ: employeeData?.joining_date || '',
            station: null,
            line: Number(lineId) || undefined
          }
          setTrainee(traineeInfo)
        } catch (error) {
          const cleanOperatorId = operatorId?.trim() || ''
          const traineeInfo: TraineeInfo = {
            traineeId: cleanOperatorId,
            trainee_name: employeeName,
            trainer_name: '',
            line_name: lineName,
            revision_date: new Date().toISOString().split('T')[0],
            DOJ: employeeData?.joining_date || '',
            station: null,
            line: Number(lineId) || undefined
          }
          setTrainee(traineeInfo)
        }
      }
    }
    createOrFetchTrainee()
  }, [operatorId, employeeName, lineName, employeeData, lineId])

  // --- Fetch lines and stations ---
  useEffect(() => {
    axios.get('http://localhost:8000/level2-sections/')
      .then((res) => setLines(res.data))
      .catch((err) => console.error('Failed to fetch lines:', err));

    axios.get('http://localhost:8000/level2-topics/')
      .then((res) => setStations(res.data))
      .catch((err) => console.error('Failed to fetch stations:', err));
  }, []);

  // Use the lineId passed from previous component to find matching line
  const matchingLine = lines.find((line) => 
    line.name === trainee?.line_name || line.id === Number(lineId)
  );
  // Filter stations by line and use .title for display
  const filteredStations = stations.filter(
    (station) => station.line === matchingLine?.id
  );

  // --- Auto-select the first process ---
  useEffect(() => {
    if (!selectedStationId && filteredStations.length > 0) {
      setSelectedStationId(filteredStations[0].id);
    }
  }, [filteredStations, selectedStationId]);

  // --- Load scores for selected process ---
  useEffect(() => {
    const ensureTraineeProcessExistsAndLoadScores = async () => {
      if (trainee?.traineeId && selectedStationId && ojtDays.length > 0) {
        let traineeDbId = null;
        try {
          // GET trainee by code and station
          const traineeResponse = await axios.get(
            `http://localhost:8000/trainee/${trainee.traineeId.trim()}/${selectedStationId}/`
          );
          const traineeData = traineeResponse.data;
          traineeDbId = traineeData.id;
          setTrainee(prev => prev ? { 
            ...prev, 
            id: traineeDbId,
            trainer_name: traineeData.trainer_name || prev.trainer_name 
          } : null);

          // If OJT scores exist, load them into the form
          if (traineeData.ojtscores && traineeData.ojtscores.length > 0) {
            setDailyScores(prev => prev.map(score => {
              const existingScore = traineeData.ojtscores.find((es: any) => {
                // Match by day_number or name
                const dayMatch = ojtDays.find(d => d.id === es.day || d.id === es.day_id);
                return dayMatch && (dayMatch.day_number === score.day || dayMatch.name === `Day ${score.day}`);
              });
              if (existingScore) {
                return {
                  ...score,
                  date: formatDateForDisplay(existingScore.date || ''),
                  plan: existingScore.production_plan?.toString() || '',
                  actual: existingScore.production_actual?.toString() || '',
                  production_marks: existingScore.production_marks || 0,
                  rejections: existingScore.quality_no_of_rejection?.toString() || '',
                  quality_marks: existingScore.quality_marks || 0,
                  submitted: true
                }
              }
              return score;
            }));
            // Set form fields from first score
            const firstScore = traineeData.ojtscores[0];
            if (firstScore) {
              setPreparedBy(firstScore.prepared_by || '');
              setApprovedBy(firstScore.approved_by || '');
              setEngineerJudge(firstScore.Engineer_judge || '');
            }
          } else {
            // No scores for this process, reset form
            setDailyScores([
              { day: 1, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
              { day: 2, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
              { day: 3, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
              { day: 4, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
              { day: 5, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
              { day: 6, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false }
            ]);
            setPreparedBy('');
            setApprovedBy('');
            setEngineerJudge('');
          }
        } catch (error: any) {
          // If not found, create the trainee-process record, then fetch again
          if (error.response && error.response.status === 404) {
            try {
              const traineePayload = {
                traineeId: trainee.traineeId.trim(),
                trainee_name: trainee.trainee_name,
                trainer_name: trainee.trainer_name || 'Default Trainer',
                line: trainee.line || Number(lineId),
                station: selectedStationId,
                revision_date: trainee.revision_date,
                DOJ: trainee.DOJ
              }
              await axios.post('http://localhost:8000/leveltwo-trainees/', traineePayload);
              // Now fetch again
              const traineeResponse = await axios.get(
                `http://localhost:8000/trainee/${trainee.traineeId.trim()}/${selectedStationId}/`
              );
              const traineeData = traineeResponse.data;
              setTrainee(prev => prev ? { 
                ...prev, 
                id: traineeData.id,
                trainer_name: traineeData.trainer_name || prev.trainer_name 
              } : null);
              setDailyScores([
                { day: 1, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
                { day: 2, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
                { day: 3, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
                { day: 4, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
                { day: 5, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
                { day: 6, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false }
              ]);
              setPreparedBy('');
              setApprovedBy('');
              setEngineerJudge('');
            } catch (createErr) {
              setSubmitError('Failed to create trainee-process record');
            }
          }
        }
      }
    };
    ensureTraineeProcessExistsAndLoadScores();
  }, [trainee?.traineeId, selectedStationId, ojtDays]);

  // --- Daily Scores State ---
  const [dailyScores, setDailyScores] = useState<DailyScore[]>([
    { day: 1, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
    { day: 2, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
    { day: 3, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
    { day: 4, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
    { day: 5, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
    { day: 6, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false }
  ])

  // --- Submit Handler ---
  const handleSubmit = async () => {
    setLoading(true)
    setSubmitError('')

    try {
      // Validation
      const filledRows = dailyScores.filter(row =>
        row.date && row.plan && row.actual && row.rejections
      )

      if (filledRows.length === 0) {
        setSubmitError('Please fill at least one day\'s data')
        setLoading(false)
        return
      }

      // Validate date format for filled rows
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      const invalidDates = filledRows.filter(row => !dateRegex.test(row.date))
      if (invalidDates.length > 0) {
        setSubmitError('Please enter dates in DD/MM/YYYY format')
        setLoading(false)
        return
      }

      if (!selectedStationId) {
        setSubmitError('Please select a process/station')
        setLoading(false)
        return
      }

      if (!preparedBy.trim() || !approvedBy.trim() || !engineerJudge.trim()) {
        setSubmitError('Please fill in Prepared By, Approved By, and Engineer Judge fields')
        setLoading(false)
        return
      }

      // Ensure trainee exists in database and get the database ID
      let traineeDbId = trainee?.id
      if (!traineeDbId && trainee) {
        try {
          // First, try to create the trainee with cleaned ID
          const cleanTraineeId = trainee.traineeId.trim()
          const traineePayload = {
            traineeId: cleanTraineeId,
            trainee_name: trainee.trainee_name,
            trainer_name: trainee.trainer_name || 'Default Trainer',
            line: trainee.line || Number(lineId),
            station: selectedStationId,
            revision_date: trainee.revision_date,
            DOJ: trainee.DOJ
          }
          await axios.post('http://localhost:8000/leveltwo-trainees/', traineePayload)
        } catch (traineeErr: any) {
          // Continue - trainee might already exist
        }
        // Now get the trainee with database ID using the specific endpoint
        try {
          const cleanTraineeId = trainee.traineeId.trim()
          const traineeResponse = await axios.get(`http://localhost:8000/trainee/${cleanTraineeId}/${selectedStationId}/`)
          traineeDbId = traineeResponse.data.id
          setTrainee(prev => prev ? { ...prev, id: traineeDbId, traineeId: cleanTraineeId } : null)
        } catch (fetchErr: any) {
          setSubmitError(`Failed to get trainee database ID. Trainee '${trainee.traineeId.trim()}' not found at station ${selectedStationId}.`)
          setLoading(false)
          return
        }
      }

      // Submit only filled rows
      for (const row of filledRows) {
        // Find the corresponding OJT day
        const ojtDay = ojtDays.find(d => d.day_number === row.day || d.name === `Day ${row.day}`)
        if (!ojtDay) continue

        const payload = {
          trainee: traineeDbId,
          day: ojtDay.id,
          date: formatDateForAPI(row.date),
          production_plan: parseInt(row.plan) || 0,
          production_actual: parseInt(row.actual) || 0,
          production_marks: row.production_marks,
          quality_no_of_rejection: parseInt(row.rejections) || 0,
          quality_marks: row.quality_marks,
          Engineer_judge: engineerJudge,
          prepared_by: preparedBy,
          approved_by: approvedBy
        }
        try {
          await axios.post('http://localhost:8000/leveltwo-scores/', payload)
        } catch (submitErr: any) {
          throw submitErr
        }
      }

      alert('Data submitted successfully!')

      // Mark submitted rows
      setDailyScores(prev => prev.map(score => {
        const isSubmitted = filledRows.some(fr => fr.day === score.day)
        return isSubmitted ? { ...score, submitted: true } : score
      }))

    } catch (err: any) {
      let errorMessage = 'Submission failed!'
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data
        } else if (err.response.data.detail) {
          errorMessage = err.response.data.detail
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message
        } else {
          errorMessage = JSON.stringify(err.response.data)
        }
      }
      setSubmitError(errorMessage)
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // --- Marking calculation ---
  const calculateProductionMarks = (plan: number, actual: number): number => {
    if (plan === 0) return 0;
    const percentage = (actual / plan) * 100;
    if (percentage >= 90) return 4;
    if (percentage >= 80) return 2;
    if (percentage >= 70) return 1;
    return 0;
  };

  const calculateQualityMarks = (rejections: number): number => {
    if (rejections === 0) return 4;
    if (rejections === 1) return 2;
    if (rejections === 2) return 1;
    return 0;
  };

  const handleInputChange = (index: number, field: string, value: string | number) => {
    setDailyScores((prevScores) => {
      return prevScores.map((row, i) => {
        if (i !== index) return row;
        const updatedRow = {
          ...row,
          [field]: value,
        };
        const plan = Number(updatedRow.plan);
        const actual = Number(updatedRow.actual);
        const rejections = Number(updatedRow.rejections);
        return {
          ...updatedRow,
          production_marks: calculateProductionMarks(plan, actual),
          quality_marks: calculateQualityMarks(rejections),
        };
      });
    });
  };

  // --- Table JSX ---
  return (
   <div className="p-4 text-sm bg-white min-h-screen">
  <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-4 md:p-8 border border-gray-200">
    <table className="w-full border border-gray-300 rounded-xl overflow-hidden text-center">
      <tbody>
        {/* Row 1: Logo + Title + Details */}
        <tr>
          {/* Logo */}
          <td rowSpan={4} className="border border-gray-300 w-32 p-2 bg-white align-middle">
            {/* <img src={logo} alt="Logo" className="w-24 h-24 object-contain mx-auto" /> */}
          </td>
          {/* Title */}
          <td rowSpan={4} colSpan={2} className="border border-gray-300 bg-white">
            <div className="flex flex-col justify-center h-full items-center">
              <h1 className="text-2xl font-extrabold text-blue-900 tracking-wide">ON JOB TRAINING</h1>
              <h1 className="text-2xl font-extrabold text-blue-900 tracking-wide">SHEET</h1>
            </div>
          </td>
          {/* Revision Date */}
          <td className="border border-gray-300 font-semibold bg-gray-80">Revision Date</td>
          <td className="border border-gray-300 bg-white" colSpan={1}>
            {trainee?.revision_date || ''}
          </td>
          <td className="border border-gray-300 bg-white" colSpan={3}></td>
        </tr>
        <tr>
          <td className="border border-gray-300 font-semibold bg-gray-80">TRAINEE NAME :</td>
          <td className="border border-gray-300 bg-white">{trainee?.trainee_name || ''}</td>
          <td className="border border-gray-300 font-semibold bg-gray-80">TRAINER :</td>
          <td className="border border-gray-300 bg-white">{trainee?.trainer_name || ''}</td>
        </tr>
        <tr>
          <td className="border border-gray-300 font-semibold bg-gray-80">EMP NO. :</td>
          <td className="border border-gray-300 bg-white">{trainee?.traineeId || ''}</td>
          <td className="border border-gray-300 font-semibold bg-gray-80">LINE :</td>
          <td className="border border-gray-300 bg-white">{trainee?.line_name || ''}</td>
        </tr>
        <tr>
          <td className="border border-gray-300 font-semibold bg-gray-80">D.O.J. :</td>
          <td className="border border-gray-300 bg-white" colSpan={1}>
            {trainee?.DOJ || ''}
          </td>
        </tr>

        {/* Process Name (auto-selected, not a dropdown) */}
        <tr>
          <td className="border border-gray-300 text-center font-semibold p-1 bg-gray-80" colSpan={7}>
            {filteredStations.find(st => st.id === selectedStationId)?.title || 'No Process Found'}
          </td>
        </tr>

        {/* Table Header Rows */}
        <tr className="bg-blue-50">
          <th className="border border-gray-300" rowSpan={2}>DAYS</th>
          <th className="border border-gray-300" rowSpan={2}>DATE</th>
          <th className="border border-gray-300 text-blue-900" colSpan={3}>Production</th>
          <th className="border border-gray-300 text-blue-900" colSpan={2}>QUALITY</th>
        </tr>
        <tr className="bg-gray-80">
          <th className="border border-gray-300">PLAN</th>
          <th className="border border-gray-300">ACT.</th>
          <th className="border border-gray-300">Marks</th>
          <th className="border border-gray-300">NO. OF REJ.</th>
          <th className="border border-gray-300">Marks</th>
        </tr>

        {/* Table Rows */}
        {[1, 2, 3, 4, 5, 6].map((day, index) => (
          <tr key={day} className={index % 2 === 0 ? "bg-white" : "bg-gray-80"}>
            <td className="border border-gray-300">{day}</td>
            {/* Date */}
            <td className="border border-gray-300">
              <input
                type="date"
                value={formatDateForInput(dailyScores[index].date)}
                onChange={(e) => {
                  const selectedDate = e.target.value;
                  const displayDate = formatDateForDisplay(selectedDate);
                  handleInputChange(index, 'date', displayDate);
                }}
                className="w-full p-1 rounded border focus:ring-2 focus:ring-blue-400"
              />
              {dailyScores[index].date && (
                <div className="text-xs text-gray-600 mt-1">
                  {dailyScores[index].date}
                </div>
              )}
            </td>
            {/* Plan */}
            <td className="border border-gray-300">
              <input
                type="number"
                value={dailyScores[index].plan}
                onChange={(e) => handleInputChange(index, 'plan', e.target.value)}
                className="w-full p-1 rounded border focus:ring-2 focus:ring-blue-400"
              />
            </td>
            {/* Actual */}
            <td className="border border-gray-300">
              <input
                type="number"
                value={dailyScores[index].actual}
                onChange={(e) => handleInputChange(index, 'actual', e.target.value)}
                className="w-full p-1 rounded border focus:ring-2 focus:ring-blue-400"
              />
            </td>
            {/* Production Marks */}
            <td className="border border-gray-300 font-semibold text-blue-700">
              {dailyScores[index].production_marks}
            </td>
            {/* Rejections */}
            <td className="border border-gray-300">
              <input
                type="number"
                value={dailyScores[index].rejections}
                onChange={(e) => handleInputChange(index, 'rejections', e.target.value)}
                className="w-full p-1 rounded border focus:ring-2 focus:ring-blue-400"
              />
            </td>
            {/* Quality Marks */}
            <td className="border border-gray-300 font-semibold text-blue-700">
              {dailyScores[index].quality_marks}
            </td>
          </tr>
        ))}

        {/* Marks Footer */}
        <tr className="bg-gray-80 font-semibold">
          <td className="border border-gray-300" colSpan={4} style={{ paddingRight: '10px', textAlign: 'right' }}>
            Marks
          </td>
          <td className="border border-gray-300 text-blue-700">{dailyScores.reduce((sum, row) => sum + Number(row.production_marks || 0), 0)}</td>
          <td className="border border-gray-300" style={{ paddingRight: '10px', textAlign: 'right' }}>
            Marks
          </td>
          <td className="border border-gray-300 text-blue-700">{dailyScores.reduce((sum, row) => sum + Number(row.quality_marks || 0), 0)}</td>
        </tr>

        {/* Engineer Signatures */}
        <tr>
          <td className="border border-gray-300 font-semibold align-top p-1" rowSpan={4}></td>
          <td colSpan={6} className="border border-gray-300 font-semibold text-left p-1 bg-gray-80">
            ENGINEER JUDGE
            <input
              type="text"
              value={engineerJudge}
              onChange={(e) => setEngineerJudge(e.target.value)}
              placeholder="Engineer Judge"
              className="border p-1 w-full rounded focus:ring-2 focus:ring-blue-400 mt-1"
            />
          </td>
        </tr>
        <tr>
          <td colSpan={6} className="border border-gray-300 font-semibold text-left p-1">SIGN</td>
        </tr>
        <tr>
          <td colSpan={6} className="border border-gray-300 font-semibold text-left p-1">APR. BY</td>
        </tr>

        {/* Marking Scheme Header */}
        <tr>
          <td colSpan={7} className="border border-gray-300 text-center font-bold bg-blue-50">MARKING SCHEME</td>
        </tr>

        {/* Marking Scheme Details */}
        <tr>
          <td rowSpan={5} colSpan={2} className="border border-gray-300 font-semibold align-top p-2 bg-gray-80">
            Legends (Actual<br />Production):
          </td>
          <td className="border border-gray-300 text-center bg-gray-80">Production Quantity</td>
          <td className="border border-gray-300 text-center bg-gray-80">Marks</td>
          <td rowSpan={5} className="border border-gray-300 text-center bg-gray-80">Legend (Rejection Quantity):</td>
          <td className="border border-gray-300 text-center bg-gray-80">Number of Rejections</td>
          <td className="border border-gray-300 text-center bg-gray-80">Marks</td>
        </tr>
        <tr>
          <td className="border border-gray-300 text-center">90%-100%</td>
          <td className="border border-gray-300 text-center">4</td>
          <td className="border border-gray-300 text-center">0</td>
          <td className="border border-gray-300 text-center">4</td>
        </tr>
        <tr>
          <td className="border border-gray-300 text-center">80%-90%</td>
          <td className="border border-gray-300 text-center">2</td>
          <td className="border border-gray-300 text-center">1</td>
          <td className="border border-gray-300 text-center">2</td>
        </tr>
        <tr>
          <td className="border border-gray-300 text-center">70%-80%</td>
          <td className="border border-gray-300 text-center">1</td>
          <td className="border border-gray-300 text-center">2</td>
          <td className="border border-gray-300 text-center">1</td>
        </tr>
        <tr>
          <td className="border border-gray-300 text-center">&lt;70%</td>
          <td className="border border-gray-300 text-center">0</td>
          <td className="border border-gray-300 text-center">&gt;=3</td>
          <td className="border border-gray-300 text-center">0</td>
        </tr>

        {/* Note */}
        <tr>
          <td colSpan={7} className="border border-gray-300 italic text-sm p-1 bg-gray-80">
            NOTE:- Minimum 70% marks required in Production and in Quality.
          </td>
        </tr>

        {/* Prepared By / Approved By */}
        <tr>
          <td colSpan={4} className="border border-gray-300 text-sm p-1 bg-white">
            PREPARED BY:
            <input
              type="text"
              className="w-full p-1 text-sm rounded border focus:ring-2 focus:ring-blue-400 mt-1"
              placeholder="Prepared by"
              value={preparedBy}
              onChange={(e) => setPreparedBy(e.target.value)}
            />
          </td>
          <td colSpan={3} className="border border-gray-300 text-sm p-1 bg-white">
            APPROVED BY:
            <input
              type="text"
              className="w-full p-1 text-sm rounded border focus:ring-2 focus:ring-blue-400 mt-1"
              placeholder="Approved by"
              value={approvedBy}
              onChange={(e) => setApprovedBy(e.target.value)}
            />
          </td>
        </tr>
        <tr>
          <td className="border border-gray-300 text-xs p-1 bg-gray-80">FM-PRD-16</td>
          <td className="border border-gray-300 text-xs p-1 bg-gray-80">Rev:00</td>
          <td colSpan={5} className="border border-gray-300 text-xs p-1 bg-gray-80">Origin: 20-05-2021</td>
        </tr>
      </tbody>
    </table>

    {/* Error Display */}
    {submitError && (
      <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
        {submitError}
      </div>
    )}

    {/* Submit Button */}
    <div className="mt-4 flex justify-center">
      <button
        onClick={handleSubmit}
        disabled={loading}
        type="submit"
        className="bg-blue-600 text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </div>

    {/* Instructions */}
    <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded">
      <p className="text-sm text-blue-800">
        <strong>Instructions:</strong> Fill in the data for the days you want to submit and click the "Submit" button.
        You can fill partial data (e.g., just Day 1) and submit, then come back later to fill and submit additional days.
      </p>
    </div>
  </div>
</div>
  )
};

export default OnJobTraining

