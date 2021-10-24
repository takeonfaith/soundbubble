import React, { useEffect, useState } from "react";
import { AlbumList } from "../../../../components/Lists/AlbumList";
import { AuthorsList } from "../../../../components/Lists/AuthorsList";
import { SongList } from "../../../../components/Lists/SongList";
import { LoadingCircle } from "../../../../components/Loading/LoadingCircle";
import { Slider } from "../../../../components/Tools/Slider";
import { firestore } from "../../../../firebase";
import { fetchItemList } from "../../../../shared/lib/fetch-item-list";
export const AttachmentList = ({ chatId }) => {
  const [attachmentList, setAttachmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sliderCurrentPage, setSliderCurrentPage] = useState(0);
  const attachmentContent = [
    <SongList
      listOfSongs={attachmentList}
      source={{
        source: `/chat/${chatId}`,
        name: `Chat with ${chatId}`,
        image: "",
        songsList: attachmentList,
      }}
    />,
    <AuthorsList listOfAuthors={attachmentList} />,
    <AlbumList listOfAlbums={attachmentList} loading={loading} />,
  ];
  async function fetchAttachedData(attachedType, firebaseCollection) {
    const chatData = await firestore.collection("chats").doc(chatId).get();
    chatData.data().messages.forEach((message) => {
      if (message[attachedType].length > 0) {
        fetchItemList(
          message[attachedType],
          firebaseCollection,
          setAttachmentList,
          (res) => res,
          () => setLoading(false),
          undefined,
          1
        );
      }
    });
  }

  useEffect(() => {
    switch (sliderCurrentPage) {
      case 0:
        fetchAttachedData("attachedSongs", "songs").then(() =>
          setLoading(false)
        );
        break;
      case 1:
        fetchAttachedData("attachedAuthors", "users").then(() =>
          setLoading(false)
        );
        break;
      case 2:
        fetchAttachedData("attachedAlbums", "playlists").then(() =>
          setLoading(false)
        );
        break;
      default:
        break;
    }
  }, [sliderCurrentPage]);

  useEffect(() => {
    setAttachmentList([]);
  }, [chatId]);

  return (
    <div className="AttachmentList">
      <Slider
        pages={["Songs", "Authors", "Playlists"]}
        currentPage={sliderCurrentPage}
        setCurrentPage={(page) => {
          setSliderCurrentPage(page);
          setLoading(true);
          setAttachmentList([]);
        }}
      />
      {loading ? (
        <LoadingCircle />
      ) : attachmentList.length > 0 ? (
        attachmentContent[sliderCurrentPage]
      ) : (
        <h2>Nothing here</h2>
      )}
    </div>
  );
};
