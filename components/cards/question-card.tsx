import Link from "next/link";

import { getTimeStamp } from "@/lib/utils";
import { Question, Tag } from "@/types/global";
import { siteConfig } from "@/config/site";
import TagCard from "./tag-card";
import Metric from "../metric";

interface Props {
  question: Question;
}

export default function QuestionCard({ question }: Props) {
  const { _id, title, tags, author, upVotes, answers, views, createdAt } = question;

  return (
    <div className="card-wrapper rounded-[10px] p-9 shadow-sm sm:p-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div className="flex-1">
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <Link href={siteConfig.ROUTES.QUESTION(_id)}>
            <h2 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">{title}</h2>
          </Link>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-3 flex w-full flex-wrap gap-2">
        {tags.map((tag: Tag) => (
          <TagCard key={tag._id} _id={tag._id} name={tag.name} />
        ))}
      </div>

      {/* Metrics - Author */}
      <div className="mt-6 flex w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.image}
          alt={author.name}
          title={`• asked ${getTimeStamp(createdAt)}`}
          value={author.name}
          href={siteConfig.ROUTES.PROFILE(_id)}
          textStyles="body-medium text-dark400_light700"
          isAuthor
        />

        {/* Metrics - Other */}
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="/icons/like.svg"
            alt="like"
            title="Votes"
            value={upVotes}
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/icons/message.svg"
            alt="Answers"
            title="Answers"
            value={answers}
            textStyles="small-medium text-dark400_light800"
          />

          <Metric
            imgUrl="/icons/eye.svg"
            alt="Views"
            title="Views"
            value={views}
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
}
