import React from 'react';
import { FaGithubSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";



const Links: React.FC = () => {
  const btnClick = (link: string) => () => {
    window.open(link);
  }

  return (
    <button
     style={{
      position: 'absolute',
      bottom: 15, right: 15,
      fontSize: 35,
      padding: 0,
      display: 'flex',
      background: 'none',
      border: 'none',
    }}
    >
      <FaGithubSquare 
      style={{cursor: 'pointer', marginRight: 10}}
      onClick={btnClick('https://github.com/RomainChanteloup/optimus-world')}
      />
      <FaLinkedin
      style={{cursor: 'pointer'}}
      onClick={btnClick('https://www.linkedin.com/in/romain-chanteloup/')}
      />
    </button>
  );
};

export default Links;
