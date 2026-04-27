import { NextFunction, Request, Response } from 'express';
import { dbActions } from '../../db/dbActions';
import { querySchema } from '../../types';
import { handleResponse } from '../../utils/helper';
import { fetchFootballData } from './services';
import SelectedLeagues from '../selectedLeagues/model';

export const getFixtureMonks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json(handleResponse(400, 'Date is required'));
    }

    let page: number = 1,
      hasMore: boolean = true,
      fixtures: any[] = [],
      data: any[] = [];

    try {
      while (hasMore) {
        const response = await fetchFootballData(
          `/fixtures/date/${date}?include=league.country;round.stage;participants;state;scores;periods&${page}`
        );

        fixtures = [...fixtures, ...response?.data];
        hasMore = response?.data?.pagination?.has_more;
        page += 1;
      }
    } catch (err) {
      console.error(err);
    }

    // Fetch selected leagues from the database
    const selectedLeagues = await dbActions.readEvery(SelectedLeagues, {
      sort: { position: 1 },
    });

    const selectedLeagueIds = new Set(selectedLeagues.map((l) => l.id));

    const leagueMap: { [key: string]: any } = {};

    fixtures.forEach((fixture) => {
      const leagueId = fixture.league.id;

      if (selectedLeagueIds.has(leagueId)) {
        if (!leagueMap[leagueId]) {
          leagueMap[leagueId] = {
            id: leagueId,
            name: fixture.league.name,
            image: fixture.league.image_path,
            fixtures: [],
          };
        }
        leagueMap[leagueId].fixtures.push(fixture);
      }
    });

    data = Object.values(leagueMap);

    res.status(200).json(handleResponse(200, 'Formatted fixture list', data));
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    next(error);
  }
};
