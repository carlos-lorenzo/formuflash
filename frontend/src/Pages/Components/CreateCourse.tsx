import React, { useState } from 'react'

import { AxiosInstance } from 'axios';

import { toast } from 'react-toastify';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faXmark } from '@fortawesome/free-solid-svg-icons';

interface ICreateCourseProps {
    client: AxiosInstance,
    getCourses: (courseId?: number) => void,
}

export default function CreateCourse({ client, getCourses }: ICreateCourseProps) {

    const [courseName, setCourseName] = useState<string>('');
    const [promptActive, setPromptActive] = useState<boolean>(false);

    function handleCreateClick() {
        setPromptActive(!promptActive);
    }

    function handleError(error: any): string {
        if(error.response.data.error) {
            return error.response.data.error
        }
        return "Unexpected error"
    }

    function handleCourseCreation(e: React.FormEvent) {
        e.preventDefault();
        const id = toast.loading("Creating course...");

        client.post('/create_course',
        {
            name: courseName,
        }, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        }).then((response) => {
            
            toast.update(id, 
                { 
                render: "Course created", 
                type: "success", 
                isLoading: false,
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            getCourses(response.data.course_id);
            setPromptActive(false);
            setCourseName('');
        }).catch((error) => {
            toast.update(id, 
                { 
                render: handleError(error), 
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
        <>
            <div id="create-deck-button" className='create place-center secondary shadow-secondary pointer border shadow-margin' onClick={handleCreateClick}>
                <FontAwesomeIcon icon={faCirclePlus} size='2x'/>
            </div>

            {
                promptActive ?
                <>
                    <div className="screen-cover"></div>
                    <div id="create-course-prompt" className="create-prompt secondary shadow-accent border">
                        <FontAwesomeIcon icon={faXmark} size='2x' className='pointer close-prompt' onClick={() => setPromptActive(false)}/>
                        <form onSubmit={(e) => handleCourseCreation(e)} className='create-prompt-form'>
                            <label htmlFor="create-course-input">Create Course</label>
                            <input id="create-course-input" maxLength={50} className="create-input" type="text" autoComplete="off" value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder='Course name'/>
                            <button type="submit" className='shadow-accent accent border'>Create</button>
                        </form>
                        
                    </div> 
                
                </>
                
                
                
                : null
            }
        </>
        

        
    )
}
