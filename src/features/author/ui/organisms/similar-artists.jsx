import React, { useEffect, useState } from "react";

import findSimilarArtists from "../../../../shared/lib/find-similar-artists";
import { AuthorsList } from "../templates/authors-list";

export const SimilarArtists = ({ data }) => {
  const [similarArtists, setSimilarArtists] = useState([]);

  useEffect(() => {
    findSimilarArtists(data, setSimilarArtists);
  }, [data]);
  return (
    <AuthorsList listOfAuthors={similarArtists} title={"Similar Authors"} />
  );
};
