import React from 'react'

import { useNavigate } from 'react-router-dom';

import ICourse from '../../types/ICourse'

interface ICourseProps {
    courseData: ICourse,
    setActiveCourseId: (courseId: number) => void
}

export default function Course({ courseData, setActiveCourseId }: ICourseProps) {

    const navigate = useNavigate();

    function handleCourseClick() {
        setActiveCourseId(courseData.id);
        
    }
    return (
        <div className='course accent border place-center shadow-accent pointer' onClick={handleCourseClick}>
            {courseData.name}
        </div>
    )
}
