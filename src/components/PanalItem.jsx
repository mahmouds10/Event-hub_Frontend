import React from "react";
import { Link } from "react-router-dom";

function PanalItem({ href, icon, text }) {
  return (
    <Link
      to={href}
      className="hover:bg-slate-50 p-2 flex items-center gap-3 relative transition-all duration-300 ease-linear overflow-hidden panal-item"
    >
      <span className="text-lg absolute panal-icon">{icon}</span>
      {text}
    </Link>
  );
}

export default PanalItem;
