import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  curriculum: router({
    arcs: publicProcedure.query(async () => {
      const { getAllArcs } = await import("./db");
      return getAllArcs();
    }),
    arcWithSessions: publicProcedure.input((val: unknown) => {
      if (typeof val === 'object' && val !== null && 'arcId' in val && typeof (val as any).arcId === 'number') {
        return val as { arcId: number };
      }
      throw new Error('Invalid input');
    }).query(async ({ input }) => {
      const { getArcWithSessions } = await import("./db");
      return getArcWithSessions(input.arcId);
    }),
    allSessions: publicProcedure.query(async () => {
      const { getAllSessions } = await import("./db");
      return getAllSessions();
    }),
    sessionByNumber: publicProcedure.input((val: unknown) => {
      if (typeof val === 'object' && val !== null && 'sessionNumber' in val && typeof (val as any).sessionNumber === 'number') {
        return val as { sessionNumber: number };
      }
      throw new Error('Invalid input');
    }).query(async ({ input }) => {
      const { getSessionByNumber } = await import("./db");
      return getSessionByNumber(input.sessionNumber);
    }),
    sessionsForArc: publicProcedure.input((val: unknown) => {
      if (typeof val === 'object' && val !== null && 'arcId' in val && typeof (val as any).arcId === 'number') {
        return val as { arcId: number };
      }
      throw new Error('Invalid input');
    }).query(async ({ input }) => {
      const { getSessionsForArc } = await import("./db");
      return getSessionsForArc(input.arcId);
    }),
  }),
  resources: router({
    all: publicProcedure.query(async () => {
      const { getAllResources } = await import("./db");
      return getAllResources();
    }),
    byType: publicProcedure.input((val: unknown) => {
      if (typeof val === 'object' && val !== null && 'resourceType' in val && typeof (val as any).resourceType === 'string') {
        return val as { resourceType: string };
      }
      throw new Error('Invalid input');
    }).query(async ({ input }) => {
      const { getResourceByType } = await import("./db");
      return getResourceByType(input.resourceType);
    }),
  }),
  grants: router({
    all: publicProcedure.query(async () => {
      const { getAllGrants } = await import("./db");
      return getAllGrants();
    }),
  }),
});

export type AppRouter = typeof appRouter;
