"use client";

import Image from "next/image";
import { use, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { toggleSaveQuestion } from "@/lib/actions/collection.action";
import { ActionResponse } from "@/types/global";

interface CollectionBaseParams {
  questionId: string;
  hasSavedPromise: Promise<ActionResponse<{ saved: boolean }>>;
}

export default function SaveQuestion({ questionId, hasSavedPromise }: CollectionBaseParams) {
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const userId = session.data?.user?.id;

  const { data } = use(hasSavedPromise);
  const  { saved: hasSaved } = data || {};

  const handleSave = async () => {
    if (loading) return;
    if (!userId) {
      toast.error("You need to be logged in to save questions.");
    }
    setLoading(true);
    try {
      const { success, data, error } = await toggleSaveQuestion({ questionId });
      if (!success) throw new Error(error?.message || "Failed to save the question.");
      toast.success(data?.saved ? "Question saved to your collection." : "Question removed from your collection.");
    } catch (error) {
      toast.error("An error occurred while saving the question.", {
        description: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Image
      src={hasSaved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
      alt="Save Question"
      width={18}
      height={18}
      className={`cursor-pointer ${loading ? "opacity-50" : "opacity-100"}`}
      onClick={handleSave}
    />
  );
}
