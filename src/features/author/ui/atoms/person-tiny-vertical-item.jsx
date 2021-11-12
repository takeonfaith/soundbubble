import React from "react";
import { Link } from "react-router-dom";
import { useModal } from "../../../../contexts/modal";

export const PersonTinyVerticalItem = ({ person }) => {
  const { setOpenModal } = useModal();
  return (
    <Link to={`/authors/${person.uid}`}>
      <div
        className="PersonTinyVerticalItem"
        onClick={() => setOpenModal(false)}
      >
        <div className="personTinyImage">
          <img loading="lazy" src={person.photoURL} alt="" />
        </div>
        <div className="personTinyName">{person.displayName}</div>
      </div>
    </Link>
  );
};
