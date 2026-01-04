import Image from "next/image";

interface Props {
  imgUrl: string;
  value: number;
  title: string;
}

export default function StatsCard({ imgUrl, value, title }: Props) {
  return (
    <div className="light-border background-light900_dark300 shadow-light-300 dark:shadow-dark-200 flex min-h-[120px] items-center gap-5 rounded-xl border p-6">
      {/* Icon container */}
      <div className="bg-light-800 dark:bg-dark-400 flex h-22 w-18 items-center justify-center rounded-lg">
        <Image src={imgUrl} alt={`${title} icon`} width={42} height={42} />
      </div>

      {/* Text */}
      <div className="flex flex-col gap-1">
        <p className="text-dark200_light900 text-2xl font-bold">{value}</p>
        <p className="text-dark400_light700 text-sm font-medium">{title}</p>
      </div>
    </div>
  );
}
