import QuestionCard from "@/components/cards/question-card";
import HomeFilter from "@/components/filters/home-filter";
import LocalSearch from "@/components/search/local-search";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { api } from "@/lib/api";
import handleError from "@/lib/handlers/error";
import Link from "next/link";

export const metadata = {
  title: "Home",
};

const questions = [
  {
    _id: "1",
    title: "How to learn Next.js?",
    description: "A comprehensive guide to learning Next.js.",
    tags: [{ _id: "1", name: "Next.js" }],
    author: {
      _id: "1",
      name: "Juliet Jones",
      image: "https://t4.ftcdn.net/jpg/11/66/06/77/360_F_1166067709_2SooAuPWXp20XkGev7oOT7nuK1VThCsN.jpg",
    },
    upVotes: 10,
    downVotes: 2,
    answers: 5,
    views: 150,
    createdAt: new Date(),
  },
  {
    _id: "2",
    title: "How to learn React?",
    description: "A comprehensive guide to learning React.",
    tags: [{ _id: "1", name: "React" }],
    author: {
      _id: "1",
      name: "Kevin Smith",
      image:
        "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png",
    },
    upVotes: 12,
    downVotes: 3,
    answers: 7,
    views: 180,
    createdAt: new Date("2024-06-20"),
  },
];

// const test = async () => {
//   try {
//     return await api.users.getAll();
//   } catch (error) {
//     return handleError(error);
//   }
// };

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

export default async function Home({ searchParams }: SearchParams) {
  const { query = "", filter = "" } = await searchParams;

  // const users = await test();
  // console.log("Users:", users);

  const filteredQuestions = questions.filter((question) => {
    const matchesQuery = question.title.toLowerCase().includes(query.toLowerCase());

    let matchesFilter = true;

    if (filter === "react") {
      matchesFilter = question.tags.some((tag) => tag.name === "React");
    } else if (filter === "nextjs") {
      matchesFilter = question.tags.some((tag) => tag.name === "Next.js");
    } else {
      matchesFilter = question.views >= 100;
    }

    return matchesQuery && matchesFilter;
  });

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button className="primary-gradient text-light-900! min-h-[46px] px-4 py-3">
          <Link href={siteConfig.ROUTES.ASK_QUESTION}>Ask Question</Link>
        </Button>
      </section>
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/"
          imgSrc="/icons/search.svg"
          placeholder="Search..."
          otherClasses="flex-1"
          iconPosition="left"
        />
      </section>
      <HomeFilter />
      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <QuestionCard key={question._id} question={question} />
        ))}
      </div>
    </>
  );
}
