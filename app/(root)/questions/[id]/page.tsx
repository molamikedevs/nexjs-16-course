import Link from "next/link";
import { after } from "next/server";
import { siteConfig } from "@/config/site";
import { getQuestion, incrementViews } from "@/lib/actions/question.action";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import { RouteParams, TagParams } from "@/types/global";
import { redirect } from "next/navigation";

import TagCard from "@/components/cards/tag-card";
import Metric from "@/components/common/metric";
import UserAvatar from "@/components/common/user-avatar";
import Preview from "@/components/editor/preview";
import AnswerForm from "@/components/forms/answer-form";

export default async function QuestionDetails({ params }: RouteParams) {
  const { id } = await params;
  const { success, data: question } = await getQuestion({ questionId: id });

  // Using after to increment views is a good choice here because
  //  it allows the main content to load without
  // waiting for the view increment operation to complete.
  after(async () => {
    await incrementViews({ questionId: id });
  });

  if (!success || !question) return redirect("/404");
  const { author, createdAt, content, title, views, answers, tags } = question;

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1">
            <UserAvatar
              id={author._id}
              name={author.name}
              imageUrl={author.image}
              classNames="size-[22px]"
              fallBackClassName="text-[10px]"
            />
            <Link href={siteConfig.ROUTES.PROFILE(author._id)}>
              <p className="paragraph-semibold text-dark300_light700">{author.name}</p>
            </Link>
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">{title}</h2>
      </div>

      <div className="mt-5 mb-8 flex flex-wrap gap-4">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimeStamp(new Date(createdAt))}`}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="message icon"
          value={answers}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/eye.svg"
          alt="eye icon"
          value={formatNumber(views)}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
      </div>

      <Preview content={content} />
      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag: TagParams) => (
          <TagCard key={tag._id} _id={tag._id as string} name={tag.name} compact />
        ))}
      </div>

      <section className="my-5">
        <AnswerForm questionId={question._id} />
      </section>
    </>
  );
}
