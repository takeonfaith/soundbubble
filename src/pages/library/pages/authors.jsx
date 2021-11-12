import React, { useState } from "react";
import { ContentContainer } from "../../../shared/ui/atoms/content-container";
import { useSong } from "../../../contexts/song";
import { AuthorItemBig } from "../../../features/author/ui/molecules/author-item-big";
import SearchBar from "../../../shared/ui/organisms/search-bar";

const AuthorsPage = () => {
  const { yourAuthors } = useSong();
  const [searchValue, setSearchValue] = useState("");
  const [displayAuthors, setDisplayAuthors] = useState(yourAuthors);
  return (
    <div className="AuthorsPage">
      <ContentContainer>
        <SearchBar
          value={searchValue}
          setValue={setSearchValue}
          setResultAuthorList={setDisplayAuthors}
          defaultSearchMode={"authors"}
          defaultAuthorsListValue={yourAuthors}
          inputText="Search for authors"
        />
        <div className="authorsContainer">
          {displayAuthors.map((authorData) => {
            return <AuthorItemBig data={authorData} key={authorData.uid} />;
          })}
        </div>
      </ContentContainer>
    </div>
  );
};

export default AuthorsPage;
