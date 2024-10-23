"use client";

import { useState, useEffect, useRef } from "react";
import { Info, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import LoadingMessage from "./loadingMessage";

import { Message } from "@/types/types";
import { callAI } from "@/lib/ai/graph/callAI";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

const exampleQuestions = [
  "What is a crow?",
  "How are users authenticated?",
  "How to add a function that gets commit content?",
  "What are your business hours?",
  "Can you explain your return policy?",
];

export default function Chat({
  initialMessages = [],
}: {
  initialMessages?: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      const userMessage = {
        id: Date.now(),
        text: newMessage,
        sender: "user" as const,
      };
      setMessages((prev) => [...prev, userMessage]);
      setNewMessage("");
      setIsLoading(true);

      try {
        const results = await callAI(newMessage);
        const AIMessage = {
          id: Date.now(),
          text: results.output
            ? results.output
            : "Question cannot be answered. Please ask another question.",
          sender: "other" as const,
          traceback: results.tracebacks,
        };

        setMessages((prev) => [...prev, AIMessage]);
      } catch (error) {
        console.error("Error getting response:", error);
        const errorMessage = {
          id: Date.now(),
          text: error as string,
          sender: "other" as const,
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleExampleClick = (question: string) => {
    setNewMessage(question);
  };

  const handleMoreInfo = (message: Message) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-col h-[600px] sm:w-[60vw] w-screen border rounded-lg overflow-hidden">
      <div className="bg-primary text-primary-foreground p-6" />
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex ${
                  message.sender === "user" ? "flex-row-reverse" : "flex-row"
                } items-end`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={message.sender === "user" ? "" : "/logo-modified.png"}
                  />
                  <AvatarFallback>
                    {message.sender === "user" ? "U" : "AI"}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={`mx-2 py-2 px-4 rounded-lg ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                </div>
              </div>
              {message.sender === "other" && (
                <Button
                  variant="ghost"
                  className="mt-1 max-w-40 ml-10"
                  onClick={() => handleMoreInfo(message)}
                >
                  <Info className="h-4 w-4 mr-2" />
                  View traceback
                </Button>
              )}
            </div>
          ))}
        </div>
        {isLoading && <LoadingMessage />}
        <div ref={messagesEndRef} />
      </ScrollArea>
      <div className="p-4 bg-background border-t">
        <div className="mb-4 flex flex-wrap gap-2">
          <p className="w-full text-sm text-muted-foreground mb-2">
            Example questions:
          </p>
          {exampleQuestions.map((question, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80"
              onClick={() => handleExampleClick(question)}
            >
              {question}
            </Badge>
          ))}
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await handleSendMessage();
          }}
          className="flex space-x-2"
        >
          <Textarea
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="min-h-[80px]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Answer Traceback</DialogTitle>
            <DialogDescription>
              Here&apos;s all the steps that the AI took to get to your answer:
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="mt-4 max-h-[80vh]">
            <p className="whitespace-pre-wrap">{selectedMessage?.traceback}</p>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
