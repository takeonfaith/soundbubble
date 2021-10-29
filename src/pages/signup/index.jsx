import React, { useState } from "react";
import { ColorExtractor } from "react-color-extractor";
import { Link } from "react-router-dom";
import { FullScreenLoading } from "../../components/Loading/FullScreenLoading";
import { BlurredBg } from "../../components/SignIn-Up/BlurredBg";
import { RadioBtn } from "../../components/SignIn-Up/RadioBtn";
import { TitleAndLogo } from "../../components/SignIn-Up/TitleAndLogo";
import { useAuth } from "../../contexts/AuthContext";
import DownloadButton from "../../shared/ui/atoms/download-button";
import Input from "../../shared/ui/atoms/input";
import "../../styles/SignIn-Up.css";
import { LOGIN_ROUTE } from "../../utils/route-consts";

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
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            setValue={setEmail}
            margin
          />
          <Input
            type="text"
            placeholder="Enter your name"
            value={name}
            setValue={setName}
            margin
          />
          <Input
            type="password"
            placeholder="Create password"
            value={password}
            setValue={setPassword}
            margin
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
              <button className="inBtn">Already registered</button>
            </Link>
          </div>
        </div>
      </div>
      <BlurredBg />
    </div>
  );
};

export default SignUpPage;
