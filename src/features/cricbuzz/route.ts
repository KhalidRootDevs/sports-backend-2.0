import { Router } from 'express';
import { cricBuzzCricketV2Data } from './controller';

const router = Router();

router.get('/fixtures/*', cricBuzzCricketV2Data);

export default router;
