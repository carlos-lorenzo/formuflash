import { useState } from "react";

import {
  Routes,
  Route
} from "react-router-dom";

import axios from "axios";

import Header from "./Pages/Components/Header";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import UserView from "./Pages/UserView";
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



    return (
        <>
            <Header 
                user={user}
            />
           
            <Routes>
                <Route path="/" element={<Home client={client }/>} />
                <Route path="/login" element={
                <Login 
                    client={client}
                    setUser={setUser}
                    />} />
                <Route path="/deck-view" element={
                <DeckView 
                    client={client}
                    activeDeckId={activeDeckId}
                    user={user}
                />}/>
                <Route path="/home" element={
                <UserView 
                    client={client}
                    user={user}
                    activeCourseId={activeCourseId}
                    setActiveCourseId={setActiveCourseId}
                    activeDeckId={activeDeckId}
                    setActiveDeckId={setActiveDeckId}
                />} />
            </Routes>
            
        </>
        
    );
}

export default App

