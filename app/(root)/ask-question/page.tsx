import QuestionForm from "@/components/forms/question-form";

export const metadata = {
  title: "Ask a Question",
};

export default function AskQuestionPage() {
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9">
        <QuestionForm />
      </div>
    </>
  );
}
