import React from "react";
import { PersonTiny } from "../Basic/PersonTiny";

export const TinyPersonsList = ({
  listOfPeople,
  title,
  chosenArray,
  setChosenArray = () => null,
  lastSeen = false,
}) => {
  return (
    <div>
      {title ? (
        <h2 style={{ marginTop: "0", marginBottom: "7px" }}>{title}</h2>
      ) : null}
      {listOfPeople.map((person) => {
        return (
          <PersonTiny
            data={person}
            chosenArray={chosenArray}
            setChosenArray={setChosenArray}
            lastSeen={lastSeen}
          />
        );
      })}
    </div>
  );
};
