import React from 'react'

import { AxiosInstance } from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';

import Course from './Course';

import ICourse from '../../types/ICourse';

interface ICoursesProps {
    client: AxiosInstance,
    courses: ICourse[],
    getCourses: () => void,
    getCourseDecks: (courseId: number | undefined) => void,
    setActiveCourseId: (courseId: number) => void
}
export default function Courses({ client, courses, getCourses, getCourseDecks, setActiveCourseId }: ICoursesProps) {

    function handleCourseCreation() {
        client.post('/create_course',
        {
            name: "New Course",
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        }
        ).then((response) => {
            getCourses();
        })
    }

    return (
        <div id='courses' className='fill'>

            {courses.map((course) => (
                <Course 
                    key={course.course_id}
                    courseData={course}
                    setActiveCourseId={setActiveCourseId}
                    getCourseDecks={getCourseDecks}
                />
            ))}
            <div id="create-course-button" className='create place-center secondary shadow-secondary pointer border' onClick={handleCourseCreation}>
                <FontAwesomeIcon icon={faCirclePlus} size='2x'/>
            </div>

        </div>
    )
}
