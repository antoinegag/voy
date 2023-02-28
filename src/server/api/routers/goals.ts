import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { generateGoal } from "../../../utils/openai";

export const goalsRouter = createTRPCRouter({
  getHabits: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.goal.findMany({
      where: { userId: ctx.session.user.id },
    });
  }),
  generateGoal: protectedProcedure
    .input(
      z.object({
        sportId: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        goal: z.number(),
        unit: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      // TODO: validate that strings match a pattern to prevent
      // prompt injection (i.e check that unit is km/hours/minutes)

      const { sportId, ...rest } = input;

      const sport = await ctx.prisma.sport.findFirst({
        where: { id: input.sportId },
      });

      const generated = await generateGoal({
        sportName: sport?.name ?? "any sport",
        ...rest,
      });

      return generated;

      // Mock data
      // await new Promise((r) => setTimeout(r, 4000));

      // return {
      //   plan: {
      //     name: "4000 km Cycling Challenge",
      //     description:
      //       "Challenge myself to cycle 4000 km in a span of three months",
      //     plan: {
      //       February: {
      //         "Week 1": {
      //           milestone: "400 km",
      //           focus:
      //             "Focus on feeling the rhythm of the road and cycle smoothly.",
      //         },
      //         "Week 2": {
      //           milestone: "350 km",
      //           focus:
      //             "Challenge yourself to beat your last week's record by even a small fraction.",
      //         },
      //         "Week 3": {
      //           milestone: "350 km",
      //           focus:
      //             "Be brave and try ascending hills and challenge yourself.",
      //         },
      //         "Week 4": {
      //           milestone: "300 km",
      //           focus:
      //             "Maintain the newfound intensity and keep the fire burning.",
      //         },
      //       },
      //       March: {
      //         "Week 1": {
      //           milestone: "400 km",
      //           focus:
      //             "Focus on longer term objectives and stay motivated on the roads.",
      //         },
      //         "Week 2": {
      //           milestone: "350 km",
      //           focus:
      //             "Break till maintenance week but make sure you don't lose momentum.",
      //         },
      //         "Week 3": {
      //           milestone: "350 km",
      //           focus:
      //             "Maintain your cycling gears so that they don't stand in between your goals.",
      //         },
      //         "Week 4": {
      //           milestone: "300 km",
      //           focus: "Keep pushing yourself and strive to do better.",
      //         },
      //       },
      //       April: {
      //         "Week 1": {
      //           milestone: "400 km",
      //           focus:
      //             "Take time off rest but use the freshness to cycle with more energy.",
      //         },
      //         "Week 2": {
      //           milestone: "350 km",
      //           focus:
      //             "Have regular checkups of your joint pains and make sure you're all set.",
      //         },
      //         "Week 3": {
      //           milestone: "350 km",
      //           focus:
      //             "Prepare for the last lap and challenge yourself to go for the kill.",
      //         },
      //         "Week 4": {
      //           milestone: "300 km",
      //           focus:
      //             "You are almost there! Dig deep and bring out your best for the end spurt.",
      //         },
      //       },
      //       May: {
      //         "Week 1": {
      //           milestone: "400 km",
      //           focus: "Stay motivated and take time with the last steps.",
      //         },
      //         "Week 2": {
      //           milestone: "350 km",
      //           focus:
      //             "Don't be afraid to rest and relax as well to keep going.",
      //         },
      //         "Week 3": {
      //           milestone: "350 km",
      //           focus: "Pace yourself to finish this epic cycling trip.",
      //         },
      //         "Week 4": {
      //           milestone: "200 km",
      //           focus:
      //             "You can do it! Enjoy the last bits of your journey and achieve success!",
      //         },
      //       },
      //     },
      //   },
      //   error: null,
      // };
    }),
});
