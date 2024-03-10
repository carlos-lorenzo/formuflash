import { useState } from "react";

import MarkdownLatex from "./Components/MarkdownLatex";

import { AxiosInstance } from "axios";

interface ILoginProps {
    client: AxiosInstance
}


export default function Home({ client }: ILoginProps) {
    let [content, setContent] = useState("");
    

    function getCard() {
        client.get(
            "/fetch_deck_card?deck_id=1",
        ).then((response) => {
            setContent(response.data.card.answer)
            
        })
    }
    

  return (
    <div>
        <button onClick={getCard}>Get Card</button>
        <MarkdownLatex content={content} />
    </div>
  );
}


