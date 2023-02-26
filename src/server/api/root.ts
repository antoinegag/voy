import { createTRPCRouter } from "./trpc";
import { habitsRouter } from "./routers/habits";
import { goalsRouter } from "./routers/goals";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  goals: goalsRouter,
  habits: habitsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
