// import { useParams, useNavigate } from 'react-router-dom';
// import Navbar from '../../../Navbar/Navbar';
// import { useEffect, useState } from 'react';

// interface Lesson {
//     id: number;
//     skill_training: number;
//     day: number;
//     day_name: string;
//     title: string;
//     description?: string;
//     details?: string;
//     question_paper_id?: number;

// }

// interface DayData {
//     day: string;
//     lessons: Lesson[];
// }

// interface GroupedLessons {
//     [key: string]: DayData;
// }

// const Level1 = () => {
//     const navigate = useNavigate();
//     const [lessons, setLessons] = useState<Lesson[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [levelName, setLevelName] = useState('Training Details');

//     useEffect(() => {
//         const fetchLessons = async () => {
//             try {
//                 const response = await fetch(`http://127.0.0.1:8000/subtopics-day/`);
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 const jsonData = await response.json();
//                 console.log(jsonData);
//                 // Set level name based on the first lesson's skill_training
//                 if (jsonData.length > 0) {
//                     const firstLesson = jsonData[0];
//                     setLevelName(`Level ${firstLesson.skill_training} Training Details`);
//                 }
                
//                 setLessons(jsonData);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Fetch error:', error);
//                 setError('Failed to load lessons');
//                 setLoading(false);
//             }
//         };

//         fetchLessons();
//     }, []);

//     const groupLessonsByDay = (lessonsToGroup: Lesson[]): GroupedLessons => {
//         const grouped: GroupedLessons = {};
//         lessonsToGroup.forEach(lesson => {
//             const day = lesson.day_name; // Use day_name from the API
//             if (!grouped[day]) {
//                 grouped[day] = {
//                     day: day,
//                     lessons: []
//                 };
//             }
//             grouped[day].lessons.push(lesson);
//         });
//         return grouped;
//     };

// // const handleLessonClick = (lesson: Lesson) => {
// //     if (lesson.title === 'Evaluation') {
// //         navigate('/assign-remote', { state: { questionPaperId: 1 } }); // hardcoded ID
// //     } else {
// //         navigate(`/level1/${lesson.id}`);
// //     }
// // };

//     const handleLessonClick = (lesson: Lesson) => {
//             if (lesson.title === 'Evaluation') {
//                 navigate('/assign-remote', { state: { questionPaperId: 1 } }); // hardcoded ID
//             } else if (lesson.title === 'Feedback Form') {
//                 navigate('/sdc'); // Navigate to SDC page for Feedback Form
//             } else {
//                 navigate(`/level1/${lesson.id}`);
//             }
//         };



//     // Function to get background color based on lesson title
//     const getLessonBackgroundColor = (title: string) => {
//         switch (title) {
//             case 'Evaluation':
//                 return 'bg-red-50 hover:bg-red-100 border-l-4 border-red-400';
//             case 'Feedback Form':
//                 return 'bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-400';
//             default:
//                 return 'bg-gray-50 hover:bg-gray-100 border-l-4 border-gray-400';
//         }
//     };


//     // Function to get text color based on lesson title
//     const getLessonTextColor = (title: string) => {
//         switch (title) {
//             case 'Evaluation':
//                 return 'text-red-700 hover:text-red-800';
//             case 'Feedback Form':
//                 return 'text-blue-700 hover:text-blue-800';
//             default:
//                 return 'text-[#1c2a4d] hover:text-blue-600';
//         }
//     };



//     if (loading) {
//         return (
//             <div>
//                 {/* <Navbar heading={levelName} /> */}
//                 <div className="max-w-6xl mx-auto px-4 py-6">
//                     <div className="flex justify-center items-center h-64">
//                         <p>Loading lessons...</p>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div>
//                 {/* <Navbar heading={levelName} /> */}
//                 <div className="max-w-6xl mx-auto px-4 py-6">
//                     <div className="flex justify-center items-center h-64">
//                         <p className="text-red-500">{error}</p>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     const groupedLessons = groupLessonsByDay(lessons);

