import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ErrorPlate } from "../../components/MessagePlates/ErrorPlate";
import { FullScreenLoading } from "../../components/Loading/FullScreenLoading";
import { BlurredBg } from "../../components/SignIn-Up/BlurredBg";
import { TitleAndLogo } from "../../components/SignIn-Up/TitleAndLogo";
import { useAuth } from "../../contexts/AuthContext";
import { SIGNUP_ROUTE } from "../../utils/route-consts";
import Input from "../../shared/ui/atoms/input";

const LogInPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const isValid = email.length !== 0 && password.length !== 0;
  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) {
      return setErrorMessage("One of your fields is totaly empty");
    }
    await login(email, password, setErrorMessage, setLoading);
  }
  return (
    <div className="In-Up-Container">
      <div className="CentralPlate">
        <FullScreenLoading loading={loading} />
        <TitleAndLogo title="Log In" />
        <ErrorPlate errorMessage={errorMessage} />
        <div className="inner-plate-content">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            setValue={setEmail}
            margin
          />
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            setValue={setPassword}
            margin
          />
          <div className="inAndUpBtns">
            <button className="upBtn" disabled={loading} onClick={handleSubmit}>
              Log In
            </button>
            <Link to={SIGNUP_ROUTE}>
              <button className="inBtn">Create new account</button>
            </Link>
          </div>
        </div>
      </div>
      <BlurredBg />
    </div>
  );
};

export default LogInPage;
