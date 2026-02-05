import React from "react";
import styled from "styled-components";

const Spinner = styled.div`
  width: 12px;
  height: 12px;
  border: 2px solid currentColor;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
  margin-right: 6px;

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingSpinner = ({ size = "12px", className = "" }) => (
  <Spinner style={{ width: size, height: size }} className={className} />
);

export default LoadingSpinner;
