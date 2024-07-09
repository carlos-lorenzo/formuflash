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
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import LandingPage from "./Pages/LandingPage";
import DeckView from "./Pages/DeckView";
import Profile from "./Pages/Profile";
import Confirmation from "./Pages/Confirmation";
import ResetPassword from "./Pages/ResetPassword";
import IUser from "./types/User";




// Axios settings for authentication
axios.defaults.xsrfCookieName = 'X-CSRFToken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = false;
//baseURL: `${window.location.protocol}//${window.location.host.split(':')[0]}:8000/api`,
const client = axios.create({
    baseURL: `${window.location.protocol}//${window.location.host.split(':')[0]}/api`,
});

client.get('/get_csrf_token')
.then(response => {
    client.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken;
}).catch(_ => {
});

//document.documentElement.setAttribute('data-theme', 'dark');

function App() {
    const [activeCourseId, setActiveCourseId] = useState<number | undefined>();
    const [activeDeckId, setActiveDeckId] = useState<number | undefined>();
    const [showBack, setShowBack] = useState(false);

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
            />
           
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

            </Routes>

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

