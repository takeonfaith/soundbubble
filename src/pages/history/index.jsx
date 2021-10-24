import React, { useState } from "react";
import { useEffect } from "react";
import { ContentContainer } from "../../components/Containers/ContentContainer";
import { SongList } from "../../components/Lists/SongList";
import { useAuth } from "../../contexts/AuthContext";
import { firestore } from "../../firebase";
import { fetchItemList } from "../../shared/lib/fetch-item-list";
import { GoBackBtn } from "../../shared/ui/atoms/go-back-button";

const HistoryPage = () => {
  const [historySongsIds, setHistorySongsIds] = useState([]);
  const [historySongs, setHistorySongs] = useState([]);
  const { currentUser } = useAuth();
  useEffect(() => {
    firestore
      .collection("history")
      .doc(currentUser.uid)
      .onSnapshot((res) => {
        setHistorySongsIds(res.data().history);
      });
  }, [firestore]);

  useEffect(() => {
    fetchItemList(historySongsIds, "songs", setHistorySongs);
  }, [historySongsIds]);
  return (
    <div className="HistoryPage" style={{ animation: "zoomIn .2s forwards" }}>
      <ContentContainer>
        <div style={{ display: "flex", alignItems: "center" }}>
          <GoBackBtn />
          <h2 style={{ margin: "0px", marginLeft: "8px" }}>History</h2>
        </div>
        <SongList
          listOfSongs={historySongs}
          source={{
            source: `/history`,
            name: "History",
            image:
              "https://www.seekpng.com/png/full/781-7815113_history-icon-white-png.png",
            songsList: historySongs,
          }}
          showCount
          showSearch
          displayIfEmpty={"Nothing here"}
        />
      </ContentContainer>
    </div>
  );
};

export default HistoryPage;
