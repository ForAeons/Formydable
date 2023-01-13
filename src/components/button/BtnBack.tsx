import React from "react";
import { useNavigate } from "react-router-dom";

const BtnBack: React.FC = () => {
  const navigator = useNavigate();
  return (
    <button
      className="rounded-md bg-indigo-400 px-5 py-1 text-sm font-bold text-slate-600 shadow-md hover:bg-indigo-300"
      onClick={() => navigator(-1)}
    >
      Back
    </button>
  );
};

export default BtnBack;