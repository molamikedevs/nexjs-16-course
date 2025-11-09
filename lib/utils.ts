import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTimeStamp = (date: Date) => {
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const interval in intervals) {
    const intervalSeconds = intervals[interval];
    const count = Math.floor(secondsAgo / intervalSeconds);

    if (count >= 1) {
      return `${count} ${interval}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};



export function getDevIconClassName(techName: string) {
  const normalizedTechName = techName.replace(/[. ]/g, "").toLowerCase();

  const techMap: { [key: string]: string } = {
    javaScript: "devicon-javascript-plain",
    js: "devicon-javascript-plain",
    typeScript: "devicon-typescript-plain",
    ts: "devicon-typescript-plain",
    react: "devicon-react-original",
    reactjs: "devicon-react-original",
    nextjs: "devicon-nextjs-plain",
    next: "devicon-nextjs-plain",
    nodejs: "devicon-nodejs-plain",
    node: "devicon-nodejs-plain",
    bun: "devicon-bun-plain",
    bunjs: "devicon-bun-plain",
    deno: "devicon-denojs-original",
    denojs: "devicon-denojs-plain",
    python: "devicon-python-plain",
    java: "devicon-java-plain",
    cpp: "devicon-cplusplus-plain",
    cplusplus: "devicon-cplusplus-plain",
    csharp: "devicon-csharp-plain",
    php: "devicon-php-plain",
    html: "devicon-html5-plain",
    html5: "devicon-html5-plain",
    css: "devicon-css3-plain",
    css3: "devicon-css3-plain",
    git: "devicon-git-plain",
    docker: "devicon-docker-plain",
    mongodb: "devicon-mongodb-plain",
    mongo: "devicon-mongodb-plain",
    mysql: "devicon-mysql-plain",
    postgresql: "devicon-postgresql-plain",
    postgres: "devicon-postgresql-plain",
    aws: "devicon-amazonwebservices-original",
    amazonwebservices: "devicon-amazonwebservices-original",
    tailwind: "devicon-tailwindcss-original",
    tailwindcss: "devicon-tailwindcss-original",
  };

  return `${techMap[normalizedTechName] || `devicon-${normalizedTechName}-plain`} colored`;
}
