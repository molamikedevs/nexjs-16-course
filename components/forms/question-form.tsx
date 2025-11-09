'use client';

import { AskQuestionSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { use, useRef } from "react";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";

// This is the only place InitializedMDXEditor is imported directly.
const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false
})

export default function QuestionForm() {
  const editorRef = useRef<MDXEditorMethods>(null);
    const form = useForm({
        resolver: zodResolver(AskQuestionSchema),
        defaultValues: {
            title: "",
            content: "",
            tags: [],
        },
    });

    const handleCreateQuestion = async (data: any) => {
        console.log(data);
    }                               


  return  <Form {...form}>
    <form className="flex w-full flex-col gap-10" onSubmit={form.handleSubmit(handleCreateQuestion)}>
        {/** Title Field */}
        <FormField
            control={form.control}
            name='title'
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
                <FormDescription className="mt-2.5 body-regular text-light-500">
                    Be specific and imagine you’re asking a question to another person.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/** Content Field */}
          <FormField
            control={form.control}
            name='content'
            render={({ field: formField }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                    Detailed explanation of your question <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  {/* Editor Component */}
                  <Editor editorRef={editorRef} value={formField.value} fieldChange={formField.onChange} />
                </FormControl>
                <FormDescription className="mt-2.5 body-regular text-light-500">
                    Introduce the problem and expand on what you put in the title.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/** Tags Field */}
          <FormField
            control={form.control}
            name='tags'
            render={({ field: formField }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                    Question Tags <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <div>
                    <Input
                    {...formField}
                    placeholder="Add tags..."
                    className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus rounded-1.5 min-h-14 border"
                  />
                  Tags
                  </div>
                </FormControl>
                <FormDescription className="mt-2.5 body-regular text-light-500">
                    Add up to 5 tags to describe what your question is about. You need to press enter to add a tag.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/** Submit Button */}
          <div className="mt-16 flex justify-end">
            <Button
              type="submit"
              className="primary-gradient rounded-2 text-light-900! w-full"
            >
              Post Your Question
            </Button>
          </div>
    </form>
  </Form>;
}