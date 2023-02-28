import { createTRPCRouter, publicProcedure } from "../trpc";

export const sportsRouter = createTRPCRouter({
  getSports: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.sport.findMany();
  }),
});
