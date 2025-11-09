"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";

const filters = [
  { name: "React", value: "react" },
  { name: "Next.js", value: "nextjs" },
  // { name: "Unanswered", value: "unanswered" },
  // { name: "Recommended", value: "recommended" },
];

export default function HomeFilter() {
  const searchParams = useSearchParams();
  const filterParams = searchParams.get("filter");
  const [activeFilter, setActiveFilter] = useState(filterParams || "");
  const router = useRouter();

  const handleFilterChange = (filter: string) => {
    let newUrl;
    if (filter === activeFilter) {
      setActiveFilter("");
      newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ["filter"],
      });
    } else {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: filter.toLowerCase(),
      });
      setActiveFilter(filter);
    }
    router.push(newUrl);
  };

  return (
    <div className="m-10 hidden flex-wrap gap-3 sm:flex">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          className={cn(
            "body-medium cursor-pointer rounded-lg px-4 py-3 capitalize shadow-none",
            filter.value === activeFilter
              ? "bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400"
              : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
          )}
          onClick={() => handleFilterChange(filter.value)}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
}
