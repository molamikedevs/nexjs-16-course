import { getTags } from "@/lib/actions/tag.actions";

export default async function TagsPage() {
  const { success, data, error } = await getTags({
    page: 1,
    pageSize: 10,
    query: "javascript",
    // filter: "popular",
  });

  const { tags } = data || {};
  console.log(tags);
  return <div>Tags</div>;
}
