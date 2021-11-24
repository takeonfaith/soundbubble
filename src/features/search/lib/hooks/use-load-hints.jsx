import { useEffect } from "react";
import normalizeString from "../../../../shared/lib/normalize-string";
import findSearchHints from "../find-search-hints";
import findTopSearches from "../find-top-searches";
import transliteWord from "../translite-word";

const useLoadHints = ({
  setCurrentHint,
  searchValue,
  inputFocused,
  setSearchHints,
  defaultSearchMode,
}) => {
  useEffect(() => {
    setCurrentHint(-1);
    const searchMode =
      defaultSearchMode === "All" ? undefined : defaultSearchMode.toLowerCase();
    if (searchValue.length === 0 && inputFocused && searchMode === undefined) {
      Promise.resolve(findTopSearches()).then((res) => {
        Promise.all(res).then((hint) => {
          setSearchHints(hint);
        });
      });
    } else if (searchValue.length !== 0 && inputFocused) {
      Promise.resolve(
        findSearchHints(normalizeString(searchValue), searchMode)
      ).then((res) => {
        Promise.all(res).then((hint) => {
          // console.log(hint);
          const sortedHints = hint.sort((a, b) => b.rank - a.rank);

          if (sortedHints.length) setSearchHints(sortedHints.slice(0, 10));
          else {
            Promise.resolve(
              findSearchHints(
                transliteWord(normalizeString(searchValue)),
                searchMode
              )
            ).then((res) => {
              Promise.all(res).then((hint) => {
                const sortedHints = hint.sort((a, b) => b.rank - a.rank);
                setSearchHints(sortedHints.slice(0, 10));
              });
            });
          }
        });
      });
    } else setSearchHints([]);
  }, [searchValue, inputFocused, defaultSearchMode]);
};

export default useLoadHints;
