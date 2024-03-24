import React, { useState } from 'react'

import { AxiosInstance } from 'axios';

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

    function handleCourseCreation(e: React.FormEvent) {
        e.preventDefault();

        client.post('/create_course',
        {
            name: courseName,
        }, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        }).then((response) => {
            getCourses(response.data.course_id);
            setPromptActive(false);
            setCourseName('');
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
                            <input className="create-input" type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder='Course name'/>
                            <button type="submit" className='shadow-accent accent border'>Create</button>
                        </form>
                        
                    </div> 
                
                </>
                
                
                
                : null
            }
        </>
        

        
    )
}
