import { Link } from 'react-router-dom';


export default function LandingPage() {

   
    return (
        <div id='landing-page'>
            <div id="hero">
                <div id="hero-content">
                    <h1>Formuflash - Revoluciona tu aprendizaje</h1>
                    <h2 style={{color: "var(--secondary-200)"}}>Una aplicación de flashcards con LaTeX y Markdown</h2>
                    <Link to="/register" id="cta" className='accent shadow-accent border'><b>Únete</b></Link>
                </div>
            </div>
            <div id="description">
                <div className='text-container'>
                <h2>Revoluciona tu aprendizaje con la mejor aplicación para estudiantes STEM</h2>
                <h3>Di adios a la molestia: El poder de LaTeX y Markdown al alcance de tus dedos</h3>
                </div>
                
            </div>

            <div id="features">
                <div id="feature-1" className='border feature'>
                    <div className="text-container">
                        <h2>Empodérate con Formuflash</h2>
                        <h3>Crea elegantes tarjetas de forma sencilla y dinámica</h3>
                    </div>
                    <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYm93djFyOGd0bXRuMXFyc3lwODU2eHJ6cm1sNjV0MTRuemxudG94NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/AZr0r4sgmsvafkbXg0/giphy.gif" alt="Efficient Learning" className='info-image shadow-secondary border' />
                </div>

                <div id="feature-2" className='border feature'>
                    <div className="text-container">
                        <h2>Enfócate en lo que realmente importa</h2>
                        <h3>Maximiza tu aprendizaje, minimiza el tiempo</h3>
                    </div>
                </div>
            </div>

            <div id="footer">
                <p>© Formuflash - Carlos Lorenzo-Zúñiga Marí</p>
            </div>

        </div>
        

    )
}
