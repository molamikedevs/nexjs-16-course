import { ActionResponse, AnswerParams } from "@/types/global";
import { EMPTY_ANSWERS } from "@/constants/state";
import DataRenderer from "../common/data-renderer";
import AnswerCard from "../cards/answer-card";

interface AllAnswersProps extends ActionResponse<AnswerParams[]> {
  totalAnswers: number;
}

export default function AllAnswers({ data, success, error, totalAnswers }: AllAnswersProps) {
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">
          {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
        </h3>
      </div>

      <DataRenderer
        data={data}
        success={success}
        error={error}
        empty={EMPTY_ANSWERS}
        render={(answers) => answers.map((answer) => <AnswerCard key={answer._id} {...answer} />)}
      />
    </div>
  );
}
