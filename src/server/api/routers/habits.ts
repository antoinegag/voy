import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const habitsRouter = createTRPCRouter({
  getHabits: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.habit.findMany({
      where: { userId: ctx.session.user.id },
    });
  }),
});
