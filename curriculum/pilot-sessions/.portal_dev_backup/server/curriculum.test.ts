import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("curriculum procedures", () => {
  it("should fetch all arcs", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const arcs = await caller.curriculum.arcs();

    expect(Array.isArray(arcs)).toBe(true);
    expect(arcs.length).toBe(3);
    expect(arcs[0]?.arcNumber).toBe(1);
    expect(arcs[0]?.arcTitle).toContain("The Machine");
  });

  it("should fetch all sessions", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const sessions = await caller.curriculum.allSessions();

    expect(Array.isArray(sessions)).toBe(true);
    expect(sessions.length).toBe(31); // Sessions 0-30
    expect(sessions[0]?.sessionNumber).toBe(0);
    expect(sessions[0]?.sessionTitle).toContain("Welcome");
  });

  it("should fetch a specific session by number", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const session = await caller.curriculum.sessionByNumber({ sessionNumber: 1 });

    expect(session).not.toBeNull();
    expect(session?.sessionNumber).toBe(1);
    expect(session?.sessionTitle).toContain("The Mechanism");
    expect(session?.arcId).toBe(1);
  });

  it("should fetch sessions for a specific arc", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const sessions = await caller.curriculum.sessionsForArc({ arcId: 1 });

    expect(Array.isArray(sessions)).toBe(true);
    expect(sessions.length).toBe(11); // Sessions 0-10 for Arc 1
    expect(sessions[0]?.arcId).toBe(1);
  });

  it("should fetch arc with its sessions", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const arcWithSessions = await caller.curriculum.arcWithSessions({ arcId: 1 });

    expect(arcWithSessions).not.toBeNull();
    expect(arcWithSessions?.arcNumber).toBe(1);
    expect(Array.isArray(arcWithSessions?.sessions)).toBe(true);
    expect(arcWithSessions?.sessions?.length).toBe(11);
  });
});

describe("resources procedures", () => {
  it("should fetch all resources", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const resources = await caller.resources.all();

    expect(Array.isArray(resources)).toBe(true);
    expect(resources.length).toBe(4); // checklist, glossary, plan_b, capability_statement
  });

  it("should fetch a specific resource by type", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const resource = await caller.resources.byType({ resourceType: "checklist" });

    expect(resource).not.toBeNull();
    expect(resource?.resourceType).toBe("checklist");
    expect(resource?.title).toContain("Facilitator Readiness Checklist");
    expect(resource?.content).toBeTruthy();
  });
});

describe("grants procedures", () => {
  it("should fetch all grants", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const grants = await caller.grants.all();

    expect(Array.isArray(grants)).toBe(true);
    expect(grants.length).toBeGreaterThan(0);
    
    // Check for specific grant funders
    const funders = grants.map((g) => g.funder);
    expect(funders).toContain("Bureau of Justice Assistance (BJA)");
    expect(funders).toContain("U.S. Department of Veterans Affairs");
    expect(funders).toContain("Infinite Hero Foundation");
    expect(funders).toContain("Bob Woodruff Foundation");
  });

  it("should have required fields for each grant", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const grants = await caller.grants.all();

    grants.forEach((grant) => {
      expect(grant.grantName).toBeTruthy();
      expect(grant.funder).toBeTruthy();
      expect(grant.deadline).toBeTruthy();
      expect(grant.alignment).toBeTruthy();
    });
  });
});
