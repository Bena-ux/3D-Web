import React from 'react';

const TextPanel = ({ text }) => {
  return (
    <div className="glass-panel p-6 w-1/2 flex-col justify-center items-start flex" style={{whiteSpace: "pre-line"}}>
        {text &&  <p className="text-md mt-2 ">
          {text}
        </p>}
    </div>
  );
};

export default TextPanel;