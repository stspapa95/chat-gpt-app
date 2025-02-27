"use client";
import { useState, useRef } from "react";

import { getCompletion } from "@/server-actions/getCompletion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Message } from "@/types";

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const chatId = useRef<number | null>(null);

  const handleGetCompletion = async () => {
    const completions = await getCompletion(chatId.current, [
      ...messages,
      {
        role: "user",
        content: message,
      },
    ]);

    chatId.current = completions.id;

    setMessage("");
    setMessages(completions.messages);
  };
  return (
    <div className={"flex flex-col"}>
      {messages.map((message, index) => (
        <div
          key={index}
          className={`mt-5 flex flex-col ${message.role === "user"} ? "items-end" : "items-start`}
        >
          <div
            className={`${message.role === "user" ? "bg-blue-300" : "bg-gray"} rounded-mb py-2 px-8`}
          >
            {message.content}
          </div>
        </div>
      ))}

      <div className={"flex border-t-2 border-t-gray-500 pt-3 mt-3"}>
        <Input
          className={"flex-grow text-xl"}
          placeholder={"Question"}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={async (e) => {
            if (e.key === "Enter") {
              await handleGetCompletion();
            }
          }}
        />

        <Button onClick={handleGetCompletion} className={"ml-3 text-sm"}>
          Send
        </Button>
      </div>
    </div>
  );
}

export default Chat;
