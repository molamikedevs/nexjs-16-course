'use client';


import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { formatNumber } from "@/lib/utils";

interface VotesProps {
    upVotes: number;
    downVotes: number;
    hasUpVoted: boolean;
    hasDownVoted: boolean;
}

export default function Votes({ upVotes, downVotes, hasUpVoted, hasDownVoted }: VotesProps) {
    const [isLoading, setIsLoading] = useState(false);
    const session = useSession();
    const userId = session.data?.user?.id;

    const handleVote = async (type: "upvote" | "downvote") => {
        if (!userId) return toast.error("You must be logged in to vote.");
        setIsLoading(true);
        try {
            const successMessage =
                type === "upvote"
                    ? `Upvoted ${hasUpVoted ? "added" : "removed"} successfully.`
                    : `Downvoted ${hasDownVoted ? "added" : "removed"} successfully.`;
                    toast.success(successMessage, {
                        description: `You have ${hasUpVoted || hasDownVoted ? "removed" : "added"} your ${type}.`,
                    });
        } catch (error) {
            toast.error("An error occurred while processing your vote.", {
                description: (error as Error).message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
         <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <Image
          src={
            hasUpVoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"
          }
          width={18}
          height={18}
          alt="upvote"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Upvote"
          onClick={() => !isLoading && handleVote("upvote")}
        />

        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(upVotes)}
          </p>
        </div>
      </div>

      <div className="flex-center gap-1.5">
        <Image
          src={
              hasDownVoted
              ? "/icons/downvoted.svg"
              : "/icons/downvote.svg"
          }
          width={18}
          height={18}
          alt="downvote"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Downvote"
          onClick={() => !isLoading && handleVote("downvote")}
        />

        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(downVotes)}
          </p>
        </div>
      </div>
    </div>
    )
}