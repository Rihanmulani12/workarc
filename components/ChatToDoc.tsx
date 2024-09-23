"use client";

import * as Y from "yjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { BotIcon } from "lucide-react";
import Markdown from "react-markdown";
import { useState, FormEvent, useTransition } from "react";
import { toast } from "sonner";

function ChatToDoc({ doc }: { doc: Y.Doc }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [question, setQuestion] = useState<string>("");

  const handleAskQue = async (e: FormEvent) => {
    e.preventDefault();
    setQuestion(input);

    startTransition(async () => {
      const documentData = doc.get("document-store").toJSON();
      const res = await fetch(`${process.env.
          NEXT_PUBLIC_BASE_URL}/chatToDocument`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({  documentData, question: input }),
        }
      );

      if (res.ok) {
        const { message } = await res.json();
        setSummary(message);
        toast.success("Document chat successfully");
      } else {
        toast.error("Failed to fetch response");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>
          <BotIcon className="mr-5" />
          Chat to document
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat the document</DialogTitle>
          <DialogDescription>Ask your question to the document</DialogDescription>
          <hr className="mt-5" />
          {question && (
            <p className="text-sm text-muted-foreground">Q: {question}</p>
          )}
        </DialogHeader>

        <form onSubmit={handleAskQue}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your question"
            className="w-full p-2 border rounded"
            required
          />
          <Button type="submit" className="mt-2">Ask</Button>
        </form>

        {summary && (
          <section className="flex flex-col items-start max-h-96 overflow-y-auto gap-4 p-5 bg-gray-100 rounded-lg shadow-md mt-4">
            <div className="flex items-center gap-2">
              <BotIcon className="w-10 h-10 flex-shrink-0" />
              <p className="text-lg font-semibold">GPT {isPending ? "Translating..." : "Translated"}</p>
            </div>

            <div className="w-full text-sm text-gray-800">
              {isPending ? (
                <p>Translating...</p>
              ) : (
                <Markdown>{summary}</Markdown>
              )}
            </div>
          </section>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ChatToDoc;

