import express, { Request, Response } from 'express';
import { User } from '../models/user';

import { Password } from "../services/password";
import { body } from 'express-validator';
import { validateRequest, BadRequestError } from '@dwticketing/common';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signin',
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must write correct password')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('You provide wrong credentials');
    }

    const passwordsMatch = await Password.compare(existingUser.password, password);

    if (!passwordsMatch) {
      throw new BadRequestError('You provide wrong credentials');
    }

    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      }, process.env.JWT_KEY!
    );

    // @ts-ignore
    req.session = { jwt: userJwt };

    res.status(200).send(existingUser);
});

export { router as signinRouter };