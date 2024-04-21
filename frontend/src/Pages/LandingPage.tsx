import React from 'react';

import { Link } from 'react-router-dom';

export default function LandingPage() {

   
    return (
        <div id='landing-page'>
            <div id="hero">
                <div id="hero-content">
                    <h1 >Revolutionise Your Learning Journey</h1>
                    <h3 style={{color: "var(--secondary-200)"}}>A STEM-focused flashcard app with seamless LaTeX and Markdown integration</h3>
                    <Link to="/register" id="cta" className='accent shadow-accent border'><b>Get Started</b></Link>
                </div>
            </div>
            <div id="description">
                <div className='text-container'>
                <h1>Revolutionize Your Study with the PREMIER Flashcard App for STEM Students</h1>
                <h2>Say Goodbye to the Hassle: Greek Letters and Symbols at Your Fingertips</h2>
                </div>
                
            </div>

            <div id="features">
                <div id="feature-1" className='border feature'>
                    <div className="text-container">
                        <h1>Empower yourself with LaTeX and Markdown</h1>
                        <h3>Effortlessly create cleanly organized flashcards with complex mathematical equations</h3>
                    </div>
                    <img src="https://picsum.photos/900" alt="Latex Flashcard" className='info-image shadow-secondary border' />
                </div>

                <div id="feature-2" className='border feature'>
                    <div className="text-container">
                        <h1>Focus on What Truly Matters</h1>
                        <h3>Maximize Efficiency, Minimize Time Spent</h3>
                    </div>
                    <img src="https://picsum.photos/900" alt="Efficient Learning" className='info-image shadow-secondary border' />
                </div>
            </div>

            <div id="footer">

                <p>© Carlos Lorenzo-Zúñiga Marí</p>

            </div>

        </div>
        

    )
}
