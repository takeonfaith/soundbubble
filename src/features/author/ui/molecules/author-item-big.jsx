import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../contexts/auth";

import { AddToListCircle } from "../../../../shared/ui/molecules/add-to-list-circle";
import saveSearchHistory from "../../../search/lib/save-search-history";

export const AuthorItemBig = ({
  data,
  listOfChosenAuthors,
  setListOfChosenAuthors,
  shouldSaveSearchHistory = false,
}) => {
  const { currentUser } = useAuth();

  const handleSaveSearchHistory = () => {
    if (shouldSaveSearchHistory)
      saveSearchHistory(currentUser.uid, data.uid, "users");
  };

  return (
    <Link
      to={`/authors/${data.uid}`}
      className="AuthorItemBig"
      onClick={handleSaveSearchHistory}
    >
      <AddToListCircle
        listOfChosenItems={listOfChosenAuthors}
        setListOfChosenItems={setListOfChosenAuthors}
        itemId={data.uid}
      />
      <div>
        <div
          className="AuthorItemBigImage"
          style={{ background: data.imageColors && data.imageColors[0] }}
        >
          <img src={data.photoURL} alt="" loading="lazy" />
        </div>
        <h3>{data.displayName}</h3>
      </div>
    </Link>
  );
};
