"use client";

import Image from "next/image";

import { deleteQuestion } from "@/lib/actions/question.action";
import { deleteAnswer } from "@/lib/actions/answer.action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

interface Props {
  type: string;
  itemId: string;
}

export default function EditDeleteAction({ type, itemId }: Props) {
  const router = useRouter();

  const handleEdit = async () => {
    //Redirect to edit page
    router.push(`/questions/${itemId}/edit`);
  };;

  const handleDelete = async () => {
    if (type === "question") {
      await deleteQuestion({ questionId: itemId });
      toast.success("Question deleted successfully", {
        description: "Your question has been removed.",
      });
    } else if (type === "answer") {
      await deleteAnswer({ answerId: itemId });
      toast.success("Answer deleted successfully", {
        description: "Your answer has been removed.",
      });
    }
  };

  return (
    <div className={`flex items-center justify-end gap-3 max-sm:w-full ${type === "answer" && "justify-center gap-0"}`}>
      {type === "question" && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Image
              src="/icons/edit.svg"
              alt="edit"
              width={14}
              height={14}
              className="cursor-pointer object-contain"
              onClick={handleEdit}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-primary-500! text-light-800!">
            <p>Edit</p>
          </TooltipContent>
        </Tooltip>
      )}

      <AlertDialog>
        <AlertDialogTrigger className="cursor-pointer">
          <Tooltip>
            <TooltipTrigger asChild>
              <Image
                src="/icons/trash.svg"
                alt="delete"
                width={14}
                height={14}
                className="cursor-pointer object-contain"
              />
            </TooltipTrigger>
            <TooltipContent className="bg-primary-500! text-light-800!">
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </AlertDialogTrigger>
        <AlertDialogContent className="background-light800_dark300">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your{" "}
              {type === "question" ? "question" : "answer"} and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn">Cancel</AlertDialogCancel>
            <AlertDialogAction className="border-primary-100! bg-primary-500! text-light-800!" onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
