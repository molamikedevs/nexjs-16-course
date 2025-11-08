import { Input } from "../ui/input";
import LocalSearch from "./local-search";

export default function GlobalSearch() {
  return (
    <LocalSearch
      route="/"
      imgSrc="/icons/search.svg"
      placeholder="Search questions..."
      otherClasses="flex-1"
      iconPosition="left"
    />
  );
}