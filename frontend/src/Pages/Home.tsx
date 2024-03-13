import { useState } from "react";

import { AxiosInstance } from "axios";

import MarkdownLatex from "./Components/MarkdownLatex";


interface ILoginProps {
    client: AxiosInstance
}


export default function Home({ client }: ILoginProps) {
    let [content, setContent] = useState("");
    

    function getCard() {
        client.get(
            "/fetch_deck_card?deck_id=1",
            {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }
        ).then((response) => {
            setContent(response.data.card.answer)
            
        })
    }
    

  return (
    <>
        <MarkdownLatex content={content} />
        <button onClick={getCard} className="shadow-accent border">Get Card</button>
    </>
  );
}


