import { auth } from "@/auth";
import QuestionForm from "@/components/forms/question-form";
import { siteConfig } from "@/config/site";
import { getQuestion } from "@/lib/actions/question.action";
import { RouteParams } from "@/types/global";
import { notFound, redirect } from "next/navigation";

export const metadata = {
  title: "Edit Question",
};

export default async function EditQuestionPage({ params }: RouteParams) {
  const { id } = await params;
  if (!id) return notFound();

  const session = await auth();
  if (!session) return redirect("/sign-in");

  const { data: question, success } = await getQuestion({ questionId: id });
  if (!success) return notFound();

  if (question?.author._id.toString() !== session?.user?.id) return redirect(siteConfig.ROUTES.QUESTION(id));
  return (
    <main className="mt-9">
      <QuestionForm question={question} isEdit />
    </main>
  );
}
