import React from 'react'

import { AxiosInstance } from 'axios';

import { toast } from 'react-toastify';

import Course from './Course';
import CreateCourse from './CreateCourse';
import DeletePopup from './DeletePopup';


import ICourse from '../../types/ICourse';

interface ICoursesProps {
    client: AxiosInstance,
    courses: ICourse[],
    activeCourseId: number | undefined,
    getCourses: () => void,
    getCourseDecks: (courseId: number | undefined) => void,
    setActiveCourseId: (courseId: number) => void,
    setActiveCourseName: React.Dispatch<React.SetStateAction<string>>,
    setShowingCourses: React.Dispatch<React.SetStateAction<boolean>>
}

interface IDeleteInfo {
    show: boolean,
    id: number | undefined
}

export default function Courses({ client, courses, activeCourseId, getCourses, getCourseDecks, setActiveCourseId, setActiveCourseName, setShowingCourses }: ICoursesProps) {


    const [deleteInfo, setDeleteInfo] = React.useState<IDeleteInfo>({show: false, id: undefined});

    function handleCourseDelete(id: number | undefined) {

        if (id === undefined) {
            return;
        }

        const toastId = toast.loading("Eliminando curso");

        client.post(
            '/delete_course',
            {
                id: id
            },
            {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }
        ).then(() => {
            setDeleteInfo({show: false, id: undefined});

            toast.update(toastId, {
                render: "Curso eliminado",
                type: "info",
                isLoading: false,
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            getCourses();

        }).catch(() => {
            toast.update(toastId, {
                render: "Error eliminando el curso",
                type: "error",
                isLoading: false,
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        })
    }

    return (
        <div id='courses' className='fill'>
            <h3 style={{textAlign: 'left', marginLeft: "1rem"}}>Cursos</h3>
            {courses.map((course) => (
                <Course 
                    activeCourseId={activeCourseId}
                    key={course.course_id}
                    client={client}
                    courseData={course}
                    setActiveCourseId={setActiveCourseId}
                    getCourseDecks={getCourseDecks}
                    setActiveCourseName={setActiveCourseName}
                    setDeleteInfo={setDeleteInfo}
                    setShowingCourses={setShowingCourses}
                />
            ))}
            <CreateCourse 
                client={client} 
                getCourses={getCourses}
            />
            <DeletePopup popupInfo={deleteInfo} setPopupInfo={setDeleteInfo} handleDeletion={handleCourseDelete}/>
        </div>
    )
}
