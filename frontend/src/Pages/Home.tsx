import React, {useEffect, useState, lazy} from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { AxiosInstance } from 'axios';

import MediaQuery from 'react-responsive';

const Courses = lazy(() => import('./Components/Courses'));
const Decks = lazy(() => import('./Components/Decks'));

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
    setActiveDeckId: React.Dispatch<React.SetStateAction<number | undefined>>,
    setDeckAction: React.Dispatch<React.SetStateAction<DeckAction>>,
    setShowBack: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Home({ 
    client, 
    user,
    activeCourseId,
    setActiveCourseId,
    setActiveDeckId,
    setDeckAction,
    setShowBack

}: IHome) {

    const navigate = useNavigate();
    const [showingCourses, setShowingCourses] = useState<boolean>(true);
    const [courses, setCourses] = useState<ICourse[]>([]);
    const [decks, setDecks] = useState<IBriefDeck[]>([]);
    const [activeCourseName, setActiveCourseName] = useState<string>('');
    let [searchParams, _] = useSearchParams();
    
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
                let courseId = response.data.courses[0].course_id;
                let paramCourseID = searchParams.get('course_id');
                if (activeCourseId === undefined) {
                    setActiveCourseId(courseId);
                    
                }
                if (paramCourseID) {
                    courseId = Number(paramCourseID);
                    setActiveCourseName(findActiveCourseName(Number(searchParams.get('course_id')), response.data.courses));
                }
                if(!paramCourseID) {
                    setActiveCourseName(response.data.courses[0].name);
                }
                
                setCourses(response.data.courses);
                getCourseDecks(courseId);
                
            }

            
        })
    }

    function findActiveCourseName(id: number | undefined, courses: ICourse[]): string {
        if (!id) {
            return '';
        }
        for (let course of courses) {
            if (course.course_id === id) {
                return course.name;
            }
        }
        return '';

    }

    
    useEffect(() => {
        
        if(searchParams.get('view') === "deck") {
            setShowingCourses(false);
        }
        if(!user.loggedIn) {
            navigate('/login');
        }
        
        getCourses();
        setActiveCourseName(findActiveCourseName(Number(searchParams.get('course_id')), courses));
        
    }, [])
    

    useEffect(() => {
        getCourseDecks(activeCourseId);
        setActiveCourseName(findActiveCourseName(activeCourseId, courses));
    }, [activeCourseId])

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
