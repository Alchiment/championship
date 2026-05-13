import { httpFacade } from "./http.facade";

interface ApiOptions {
  signal?: AbortSignal;
}

class ApiFacade {
  private baseUrl = "/api";

  async getTeams(options?: ApiOptions): Promise<any> {
    return httpFacade.get(this.url("/teams"), this.headers(options));
  }

  async getMatches(tournamentId?: string, round?: number): Promise<any> {
    const params = new URLSearchParams();
    if (tournamentId) params.set("tournamentId", tournamentId);
    if (round !== undefined) params.set("round", round.toString());
    const qs = params.toString();
    return httpFacade.get(this.url(`/matches${qs ? `?${qs}` : ""}`), this.headers());
  }

  async getStandings(tournamentId?: string): Promise<any> {
    const params = tournamentId ? `?tournamentId=${tournamentId}` : "";
    return httpFacade.get(this.url(`/standings${params}`), this.headers());
  }

  async createTeam(data: { name: string; code: string; flag: string }): Promise<any> {
    return httpFacade.post(this.url("/teams"), data, this.headers());
  }

  async recordMatchResult(matchId: string, homeScore: number, awayScore: number): Promise<any> {
    return httpFacade.patch(this.url(`/matches/${matchId}`), { homeScore, awayScore }, this.headers());
  }

  async withdrawTeam(teamId: string): Promise<any> {
    return httpFacade.delete(this.url(`/teams/${teamId}`), this.headers());
  }

  private url(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  private headers(options?: ApiOptions): Record<string, string> {
    return {
      "Content-Type": "application/json",
      ...(options?.signal ? {} : {}),
    };
  }
}

export const apiFacade = new ApiFacade();
