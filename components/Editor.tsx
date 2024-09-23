"use client";
import * as Y from "yjs";
import { Button } from "./ui/button";
import { useRoom, useSelf } from "@liveblocks/react";
import { useEffect, useState } from "react";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { MoonIcon, SunIcon } from "lucide-react";
import {BlockNoteView} from "@blocknote/mantine"
import { BlockNoteEditor } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import stringToColor from "@/lib/stringToColor";
import TarnslateDocument from "./TarnslateDocument";
import ChatToDoc from "./ChatToDoc";



type EditorProps = {
    doc : Y.Doc;
    provider : LiveblocksYjsProvider;
    darkMode : boolean;
}

function BlockNote({ doc, provider, darkMode }: EditorProps) {
    const userInfo = useSelf((me) => me.info)

    const editor : BlockNoteEditor = useCreateBlockNote({
        collaboration : {
            provider,
            fragment : doc.getXmlFragment("document-store"),
            user : {
                name : userInfo?.name as string,
                color : stringToColor(userInfo?.email as string),
            }
        }
    })
    return (
        <div className="relative max-6xl mx-auto">
            <BlockNoteView
            className="min-h-screen"
               editor={editor}
               theme={darkMode ? "dark" : "light"}
            />
        </div>
    )
}

function Editor() {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  const [darkmode, setDarkmode] = useState(false);

  useEffect(() => {
    const yDoc = new Y.Doc();

    const yprovider = new LiveblocksYjsProvider(room, yDoc);

    setDoc(yDoc);
    setProvider(yprovider);

    return () => {
      yDoc?.destroy();
      yprovider?.destroy();
     
    }

  }, [room]);

  if(!doc || !provider) {
    return null;
  }

  const style = `hover:text-white ${
    darkmode
      ? "text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700"
      : "text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-700"
  }`;
  

  return (
    <div className="max-w-6xl mx-auto ">
      <div className="flex items-center justify-end mb-10">
       
       <TarnslateDocument doc={doc}/>


       <ChatToDoc doc={doc}/>

        {/* Dark mode button */}
        <Button className={style} onClick={() => setDarkmode(!darkmode)}>
          {darkmode ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>

     <BlockNote doc={doc} provider={provider} darkMode={darkmode} />
    </div>
  );
}

export default Editor;
