import Link from "next/link";

import { getQuestions } from "@/lib/actions/question.action";
import { RouteParams } from "@/types/global";
import { EMPTY_QUESTION } from "@/constants/state";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

import QuestionCard from "@/components/cards/question-card";
import HomeFilter from "@/components/filters/home-filter";
import LocalSearch from "@/components/search/local-search";
import DataRenderer from "@/components/common/data-renderer";
import CommonFilter from "@/components/filters/common-filter";
import { HomePageFilters } from "@/constants/filters";

export const metadata = {
  title: "Home",
};

const Home = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });

  const { questions } = data || {};

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
          route={siteConfig.ROUTES.HOME}
          imgSrc="/icons/search.svg"
          placeholder="Search..."
          otherClasses="flex-1"
        />

        <CommonFilter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </section>
      <HomeFilter />
      <DataRenderer
        success={success}
        error={error}
        data={questions}
        empty={EMPTY_QUESTION}
        render={(questions) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        )}
      />
    </>
  );
};

export default Home;
