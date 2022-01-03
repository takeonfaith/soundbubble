import { useEffect, useState } from "react";
import { useAuth } from "../../../../contexts/auth";
import { firestore } from "../../../../firebase";

const useFriendRequest = () => {
  const { currentUser } = useAuth();
  const [friendRequests, setFriendRequests] = useState([]);
  function fetchFriendRequests() {
    const tempArray = [];
    currentUser.friends.forEach(async (friendObj, i) => {
      if (friendObj.status === "requested") {
        const personData = (
          await firestore.collection("users").doc(friendObj.uid).get()
        ).data();
        tempArray.push(personData);
        if (i === currentUser.friends.length - 1) setFriendRequests(tempArray);
      }
    });
  }

  useEffect(() => {
    fetchFriendRequests();
  }, [JSON.stringify(currentUser.friends)]);

  function addFriend(uid) {
    const friendsList = currentUser.friends;
    const otherUserFriendList = friendRequests.find(
      (person) => person.uid === uid
    ).friends;
    friendsList.find((obj) => obj.uid === uid).status = "added";
    otherUserFriendList.find((obj) => obj.uid === currentUser.uid).status =
      "added";

    firestore.collection("users").doc(currentUser.uid).update({
      friends: friendsList,
    });
    firestore.collection("users").doc(uid).update({
      friends: otherUserFriendList,
    });

    setFriendRequests((arrOfReqs) => arrOfReqs.filter((el) => el.uid !== uid));
  }

  function rejectFriend(uid) {
    const friendsList = currentUser.friends.filter((obj) => obj.uid !== uid);
    firestore
      .collection("users")
      .doc(uid)
      .get()
      .then((res) => {
        const otherUserFriendList = res
          .data()
          .friends.filter((obj) => obj.uid !== currentUser.uid);
        firestore.collection("users").doc(currentUser.uid).update({
          friends: friendsList,
        });
        firestore.collection("users").doc(uid).update({
          friends: otherUserFriendList,
        });
        setFriendRequests((arrOfReqs) =>
          arrOfReqs.filter((el) => el.uid !== uid)
        );
      });
  }

  return [friendRequests, addFriend, rejectFriend];
};

export default useFriendRequest;
