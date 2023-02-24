import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getSecretMessage: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    const fullUser = await ctx.prisma.user.findFirst({
      where: { id: ctx.session.user.id },
    });
    console.log({ fullUser });

    return `You are ${user.name}, id: ${user.id}`;
  }),
});
