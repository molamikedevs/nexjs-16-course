import { RouteParams } from "@/types/global";

export default async function QuestionDetails({ params }: RouteParams) {
    const {id }= await params

    return <div>Question Details Page - ID: {id}</div>;
}