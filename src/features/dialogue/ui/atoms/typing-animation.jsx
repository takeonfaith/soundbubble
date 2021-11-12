import React, { useEffect, useState } from "react";
import { firestore } from "../../../../firebase";
import { useAuth } from "../../../../contexts/auth";
import { SmallImages } from "../../../album/ui/atoms/small-images";
export const TypingAnimation = ({ typingPeople }) => {
  const [typingPeopleData, setTypingPeopleData] = useState([]);
  const { currentUser } = useAuth();
  useEffect(() => {
    setTypingPeopleData([]);
    typingPeople.map(async (personId) => {
      const personData = (
        await firestore.collection("users").doc(personId).get()
      ).data();
      if (personData.uid !== currentUser.uid)
        setTypingPeopleData((prev) => [...prev, personData]);
    });
  }, [typingPeople]);
  return typingPeopleData.length > 0 ? (
    <div className="typingWrapper">
      <SmallImages
        imagesList={typingPeopleData.map((person) => person.photoURL)}
        borderColor={"var(--navItemColor)"}
      />
      <div className="TypingAnimation">
        <span className="typingCircle"></span>
        <span className="typingCircle"></span>
        <span className="typingCircle"></span>
      </div>
    </div>
  ) : null;
};
