import { createTRPCRouter } from "./trpc";
import { habitsRouter } from "./routers/habits";
import { goalsRouter } from "./routers/goals";
import { sportsRouter } from "./routers/sports";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  goals: goalsRouter,
  habits: habitsRouter,
  sports: sportsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
