import { NextFunction, Request, Response } from "express";
import SelectedLeagues from "../selectedLeagues/model";
import rapidApiFootballUrl from "./services";

export async function getFixturesRapid(req: Request, res: Response, next: NextFunction) {
  try {
    const { date } = req.body;
    const { data: { response } = [] } = await rapidApiFootballUrl.get(`/fixtures?date=${date}`);

    const selectedLeagues = await SelectedLeagues.find().sort({ position: 1 });

    // Filter fixtures based on selected leagues
    let data: any[] = [];

    const selectedLeagueIds = new Set(selectedLeagues.map((l) => l.id));

    const leagueMap: { [key: string]: any } = {};

    response.forEach((fixture: any) => {
      const leagueId = fixture.league.id;

      if (selectedLeagueIds.has(leagueId)) {
        if (!leagueMap[leagueId]) {
          leagueMap[leagueId] = {
            id: leagueId,
            name: fixture.league.name,
            image: fixture.league.logo,
            fixtures: []
          };
        }
        leagueMap[leagueId].fixtures.push(fixture);
      }
    });

    data = Object.values(leagueMap);

    res.send({
      status: true,
      data,
      message: "Fixture by league group fetched successfully!"
    });
  } catch (error) {
    next(error);
  }
}
