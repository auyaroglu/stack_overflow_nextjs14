"use client"

import React, { useRef, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { useForm } from "react-hook-form"
import { AnswerSchema } from "@/lib/validations"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTheme } from "@/context/ThemeProvider"
import { Button } from "../ui/button"
import Image from "next/image"
import dynamic from 'next/dynamic';
import { createAnswer } from "@/lib/actions/answer.action"
import { usePathname } from "next/navigation"

const BundledEditor = dynamic(() => import("@/components/shared/BundleEditor"), {
    ssr: false,
});

interface Props {
    question: string
    questionId: string
    authorId: string
}

const Answer = ({ question, questionId, authorId }: Props) => {
    const pathname = usePathname()
    const [isSubmitting, setIsSubmitting] = useState(false)
    // const [isSubmittingAI, setIsSubmittingAI] = useState(false)
    const { mode } = useTheme()
    const editorRef = useRef(null)

    const form = useForm<z.infer<typeof AnswerSchema>>({
        resolver: zodResolver(AnswerSchema),
        defaultValues: {
            answer: ''
        }
    })

    const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
        setIsSubmitting(true)

        try {
            await createAnswer({
                content: values.answer,
                author: JSON.parse(authorId),
                question: JSON.parse(questionId),
                path: pathname
            })

            form.reset()

            if (editorRef.current) {
                const editor = editorRef.current as any

                editor.setContent('')
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const generateAIAnswer = async () => {
        if (!authorId) return;

        // setIsSubmittingAI(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`,
                {
                    method: 'POST',
                    body: JSON.stringify({ question })
                }
            )

            const aiAnswer = await response.json()

            alert(aiAnswer.reply)
        } catch (error) {
            console.log(error)
        } finally {
            // setIsSubmittingAI(false)
        }
    }

    return (
        <div>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <h4 className="paragraph-semibold text-dark400_light800">Write your answer</h4>
                <Button
                    className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
                    onClick={generateAIAnswer}
                >
                    <Image
                        src="/assets/icons/stars.svg"
                        alt="star"
                        width={12}
                        height={12}
                        className="object-contain"
                    />
                    Generate AI Answer
                </Button>
            </div>
            <Form {...form}>
                <form
                    className="mt-6 flex w-full flex-col gap-10"
                    onSubmit={form.handleSubmit(handleCreateAnswer)}
                >
                    <FormField
                        control={form.control}
                        name="answer"
                        render={({ field }) => (
                            <FormItem className="flex w-full flex-col gap-3">
                                <FormControl className="mt-3.5">
                                    <BundledEditor
                                        onBlur={field.onBlur}
                                        onEditorChange={(content: string) => field.onChange(content)}
                                        // @ts-ignore
                                        onInit={(evt, editor) => {
                                            editorRef.current = editor
                                        }}
                                        init={{
                                            promotion: false,
                                            license_key: 'gpl',
                                            height: 350,
                                            menubar: false,
                                            plugins: [
                                                'advlist', 'anchor', 'autolink', 'help', 'image', 'link', 'lists',
                                                'searchreplace', 'table', 'wordcount', 'fullscreen', 'codesample', 'media', 'preview', 'insertdatetime'
                                            ],
                                            toolbar: 'undo redo |' +
                                                'codesample | bold italic forecolor | alignleft aligncenter ' +
                                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                                'removeformat | help',
                                            content_style: 'body { font-family:Inter; font-size:16px }',
                                            // skin: 'oxide-dark',
                                            // content_css: 'dark'
                                            skin: mode === 'dark' ? 'oxide-dark' : 'oxide',
                                            content_css: mode === 'dark' ? 'dark' : 'default',
                                        }}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="primary-gradient w-fit text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default Answer