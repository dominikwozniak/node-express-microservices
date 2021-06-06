import express, { Request, Response } from 'express';
import { currentUser } from '../middlewares/current-user';
import { requireAuth } from '../middlewares/require-auth';

const router = express.Router();

router.post(
  '/api/users/signout',
  currentUser,
  requireAuth,
  (req: Request, res: Response) => {
  req.session = null;

  res.send({});
});

export { router as signoutRouter };