import React from "react";
import { AddToListCircle } from "../../shared/ui/molecules/add-to-list-circle";
import { LastSeen } from "./LastSeen";
import styled from "styled-components";

const RightIconWrapper = styled.div`
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
`;

export const PersonTiny = ({
  data,
  chosenArray,
  setChosenArray,
  lastSeen = false,
  rightButton,
  ...restProps
}) => {
  return (
    <div className="person" {...restProps}>
      <AddToListCircle
        listOfChosenItems={chosenArray}
        setListOfChosenItems={setChosenArray}
        itemId={data.uid}
      />
      <div className="pesronImg">
        <img loading="lazy" src={data.photoURL} alt="" />
      </div>
      <div className="personName">{data.displayName}</div>
      {lastSeen && <LastSeen userUID={data.uid} className="is-online" />}
      <RightIconWrapper>{rightButton}</RightIconWrapper>
    </div>
  );
};
