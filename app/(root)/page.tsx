// import HomeFilter from "@/components/filters/home-filter";
import LocalSearch from "@/components/search/local-search";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/route";
import Link from "next/link";

export const metadata = {
  title: "Home",
};

const questions = [
  {
    id: "1",
    title: "How to learn Next.js?",
    description: "A comprehensive guide to learning Next.js.",
    tags: [
      { _id: "1", name: "Next.js" },
      { _id: "2", name: "React" },
    ],
    author: { _id: "1", name: "John Doe" },
    upVotes: 10,
    downVotes: 2,
    answers: 5,
    views: 150,
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "How to learn React?",
    description: "A comprehensive guide to learning React.",
    tags: [
      { _id: "1", name: "React" },
      { _id: "2", name: "JavaScript" },
    ],
    author: { _id: "1", name: "Kevin Smith" },
    upVotes: 12,
    downVotes: 3,
    answers: 7,
    views: 180,
    createdAt: new Date(),
  },
];

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

export default async function Home({ searchParams }: SearchParams) {
  const { query } = await searchParams;

  const filteredQuestions = query
    ? questions.filter((question) => question.title.toLowerCase().includes(query?.toLowerCase()))
    : questions;

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button className="primary-gradient text-light-900! min-h-[46px] px-4 py-3">
          <Link href={ROUTES.ASK_QUESTION}>Ask Question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          route="/"
          imgSrc="/icons/search.svg"
          placeholder="Search..."
          otherClasses="flex-1"
          iconPosition="left"
        />
      </section>
      {/* <HomeFilter /> */}
      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <h1 key={question.id}>{question.title}</h1>
        ))}
      </div>
    </>
  );
}
