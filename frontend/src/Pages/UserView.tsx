import React, {useEffect, useState} from 'react';

import { useNavigate } from 'react-router-dom';

import { AxiosInstance } from 'axios';

import Courses from './Components/Courses';
import Decks from './Components/Decks';

import IUser from '../types/User';
import ICourse from '../types/ICourse';

interface IUserViewProps {
    client: AxiosInstance,
    user: IUser,
    activeCourseId: number | undefined,
    setActiveCourseId: React.Dispatch<React.SetStateAction<number | undefined>>,
    activeDeckId: number | undefined,
    setActiveDeckId: React.Dispatch<React.SetStateAction<number | undefined>>
}

export default function UserView({ 
    client, 
    user,
    activeCourseId,
    setActiveCourseId,
    activeDeckId,
    setActiveDeckId 
}: IUserViewProps) {

    const navigate = useNavigate();

    const [courses, setCourses] = useState<ICourse[]>([]);


    useEffect(() => {
        if(!user.loggedIn) {
            navigate('/login');
        }
    
        client.get("/get_courses").then((response) => {
            if (response.data.courses.length === 0) {
                return (
                    <div>
                        No Courses
                    </div>
                );
            }

            if (activeCourseId === undefined) {
                setActiveCourseId(response.data.courses[0].id);
            }
            setCourses(response.data.courses);
        })
    }, [])
    

	return (
		<div id='user-view' className='full'>

            <Courses
                courses={courses}
                setActiveCourseId={setActiveCourseId}
            />

            <Decks
                
            />

        </div>
	)
}
