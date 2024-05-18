"use client"

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import BundledEditor from "@/components/shared/BundleEditor"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button"
import { QuestionsSchema } from "@/lib/validations"
import { Badge } from "../ui/badge"
import Image from "next/image"
import { createQuestion } from "@/lib/actions/question.action"

const type: any = 'create'

const Question = () => {
    // Form bir kez gönderilirken, işlem bitmeden ikinci kez gönderilmesini engellemek için eklendi
    const [isSubmitting, setIsSubmitting] = useState(false)

    // 1. Define your form.
    const form = useForm<z.infer<typeof QuestionsSchema>>({
        resolver: zodResolver(QuestionsSchema),
        defaultValues: {
            title: "",
            explanation: "",
            tags: []
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof QuestionsSchema>) {
        setIsSubmitting(true)

        try {
            // make an async call to your API -> create a question
            // contain all form data

            await createQuestion({})

            // navigate to home page
        } catch (error) {

        } finally {
            setIsSubmitting(false)
        }
    }

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: any) => {
        if (e.key === "Enter" && field.name === 'tags') {
            // Tarayıcı her seferinde yenilenmesin diye eklendi
            e.preventDefault()

            const tagInput = e.target as HTMLInputElement
            const tagValue = tagInput.value.trim() // sağındaki ve solundaki boşlukları silmek için

            if (tagValue !== '') {
                if (tagValue.length > 15) {
                    return form.setError('tags', {
                        type: 'required',
                        message: 'Tag must be less than 15 characters'
                    })
                }

                if (!field.value.includes(tagValue as never)) {
                    form.setValue('tags', [...field.value, tagValue])
                    tagInput.value = ""
                    form.clearErrors('tags')
                }
            } else {
                form.trigger()
            }
        }
    }

    const handleTagRemove = (tag: string, field: any) => {
        const newTags = field.value.filter((t: string) => t !== tag)

        form.setValue('tags', newTags)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-10">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col">
                            <FormLabel className="paragraph-semibold text-dark400_light800">Question Title <span className="text-primary-500">*</span></FormLabel>
                            <FormControl className="mt-3.5">
                                <Input
                                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                                    {...field} />
                            </FormControl>
                            <FormDescription className="body-regular mt-2.5 text-light-500">
                                Be specific and imagine you&apos;re asking a question to another person.
                            </FormDescription>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="explanation"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-3">
                            <FormLabel className="paragraph-semibold text-dark400_light800">Detailed explanation of your problem <span className="text-primary-500">*</span></FormLabel>
                            <FormControl className="mt-3.5">
                                <BundledEditor
                                    initialValue=''
                                    onBlur={field.onBlur}
                                    onEditorChange={(content: string) => field.onChange(content)}
                                    init={{
                                        promotion: false,
                                        license_key: 'gpl',
                                        language: 'tr',
                                        language_url: '/locales/tr.js',
                                        height: 350,
                                        menubar: true,
                                        plugins: [
                                            'advlist', 'anchor', 'autolink', 'help', 'image', 'link', 'lists',
                                            'searchreplace', 'table', 'wordcount', 'fullscreen', 'codesample', 'media', 'preview', 'insertdatetime'
                                        ],
                                        toolbar: 'undo redo |' +
                                            'codesample | bold italic forecolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | help',
                                        content_style: 'body { font-family:Inter; font-size:16px }'
                                    }}
                                />
                            </FormControl>
                            <FormDescription className="body-regular mt-2.5 text-light-500">
                                Introduce the problem and explanation on what you put in the title. Minimum 20 characters.
                            </FormDescription>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col">
                            <FormLabel className="paragraph-semibold text-dark400_light800">Tags <span className="text-primary-500">*</span></FormLabel>
                            <FormControl className="mt-3.5">
                                <>
                                    <Input
                                        className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                                        placeholder="Add tags..."
                                        onKeyDown={(e) => handleInputKeyDown(e, field)}
                                    />

                                    {field.value.length > 0 && (
                                        <div className="flex-start mt-2.5 gap-2.5">
                                            {field.value.map((tag: any) => (
                                                <Badge key={tag} className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                                                    onClick={() => handleTagRemove(tag, field)}>
                                                    {tag}
                                                    <Image
                                                        src="/assets/icons/close.svg"
                                                        alt="Close icon"
                                                        width={12}
                                                        height={12}
                                                        className="cursor-pointer object-contain invert-0 dark:invert"
                                                    />
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </>
                            </FormControl>
                            <FormDescription className="body-regular mt-2.5 text-light-500">
                                Add up to 3 tags to describe what your question is about. You need to press enter to add a tag.
                            </FormDescription>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="primary-gradient w-fit !text-light-900" disabled={isSubmitting}>
                    {isSubmitting ?
                        (
                            <>
                                {type === 'edit' ? 'Editing...' : 'Posting...'}
                            </>
                        ) :
                        (
                            <>
                                {type === 'edit' ? 'Edit Question' : 'Ask Question'}
                            </>
                        )}
                </Button>
            </form>
        </Form>
    )
}

export default Question