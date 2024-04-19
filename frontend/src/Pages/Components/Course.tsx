import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faCircleCheck, faCircleXmark, faPen } from '@fortawesome/free-solid-svg-icons';

import { toast } from 'react-toastify';

import { AxiosInstance } from 'axios';

import ICourse from '../../types/ICourse';

interface ICourseProps {
    client: AxiosInstance
    courseData: ICourse,
    activeCourseId: number | undefined,
    setActiveCourseId: (courseId: number) => void,
    getCourseDecks: (courseId: number | undefined) => void,
    setActiveCourseName: React.Dispatch<React.SetStateAction<string>>,
    setDeleteInfo: React.Dispatch<React.SetStateAction<{show: boolean, id: number | undefined}>>
}

export default function Course({ client, courseData, activeCourseId, setActiveCourseId, getCourseDecks, setActiveCourseName, setDeleteInfo }: ICourseProps) {

    const [renamingCourse, setRenamingCourse] = useState(false);
    const [newCourseName, setNewCourseName] = useState(courseData.name);
    const [courseName, setCourseName] = useState(courseData.name);

    function handleCourseClick() {
        setActiveCourseId(courseData.course_id);
        getCourseDecks(courseData.course_id);
        setActiveCourseName(courseData.name);
    }

    function handleCourseRename() {
        const id = toast.loading("Renaming course");

        client.post(
            '/rename_course',
            {
                course_id: courseData.course_id,
                name: newCourseName
            },
            {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }
        ).then((response) => {
            setRenamingCourse(false);
            setCourseName(response.data.name);
            courseData.name = response.data.name;
            
            if (activeCourseId === courseData.course_id) {
                setActiveCourseName(response.data.name);
            }

            toast.update(id, {
                render: "Course renamed",
                
                type: "success",
                isLoading: false,
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })

        }).catch((error) => {
            
            toast.update(id, {
                render: error.response.data.error,
                type: "error",
                isLoading: false,
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        })
    }

    return (
        <div className='course secondary border place-center shadow-secondary pointer shadow-margin' onClick={handleCourseClick}>
            {
                renamingCourse ? 
                <div className="rename">
                    <input type='text' maxLength={50} className="rename-input" value={newCourseName} onChange={(event) => setNewCourseName(event.target.value)}/>
                    <FontAwesomeIcon icon={faCircleCheck} size='lg' className='pointer deck-option' onClick={() => handleCourseRename()}/>
                    <FontAwesomeIcon icon={faCircleXmark} size='lg' className='pointer deck-option' onClick={() => setRenamingCourse(false)}/>
                </div>
                
                : 

                <div className="current-name">
                    <h3>{courseName}</h3>
                    <FontAwesomeIcon icon={faPen} size='lg' className='pointer deck-option' onClick={() => setRenamingCourse(true)}/>
                </div>
            }
            <FontAwesomeIcon icon={faTrashCan} size='lg' className='pointer delete-card' onClick={() => setDeleteInfo({show: true, id: courseData.course_id})}/>
        </div>
    )
}
