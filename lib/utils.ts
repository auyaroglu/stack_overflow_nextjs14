import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getTimestamp = (createdAt: Date): string => {
    const now = new Date()
    const diff = now.getTime() - createdAt.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)

    if (years > 0) {
        return `${years} ${years === 1 ? "year" : "years"} ago`
    } else if (months > 0) {
        return `${months} ${months === 1 ? "month" : "months"} ago`
    } else if (weeks > 0) {
        return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`
    } else if (days > 0) {
        return `${days} ${days === 1 ? "day" : "days"} ago`
    } else if (hours > 0) {
        return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
    } else if (minutes > 0) {
        return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
    } else {
        return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`
    }
}

export const formatAndDivideNumber = (num: number): string => {
    if (num >= 1000000) {
        const formattedNum = (num / 1000000).toFixed(1);
        return `${formattedNum}M`;
    } else if (num >= 1000) {
        const formattedNum = (num / 1000).toFixed(1);
        return `${formattedNum}K`;
    } else {
        return num.toString();
    }
};

export const getJoinedDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}