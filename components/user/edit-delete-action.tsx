'use client';

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
} from "@/components/ui/alert-dialog"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


interface Props {
  type: string
  itemId: string;
}

export default function EditDeleteAction({type, itemId}: Props) {
    const router = useRouter();


    const handleEdit = async () => {
        // Implement edit functionality here
        router.push(`/questions/${itemId}/edit`);
    }

     const handleDelete = async () => {
        if (type === "question") {
            // Implement question delete functionality here

            toast.success("Question deleted successfully", {
                description: "Your question has been removed."
            });
        } else if (type === "answer") {
            // Implement answer delete functionality here
            toast.success("Answer deleted successfully", {
                description: "Your answer has been removed.",
            });
        }
    }


  return <div className={`flex items-center justify-end gap-3 max-sm:w-full ${type === "answer" && "gap-0 justify-center"}`}>
    {
        type === "question" && (
            <Image
                src="/icons/edit.svg"
                alt="edit"
                width={14}
                height={14}
                className="cursor-pointer object-contain"
                onClick={handleEdit} 
            />
        )
    }

    <AlertDialog>
  <AlertDialogTrigger className="cursor-pointer">
    <Image
        src="/icons/trash.svg"
        alt="delete"
        width={14}
        height={14}
        className="cursor-pointer object-contain"
    />
  </AlertDialogTrigger>
  <AlertDialogContent className="background-light800_dark300">
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your {type === "question" ? "question" : "answer"} and remove it from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel className="btn">Cancel</AlertDialogCancel>
      <AlertDialogAction className="border-primary-100! bg-primary-500! text-light-800!" onClick={handleDelete}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
  </div>;
}