import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isProtectedRoute = createRouteMatcher([
    "/question/:id",
    "/tags",
    "/profile/:id",
]);

export default clerkMiddleware((auth, req) => {
    if (isProtectedRoute(req)) auth().protect()
})


export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
