import React from "react";
import { Link } from "react-router-dom";
import { NotificationCircle } from "../../../../components/Basic/NotificationCircle";

export default function NavigationItem({
  id,
  title,
  icon,
  link,
  currentPage,
  setCurrentPage,
  notificationValue,
}) {
  return (
    <Link to={link}>
      <div
        className={"NavigationItem " + (id === currentPage ? "active" : "")}
        onClick={() => setCurrentPage(id)}
      >
        <div className="icon">{icon}</div>
        <b>{title}</b>
        <NotificationCircle value={notificationValue} />
      </div>
    </Link>
  );
}
