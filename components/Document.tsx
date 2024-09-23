"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

import { useDocumentData } from "react-firebase-hooks/firestore";

import Editor from "./Editor";
import useOwner from "@/lib/useOwner";
import DeleateDoument from "./DeleateDoument";
import InviteUser from "./InviteUser";
import ManageUser from "./ManageUsers";
import Avatars from "./Avatars";

const Document = ({ id }: { id: string }) => {
  const [data] = useDocumentData(doc(db, "documents", id));

  const [input, setInput] = useState("");
  const [isUpdating, startTransition] = useTransition();

  const isOwner = useOwner();
  
  useEffect(() => {
    if (data) {
      setInput(data.title);
    }
  }, [data]);

  const upadtetitle = (e: React.FormEvent) => {
    e.preventDefault();

    if (input.trim()) {
      startTransition(async () => {
        await updateDoc(doc(db, "documents", id), {
          title: input,
        });
      });
    }
  };

  return (
    <div>
      <div className="flex max-w-6xl mx-auto justify-between pb-5">
        <form className="flex flex-1 space-x-2 " onSubmit={upadtetitle}>
          {/* upadte Title */}
          <Input value={input} onChange={(e) => setInput(e.target.value)} />

          <Button disabled={isUpdating} type="submit">
            {isUpdating ? "Updating..." : "Update"}
          </Button>

          {/* if */}
          {isOwner && (
            <>
            {/* Invite */}
            {/* Delete */}
            

            <DeleateDoument/>
            <InviteUser/>
            </>
          )}




          {/* isOwner && invaited , delete doc*/}
        </form>
      </div>

      <div className="flex max-w-6xl mx-auto justify-between items-center mb-5">
       <ManageUser/>

       <Avatars/>
      </div>
      <hr className="pb-10"/>

      <Editor/>
    </div>
  );
};

export default Document;
