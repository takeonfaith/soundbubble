import React from "react";
import { PersonTiny } from "../../../../entities/user/ui/organisms/person-tiny";

export const TinyPersonsList = ({
  listOfPeople,
  restriction = null,
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
      {!restriction
        ? listOfPeople.map((person) => {
            return (
              <PersonTiny
                data={person}
                chosenArray={chosenArray}
                setChosenArray={setChosenArray}
                lastSeen={lastSeen}
              />
            );
          })
        : listOfPeople.slice(0, restriction).map((person) => {
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
