import { siteConfig } from "@/config/site";
import { EMPTY_USERS } from "@/constants/state";
import { getUsers } from "@/lib/actions/user.action";
import { RouteParams } from "@/types/global";

import UserCard from "@/components/cards/user-card";
import DataRenderer from "@/components/common/data-renderer";
import LocalSearch from "@/components/search/local-search";

export default async function CommunityPage({ searchParams }: RouteParams) {
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getUsers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });

  const { users } = data || {};

  return (
    <>
      <h1 className="h1-bold text-dark400_light900">All Users</h1>
      <div className="mt-11">
        <LocalSearch
          route={siteConfig.ROUTES.COMMUNITY}
          imgSrc="/icons/search.svg"
          placeholder="There are some awesome developers here. Find them!"
          otherClasses="flex-1"
        />
      </div>

      <DataRenderer
        success={success}
        error={error}
        data={users}
        empty={EMPTY_USERS}
        render={(users) => (
          <div className="mt-10 flex flex-wrap gap-4">
            {users.map((user) => (
              <UserCard key={user._id} {...user} />
            ))}
          </div>
        )}
      />
    </>
  );
}
