import { formatNumber } from "@/lib/utils";
import { BadgeCounts } from "@/types/global";
import StatsCard from "../cards/starts-card";

interface Props {
  badges: BadgeCounts;
  totalQuestions: number;
  totalAnswers: number;
}

export default function Stats({ totalQuestions, totalAnswers, badges }: Props) {
  return (
    <div className="mt-10">
      <div className="xs:grid-cols-2 mt-5 grid grid-cols-1 gap-5 md:grid-cols-4">
        <div className="light-border background-light900_dark300 shadow-light-300 dark:shadow-dark-200 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6">
          <div>
            <p className="paragraph-semibold text-dark200_light900">{formatNumber(totalQuestions)}</p>
            <p className="body-medium text-dark400_light700">Questions</p>
          </div>

          <div>
            <p className="paragraph-semibold text-dark200_light900">{formatNumber(totalAnswers)}</p>
            <p className="body-medium text-dark400_light700">Answers</p>
          </div>
        </div>

        <StatsCard imgUrl="/icons/gold-medal.svg" value={badges.gold} title="Gold Badges" />

        <StatsCard imgUrl="/icons/silver-medal.svg" value={badges.silver} title="Silver Badges" />

        <StatsCard imgUrl="/icons/bronze-medal.svg" value={badges.bronze} title="Bronze Badges" />
      </div>
    </div>
  );
}
