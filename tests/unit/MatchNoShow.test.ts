import { describe, it, expect } from "vitest";
import { Match, MatchPhase, MatchStatus } from "../../app/domain/entities/Match";

describe("Match.isNoShow", () => {
  it("returns true when match status is NO_SHOW", () => {
    const match = new Match({
      id: "m1",
      round: 1,
      phase: MatchPhase.LEAGUE,
      status: MatchStatus.NO_SHOW,
      homeScore: null,
      awayScore: null,
      tournamentId: "t1",
      homeTeamId: "a",
      awayTeamId: "b",
    });

    expect(match.isNoShow()).toBe(true);
  });

  it("returns false when match status is COMPLETED", () => {
    const match = new Match({
      id: "m1",
      round: 1,
      phase: MatchPhase.LEAGUE,
      status: MatchStatus.COMPLETED,
      homeScore: 2,
      awayScore: 1,
      tournamentId: "t1",
      homeTeamId: "a",
      awayTeamId: "b",
    });

    expect(match.isNoShow()).toBe(false);
  });

  it("returns false when match status is SCHEDULED", () => {
    const match = new Match({
      id: "m1",
      round: 1,
      phase: MatchPhase.LEAGUE,
      status: MatchStatus.SCHEDULED,
      homeScore: null,
      awayScore: null,
      tournamentId: "t1",
      homeTeamId: "a",
      awayTeamId: "b",
    });

    expect(match.isNoShow()).toBe(false);
  });
});

describe("Match.markNoShow", () => {
  it("marks a scheduled match as NO_SHOW with null scores", () => {
    const match = new Match({
      id: "m1",
      round: 1,
      phase: MatchPhase.LEAGUE,
      status: MatchStatus.SCHEDULED,
      homeScore: null,
      awayScore: null,
      tournamentId: "t1",
      homeTeamId: "a",
      awayTeamId: "b",
    });

    const updated = match.markNoShow();
    expect(updated.status).toBe(MatchStatus.NO_SHOW);
    expect(updated.homeScore).toBeNull();
    expect(updated.awayScore).toBeNull();
  });

  it("throws when match is already COMPLETED", () => {
    const match = new Match({
      id: "m1",
      round: 1,
      phase: MatchPhase.LEAGUE,
      status: MatchStatus.COMPLETED,
      homeScore: 2,
      awayScore: 1,
      tournamentId: "t1",
      homeTeamId: "a",
      awayTeamId: "b",
    });

    expect(() => match.markNoShow()).toThrow("Match is already completed");
  });

  it("throws when match is already NO_SHOW", () => {
    const match = new Match({
      id: "m1",
      round: 1,
      phase: MatchPhase.LEAGUE,
      status: MatchStatus.NO_SHOW,
      homeScore: null,
      awayScore: null,
      tournamentId: "t1",
      homeTeamId: "a",
      awayTeamId: "b",
    });

    expect(() => match.markNoShow()).toThrow("Match is already marked as no-show");
  });
});

describe("Match.recordResult rejects NO_SHOW", () => {
  it("throws when trying to record result on a NO_SHOW match", () => {
    const match = new Match({
      id: "m1",
      round: 1,
      phase: MatchPhase.LEAGUE,
      status: MatchStatus.NO_SHOW,
      homeScore: null,
      awayScore: null,
      tournamentId: "t1",
      homeTeamId: "a",
      awayTeamId: "b",
    });

    expect(() => match.recordResult(3, 0)).toThrow("Cannot record result for a no-show match");
  });
});