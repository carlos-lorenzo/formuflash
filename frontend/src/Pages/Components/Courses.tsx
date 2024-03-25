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
    getCourses: () => void,
    getCourseDecks: (courseId: number | undefined) => void,
    setActiveCourseId: (courseId: number) => void,
    setActiveCourseName: React.Dispatch<React.SetStateAction<string>>
}

interface IDeleteInfo {
    show: boolean,
    id: number | undefined
}

export default function Courses({ client, courses, getCourses, getCourseDecks, setActiveCourseId, setActiveCourseName }: ICoursesProps) {


    const [deleteInfo, setDeleteInfo] = React.useState<IDeleteInfo>({show: false, id: undefined});

    function handleDeckDelte(id: number | undefined) {

        if (id === undefined) {
            return;
        }

        const toastId = toast.loading("Deleting deck...");

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
                render: "Course deleted",
                type: "info",
                isLoading: false,
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            getCourses();

        }).catch(() => {
            toast.update(toastId, {
                render: "Error deleting deck",
                type: "error",
                isLoading: false,
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        })
    }

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
                    setDeleteInfo={setDeleteInfo}
                />
            ))}
            <CreateCourse 
                client={client} 
                getCourses={getCourses}
            />
            <DeletePopup popupInfo={deleteInfo} setPopupInfo={setDeleteInfo} handleDeletion={handleDeckDelte}/>
        </div>
    )
}
