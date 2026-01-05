import Link from "next/link";
import dayjs from "dayjs";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getUser, getUserAnswers, getUserQuestions, getUserTags } from "@/lib/actions/user.action";
import { RouteParams } from "@/types/global";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EMPTY_ANSWERS, EMPTY_QUESTION, EMPTY_TAGS } from "@/constants/state";

import DataRenderer from "@/components/common/data-renderer";
import Stats from "@/components/user/stats";
import UserAvatar from "@/components/common/user-avatar";
import ProfileLink from "@/components/user/profile-link";
import QuestionCard from "@/components/cards/question-card";
import Pagination from "@/components/common/pagination";
import AnswerCard from "@/components/cards/answer-card";
import TagCard from "@/components/cards/tag-card";

export default async function Profile({ params, searchParams }: RouteParams) {
  const { id } = await params;
  const { page, pageSize } = await searchParams;
  if (!id) notFound();

  // Fetch logged in user ID
  const loggedUserId = await auth();
  const { success, data, error } = await getUser({ userId: id });

  if (!success) return <div className="h1-bold text-dark100_light900">{error?.message}</div>;

  // Fetch user questions
  const {
    success: dataSuccess,
    data: questionsData,
    error: questionsError,
  } = await getUserQuestions({
    userId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
  });

  // Extract data
  const { questions, isNext: hasMoreQuestions } = questionsData!;

  // Fetch user answers
  const {
    data: answersData,
    success: answersSuccess,
    error: answersError,
  } = await getUserAnswers({
    userId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
  });

  // Extract data
  const { answers, isNext: hasMoreAnswers } = answersData!;

  // Fetch user answers
  const { data: tagsData, success: tagsSuccess, error: tagsError } = await getUserTags({ userId: id });

  // Extract data
  const { tags } = tagsData!;

  // Get user details
  const {
    user: { _id, name, image, bio, location, portfolioUrl, username, createdAt },
    totalQuestions,
    totalAnswers,
  } = data!;

  // Get first name
  const firstName = name.split(" ")[0];

  return (
    <>
      <section className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          {/* User Avatar */}
          <UserAvatar
            id={_id}
            name={name}
            imageUrl={image}
            classNames="size-[140px] rounded-full object-cover"
            fallBackClassName="text-6xl font-bolder"
          />
          <div className="mt-3 ml-3">
            <h2 className="h2-bold text-dark100_light900">{firstName}</h2>
            <p className="paragraph-regular text-dark200_light800">@{username}</p>
            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {portfolioUrl && <ProfileLink imgUrl="/icons/link.svg" href={portfolioUrl} title="Portfolio" />}
              {location && <ProfileLink imgUrl="/icons/location.svg" title={location} />}
              <ProfileLink imgUrl="/icons/calendar.svg" title={dayjs(createdAt).format("MMMM YYYY")} />
            </div>
            {bio && <p className="paragraph-regular text-dark400_light800 mt-8">{bio}</p>}
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          {loggedUserId?.user?.id === id && (
            <Link href="/profile/edit">
              <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-10 min-w-40 cursor-pointer">
                Edit Profile
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* User Stats */}
      <Stats totalQuestions={totalQuestions} totalAnswers={totalAnswers} badges={{ gold: 0, silver: 0, bronze: 0 }} />

      {/* User Questions and Answers */}
      <section className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-2">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          {/* Top Posts */}
          <TabsContent value="top-posts" className="mt-5 flex flex-col gap-6">
            <DataRenderer
              success={dataSuccess}
              error={questionsError}
              data={questions}
              empty={EMPTY_QUESTION}
              render={(questions) => (
                <div className="flex w-full flex-col gap-6">
                  {questions.map((question) => (
                    <QuestionCard key={question._id} question={question} />
                  ))}
                </div>
              )}
            />
            {!questions && <Pagination page={page} isNext={hasMoreQuestions} />}
          </TabsContent>
          {/* Answers */}
          <TabsContent value="answers" className="flex flex-col gap-6">
            <DataRenderer
              success={answersSuccess}
              error={answersError}
              data={answers}
              empty={EMPTY_ANSWERS}
              render={(answers) => (
                <div className="flex w-full flex-col gap-6">
                  {answers.map((answer) => (
                    <AnswerCard
                      key={answer._id}
                      {...answer}
                      content={answer.content.slice(0, 27)}
                      containerClassNames="card-wrapper rounded-[10px] px-7 py-9 sm:px-11"
                      showReadMore
                    />
                  ))}
                </div>
              )}
            />
            {!answers && <Pagination page={page} isNext={hasMoreAnswers} />}
          </TabsContent>
        </Tabs>

        {/* Top Tech Tags */}
        <div className="flex w-full min-w-[250px] flex-1 flex-col max-lg:hidden">
          <h3 className="h3-bold text-dark200_light900">Top Tech</h3>
          <div className="mt-7 flex flex-col gap-4">
            <DataRenderer
              success={tagsSuccess}
              error={tagsError}
              data={tags}
              empty={EMPTY_TAGS}
              render={(tags) => (
                <div className="flex w-full flex-col gap-6">
                  {tags.map((tag) => (
                    <TagCard key={tag._id} {...tag} />
                  ))}
                </div>
              )}
            />
          </div>
        </div>
      </section>
    </>
  );
}
