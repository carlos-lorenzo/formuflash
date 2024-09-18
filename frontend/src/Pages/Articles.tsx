import { useEffect } from 'react'

//import MarkdownLatex from './Components/MarkdownLatex';

import "../styles/articles.css";

export default function Articles() {
    useEffect(() => {
        document.title = "Cómo usar LaTeX - FormuFlash";
    }, [])

  	return (
    	<article className="article" >
            <h1>¿Cómo usar LaTeX?</h1>
        </article>
  	)
}