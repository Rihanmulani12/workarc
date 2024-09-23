"use server";

import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";


export async function createNewDocument() {
  auth().protect();

  const { sessionClaims } = await auth();

  const docCollectionRef = adminDb.collection("documents");
  const docref = await docCollectionRef.add({
    title: "New Doc",
  });

  await adminDb
    .collection("users")
    .doc(sessionClaims?.email as string)
    .collection("rooms")
    .doc(docref.id)
    .set({
      userId: sessionClaims?.email,
      roomId: docref.id,
      createdAt: new Date(),
      role: "owner",
    });

  return { docId: docref.id };
}

export async function deleteDocument(roomId: string) {
  auth().protect();

  console.log("deleting room", roomId);

  try {
    //delete the document ref itself
    await adminDb.collection("documents").doc(roomId).delete();
    const query = await adminDb
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();

    const batch = adminDb.batch();

    //delete the room ref in user collection

    query.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    await liveblocks.deleteRoom(roomId);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function inviteUserToDocument(roomId: string, email: string) {
  auth().protect();

  console.log("inviting user", email, roomId);

  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .set({
        userId: email,
        roomId: roomId,
        createdAt: new Date(),
        role: "editor",
      });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function removeUserFromDocument(roomId: string, email: string) {
  auth().protect();

  console.log("removeUserFromDocument", email, roomId);

  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .delete();

      return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
