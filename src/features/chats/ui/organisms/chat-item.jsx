import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { AmountOfUnseenMessages } from "../atoms/amount-of-unseen-messages";
import { firestore } from "../../../../firebase";
import displayDate from "../../../../functions/display/displayDate";
import { IsUserOnlineCircle } from "../../../../components/Basic/IsUserOnlineCircle";
import { LastSentMessage } from "../molecules/last-sent-message";
import { amountOfUnseenMessages } from "../../lib/amount-of-unseen-messages";

export const ChatItem = ({ chatData }) => {
  const { currentUser } = useAuth();
  const { chatName, chatImage, participants } = chatData;
  const [otherPerson, setOtherPerson] = useState({});
  const [amountOfUnseen, setAmountOfUnseen] = useState(0);
  const [messages, setMessages] = useState(chatData.messages);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    firestore
      .collection("chats")
      .doc(chatData.id)
      .onSnapshot((snapshot) => {
        setMessages(snapshot.data().messages);
        setTyping(!!snapshot.data().typing.length);
      });
  }, []);

  useEffect(() => {
    setAmountOfUnseen(amountOfUnseenMessages(messages, currentUser));
  }, []);

  async function fetchOtherPerson() {
    if (!chatName) {
      const otherPersonId = participants.find(
        (personId) => personId !== currentUser.uid
      );
      const person = (
        await firestore.collection("users").doc(otherPersonId).get()
      ).data();
      setOtherPerson(person);
    } else {
      const otherPersonId = messages[messages.length - 1]?.sender;
      const person = (
        await firestore.collection("users").doc(otherPersonId).get()
      ).data();
      setOtherPerson(person);
    }
  }

  useEffect(() => {
    fetchOtherPerson();
  }, []);
  return chatData ? (
    <Link to={`/chat/${chatData.id}`}>
      <div className={"ChatItem " + (amountOfUnseen > 0 ? "unseen" : "")}>
        <div className="chatItemImage">
          <img loading="lazy" src={chatImage || otherPerson.photoURL} alt="" />
        </div>
        {!chatName && <IsUserOnlineCircle userUID={otherPerson.uid} />}
        <div style={{ width: "100%" }}>
          <h4
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <span>{chatName || otherPerson.displayName}</span>
            <div>
              {messages.length ? (
                <span
                  style={{ opacity: ".6", fontWeight: "500", fontSize: ".8em" }}
                >
                  {displayDate(
                    messages[messages.length - 1].sentTime,
                    chatData &&
                      Date.now() -
                        new Date(
                          messages[messages.length - 1].sentTime
                        ).getTime() >
                        86000000
                      ? 0
                      : 2
                  )}
                </span>
              ) : null}
              <AmountOfUnseenMessages amountOfUnseen={amountOfUnseen} />
            </div>
          </h4>
          {messages.length ? (
            <p
              style={
                messages[messages.length - 1].sender !== currentUser.uid
                  ? { color: "#fff" }
                  : {}
              }
            >
              {
                <LastSentMessage
                  sender={otherPerson}
                  isGroup={chatName.length}
                  message={messages[messages.length - 1]}
                  showUnseenCircle
                  typing={typing}
                />
              }
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  ) : null;
};
