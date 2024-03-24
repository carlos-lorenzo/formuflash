import React from 'react'

import { AxiosInstance } from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';

import Course from './Course';
import CreateCourse from './CreateCourse';

import ICourse from '../../types/ICourse';

interface ICoursesProps {
    client: AxiosInstance,
    courses: ICourse[],
    getCourses: () => void,
    getCourseDecks: (courseId: number | undefined) => void,
    setActiveCourseId: (courseId: number) => void,
    setActiveCourseName: React.Dispatch<React.SetStateAction<string>>
}
export default function Courses({ client, courses, getCourses, getCourseDecks, setActiveCourseId, setActiveCourseName }: ICoursesProps) {
    return (
        <div id='courses' className='fill'>
            <h3 style={{textAlign: 'left', marginLeft: "1rem"}}>Courses</h3>
            {courses.map((course) => (
                <Course 
                    key={course.course_id}
                    courseData={course}
                    setActiveCourseId={setActiveCourseId}
                    getCourseDecks={getCourseDecks}
                    setActiveCourseName={setActiveCourseName}
                />
            ))}
            <CreateCourse 
                client={client} 
                getCourses={getCourses}
            />

        </div>
    )
}
