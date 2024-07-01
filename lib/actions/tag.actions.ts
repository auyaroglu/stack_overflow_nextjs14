"use server"

import User from "@/database/user.model"
import { connectToDatabase } from "../mongoose"
import { GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams } from "./shared.types"
import Tag, { ITag } from "@/database/tag.model"
import { FilterQuery } from "mongoose"
import Question from "@/database/question.model"

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
    try {
        connectToDatabase()

        const { userId } = params

        const user = await User.findById(userId)

        if (!user) throw new Error('User not found')

        // Find interactions for the user and group by tags...
        // Interaction...

        return [
            { _id: '1', name: 'tag1' },
            { _id: '2', name: 'tag2' },
            { _id: '3', name: 'tag3' }
        ]
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getAllTags(params: GetAllTagsParams) {
    try {
        connectToDatabase()

        const { searchQuery, filter, page = 1, pageSize = 10 } = params
        const skipAmount = (page - 1) * pageSize

        const query: FilterQuery<typeof Tag> = {}

        if (searchQuery) {
            query.$or = [{ name: { $regex: new RegExp(searchQuery, 'i') } }]
        }

        let sortOptions = {}

        switch (filter) {
            case "popular":
                sortOptions = { questions: -1 }
                break;
            case "recent":
                sortOptions = { createdAt: -1 }
                break;
            case "name":
                sortOptions = { name: 1 }
                break;
            case "old":
                sortOptions = { createdAt: 1 }
                break;

            default:
                break;
        }

        const totalTags = await Tag.countDocuments(query)

        const tags = await Tag.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize)

        const isNext = totalTags > skipAmount + tags.length

        return { tags, isNext }
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
    try {
        connectToDatabase()

        const { tagId, searchQuery, page = 1, pageSize = 3 } = params

        const skipAmount = (page - 1) * pageSize

        const tagFilter: FilterQuery<ITag> = { _id: tagId }

        const tag = await Tag.findOne(tagFilter).populate({
            path: 'questions',
            model: Question,
            match: searchQuery
                ? { title: { $regex: new RegExp(searchQuery, 'i') } }
                : {},
            options: {
                sort: { createdAt: -1 },
                skip: skipAmount,
                limit: pageSize + 1
            },
            populate: [
                { path: 'tags', model: Tag, select: "_id name" },
                { path: 'author', model: User, select: "_id clerkId name picture" }
            ]
        })

        if (!tag) {
            throw new Error('Tag not found')
        }

        const isNext = tag.questions.length > pageSize

        const questions = tag.questions

        return { tagTitle: tag.name, questions, isNext }
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getTopPopularTags() {
    try {
        connectToDatabase()

        const PopularTags = await Tag.aggregate([
            { $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
            { $sort: { numberOfQuestions: -1 } },
            { $limit: 5 }
        ])

        return PopularTags
    } catch (error) {
        console.log(error)
        throw error
    }
}