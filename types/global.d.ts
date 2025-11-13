import { inter } from "@/config/font";
import { NextResponse } from "next/server";
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

// Standardized response type for API actions
type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

// Successful response type
type SuccessResponse<T = null> = ActionResponse<T> & { success: true };

// Error response type
type ErrorResponse = ActionResponse<undefined> & { success: false };

// Next.js specific response types
type APIErrorResponse = NextResponse<ErrorResponse>;

// Generic API response type
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;