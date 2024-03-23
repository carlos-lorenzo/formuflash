import { useState } from "react";

import { AxiosInstance } from "axios";


interface ILoginProps {
    client: AxiosInstance
}


export default function Home({ client }: ILoginProps) {
    
    
    

  return (
    <>
        <h1 style={{textAlign: 'center'}}>Landing Page</h1>
    </>
  );
}


