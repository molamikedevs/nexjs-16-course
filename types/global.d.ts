import { inter } from "@/config/font";
import { int } from "zod";

interface Tag {
  _id: string;
  name: string;
}

interface Author {
  _id: string;
  name: string;
  image: string;
}



export interface Question {
  _id: string;
  title: string;
  description: string;
  tags: Tag[];
  author: Author;
  upVotes: number;
  downVotes: number;
  answers: number;
  views: number;
  createdAt: Date;
}
