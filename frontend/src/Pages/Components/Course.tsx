import React from 'react';

import ICourse from '../../types/ICourse';

interface ICourseProps {
    courseData: ICourse,
    setActiveCourseId: (courseId: number) => void,
    getCourseDecks: (courseId: number | undefined) => void,
    setActiveCourseName: React.Dispatch<React.SetStateAction<string>>
}

export default function Course({ courseData, setActiveCourseId, getCourseDecks, setActiveCourseName }: ICourseProps) {


    function handleCourseClick() {
        setActiveCourseId(courseData.course_id);
        getCourseDecks(courseData.course_id);
        setActiveCourseName(courseData.name);
    }

    return (
        <div className='course secondary border place-center shadow-secondary pointer' onClick={handleCourseClick}>
            <h2>{courseData.name}</h2>
        </div>
    )
}
