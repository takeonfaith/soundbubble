import React, { useState } from "react";
import { ColorExtractor } from "react-color-extractor";
import { Link } from "react-router-dom";
import { FullScreenLoading } from "../../components/Loading/FullScreenLoading";
import { BlurredBg } from "../../components/SignIn-Up/BlurredBg";
import { RadioBtn } from "../../components/SignIn-Up/RadioBtn";
import { TitleAndLogo } from "../../components/SignIn-Up/TitleAndLogo";
import { useAuth } from "../../contexts/AuthContext";
import DownloadButton from "../../shared/ui/atoms/download-button";
import "../../styles/SignIn-Up.css";
import { LOGIN_ROUTE } from "../../utils/consts";

const SignUpPage = () => {
  const [currentRoleChoice, setCurrentRoleChoice] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const [photoURL, setPhotoURL] = useState("");
  const isValid =
    email.length !== 0 && password.length !== 0 && name.length !== 0;
  const [imageLocalPath, setImageLocalPath] = useState("");
  const [imageColors, setImageColors] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) {
      return setErrorMessage("One of your fields is totaly empty");
    }

    await signup(
      email,
      name,
      password,
      currentRoleChoice,
      photoURL,
      imageColors,
      setErrorMessage,
      setLoading
    );
  }
  return (
    <div className="In-Up-Container">
      <ColorExtractor
        src={imageLocalPath}
        getColors={(colors) => setImageColors(colors)}
      />
      <div className="CentralPlate">
        <FullScreenLoading loading={loading} />
        <TitleAndLogo title="Sign Up" />

        {errorMessage && <div className="Alert">{errorMessage}</div>}

        <div className="inner-plate-content">
          <input
            type="email"
            placeholder="Enter your Email"
            className="emailInput"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="password"
            name=""
            id=""
            placeholder="Create a password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              margin: "5px 0 15px 0",
            }}
          >
            <RadioBtn
              label="User"
              onClick={() => setCurrentRoleChoice(0)}
              currentActive={currentRoleChoice}
              id={0}
            />
            <RadioBtn
              label="Author"
              onClick={() => setCurrentRoleChoice(1)}
              currentActive={currentRoleChoice}
              id={1}
            />
          </div>
          <DownloadButton
            text="Download photo"
            place={"usersImages/"}
            setItemSrc={setPhotoURL}
            setImageLocalPath={setImageLocalPath}
          />
          <div className="inAndUpBtns">
            <button
              className="upBtn"
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
            >
              Sign Up
            </button>
            <Link to={LOGIN_ROUTE}>
              <button className="inBtn">Already have the account</button>
            </Link>
          </div>
        </div>
      </div>
      <BlurredBg />
    </div>
  );
};

export default SignUpPage;
