import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faCircleCheck, faCircleXmark, faPen } from '@fortawesome/free-solid-svg-icons';

import { toast } from 'react-toastify';

import { AxiosInstance } from 'axios';

import ICourse from '../../types/ICourse';

import ToolTip from './ToolTip';

interface ICourseProps {
    client: AxiosInstance
    courseData: ICourse,
    activeCourseId: number | undefined,
    setActiveCourseId: (courseId: number) => void,
    getCourseDecks: (courseId: number | undefined) => void,
    setActiveCourseName: React.Dispatch<React.SetStateAction<string>>,
    setDeleteInfo: React.Dispatch<React.SetStateAction<{show: boolean, id: number | undefined}>>,
    setShowingCourses: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Course({ client, courseData, activeCourseId, setActiveCourseId, getCourseDecks, setActiveCourseName, setDeleteInfo, setShowingCourses }: ICourseProps) {

    const [renamingCourse, setRenamingCourse] = useState(false);
    const [newCourseName, setNewCourseName] = useState(courseData.name);
    const [courseName, setCourseName] = useState(courseData.name);

    function handleCourseClick() {
        setActiveCourseId(courseData.course_id);
        getCourseDecks(courseData.course_id);
        setActiveCourseName(courseData.name);
        setShowingCourses(false);
    }

    function handleCourseRename(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
        e.stopPropagation();
        const id = toast.loading("Renombrando");
        
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
                render: "Curso renombrado",
                
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

    function handleTrashIconClick(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
        e.stopPropagation();
        setDeleteInfo({ show: true, id: courseData.course_id });
    };
    
    function handlePenClick(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
        e.stopPropagation();
        setRenamingCourse(true);
    }

    function handleRenameCancelClick(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
        e.stopPropagation();
        setRenamingCourse(false);
    }


    return (
        <div className='course secondary border place-center shadow-secondary pointer shadow-margin' onClick={handleCourseClick}>
            {
                renamingCourse ? 
                <div className="rename">
                    <input type='text' maxLength={50} className="rename-input" value={newCourseName} onChange={(event) => setNewCourseName(event.target.value)} onClick={(e) => e.stopPropagation()}/>
                    
                    <ToolTip text="Renombrar">
                        <FontAwesomeIcon icon={faCircleCheck} size='lg' className='pointer deck-option' onClick={(e) => handleCourseRename(e)}/>
                    </ToolTip>
                    
                    <ToolTip text="Cancelar">
                        <FontAwesomeIcon icon={faCircleXmark} size='lg' className='pointer deck-option' onClick={(e) => handleRenameCancelClick(e)}/>
                    </ToolTip>
                </div>
                
                : 

                <div className="current-name">
                    <h3>{courseName}</h3>

                    <ToolTip text="Renombrar Curso">
                        <FontAwesomeIcon icon={faPen} size='lg' className='pointer deck-option' onClick={(e) => handlePenClick(e)}/>
                    </ToolTip>
                </div>
            }
            <FontAwesomeIcon icon={faTrashCan} size='lg' className='pointer delete-card' onClick={(e) => handleTrashIconClick(e)}/>
        </div>
    )
}
