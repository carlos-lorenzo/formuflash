import { useState } from "react";

import { AxiosInstance } from "axios";

import MarkdownLatex from "./Components/MarkdownLatex";
import CreateCard from "./Components/CreateCard";


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


        <h3>Create Cards</h3>
        <CreateCard client={client} />
    </div>
  );
}


