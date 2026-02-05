import { useState } from "react";

export const useUserData = () => {
  const [Tel, setTel] = useState("");
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [BusinessEmail, setBusinessEmail] = useState("");
  const [Appeal, setAppeal] = useState("");
  const [AllData, setAllData] = useState([]);

  return {
    Tel,
    setTel,
    Name,
    setName,
    Email,
    setEmail,
    BusinessEmail,
    setBusinessEmail,
    Appeal,
    setAppeal,
    AllData,
    setAllData,
  };
};
