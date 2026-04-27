import { Router } from 'express';
import { getFixtureMonks } from './controller';
import { redisCachingMiddleware } from '../redis/services';

const router = Router();

// Get formatted fixture
router.post('/fixtures/formatted', redisCachingMiddleware(), getFixtureMonks);

export default router;
