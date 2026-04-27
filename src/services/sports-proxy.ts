import { NextFunction, Request, Response } from "express";
import { monksFootballUrl, monksFootballUrl4, rapidApiFootballUrl } from "../lib/axios";
import LiveMatch from "../features/liveMatch/model";
import SelectedLeagues from "../features/selectedLeagues/model";
import News from "../features/news/model";

async function getFixtureIds(): Promise<number[]> {
  const result = await LiveMatch.aggregate<{ ids: number[] }>([
    { $match: { fixture_id: { $ne: null } } },
    { $group: { _id: null, ids: { $push: "$fixture_id" } } }
  ]);
  return result[0]?.ids ?? [];
}

async function getSelectedLeagues() {
  return SelectedLeagues.find().sort({ position: 1 });
}

export async function monksFootballV3Data(req: Request, res: Response, next: NextFunction): Promise<void> {
  const removedPrefixUrl = req.originalUrl.replace("/api/sports/monk/v3", "");
  const urlEndpoint = removedPrefixUrl.split("?")[0] ?? "";
  const urlQueryString = removedPrefixUrl.split("?")[1];
  const mainUrl = urlQueryString ? `${urlEndpoint}?${urlQueryString}` : urlEndpoint;

  try {
    const { data } = await monksFootballUrl.get(mainUrl);

    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function monksFootballV4Data(req: Request, res: Response, next: NextFunction): Promise<void> {
  const removedPrefixUrl = req.originalUrl.replace("/api/sports/monk/v4", "");
  const urlEndpoint = removedPrefixUrl.split("?")[0] ?? "";
  const urlQueryString = removedPrefixUrl.split("?")[1];
  const mainUrl = urlQueryString ? `${urlEndpoint}?${urlQueryString}` : urlEndpoint;

  try {
    const { data } = await monksFootballUrl4.get(mainUrl);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function rapidApiFootballV3Data(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const removedPrefixUrl = req.originalUrl.replace("/api/sports/rapid/v3", "");
    const urlEndpoint = removedPrefixUrl.split("?")[0] ?? "";
    const urlQueryString = removedPrefixUrl.split("?")[1];
    const mainUrl = urlQueryString ? `${urlEndpoint}?${urlQueryString}` : urlEndpoint;

    if (urlEndpoint.includes("fixtures") && urlQueryString?.includes("date")) {
      const { data } = await rapidApiFootballUrl.get<{ response: unknown[] }>(mainUrl);
      const matchIds = await getFixtureIds();
      const selectedLeagues = await getSelectedLeagues();

      type FixtureItem = { fixture: { id: number }; league: { id: number }; rex_value: boolean } & Record<
        string,
        unknown
      >;
      const responseData: FixtureItem[] = (data.response ?? []).map((fixture: unknown) => {
        const f = fixture as { fixture: { id: number }; league: { id: number } };
        return { ...(f as Record<string, unknown>), rex_value: matchIds.includes(f.fixture.id) } as FixtureItem;
      });

      const filteredFixtures = selectedLeagues.flatMap((sl) => responseData.filter((f) => sl.id === f.league.id));

      res.json({ ...(data as Record<string, unknown>), response: filteredFixtures });
      return;
    }

    if (urlEndpoint.includes("leagues")) {
      const { data } = await rapidApiFootballUrl.get<{ response: unknown[] }>(mainUrl);
      const selectedLeagues = await getSelectedLeagues();

      const filteredLeagues = selectedLeagues.flatMap((sl) =>
        (data.response ?? []).filter((l: unknown) => sl.id === (l as { league: { id: number } }).league.id)
      );

      const leaguesWithNews = await Promise.all(
        filteredLeagues.map(async (league) => {
          const l = league as { league: { id: number } } & Record<string, unknown>;
          const findNews = await News.findOne({ league_id: l.league.id });
          return { ...l, news: findNews !== null };
        })
      );

      res.json({ ...(data as Record<string, unknown>), response: leaguesWithNews });
      return;
    }

    const { data } = await rapidApiFootballUrl.get(mainUrl);
    res.json(data);
  } catch (err) {
    next(err);
  }
}
