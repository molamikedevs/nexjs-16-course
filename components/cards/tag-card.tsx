import ROUTES from "@/constants/route";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { getDevIconClassName } from "@/lib/utils";

interface TagsProps {
  _id: string;
  name: string;
  showCount?: boolean;
  compact?: boolean;
  questions?: number;
}

export default function TagCard({ _id, name, showCount, compact, questions }: TagsProps) {
  const iconClass = getDevIconClassName(name);
  return (
    <Link href={ROUTES.TAG(_id)} className="flex cursor-pointer justify-between gap-2">
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
        <div className="flex-center space-x-2">
          <i className={iconClass}></i>
          <span>{name}</span>
        </div>
      </Badge>
      {showCount && <p className="small-medium text-dark500_light700">{questions}</p>}
    </Link>
  );
}
