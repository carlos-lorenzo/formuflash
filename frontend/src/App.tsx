import { useState, useEffect, lazy, Suspense } from "react";

import {
    Routes,
    Route,
    useNavigate,
    useSearchParams
} from "react-router-dom";

import axios from "axios";

import { ToastContainer } from "react-toastify";


const Header = lazy(() => import("./Pages/Components/Header"));
const Login = lazy(() => import("./Pages/Login"));
const Register = lazy(() => import("./Pages/Register"));
const Home = lazy(() => import("./Pages/Home"));
const LandingPage = lazy(() => import("./Pages/LandingPage"));
const DeckView = lazy(() => import("./Pages/DeckView"));
const Profile = lazy(() => import("./Pages/Profile"));
const Confirmation = lazy(() => import("./Pages/Confirmation"));
const ResetPassword = lazy(() => import("./Pages/ResetPassword"));
//const Articles = lazy(() => import("./Pages/Articles"));
import IUser from "./types/User";




// Axios settings for authentication
axios.defaults.xsrfCookieName = 'X-CSRFToken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = false;

//baseURL: `${window.location.protocol}//${window.location.host.split(':')[0]}:8000/api`, - dev
const client = axios.create({
    baseURL: `${window.location.protocol}//${window.location.host.split(':')[0]}:8000/api`,
});

function setCSRF(): void {
    client.get('/get_csrf_token')
        .then(response => {
            client.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken;
        }).catch(_ => {
    });
}



setCSRF();





document.documentElement.setAttribute('data-theme', 'dark');

function App() {
    const [activeCourseId, setActiveCourseId] = useState<number | undefined>();
    const [activeDeckId, setActiveDeckId] = useState<number | undefined>();
    const [showBack, setShowBack] = useState(false);
    let [searchParams, _] = useSearchParams();
    
    const [user, setUser] = useState<IUser>({
        name: '',
        email: '',
        loggedIn: false
    });

    enum DeckAction {
        PREIVEW = 'PREIVEW',
        EDIT = 'EDIT',
        STUDY = 'STUDY',
    }
    const navigate = useNavigate();

    const [deckAction, setDeckAction] = useState(DeckAction.EDIT);

    useEffect(() => {
        let courseID = searchParams.get('course_id');
        if(courseID) {
            setActiveCourseId(Number(courseID));
        }

        if (!user.loggedIn && localStorage.getItem('token')) {
            client.get('/get_user',
                {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`
                    }
                }
            ).then((response) => {
                
                setUser({
                    name: response.data.name,
                    email: response.data.email,
                    loggedIn: true
                });

                navigate('/home');
            });
        }
    }, []);

    return (
        <>
            <Header 
                client={client}
                user={user}
                setUser={setUser}
                showBack={showBack}
                setShowBack={setShowBack}
                activeCourseId={activeCourseId}
            />
            <Suspense fallback={<div>Cargando</div>}>
                <Routes>
                    <Route path="/" element={
                    <LandingPage 
                        
                    />} />
                    <Route path="/login" element={
                    <Login 
                        client={client}
                        setUser={setUser}
                    />} />
                    <Route path="/register" element={
                    <Register 
                        client={client}
                    />}/>
                    <Route path="/deck-view" element={
                    <DeckView 
                        client={client}
                        user={user}
                        activeDeckId={activeDeckId}
                        deckAction={deckAction}
                    />}/>
                    <Route path="/home" element={
                    <Home 
                        client={client}
                        user={user}
                        activeCourseId={activeCourseId}
                        setActiveCourseId={setActiveCourseId}
                        setActiveDeckId={setActiveDeckId}
                        setDeckAction={setDeckAction}
                        setShowBack={setShowBack}
                    />} />
                    <Route path="profile" element={
                    <Profile 
                        client={client}
                        user={user}
                        setUser={setUser}
                    />} />
                    <Route path="/confirmation" element={
                        <Confirmation client={client}/>
                    }/>
                    <Route path="/reset-password" element={
                        <ResetPassword client={client}/>
                    }/>
                    {
                    // <Route path="/articles" element={
                    //    <Articles/>
                    //}/>
                    }
                </Routes>
            </Suspense>
            <ToastContainer
                position="top-right"
                autoClose={1500}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </>
        
    );
}

export default App

