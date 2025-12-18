import { inter } from "@/config/font";
import { NextResponse } from "next/server";
import { int } from "zod";

interface TagParams {
  _id: string;
  name: string;
}

interface Author {
  _id: string;
  name: string;
  image: string;
}

interface QuestionParams {
  _id: string;
  title: string;
  content: string;
  tags: TagParams[];
  author: Author;
  createdAt: Date;
  upVotes: number;
  downVotes: number;
  answers: number;
  views: number;
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

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface PaginationSearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string;
}

interface RenderProps<TItem> {
  success: boolean;
  error?: {
    message?: string;
    details?: Record<string, string[]>;
  };
  data: TItem[] | null | undefined;
  empty: {
    title: string;
    message: string;
    button?: {
      text: string;
      href: string;
    };
  };
  render: (data: TItem[]) => React.ReactNode;
}

interface StateSkeletonProps {
  image: {
    light: string;
    dark: string;
    alt: string;
  };
  title: string;
  message: string;
  button?: {
    text: string;
    href: string;
  };
}