//     return (
//         <div>
//             {/* <Navbar heading={levelName} /> */}
//             <div className="max-w-6xl mx-auto px-4 py-6">
//                  <p className="text-[28px] font-bold text-[#1c2a4d] mt-5 mb-10">Basic DOJO Training</p>
//                 <div className="space-y-6 bg-white rounded-lg shadow-lg p-12">
//                     {Object.keys(groupedLessons)
//                         .sort((a, b) => {
//                             // Extract day numbers for sorting
//                             const dayA = parseInt(a.replace(/\D/g, ''), 10);
//                             const dayB = parseInt(b.replace(/\D/g, ''), 10);
//                             return dayA - dayB;
//                         })
//                         .map((dayKey) => {
//                             const dayData = groupedLessons[dayKey];
//                             return (
//                                 <div key={dayKey} className="bg-slate-100 hover:bg-slate-200  rounded-lg p-6 flex gap-8">
                                    
//                                     <div className="w-1/4">
//                                         <div className="text-center">
//                                             <p className="font-bold text-[#1c2a4d]"> {dayKey.charAt(0).toUpperCase() + dayKey.slice(1)}</p>
//                                         </div>
//                                     </div>

//                                     <div className="flex-1 space-y-4">
//                                         {dayData.lessons.map((lesson: Lesson) => (
//                                             <div
//                                                 key={`${dayKey}-${lesson.id}`}
//                                                 className={`p-4 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer ${getLessonBackgroundColor(lesson.title)}`}
//                                                 onClick={() => handleLessonClick(lesson)}
//                                             >
//                                                 <div className="flex items-start justify-between">
//                                                     <div>
//                                                         <p className={`font-semibold transition-colors ${getLessonTextColor(lesson.title)}`}>
//                                                             {lesson.title}
//                                                         </p>
//                                                         {lesson.description && (
//                                                             <p className="text-sm text-gray-500 mt-1">
//                                                                 {lesson.description}
//                                                             </p>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Level1;



// motherson


// import { useParams, useNavigate } from 'react-router-dom';
// import Navbar from '../../../Navbar/Navbar';
// import { useEffect, useState } from 'react';

// interface Lesson {
//     id: number;
//     skill_training: number;
//     day: number;
//     day_name: string;
//     title: string;
//     description?: string;
//     details?: string;
//     question_paper_id?: number;
//     skill_id?:number

// }

// interface DayData {
//     day: string;
//     lessons: Lesson[];
// }

// interface GroupedLessons {
//     [key: string]: DayData;
// }

// const Level1 = () => {
//     const navigate = useNavigate();
//     const [lessons, setLessons] = useState<Lesson[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [levelName, setLevelName] = useState('Training Details');

//     useEffect(() => {
//         const fetchLessons = async () => {
//             try {
//                 const response = await fetch(`http://127.0.0.1:8000/subtopics-day/`);
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 const jsonData = await response.json();
//                 console.log(jsonData);
//                 // Set level name based on the first lesson's skill_training
//                 if (jsonData.length > 0) {
//                     const firstLesson = jsonData[0];
//                     setLevelName(`Level ${firstLesson.skill_training} Training Details`);
//                 }
                
//                 setLessons(jsonData);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Fetch error:', error);
//                 setError('Failed to load lessons');
//                 setLoading(false);
//             }
//         };

//         fetchLessons();
//     }, []);

//     const groupLessonsByDay = (lessonsToGroup: Lesson[]): GroupedLessons => {
//         const grouped: GroupedLessons = {};
//         lessonsToGroup.forEach(lesson => {
//             const day = lesson.day_name; // Use day_name from the API
//             if (!grouped[day]) {
//                 grouped[day] = {
//                     day: day,
//                     lessons: []
//                 };
//             }
//             grouped[day].lessons.push(lesson);
//         });
//         return grouped;
//     };

// // const handleLessonClick = (lesson: Lesson) => {
// //     if (lesson.title === 'Evaluation') {
// //         navigate('/assign-remote', { state: { questionPaperId: 1 } }); // hardcoded ID
// //     } else {
// //         navigate(`/level1/${lesson.id}`);
// //     }
// // };

