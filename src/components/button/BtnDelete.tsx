import React from "react";

interface Props {
  handleClick: () => void;
}

const BtnDelete: React.FC<Props> = ({ handleClick }) => {
  return (
    <button
      className="px-5 py-1 rounded-md shadow-md text-sm font-bold bg-red-400 hover:bg-red-500  text-slate-600"
      onClick={handleClick}
    >
      Delete
    </button>
  );
};

export default BtnDelete;