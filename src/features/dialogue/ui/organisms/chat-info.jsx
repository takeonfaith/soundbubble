import { useEffect, useState } from "react";
import { ColorExtractor } from "react-color-extractor";
import { FiSettings, FiUserPlus } from "react-icons/fi";
import { ImAttachment } from "react-icons/im";
import { MdModeEdit } from "react-icons/md";
import { RiVolumeUpLine } from "react-icons/ri";
import { PersonTiny } from "../../../../components/Basic/PersonTiny";
import { LoadingCircle } from "../../../../components/Loading/LoadingCircle";
import { Slider } from "../../../../components/Tools/Slider";
import { useAuth } from "../../../../contexts/AuthContext";
import { useModal } from "../../../../contexts/ModalContext";
import { firestore, storage } from "../../../../firebase";
import shortWord from "../../../../functions/other/shortWord";
import { fetchItemList } from "../../../../shared/lib/fetch-item-list";
import Button from "../../../../shared/ui/atoms/button";
import Input from "../../../../shared/ui/atoms/input";
import LeaveChatButton from "../atoms/leave-chat-button";
import { AttachmentList } from "../molecules/attachment-list";
import AddPeopleToChat from "./add-people-to-chat";

export const ChatInfo = ({ data }) => {
  const { currentUser } = useAuth();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatNameValue, setChatNameValue] = useState(data.chatName);
  const [newChatPhoto, setNewChatPhoto] = useState(data.chatImage);
  const [newImageLocalPath, setNewImageLocalPath] = useState("");
  const [newImageColors, setNewImageColors] = useState(data.imageColors || []);
  const { setContent } = useModal();
  const [participantsPage, setParticipantsPage] = useState(0);
  const [showUpdateBtn, setShowUpdateBtn] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchItemList(
      data.participants,
      "users",
      setParticipants,
      (res) => res,
      () => setLoading(false)
    );
  }, [data.id]);
  useEffect(() => {
    if (
      chatNameValue.trim() !== data.chatName.trim() ||
      newChatPhoto !== data.chatImage
    ) {
      setShowUpdateBtn(true);
    } else setShowUpdateBtn(false);
  }, [chatNameValue, newChatPhoto]);

  useEffect(() => {
    setChatNameValue(data.chatName);
  }, [data.id]);

  useEffect(() => {
    setChatNameValue(data.chatName);
    setNewChatPhoto(data.chatImage);
  }, [data.chatName, data.chatImage]);

  function updateChatInfo() {
    firestore.collection("chats").doc(data.id).update({
      chatName: chatNameValue,
      chatImage: newChatPhoto,
      imageColors: newImageColors,
    });
  }

  async function onFileChange(e, place, setFunc) {
    const file = e.target.files[0];
    setNewImageLocalPath(URL.createObjectURL(file));
    const storageRef = storage.ref();
    const fileRef = storageRef.child(place + file.name);
    await fileRef.put(file);
    setFunc(await fileRef.getDownloadURL());
  }
  return (
    <div className="ChatInfo">
      <ColorExtractor
        src={newImageLocalPath}
        getColors={(colors) => setNewImageColors(colors)}
      />
      <div className="chatInfoImageAndName">
        <div className="chatInfoImage">
          <label className="changePhoto">
            <MdModeEdit />
            Change photo
            <input
              type="file"
              style={{ display: "none" }}
              onChange={(e) => onFileChange(e, "chatCovers/", setNewChatPhoto)}
            />
          </label>
          <img loading="lazy" src={newChatPhoto} alt="" />
        </div>
        <div>
          <Input
            value={chatNameValue}
            setValue={setChatNameValue}
            placeholder={"Enter chat name"}
            required
          />
          <div className="chatInfoButtons">
            <button className="chatInfoButton">
              <FiSettings />
              Settings
            </button>
            <button
              className="chatInfoButton"
              onClick={() => setContent(<AttachmentList chatId={data.id} />)}
            >
              <ImAttachment />
              {shortWord("Attachments", 7)}
            </button>
            <button className="chatInfoButton">
              <RiVolumeUpLine />
              Sound
            </button>
          </div>
        </div>
        {showUpdateBtn ? (
          <button className="standartButton" onClick={updateChatInfo}>
            Update Chat
          </button>
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h4>Chat participants</h4>
        <Button
          text={"Add"}
          icon={<FiUserPlus />}
          onClick={() => setContent(<AddPeopleToChat chat={data} />)}
        />
      </div>
      <Slider
        pages={["All participants", "Administrators"]}
        currentPage={participantsPage}
        setCurrentPage={setParticipantsPage}
      />
      {!loading ? (
        participants.map((person) => {
          if (participantsPage === 1) {
            if (data.admins.includes(person.uid))
              return <PersonTiny data={person} key={person.uid} lastSeen />;
          } else
            return (
              <PersonTiny
                data={person}
                key={person.uid}
                lastSeen
                rightButton={
                  person.uid === currentUser.uid ? (
                    <LeaveChatButton chat={data} user={currentUser} />
                  ) : data.admins.includes(currentUser.uid) ? (
                    <LeaveChatButton chat={data} user={person} />
                  ) : null
                }
              />
            );
        })
      ) : (
        <LoadingCircle />
      )}
    </div>
  );
};
