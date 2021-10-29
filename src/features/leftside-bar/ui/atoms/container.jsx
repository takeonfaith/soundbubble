import styled from "styled-components";

const LeftsideBarContainer = styled.div`
  width: 100%;
  border-radius: var(--standartBorderRadius);
  background: var(--navItemColor);
  color: #fff;
  font-weight: bold;
  min-height: 40px;
  padding: 0.4px 5px;
  box-sizing: border-box;
  scroll-snap-type: y mandatory;
  transition: 0.2s height;
  position: relative;

  &:hover {
    a {
      text-decoration: none;
    }
  }

  .personName {
    white-space: nowrap;
  }
`;

export default LeftsideBarContainer;
