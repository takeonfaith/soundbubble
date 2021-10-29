import React from "react";
import { leftSideBar } from "../../../../shared/data/left-side-bar";
import useAmountOfUnseenMessages from "../../lib/use-amount-of-unseen-messages";
import NavigationItem from "../atoms/navigation-item";

const NavigationPanel = ({ currentPage, setCurrentPage }) => {
  const [home, library, search, chat] = leftSideBar;
  const amountOfUnseenMessages = useAmountOfUnseenMessages();
  return (
    <div className="NavigationPanel">
      <NavigationItem
        key={0}
        id={home.id}
        title={home.title}
        icon={home.icon}
        link={home.link}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <NavigationItem
        key={1}
        id={library.id}
        title={library.title}
        icon={library.icon}
        link={library.link}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <NavigationItem
        key={2}
        id={search.id}
        title={search.title}
        icon={search.icon}
        link={search.link}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <NavigationItem
        key={3}
        id={chat.id}
        title={chat.title}
        icon={chat.icon}
        link={chat.link}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        notificationValue={amountOfUnseenMessages}
      />
    </div>
  );
};

export default NavigationPanel;
