"use client";

import {
    ClientSideSuspense,
    RoomProvider as RoomProviderWraper,
} from "@liveblocks/react/suspense";
import { Loader } from "lucide-react";
import LiveCursorProvider from "./LiveCursorProvider";

function RoomProvider({
  roomId,
  children,
}: {
  roomId: string;
  children: React.ReactNode;
}) {
  return (
    <RoomProviderWraper
      id={roomId}
      initialPresence={{
        cursor: null,
      }}
      
    >
     <ClientSideSuspense
     fallback={<Loader className="w-6 h-6 animate-spin"/>}>
    
    <LiveCursorProvider>

      
     {children}
     </LiveCursorProvider>
   
     </ClientSideSuspense>
     
    </RoomProviderWraper>
  );
}

export default RoomProvider;
