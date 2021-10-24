import React, { useEffect, useState } from "react";
import { AuthorsList } from "../../../../components/Lists/AuthorsList";
import findSimilarArtists from "../../../../shared/lib/find-similar-artists";

export const SimilarArtists = ({ data }) => {
  const [similarArtists, setSimilarArtists] = useState([]);

  useEffect(() => {
    findSimilarArtists(data, setSimilarArtists);
  }, [data]);
  return (
    <AuthorsList listOfAuthors={similarArtists} title={"Similar Authors"} />
  );
};
