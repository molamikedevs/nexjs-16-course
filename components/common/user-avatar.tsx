import { siteConfig } from '@/config/site'
import Link from 'next/link'
import React from 'react'
import { Avatar, AvatarFallback } from '../ui/avatar'
import Image from 'next/image'
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  name: string;
  classNames?: string;
  imageUrl?: string | null;
  fallBackClassName?: string;
}

const UserAvatar = ({ id, name, imageUrl, classNames = "h-9 w-9", fallBackClassName }: Props) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <Link href={siteConfig.ROUTES.PROFILE(id)}>
      <Avatar className={cn("relative", classNames)}>
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="rounded-full" />
        ) : (
          <AvatarFallback
            className={`${fallBackClassName} primary-gradient font-space-grotesk font-bold tracking-wider text-white`}
          >
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
};

export default UserAvatar
