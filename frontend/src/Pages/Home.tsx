import React, {useEffect, useState} from 'react';

import { useNavigate } from 'react-router-dom';

import { AxiosInstance } from 'axios';

import { useMediaQuery } from 'react-responsive';
import MediaQuery from 'react-responsive';

import Courses from './Components/Courses';
import Decks from './Components/Decks';

import IUser from '../types/User';
import ICourse from '../types/ICourse';
import IBriefDeck from '../types/BriefDeck';


enum DeckAction {
    PREIVEW = 'PREIVEW',
    EDIT = 'EDIT',
    STUDY = 'STUDY',
}

interface IHome {
    client: AxiosInstance,
    user: IUser,
    activeCourseId: number | undefined,
    setActiveCourseId: React.Dispatch<React.SetStateAction<number | undefined>>,
    activeDeckId: number | undefined,
    setActiveDeckId: React.Dispatch<React.SetStateAction<number | undefined>>,
    setDeckAction: React.Dispatch<React.SetStateAction<DeckAction>>,
    setShowBack: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Home({ 
    client, 
    user,
    activeCourseId,
    activeDeckId,
    setActiveCourseId,
    setActiveDeckId,
    setDeckAction,
    setShowBack

}: IHome) {

    const navigate = useNavigate();
    const [showingCourses, setShowingCourses] = useState<boolean>(false);
    const [courses, setCourses] = useState<ICourse[]>([]);
    const [decks, setDecks] = useState<IBriefDeck[]>([]);
    const [activeCourseName, setActiveCourseName] = useState<string>('');

    function getCourseDecks(course_id: number | undefined) {
        if (course_id === undefined) {
            return;
        }
        client.get(`/course_decks?course_id=${course_id}`,
        {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        }
        ).then((response) => {
            setDecks(response.data.decks);
            
        });
    }

    function getCourses() {
        client.get("/get_courses",
        {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        }).then((response) => {
            
            if (!response.data) {
                setCourses([]);
                setDecks([]);
                setActiveCourseId(undefined);
                
            } else {
                const courseId = response.data.courses[0].course_id;
                if (activeCourseId === undefined) {
                    setActiveCourseId(courseId);
                }
                
                setCourses(response.data.courses);
                getCourseDecks(courseId);
                setActiveCourseName(response.data.courses[0].name);
            }

            
        })
    }
    
    useEffect(() => {
        if(!user.loggedIn) {
            navigate('/login');
        }
        
        getCourses();
        
    }, [])
    

	return (
		<div id='user-view' className='fill'>
            <MediaQuery query='(min-width: 1281px)'>
                <div className='whitespace'></div>
                <Courses
                    client={client}
                    courses={courses}
                    activeCourseId={activeCourseId}
                    getCourses={getCourses}
                    getCourseDecks={getCourseDecks}
                    setActiveCourseId={setActiveCourseId}
                    setActiveCourseName={setActiveCourseName}
                    setShowingCourses={setShowingCourses}
                />

                <Decks
                    client={client}
                    activeCourseId={activeCourseId}
                    decks={decks}
                    setActiveDeckId={setActiveDeckId}
                    getCourseDecks={getCourseDecks}
                    setDeckAction={setDeckAction}
                    activeCourseName={activeCourseName}
                    setShowingCourses={setShowingCourses}
                    setShowBack={setShowBack}
                />
                <div className='whitespace'></div>
            </MediaQuery>
            <MediaQuery query='(max-width: 1280px)'>
                {
                    showingCourses ? (
                        <Courses
                        client={client}
                        courses={courses}
                        activeCourseId={activeCourseId}
                        getCourses={getCourses}
                        getCourseDecks={getCourseDecks}
                        setActiveCourseId={setActiveCourseId}
                        setActiveCourseName={setActiveCourseName}
                        setShowingCourses={setShowingCourses}
                    />
                    ) : (
                        
                        <Decks
                        client={client}
                        activeCourseId={activeCourseId}
                        decks={decks}
                        setActiveDeckId={setActiveDeckId}
                        getCourseDecks={getCourseDecks}
                        setDeckAction={setDeckAction}
                        activeCourseName={activeCourseName}
                        setShowingCourses={setShowingCourses}
                        setShowBack={setShowBack}
                    />
                    )
                }

            </MediaQuery>

        </div>
	)
}
