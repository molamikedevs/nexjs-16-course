import { siteConfig } from "@/config/site";
import { EMPTY_TAGS } from "@/constants/state";
import { getTags } from "@/lib/actions/tag.action";
import { RouteParams } from "@/types/global";

import TagCard from "@/components/cards/tag-card";
import DataRenderer from "@/components/common/data-renderer";
import LocalSearch from "@/components/search/local-search";
import CommonFilter from "@/components/filters/common-filter";
import { TagFilters } from "@/constants/filters";

export const metadata = {
  title: "Tags",
};

export default async function TagsPage({ searchParams }: RouteParams) {
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getTags({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });

  const { tags } = data || {};

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 text-3xl">Tags</h1>
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        {/* Search tags */}
        <LocalSearch
          route={siteConfig.ROUTES.TAGS}
          imgSrc="/icons/search.svg"
          placeholder="Search tags..."
          otherClasses="flex-1"
        />

        <CommonFilter filters={TagFilters} otherClasses="min-h-[56px] sm:min-w-[170px]" />
      </section>

      <DataRenderer
        success={success}
        error={error}
        data={tags}
        empty={EMPTY_TAGS}
        render={(tags) => (
          <div className="mt-10 flex w-full flex-wrap gap-4">
            {tags.map((tag) => (
              <TagCard key={tag._id} {...tag} />
            ))}
          </div>
        )}
      />
    </>
  );
}
