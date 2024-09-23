import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import liveblocks from "@/lib/liveblocks";

import { adminDb } from "@/firebase-admin";

export async function POST(req : NextRequest){
    auth().protect();
    const {sessionClaims} = await auth();
    const {room} = await req.json();
 
    const session = liveblocks.prepareSession(sessionClaims?.email as string ,{
        userInfo : {
            name : sessionClaims?.name as string,
            email : sessionClaims?.email as string,
            avatar : sessionClaims?.profileImageUrl as string,
        }
    });

    const userInroom = await adminDb.collectionGroup("rooms")
    .where("userId", "==", sessionClaims?.email as string)
    .get()


    const userInRoom = userInroom.docs.find((doc) => doc.id === room)

    if(userInRoom?.exists){
        session.allow(room,session.FULL_ACCESS);
        const {body ,status} = await session.authorize();

        console.log("You are in this room");
        return new Response(body, {status})
            
    }else{
       return NextResponse.json({message: "You are not in this room"}, {status : 403})
    }
}

