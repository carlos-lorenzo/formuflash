import { useState, useEffect } from "react";

import {
    Routes,
    Route,
    useNavigate
} from "react-router-dom";

import axios from "axios";

import { ToastContainer } from "react-toastify";

import Header from "./Pages/Components/Header";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import LandingPage from "./Pages/LandingPage";
import DeckView from "./Pages/DeckView";

import IUser from "./types/User";




// Axios settings for authentication
axios.defaults.xsrfCookieName = 'X-CSRFToken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: `${window.location.protocol}//${window.location.host.split(':')[0]}:8000/api`, 
});

client.get('/get_csrf_token')
.then(response => {
    client.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken;
}) .catch(error => {
    console.error('Error fetching CSRF token:', error);
});

//document.documentElement.setAttribute('data-theme', 'dark');

function App() {
    const [activeCourseId, setActiveCourseId] = useState<number | undefined>();
    const [activeDeckId, setActiveDeckId] = useState<number | undefined>();

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
        if (!user.loggedIn) {
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
                user={user}
            />
           
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={
                <Login 
                    client={client}
                    setUser={setUser}
                    />} />
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
                    activeDeckId={activeDeckId}
                    setActiveDeckId={setActiveDeckId}
                    setDeckAction={setDeckAction}
                />} />
            </Routes>
            <ToastContainer
                position="top-right"
                autoClose={300000}
                hideProgressBar={false}
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

