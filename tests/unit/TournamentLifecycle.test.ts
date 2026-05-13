import { describe, it, expect } from "vitest";
import { Tournament, TournamentStatus } from "../../app/domain/entities/Tournament";

function makeTournament(status: TournamentStatus = TournamentStatus.SETUP): Tournament {
  return new Tournament({
    id: "t1", name: "Test", venue: "V", status,
    playoffCutoff: 4, hasGroupPhase: false, thirdPlaceEnabled: false,
    createdAt: new Date(), updatedAt: new Date(),
  });
}

describe("Tournament lifecycle", () => {
  it("starts in SETUP status", () => {
    const t = makeTournament();
    expect(t.status).toBe(TournamentStatus.SETUP);
  });

  it("transitions from SETUP to LEAGUE_PHASE", () => {
    const t = makeTournament(TournamentStatus.SETUP);
    const started = t.startLeague();
    expect(started.status).toBe(TournamentStatus.LEAGUE_PHASE);
  });

  it("transitions from LEAGUE_PHASE to PLAYOFFS when hasGroupPhase", () => {
    const t = new Tournament({
      id: "t1", name: "Test", venue: "V", status: TournamentStatus.LEAGUE_PHASE,
      playoffCutoff: 4, hasGroupPhase: true, thirdPlaceEnabled: false,
      createdAt: new Date(), updatedAt: new Date(),
    });
    const playoffs = t.startPlayoffs();
    expect(playoffs.status).toBe(TournamentStatus.PLAYOFFS);
  });

  it("transitions from LEAGUE_PHASE to COMPLETED when no group phase", () => {
    const t = makeTournament(TournamentStatus.LEAGUE_PHASE);
    const completed = t.complete();
    expect(completed.status).toBe(TournamentStatus.COMPLETED);
  });

  it("transitions from PLAYOFFS to COMPLETED", () => {
    const t = new Tournament({
      id: "t1", name: "Test", venue: "V", status: TournamentStatus.PLAYOFFS,
      playoffCutoff: 4, hasGroupPhase: true, thirdPlaceEnabled: false,
      createdAt: new Date(), updatedAt: new Date(),
    });
    const completed = t.complete();
    expect(completed.status).toBe(TournamentStatus.COMPLETED);
  });

  it("rejects invalid transitions", () => {
    const t = makeTournament(TournamentStatus.COMPLETED);
    expect(() => t.startLeague()).toThrow();
    expect(() => t.startPlayoffs()).toThrow();
  });
});