//     const handleLessonClick = (lesson: Lesson) => {
//             if (lesson.title === 'Evaluation') {
//                 navigate('/assign-remote', {
//                     state: {
//                         questionPaperId: 1,
//                         skillId: 17, // General skill ID from Station model
//                         levelId: 1, // Level 1 training
//                         fromNavigation: true,
//                         skillName: 'General', // Level 1 uses general skill
//                         levelName: 'Level 1'
//                     }
//                 });
//             } else if (lesson.title === 'Feedback Form') {
//                 navigate('/sdc'); // Navigate to SDC page for Feedback Form
//             } else {
//                 navigate(`/level1/${lesson.id}`);
//             }
//         };



//     // Function to get background color based on lesson title
//     const getLessonBackgroundColor = (title: string) => {
//         switch (title) {
//             case 'Evaluation':
//                 return 'bg-red-50 hover:bg-red-100 border-l-4 border-red-400';
//             case 'Feedback Form':
//                 return 'bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-400';
//             default:
//                 return 'bg-gray-50 hover:bg-gray-100 border-l-4 border-gray-400';
//         }
//     };


//     // Function to get text color based on lesson title
//     const getLessonTextColor = (title: string) => {
//         switch (title) {
//             case 'Evaluation':
//                 return 'text-red-700 hover:text-red-800';
//             case 'Feedback Form':
//                 return 'text-blue-700 hover:text-blue-800';
//             default:
//                 return 'text-[#1c2a4d] hover:text-blue-600';
//         }
//     };



//     if (loading) {
//         return (
//             <div>
//                 {/* <Navbar heading={levelName} /> */}
//                 <div className="max-w-6xl mx-auto px-4 py-6">
//                     <div className="flex justify-center items-center h-64">
//                         <p>Loading lessons...</p>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div>
//                 {/* <Navbar heading={levelName} /> */}
//                 <div className="max-w-6xl mx-auto px-4 py-6">
//                     <div className="flex justify-center items-center h-64">
//                         <p className="text-red-500">{error}</p>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     const groupedLessons = groupLessonsByDay(lessons);

//     return (
//         <div>
//             {/* <Navbar heading={levelName} /> */}
//             <div className="max-w-6xl mx-auto px-4 py-6">
//                  <p className="text-[28px] font-bold text-[#1c2a4d] mt-5 mb-10">Basic DOJO Training</p>
//                 <div className="space-y-6 bg-white rounded-lg shadow-lg p-12">
//                     {Object.keys(groupedLessons)
//                         .sort((a, b) => {
//                             // Extract day numbers for sorting
//                             const dayA = parseInt(a.replace(/\D/g, ''), 10);
//                             const dayB = parseInt(b.replace(/\D/g, ''), 10);
//                             return dayA - dayB;
//                         })
//                         .map((dayKey) => {
//                             const dayData = groupedLessons[dayKey];
//                             return (
//                                 <div key={dayKey} className="bg-slate-100 hover:bg-slate-200  rounded-lg p-6 flex gap-8">
                                    
//                                     <div className="w-1/4">
//                                         <div className="text-center">
//                                             <p className="font-bold text-[#1c2a4d]"> {dayKey.charAt(0).toUpperCase() + dayKey.slice(1)}</p>
//                                         </div>
//                                     </div>

//                                     <div className="flex-1 space-y-4">
//                                         {dayData.lessons.map((lesson: Lesson) => (
//                                             <div
//                                                 key={`${dayKey}-${lesson.id}`}
//                                                 className={`p-4 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer ${getLessonBackgroundColor(lesson.title)}`}
//                                                 onClick={() => handleLessonClick(lesson)}
//                                             >
//                                                 <div className="flex items-start justify-between">
//                                                     <div>
//                                                         <p className={`font-semibold transition-colors ${getLessonTextColor(lesson.title)}`}>
//                                                             {lesson.title}
//                                                         </p>
//                                                         {lesson.description && (
//                                                             <p className="text-sm text-gray-500 mt-1">
//                                                                 {lesson.description}
//                                                             </p>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Level1;




// styled version 
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../Navbar/Navbar';
import { useEffect, useState } from 'react';

interface Lesson {
    id: number;
    skill_training: number;
    day: number;
    day_name: string;
    title: string;
    description?: string;
    details?: string;
    question_paper_id?: number;
    skill_id?: number;
}

