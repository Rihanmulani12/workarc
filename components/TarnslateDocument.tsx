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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Markdown from "react-markdown";
import { Button } from "./ui/button";
import { FormEvent, useState, useTransition } from "react";
import { BotIcon, LanguagesIcon } from "lucide-react";
import { toast } from "sonner";

type Language =
  | "english"
  | "french"
  | "german"
  | "spanish"
  | "japanese"
  | "chinese"
  | "arabic"
  | "hindi"
  | "marathi";

const languages: Language[] = [
  "english",
  "french",
  "german",
  "spanish",
  "japanese",
  "chinese",
  "arabic",
  "hindi",
  "marathi",
];

function TarnslateDocument({ doc }: { doc: Y.Doc }) {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [question] = useState<string>("");


//   const CleanedSummary = (summary: any) => {
//     const sanitizedSummary = summary;
//     return DOMPurify.sanitize(summary, {
//       FORBID_TAGS: ['blockgroup'], // Remove <blockgroup> tags

     
//     });
//    }

  const handleAskQue = async (e: FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const doucument = doc.get("document-store").toJSON();
      const res = await fetch(
        `${process.env.
          NEXT_PUBLIC_BASE_URL}/translateDocument`,
        {
          method: "POST",

          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentData: doucument,
            targetLang: language,
          }),
        }
      );

      if (res.ok) {
        const { translated_text } = await res.json();
        setSummary(translated_text);
        toast.success("Document translated successfully");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>
          <LanguagesIcon />
          Translate
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Translate the document</DialogTitle>
          <DialogDescription>
            Select a language and AI will translate a summary of documnet{" "}
          </DialogDescription>

          <hr className="mt-5" />
          {question && (
            <p className="text-sm text-muted-foreground"> Q : {question}</p>
          )}
        </DialogHeader>

        {summary && (
          <section className="flex flex-col items-start max-h-96 overflow-y-auto gap-4 p-5 bg-gray-100 rounded-lg shadow-md">
            <div className="flex items-center gap-2">
              <BotIcon className="w-10 h-10 flex-shrink-0" />
              <p className="text-lg font-semibold">
                GPT {isPending ? "Translating..." : "Translated"}
              </p>
            </div>

            <div className="w-full text-sm text-gray-800">
              {isPending ? (
                <p>Translating...</p>
              ) : (
                <Markdown >{summary}</Markdown>
              )}
            </div>
          </section>
        )}

        <form className="flex gap-2" onSubmit={handleAskQue}>
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>

            <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language} value={language}>
                  {language.charAt(0).toUpperCase() + language.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" disabled={!language || isPending}>
            {isPending ? "Translating..." : "Translate"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TarnslateDocument;
