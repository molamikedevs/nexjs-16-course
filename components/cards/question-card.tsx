import Link from "next/link";

import { getTimeStamp } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { QuestionParams, TagParams } from "@/types/global";
import TagCard from "./tag-card";
import Metric from "../common/metric";
import EditDeleteAction from "../user/edit-delete-action";

interface Props {
  question: QuestionParams;
  showActionBtns?: boolean;
}

export default function QuestionCard({
  question: { _id, title, tags, author, upVotes, answers, views, createdAt },
  showActionBtns = false,
}: Props) {
  const firstName = author.name?.split(" ")[0] || "User";
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-center justify-between gap-5 sm:flex-row">
        <div className="flex-1">
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>

          <Link href={siteConfig.ROUTES.QUESTION(_id)}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">{title}</h3>
          </Link>
        </div>
        {showActionBtns && <EditDeleteAction type="question" itemId={_id} />}
      </div>

      <div className="mt-3.5 flex w-full flex-wrap gap-2">
        {tags?.map((tag: TagParams) => (
          <TagCard key={tag._id} _id={tag._id} name={tag.name} compact />
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.image}
          alt={firstName}
          value={firstName}
          title={`• asked ${getTimeStamp(createdAt)}`}
          href={siteConfig.ROUTES.PROFILE(author._id)}
          textStyles="body-medium text-dark400_light700"
          isAuthor
          titleStyles="max-sm:hidden"
        />

        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="/icons/like.svg"
            alt="like"
            value={upVotes}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/icons/message.svg"
            alt="answers"
            value={answers}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/icons/eye.svg"
            alt="views"
            value={views}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
}
