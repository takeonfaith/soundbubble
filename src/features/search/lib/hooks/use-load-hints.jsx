import { useEffect } from "react";
import normalizeString from "../../../../functions/other/normalizeString";
import findSearchHints from "../find-search-hints";
import transliteWord from "../translite-word";

const useLoadHints = ({
  setCurrentHint,
  searchValue,
  inputFocused,
  setSearchHints,
}) => {
  useEffect(() => {
    setCurrentHint(-1);
    if (searchValue.length !== 0 && inputFocused) {
      Promise.resolve(findSearchHints(normalizeString(searchValue))).then(
        (res) => {
          Promise.all(res).then((hint) => {
            const sortedHints = hint.sort((a, b) => b.rank - a.rank);

            if (sortedHints.length) setSearchHints(sortedHints.slice(0, 10));
            else {
              Promise.resolve(
                findSearchHints(normalizeString(transliteWord(searchValue)))
              ).then((res) => {
                Promise.all(res).then((hint) => {
                  const sortedHints = hint.sort((a, b) => b.rank - a.rank);
                  setSearchHints(sortedHints.slice(0, 10));
                });
              });
            }
          });
        }
      );
    } else setSearchHints([]);
  }, [searchValue, inputFocused]);
};

export default useLoadHints;
