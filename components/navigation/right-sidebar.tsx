import Image from "next/image";
import Link from "next/link";
import TagCard from "../cards/tag-card";
import { siteConfig } from "@/config/site";

const hotQuestions = [
  { _id: "1", title: "How to optimize Next.js performance?" },
  { _id: "2", title: "What is the best way to manage state in React?" },
  { _id: "3", title: "How to implement authentication in Next.js?" },
  { _id: "4", title: "What are the new features in Next.js 13?" },
  { _id: "5", title: "How to deploy a Next.js app to Vercel?" },
];

const popularTags = [
  { _id: "1", name: "Next.js", questions: 1200, showCount: true, compact: false },
  { _id: "2", name: "React", questions: 950, showCount: true, compact: false },
  { _id: "3", name: "JavaScript", questions: 800, showCount: true, compact: false },
  { _id: "4", name: "Python", questions: 600, showCount: true, compact: false },
  { _id: "5", name: "Django", questions: 400, showCount: true, compact: false },
  { _id: "6", name: "CSS", questions: 400, showCount: true, compact: false },
];

export default function RightSidebar() {
  return (
    <section className="custom-scrollbar background-light900_dark200 light-border shadow-light-300 sticky top-0 right-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 pt-36 max-xl:hidden dark:shadow-none">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map(({ _id, title }) => (
            <Link
              href={siteConfig.ROUTES.QUESTION(_id)}
              key={_id}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark400_light700">{title}</p>

              <Image
                src="/icons/chevron-right.svg"
                alt="Arrow right"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map(({ _id, name, questions, showCount, compact }) => (
            <TagCard key={_id} _id={_id} name={name} questions={questions} showCount={showCount} compact={compact} />
          ))}
        </div>
      </div>
    </section>
  );
}
