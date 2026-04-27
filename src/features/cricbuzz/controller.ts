import { NextFunction, Request, Response } from 'express';
import { AnyExpression } from 'mongoose';
import cricBuzzCricketUrl from './services';

export async function cricBuzzCricketV2Data(req: Request, res: Response, next: NextFunction) {
  try {
    const removedPrefixUrl = req.originalUrl.replace('/api/cricbuzz/fixtures', '');
    let urlEndpoint = removedPrefixUrl.split('?')[0];
    const urlQueryString = removedPrefixUrl.split('?')[1];
    const mainUrl = urlQueryString ? `${urlEndpoint}?${urlQueryString}` : urlEndpoint;
    const { data } = await cricBuzzCricketUrl.get(mainUrl);

    return res.json(data);
  } catch (error: AnyExpression) {
    console.error('Error in Cric BuzzCricketV2Data:', error.message);
    next(error);
  }
}
