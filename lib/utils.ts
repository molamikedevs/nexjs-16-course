import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
    ai: "devicon-artificialintelligence-plain",
    artificialintelligence: "devicon-artificialintelligence-plain",
  };

  return `${techMap[normalizedTechName] || `devicon-${normalizedTechName}-plain`} colored`;
}

export function getTechDescription(techName: string): string {
  const normalizedTech = techName.replace(/[ .]/g, "").toLowerCase();

  // Mapping technology names to descriptions
  const techDescriptionMap: { [key: string]: string } = {
    javascript: "JavaScript is a powerful language for building dynamic, interactive, and modern web applications.",
    typescript:
      "TypeScript adds strong typing to JavaScript, making it great for scalable and maintainable applications.",
    react: "React is a popular library for building fast, component-based user interfaces and web applications.",
    nextjs: "Next.js is a React framework for building fast, SEO-friendly, and production-grade web applications.",
    nodejs: "Node.js is a runtime for building fast and scalable server-side applications using JavaScript.",
    python: "Python is a beginner-friendly language known for its versatility and simplicity in various fields.",
    java: "Java is a versatile, cross-platform language widely used in enterprise and Android development.",
    "c++": "C++ is a high-performance language ideal for system programming, games, and large-scale applications.",
    git: "Git is a version control system that helps developers track changes and collaborate on code efficiently.",
    docker: "Docker simplifies app deployment by containerizing environments, ensuring consistency across platforms.",
    mongodb: "MongoDB is a flexible NoSQL database ideal for handling unstructured data and scalable applications.",
    mysql:
      "MySQL is a popular open-source relational database management system known for its stability and performance.",
    postgresql: "PostgreSQL is a powerful open-source SQL database known for its scalability and robustness.",
    aws: "Amazon Web Services (AWS) is a cloud computing platform that offers a wide range of services for building, deploying, and managing web and mobile applications.",
  };

  return (
    techDescriptionMap[normalizedTech] ||
    `${techName} is a technology or tool widely used in software development, providing valuable features and capabilities.`
  );
}
