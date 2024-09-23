"use client";
import { useTransition } from 'react';
import { Button } from './ui/button'
import { useRouter } from 'next/navigation';
import { createNewDocument } from '@/actions/actions';

function NewDocumentButton() {
  const [ispending, startTransition] = useTransition()
  const router = useRouter();
  const handleCreateNewDocument = () => {
    startTransition(async() => {
      const {docId} = await createNewDocument()
      router.push(`/doc/${docId}`)
    })
  }


  return (
    <Button onClick={handleCreateNewDocument} disabled={ispending}>{ispending ? "Creating..." : "New Document"}</Button>
  )
}

export default NewDocumentButton