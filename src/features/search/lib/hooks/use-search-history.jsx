import { useEffect, useState } from "react";
import { useAuth } from "../../../../contexts/auth";
import { firestore } from "../../../../firebase";

const useSearchHistory = () => {
  const [historySongs, setHistorySongs] = useState([]);
  const [historyPlaylists, setHistoryPlaylists] = useState([]);
  const [historyAuthors, setHistoryAuthors] = useState([]);
  const { currentUser } = useAuth();
  useEffect(() => {
    firestore
      .collection("searchHistory")
      .doc(currentUser.uid)
      .get()
      .then((res) => {
        if (res.data()?.history) {
          res.data().history.forEach(async ({ id, type }) => {
            const itemData = (
              await firestore.collection(type).doc(id).get()
            ).data();
            switch (type) {
              case "songs":
                setHistorySongs((prev) => [...prev, itemData]);
                break;
              case "playlists":
                setHistoryPlaylists((prev) => [...prev, itemData]);
                break;
              case "users":
                setHistoryAuthors((prev) => [...prev, itemData]);
                break;

              default:
                break;
            }
          });
        }
      });
  }, []);

  return [historySongs, historyPlaylists, historyAuthors];
};

export default useSearchHistory;
