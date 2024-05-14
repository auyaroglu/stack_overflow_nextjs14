import QuestionCard from "@/components/cards/QuestionCard"
import Filter from "@/components/shared/Filter"
import NoResult from "@/components/shared/NoResult"
import HomeFilters from "@/components/shared/home/HomeFilters"
import LocalSearchbar from "@/components/shared/search/LocalSearchbar"
import { Button } from "@/components/ui/button"
import { HomePageFilters } from "@/constants/filters"
import Link from "next/link"
import React from "react"

const questions = [
    {
        _id: "1",
        title: "How to use TypeScript with React?",
        tags: [
            { _id: "1", name: "TypeScript" },
            { _id: "2", name: "React" }
        ],
        author: {
            _id: "123",
            name: "John Doe",
            picture: "john-doe.jpg"
        },
        upvotes: 1500000,
        views: 500362,
        answers: [],
        createdAt: new Date('2024-05-14T12:00:00.000Z')
    },
    {
        _id: "2",
        title: "What are the benefits of using Tailwind CSS?",
        tags: [
            { _id: "3", name: "CSS" },
            { _id: "4", name: "Tailwind" }
        ],
        author: {
            _id: "456",
            name: "Jane Smith",
            picture: "jane-smith.jpg"
        },
        upvotes: 15,
        views: 150,
        answers: [],
        createdAt: new Date('2021-08-15T09:30:00.000Z')
    },
];

const Home = () => {
    return (
        <>
            <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="h1-bold text-dark100_light900">
                    All Questions
                </h1>

                <Link
                    href="/ask-question"
                    className="flex justify-end max-sm:w-full"
                >
                    <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
                        Ask a Question
                    </Button>
                </Link>
            </div>

            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearchbar
                    route="/"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.svg"
                    placeholder="Search for questions"
                    otherClasses="flex-1"
                />

                <Filter
                    filters={HomePageFilters}
                    otherClasses="min-h-[56px] sm:min-w-[170px]"
                    containerClasses="hidden max-md:flex"
                />
            </div>

            <HomeFilters />

            <div className="mt-10 flex w-full flex-col gap-6">
                {questions.length > 0 ?
                    questions.map((question) => (
                        <QuestionCard
                            key={question._id}
                            _id={question._id}
                            title={question.title}
                            tags={question.tags}
                            author={question.author}
                            upvotes={question.upvotes}
                            views={question.views}
                            answers={question.answers}
                            createdAt={question.createdAt}
                        />
                    ))
                    : <NoResult
                        title="There’s no question to show"
                        description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
                        link="/ask-question"
                        linkTitle="Ask a Question"
                    />
                }
            </div>
        </>
    )
}

export default Home
