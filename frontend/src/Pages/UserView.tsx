import React, {useEffect, useState} from 'react';

import { useNavigate } from 'react-router-dom';

import { AxiosInstance } from 'axios';

import Courses from './Components/Courses';
import Decks from './Components/Decks';

import IUser from '../types/User';
import ICourse from '../types/ICourse';
import IBriefDeck from '../types/BriefDeck';


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
    const [decks, setDecks] = useState<IBriefDeck[]>([]);

    function getCourseDecks(course_id: number | undefined) {
        if (course_id === undefined) {
            return;
        }
        client.get(`/course_decks?course_id=${course_id}`
        ).then((response) => {
            setDecks(response.data.decks);
        });
    }

    function getCourses() {
        client.get("/get_courses").then((response) => {
            if (response.data.courses.length === 0) {
                return (
                    <div>
                        No Courses
                    </div>
                );
            }

            if (activeCourseId === undefined) {
                setActiveCourseId(response.data.courses[0].course_id);
            }
            setCourses(response.data.courses);

            getCourseDecks(activeCourseId);
        })
    }
    
    useEffect(() => {
        if(!user.loggedIn) {
            navigate('/login');
        }
        
        getCourses();
        
    }, [])
    

	return (
		<div id='user-view' className='full'>

            <Courses
                client={client}
                courses={courses}
                getCourses={getCourses}
                getCourseDecks={getCourseDecks}
                setActiveCourseId={setActiveCourseId}
            />

            <Decks
                client={client}
                activeCourseId={activeCourseId}
                decks={decks}
                setActiveDeckId={setActiveDeckId}
                getCourseDecks={getCourseDecks}
            />

        </div>
	)
}
