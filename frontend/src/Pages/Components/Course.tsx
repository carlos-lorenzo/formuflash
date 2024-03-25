import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

import ICourse from '../../types/ICourse';

interface ICourseProps {
    courseData: ICourse,
    setActiveCourseId: (courseId: number) => void,
    getCourseDecks: (courseId: number | undefined) => void,
    setActiveCourseName: React.Dispatch<React.SetStateAction<string>>,
    setDeleteInfo: React.Dispatch<React.SetStateAction<{show: boolean, id: number | undefined}>>
}

export default function Course({ courseData, setActiveCourseId, getCourseDecks, setActiveCourseName, setDeleteInfo }: ICourseProps) {


    function handleCourseClick() {
        setActiveCourseId(courseData.course_id);
        getCourseDecks(courseData.course_id);
        setActiveCourseName(courseData.name);
    }

    return (
        <div className='course secondary border place-center shadow-secondary pointer shadow-margin' onClick={handleCourseClick}>
            <h2>{courseData.name}</h2>
            <FontAwesomeIcon icon={faTrashCan} size='lg' className='pointer delete-card' onClick={() => setDeleteInfo({show: true, id: courseData.course_id})}/>
        </div>
    )
}
