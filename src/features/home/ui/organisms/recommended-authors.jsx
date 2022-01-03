import React, { useEffect, useState } from "react";
import { AuthorsList } from "../../../../features/author/ui/templates/authors-list";
import { useAuth } from "../../../../contexts/auth";
import { useSong } from "../../../../contexts/song";
import findSimilarArtists from "../../../../shared/lib/find-similar-artists";

export const RecommendedAuthors = () => {
  const { yourAuthors } = useSong();
  const [recommendationAuthors, setRecommendationAuthors] = useState([]);

  const [uniqueAuthors, setUniqueAuthors] = useState([]);
  const { currentUser } = useAuth();
  useEffect(() => {
    if (yourAuthors !== undefined) {
      yourAuthors.forEach((author) => {
        findSimilarArtists(author, setRecommendationAuthors);
      });
    }
  }, []);

  useEffect(() => {
    recommendationAuthors.forEach((author) => {
      const uniqueAuthorsUIDSArray = uniqueAuthors.map((author) => author.uid);
      if (
        !currentUser.addedAuthors.includes(author.uid) &&
        !uniqueAuthorsUIDSArray.includes(author.uid)
      ) {
        setUniqueAuthors((prev) => [...prev, author]);
      }
    });
  }, [recommendationAuthors]);
  return (
    <div className="RecommendedAuthors">
      <AuthorsList
        listOfAuthors={uniqueAuthors}
        title={"Recommended Authors"}
      />
      {/* <h2>Recommended Authors</h2>
			<div className="artistsWrapper">
				{uniqueAuthors.map((author, index) => {
					return (
						<AuthorItemBig data={author} key={index} />
					)
				})}
			</div> */}
    </div>
  );
};
