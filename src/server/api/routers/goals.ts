import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const goalsRouter = createTRPCRouter({
  getHabits: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.goal.findMany({
      where: { userId: ctx.session.user.id },
    });
  }),
});
