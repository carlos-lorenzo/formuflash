import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from "./Pages/Login";
import Home from "./Pages/Home";

import axios from "axios";



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

function App() {
    

    return (

        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home client={client }/>} />
                <Route path="/login" element={<Login client={client}/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App

