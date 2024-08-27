import React from 'react'
import { useRef, useEffect } from 'react'

import MarkdownLatex from './MarkdownLatex'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlorinSign } from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons';

import ToolTip from './ToolTip';

interface ICreateCardProps {
    question: string,
    answer: string,
    questionInput: React.RefObject<HTMLTextAreaElement>,
    answerInput: React.RefObject<HTMLTextAreaElement>,
    setQuestion: React.Dispatch<React.SetStateAction<string>>,
    setAnswer: React.Dispatch<React.SetStateAction<string>>,
}

export default function CreateCard({  
    question, 
    answer, 
    questionInput,
    answerInput,
    setQuestion,
    setAnswer

}: ICreateCardProps) {
    

    useEffect(() => {
        questionInput.current?.focus();
    }, [])

    function handleMathShortcut(textArea: React.RefObject<HTMLTextAreaElement>) {
        if (textArea.current?.id === 'question-input') {
            setQuestion(question + "$$");
            textArea.current.focus();
        } else if (textArea.current?.id === 'answer-input') {
            setAnswer(answer + "$$");
            textArea.current.focus();
        }
    }

    function handleImageShortcut(textArea: React.RefObject<HTMLTextAreaElement>) {
        if (textArea.current?.id === 'question-input') {
            setQuestion(question + "![alt](https://i.imgur.com/i2oWxOZ.png)");
            textArea.current.focus();
        } else if (textArea.current?.id === 'answer-input') {
            setAnswer(answer + "![alt](https://i.imgur.com/i2oWxOZ.png)");
            textArea.current.focus();
        }
    }





    return (
        <div id="card-creation" className='fill'>
            <form id="create-card-form" className='fill'> 
                <div className='card-input border text fill secondary shadow-secondary'>
                    <div className='edit-info'>
                        <h4>Q</h4>
                        
                        <div className='edit-shortcuts'>
                            <ToolTip text='Insertar LaTeX'>
                                <FontAwesomeIcon icon={faFlorinSign} size='lg' className='edit-shortcut' onClick={() => handleMathShortcut(questionInput)}/>
                            </ToolTip>
                            

                            <ToolTip text='Insertar Imagen'>
                                <FontAwesomeIcon icon={faImage} size='lg' className='edit-shortcut' onClick={() => handleImageShortcut(questionInput)}/>
                            </ToolTip>
                            
                        </div>
                        
                    </div>
                    <textarea
                        id='question-input'
                        ref={questionInput}
                        value={question}
                        className='card-input-textarea'
                        onChange={(event) => setQuestion(event.target.value)}
                        autoComplete="off"
                        placeholder='Pregunta fuente'
                    />    
                </div>

                <div className='card-input border text fill secondary shadow-secondary'>
                    <div className='edit-info'>
                        <h4>A</h4>

                        <div className='edit-shortcuts'>
                            <ToolTip text='Insertar LaTeX'>
                                <FontAwesomeIcon icon={faFlorinSign} size='lg' className='edit-shortcut' onClick={() => handleMathShortcut(answerInput)}/>
                            </ToolTip>
                            
                            <ToolTip text='Insertar Imagen'>
                                <FontAwesomeIcon icon={faImage} size='lg' className='edit-shortcut' onClick={() => handleImageShortcut(answerInput)}/>
                            </ToolTip>
                        </div>
                    </div>
                    <textarea
                    id='answer-input'
                    ref={answerInput}
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    className='card-input-textarea'
                    autoComplete="off"
                    placeholder='Respuesta fuente'
                />   
                </div>
                
            </form>

            <div id="formatted-output" className='fill'>
                <div className='formatted border text fill secondary shadow-secondary'>
                    <h4>Q</h4>
                    <MarkdownLatex content={question}/>
                </div>
                
                <div className='formatted border text fill secondary shadow-secondary'>
                    <h4>A</h4>
                    <MarkdownLatex content={answer} />
                </div>
            </div>
        </div>
    )
}



