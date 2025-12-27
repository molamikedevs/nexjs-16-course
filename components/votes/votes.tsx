"use client";

import Image from "next/image";
import { use, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { formatNumber } from "@/lib/utils";
import { ActionResponse } from "@/types/global";
import { createVote } from "@/lib/actions/vote.action";

interface VotesProps {
  upVotes: number;
  downVotes: number;
  targetType: "question" | "answer";
  targetId: string;
  hasVotedPromise: Promise<ActionResponse<HasVotedResponse>>;
}

export default function Votes({ upVotes, downVotes, targetType, targetId, hasVotedPromise }: VotesProps) {
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const userId = session.data?.user?.id;

  const { data, success } = use(hasVotedPromise);
  const { hasUpVoted, hasDownVoted } = data || {};

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!userId) return toast.error("You must be logged in to vote.");
    setIsLoading(true);

    try {
      const result = await createVote({
        targetId,
        targetType,
        voteType,
      });

      if (!result.success) {
        toast.error("Failed to process your vote.", {
          description: result.error?.message || "Please try again later.",
          descriptionClassName: "danger",
        });
      }

      const successMessage =
        voteType === "upvote"
          ? `Upvote ${!hasUpVoted ? "added" : "removed"} successfully`
          : `Downvote ${!hasDownVoted ? "added" : "removed"} successfully`;

      toast.success(successMessage, {
        description: "Your vote has been recorded.",
        descriptionClassName: "success",
      });
    } catch (error) {
      toast.error("An error occurred while processing your vote.", {
        description: (error as Error).message,
        descriptionClassName: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <Image
          src={success && hasUpVoted ? "/icons/upvote.svg" : "/icons/upvoted.svg"}
          width={18}
          height={18}
          alt="upvote"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Upvote"
          onClick={() => !isLoading && handleVote("upvote")}
        />

        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">{formatNumber(upVotes)}</p>
        </div>
      </div>

      <div className="flex-center gap-1.5">
        <Image
          src={success && hasDownVoted ? "/icons/downvote.svg" : "/icons/downvoted.svg"}
          width={18}
          height={18}
          alt="downvote"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Downvote"
          onClick={() => !isLoading && handleVote("downvote")}
        />

        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">{formatNumber(downVotes)}</p>
        </div>
      </div>
    </div>
  );
}
