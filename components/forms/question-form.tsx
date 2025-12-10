"use client";

import z from "zod";
import dynamic from "next/dynamic";
import { useRef, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { AskQuestionSchema } from "@/lib/validation";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import TagCard from "../cards/tag-card";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Spinner } from "../ui/spinner";
import { QuestionParams } from "@/types/global";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

interface params {
  question?: QuestionParams;
  isEdit?: boolean;
}

export default function QuestionForm({ question, isEdit = false }: params) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const editorRef = useRef<MDXEditorMethods>(null);
  const form = useForm({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: question?.title || "",
      content: question?.content || "",
      tags: question?.tags.map((tag) => tag.name) || [],
    },
  });

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: { value: string[] }) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tagInput = e.currentTarget.value.trim();

      if (tagInput && tagInput.length < 15 && !field.value.includes(tagInput)) {
        form.setValue("tags", [...field.value, tagInput]);
        e.currentTarget.value = "";
        form.clearErrors("tags");
      } else if (tagInput.length > 15) {
        form.setError("tags", {
          type: "manual",
          message: "Tag should be less than 15 characters",
        });
      } else if (field.value.includes(tagInput)) {
        form.setError("tags", {
          type: "manual",
          message: "Tag already exists",
        });
      }
    }
  };

  const handleTagRemove = (tag: string, field: { value: string[] }) => {
    const newTags = field.value.filter((t) => t !== tag);

    form.setValue("tags", newTags);

    if (newTags.length === 0) {
      form.setError("tags", {
        type: "manual",
        message: "Tags are required",
      });
    }
  };

  const handleCreateQuestion = async (data: z.infer<typeof AskQuestionSchema>) => {
    startTransition(async () => {
      // Edit existing question
      if (isEdit && question) {
        const result = await editQuestion({ questionId: question?._id, ...data });
        if (result.success) {
          toast("Question updated successfully!", {
            description: "Your question has been posted.",
          });
          if (result.data) router.push(siteConfig.ROUTES.QUESTION(result.data._id.toString()));
        } else {
          toast("Failed to update question.", {
            description: result.error?.message || "Please try again later.",
          });
        }
        return;
      }

      // Create new question
      const result = await createQuestion(data);
      if (result.success) {
        toast("Question created successfully!", {
          description: "Your question has been posted.",
        });
        if (result.data) router.push(siteConfig.ROUTES.QUESTION(result.data._id.toString()));
      } else {
        toast("Failed to create question.", {
          description: result.error?.message || "Please try again later.",
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form className="flex w-full flex-col gap-10" onSubmit={form.handleSubmit(handleCreateQuestion)}>
        {/** Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field: formField }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>

              <FormControl>
                <Input
                  {...formField}
                  className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus rounded-1.5 min-h-14 border"
                />
              </FormControl>
              <FormDescription className="body-regular text-light-500 mt-2.5">
                Be specific and imagine you’re asking a question to another person.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/** Content Field */}
        <FormField
          control={form.control}
          name="content"
          render={({ field: formField }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed explanation of your question <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                {/* Editor Component */}
                <Editor editorRef={editorRef} value={formField.value} fieldChange={formField.onChange} />
              </FormControl>
              <FormDescription className="body-regular text-light-500 mt-2.5">
                Introduce the problem and expand on what you put in the title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/** Tags Field */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field: formField }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <div>
                  <Input
                    placeholder="Add tags..."
                    onKeyDown={(e) => handleInputKeyDown(e, formField)}
                    className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus rounded-1.5 min-h-14 border"
                  />
                  {formField.value.length > 0 && (
                    <div className="flex-start mt-2.5 flex-wrap gap-2.5">
                      {formField?.value?.map((tag: string) => (
                        <TagCard
                          key={tag}
                          _id={tag}
                          name={tag}
                          compact
                          remove
                          isButton
                          handleRemove={() => handleTagRemove(tag, formField)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription className="body-regular text-light-500 mt-2.5">
                Add up to 5 tags to describe what your question is about. You need to press enter to add a tag.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/** Submit Button */}
        <div className="mt-16 flex justify-end">
          <Button type="submit" disabled={isPending} className="primary-gradient rounded-2 text-light-900! w-full">
            {isPending ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                <span>Submitting...</span>
              </>
            ) : (
              <>{isEdit ? "Edit Question" : "Ask A Question"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
