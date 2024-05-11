import React from 'react'
import { useRef } from 'react'

import { AxiosInstance } from 'axios'
import MarkdownLatex from './MarkdownLatex'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlorinSign } from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons';

import ToolTip from './ToolTip';

interface ICreateCardProps {
    client: AxiosInstance,
    question: string,
    answer: string,
    activeCardId: number,
    activeDeckId: number | undefined,
    setQuestion: React.Dispatch<React.SetStateAction<string>>,
    setAnswer: React.Dispatch<React.SetStateAction<string>>,
    getDeck: () => void
}

export default function CreateCard({ 
    client, 
    question, 
    answer, 
    activeCardId,
    activeDeckId,
    setQuestion,
    setAnswer,
    getDeck

}: ICreateCardProps) {
    
    const questionInput = useRef<HTMLTextAreaElement>(null);
    const answerInput = useRef<HTMLTextAreaElement>(null);

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
            setQuestion(question + "![alt](https://picsum.photos/200)");
            textArea.current.focus();
        } else if (textArea.current?.id === 'answer-input') {
            setAnswer(answer + "![alt](https://picsum.photos/200)");
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
                            <ToolTip text='Insert LaTeX'>
                                <FontAwesomeIcon icon={faFlorinSign} size='lg' className='edit-shortcut' onClick={() => handleMathShortcut(questionInput)}/>
                            </ToolTip>
                            

                            <ToolTip text='Insert Image'>
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
                        placeholder='Raw question'
                    />    
                </div>

                <div className='card-input border text fill secondary shadow-secondary'>
                    <div className='edit-info'>
                        <h4>A</h4>

                        <div className='edit-shortcuts'>
                            <ToolTip text='Insert LaTeX'>
                                <FontAwesomeIcon icon={faFlorinSign} size='lg' className='edit-shortcut' onClick={() => handleMathShortcut(answerInput)}/>
                            </ToolTip>
                            
                            <ToolTip text='Insert Image'>
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
                    placeholder='Raw answer'
                />   
                </div>
                
            </form>

            <div id="formatted-output" className='fill'>
                <div className='formatted border text fill secondary shadow-secondary'>
                    <h4>Q</h4>
                    <MarkdownLatex content={question} />
                </div>
                
                <div className='formatted border text fill secondary shadow-secondary'>
                    <h4>A</h4>
                    <MarkdownLatex content={answer} />
                </div>
            </div>
        </div>
    )
}



