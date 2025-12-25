"use client";


import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { toast } from "sonner";
import { AnswerSchema } from "@/lib/validation";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { createAnswer } from "@/lib/actions/answer.action";
import { api } from "@/lib/api";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

interface AnswerFormProps {
  questionId: string;
  questionTitle: string;
  questionContent: string;
}
interface AnswerFormProps {
  questionId: string;
  questionTitle: string;
  questionContent: string;
}

// 2. Create the AuthForm component
const AnswerForm = ({ questionId, questionTitle, questionContent }: AnswerFormProps) => {
  const [isAnswering, setIsAnsweringTransition] = useTransition();
  const [isAISubmitting, setIsAISubmitting] = useState(false);
  const editorRef = useRef<MDXEditorMethods>(null);
  const session = useSession();

  // 3. Initialize the form using react-hook-form and zodResolver
  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof AnswerSchema>) => {
    setIsAnsweringTransition(async () => {
      const result = await createAnswer({
        questionId,
        content: values.content,
      });

      if (result.success) {
        form.reset();

        toast.success("Answer submitted successfully!", {
          description: "Your answer has been posted.",
        });
        if (editorRef.current) {
          editorRef.current.setMarkdown("");
        }
      } else {
        toast.error("Failed to submit answer.", {
          description: result?.error?.message || "An error occurred while submitting your answer.",
        });
      }
    });
  };

  const handleAIGenerate = async () => {
    if (session.status !== "authenticated") {
      toast.error("You must be logged in to use AI generation.");
      return;
    }

    setIsAISubmitting(true);
    const userAnswer = editorRef.current?.getMarkdown() || "";

    try {
      const { success, data, error } = await api.ai.getAnswer(questionTitle, questionContent, userAnswer);
      if (!success) {
        toast.error("Failed to generate AI answer.", {
          description: error?.message || "An error occurred during AI generation.",
        });
        return;
      }

      const formattedData = data?.replace(/<br>/g, " ").toString().trim();
      if (editorRef.current && formattedData) {
        editorRef.current.setMarkdown(formattedData);
        form.setValue("content", formattedData || "");
        form.trigger("content");
      }

      toast.success("AI answer generated successfully!", {
        description: "The answer has been generated and filled in the editor.",
      });
    } catch (error) {
      toast.error("Failed to generate AI answer.", {
        description: error instanceof Error ? error.message : "An error occurred during AI generation.",
      });
    } finally {
      setIsAISubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">Write your answer here</h4>
        <Button
          className="btn light-border-2 text-primary-500 dark:text-primary-500 gap-1.5 rounded-md border px-4 py-2.5 shadow-none"
          disabled={isAISubmitting}
          onClick={handleAIGenerate}
        >
          {isAISubmitting ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              <span>Generating AI Answer...</span>
            </>
          ) : (
            <>
              <Image src="/icons/stars.svg" alt="AI icon" width={12} height={12} className="mr-2 object-contain" />
              Generate with AI
            </>
          )}
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex-full mt-6 flex flex-col gap-10">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <Editor value={field.value} editorRef={editorRef} fieldChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/** Submit Button */}
          <div className="mt-16 flex justify-end">
            <Button type="submit" disabled={isAnswering} className="primary-gradient w-fit">
              {isAnswering ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>Submit Answer</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AnswerForm;