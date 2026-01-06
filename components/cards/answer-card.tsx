import Link from "next/link";
import { Suspense } from "react";
import { hasVoted } from "@/lib/actions/vote.action";
import { AnswerParams } from "@/types/global";
import { cn, getTimeStamp } from "@/lib/utils";
import { siteConfig } from "@/config/site";

import UserAvatar from "../common/user-avatar";
import Preview from "../editor/preview";
import Votes from "../votes/votes";
import EditDeleteAction from "../user/edit-delete-action";

interface AnswerCardProps extends AnswerParams {
  showReadMore?: boolean;
  containerClassNames?: string;
  showActionBtns?: boolean;
}

export default function AnswerCard({
  _id,
  content,
  author: { _id: authorId, name, image },
  createdAt,
  showReadMore = false,
  containerClassNames,
  downVotes,
  question,
  upVotes,
  showActionBtns = false,
}: AnswerCardProps) {
  const hasVotedPromise = hasVoted({
    targetType: "answer",
    targetId: _id,
  });

  const firstName = name?.split(" ")[0] || "User";

  return (
    <article className={cn("light-border relative border-b py-10", containerClassNames)}>
      <span id={`answer-${_id}`} className="hash-span" />

      {showActionBtns && (
        <div className="absolute top-5 right-5">
          <EditDeleteAction type="answer" itemId={_id} />
        </div>
      )}

      <div className="mb-5 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex flex-1 items-start gap-1 sm:items-center">
          <UserAvatar
            id={authorId}
            name={name}
            imageUrl={image}
            classNames="size-5 rounded-full object-cover max-sm:mt-2"
          />

          <Link
            href={siteConfig.ROUTES.PROFILE(authorId)}
            className="flex flex-col max-sm:ml-1 sm:flex-row sm:items-center"
          >
            <p className="body-semibold text-dark300_light700">{firstName ?? "Anonymous"}</p>

            <p className="small-regular text-light400_light500 mt-0.5 ml-0.5 line-clamp-1">
              <span className="max-sm:hidden"> • </span>
              answered {getTimeStamp(createdAt)}
            </p>
          </Link>
        </div>

        <div className="flex justify-end">
          <Suspense fallback={<div className="flex-center h-8 w-20">Loading...</div>}>
            <Votes
              upVotes={upVotes}
              downVotes={downVotes}
              targetType="answer"
              targetId={_id}
              hasVotedPromise={hasVotedPromise}
            />
          </Suspense>
        </div>
      </div>

      <Preview content={content} />
      {showReadMore && (
        <Link
          href={`/questions/${question}#answer-${_id}`}
          className="body-semibold font-space-grotesk text-primary-500 relative z-10"
        >
          <p className="mt">Read More...</p>
        </Link>
      )}
    </article>
  );
}