interface DayData {
    day: string;
    lessons: Lesson[];
}

interface GroupedLessons {
    [key: string]: DayData;
}

const Level1 = () => {
    const navigate = useNavigate();
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [levelName, setLevelName] = useState('Training Details');

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/subtopics-day/`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                if (jsonData.length > 0) {
                    const firstLesson = jsonData[0];
                    setLevelName(`Level ${firstLesson.skill_training} Training Details`);
                }
                setLessons(jsonData);
                setLoading(false);
            } catch (error) {
                setError('Failed to load lessons');
                setLoading(false);
            }
        };
        fetchLessons();
    }, []);

    const groupLessonsByDay = (lessonsToGroup: Lesson[]): GroupedLessons => {
        const grouped: GroupedLessons = {};
        lessonsToGroup.forEach(lesson => {
            const day = lesson.day_name;
            if (!grouped[day]) {
                grouped[day] = {
                    day: day,
                    lessons: []
                };
            }
            grouped[day].lessons.push(lesson);
        });
        return grouped;
    };

    const handleLessonClick = (lesson: Lesson) => {
        if (lesson.title === 'Evaluation') {
            navigate('/assign-remote', {
                state: {
                    questionPaperId: 1,
                    skillId: 17,
                    levelId: 1,
                    fromNavigation: true,
                    skillName: 'General',
                    levelName: 'Level 1'
                }
            });
        } else if (lesson.title === 'Feedback Form') {
            navigate('/sdc');
        } else {
            navigate(`/level1/${lesson.id}`);
        }
    };

    // --- UI/UX ENHANCEMENTS ---

    const getLessonBackgroundColor = (title: string) => {
        switch (title) {
            case 'Evaluation':
                return 'bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-300';
            case 'Feedback Form':
                return 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-300';
            default:
                return 'bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-gray-200';
        }
    };

    const getLessonTextColor = (title: string) => {
        switch (title) {
            case 'Evaluation':
                return 'text-red-700';
            case 'Feedback Form':
                return 'text-blue-700';
            default:
                return 'text-[#1c2a4d]';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
                <div className="flex flex-col items-center">
                    <svg className="animate-spin h-8 w-8 text-blue-400 mb-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    <p className="text-lg text-gray-500">Loading lessons...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    const groupedLessons = groupLessonsByDay(lessons);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-10">
            {/* <Navbar heading={levelName} /> */}
            <div className="max-w-5xl mx-auto px-4">
                <p className="text-3xl font-extrabold text-[#1c2a4d] mb-10 text-center tracking-tight drop-shadow-sm">
                    Basic DOJO Training
                </p>
                <div className="space-y-8">
                    {Object.keys(groupedLessons)
                        .sort((a, b) => {
                            const dayA = parseInt(a.replace(/\D/g, ''), 10);
                            const dayB = parseInt(b.replace(/\D/g, ''), 10);
                            return dayA - dayB;
                        })
                        .map((dayKey) => {
                            const dayData = groupedLessons[dayKey];
                            return (
                                <div
                                    key={dayKey}
                                    className="bg-white/80 hover:bg-white/90 rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-8 transition-all duration-300"
                                    style={{ boxShadow: '0 2px 16px 0 rgba(60, 72, 88, 0.08)' }}
                                >
                                    <div className="md:w-1/4 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="inline-block bg-blue-100 text-blue-700 font-bold text-lg rounded-full px-6 py-2 shadow-sm mb-2">
                                                {dayKey.charAt(0).toUpperCase() + dayKey.slice(1)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        {dayData.lessons.map((lesson: Lesson) => (
                                            <div
                                                key={`${dayKey}-${lesson.id}`}
                                                className={`p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border ${getLessonBackgroundColor(lesson.title)} group`}
                                                onClick={() => handleLessonClick(lesson)}
                                                style={{
                                                    transition: 'box-shadow 0.2s, background 0.2s',
                                                }}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className={`font-semibold text-base ${getLessonTextColor(lesson.title)} group-hover:underline`}>
                                                            {lesson.title}
                                                        </p>
                                                        {lesson.description && (
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                {lesson.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="ml-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};

export default Level1;  


