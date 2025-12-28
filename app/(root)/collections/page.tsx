import { getSavedQuestions } from "@/lib/actions/collection.action";
import { RouteParams } from "@/types/global";
import { EMPTY_COLLECTIONS } from "@/constants/state";
import { siteConfig } from "@/config/site";

import QuestionCard from "@/components/cards/question-card";
import LocalSearch from "@/components/search/local-search";
import DataRenderer from "@/components/common/data-renderer";

export const metadata = {
  title: "Collections",
};

const Collections = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getSavedQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  const { collections } = data || {};
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={siteConfig.ROUTES.COLLECTION}
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
      </div>

      <DataRenderer
        success={success}
        error={error}
        data={collections}
        empty={EMPTY_COLLECTIONS}
        render={(collections) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {collections.map((collection) => (
              <QuestionCard key={collection._id} question={collection.question} />
            ))}
          </div>
        )}
      />
    </>
  );
};

export default Collections;
