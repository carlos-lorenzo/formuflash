import React from 'react'

import Course from './Course';

import ICourse from '../../types/ICourse';

interface ICoursesProps {
    courses: ICourse[],
    setActiveCourseId: (courseId: number) => void
}
export default function Courses({ courses, setActiveCourseId }: ICoursesProps) {
    return (
        <div id='courses' className='fill'>

            {courses.map((course) => (
                <Course 
                key={course.id}
                courseData={course}
                setActiveCourseId={setActiveCourseId
                }/>

            ))}

        </div>
    )
}
