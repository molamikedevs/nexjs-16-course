interface SignInWithOAuthParams {
  provider: "github" | "google";
  providerAccountId: string;
  user: {
    name: string;
    username: string;
    email: string;
    image: string;
  };
}

interface AuthCredentials {
  username: string;
  name: string;
  email: string;
  password: string;
}

interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
}

interface EditQuestionParams extends CreateQuestionParams {
  questionId: string;
}

interface GetQuestionsParams {
  questionId: string;
}


interface IncrementViewsParams {
  questionId: string;
}

interface CreateAnswerParams {
  questionId: string;
  content: string;
}