import TagCard from "@/components/cards/tag-card";
import DataRenderer from "@/components/common/data-renderer";
import DataRender from "@/components/common/data-renderer";
import LocalSearch from "@/components/search/local-search";
import { siteConfig } from "@/config/site";
import { EMPTY_TAGS } from "@/constants/state";
import { getTags } from "@/lib/actions/tag.actions";
import { RouteParams } from "@/types/global";

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
      <section className="mt-11">
        {/* Search tags */}
        <LocalSearch
          route={siteConfig.ROUTES.TAGS}
          imgSrc="/icons/search.svg"
          placeholder="Search tags..."
          otherClasses="flex-1"
        />
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
