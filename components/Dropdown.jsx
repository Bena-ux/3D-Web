import React from "react";
import { Link } from "react-router-dom";

const models = [
  { name: 'Ercole', path: '/discover/Ercole' },
  { name: 'Giambo', path: '/discover/Giambo' }, // Second model added
  // Add more models as needed
];

const Dropdown = () => {
  return (
    <div className="relative">
      <button className="text-black">Discover</button>
      <div className="absolute z-10 bg-white opacity-90 rounded-md shadow-lg mt-2">
        {models.map((model) => (
          <Link to={model.path} key={model.name}>
            <p className="hover:bg-gray-200 p-2">{model.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
