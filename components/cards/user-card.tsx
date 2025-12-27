import Link from "next/link";
import { siteConfig } from "@/config/site";
import { UserParams } from "@/types/global";
import UserAvatar from "../common/user-avatar";

export default function UserCard({ name, image, username, _id }: UserParams) {
  return (
    <div className="shadow-light100_darknone xs:w-[230px] w-full">
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <UserAvatar
          id={_id}
          name={name}
          imageUrl={image}
          classNames="size-[100px] rounded-full object-cover"
          fallBackClassName="text-3xl tracking-widest"
        />

        <Link href={siteConfig.ROUTES.PROFILE(_id)}>
          <div className="mt-4 text-center">
            <h3 className="h3-bold text-dark200_light900 line-clamp-1">{name}</h3>
            <p className="body-regular text-dark500_light500 mt-2">@{username}</p>
          </div>
        </Link>
      </article>
    </div>
  );
}
