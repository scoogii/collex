import Nav from "@/components/Nav";
import MessagesPanel from "@/components/messages/MessagesPanel";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Messages = ({ toggleTheme }) => {
  ////////// STATE VARIABLES //////////
  const [messages, setMessages] = useState([]);
  const [isShown, setIsShown] = useState(false);
  const router = useRouter();

  ////////// HANDLERS //////////
  const getPreview = async () => {
    const response = await fetch(
      `http://localhost:8080/message/preview_all_messages?username=${localStorage.getItem(
        "username",
      )}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      },
    );

    const data = await response.json();

    if (data.error) {
      alert(data.error);
    } else {
      setMessages(data);
    }
  };

  ////////// USE EFFECTS //////////
  // If user is not logged in, redirect to home
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      setIsShown(true);
      getPreview();
    }
  }, []);

  return (
    <>
      {isShown && (
        <>
          <Nav toggleTheme={toggleTheme} />
          <MessagesPanel messages={messages} />
        </>
      )}
    </>
  );
};

export default Messages;
