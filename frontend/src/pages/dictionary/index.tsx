import React from "react";
import { useParams } from 'react-router-dom';


const DictionaryPage: React.FC = () => {
  const { dictionaryName } = useParams();
  console.log(dictionaryName)
    let text = <h1>Dictionary {`${dictionaryName}`} Page Content</h1>
  return  text;
};

export default DictionaryPage