import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { dbActions } from '../../db/dbActions';
import { querySchema } from '../../types';
import { generateToken, verifyToken } from '../../utils';
import { handleResponse } from '../../utils/helper';
import User, { UserRole } from './model';
import { UserUpdateValidator, UserValidator } from './validator';

// Register a new user
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = UserValidator.parse(req.body);
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = new User({ ...userData, password: hashedPassword });
    await dbActions.create(User, newUser);

    res.status(201).json(handleResponse(200, 'User registered successfully'));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// User login
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = z
      .object({
        email: z.string().email(),
        password: z.string().min(6),
      })
      .parse(req.body);

    const user = await dbActions.read(User, { query: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json(handleResponse(401, 'Invalid email or password'));
    }

    const accessToken = generateToken(user._id.toString(), user.role as UserRole, 'access');
    const refreshToken = generateToken(user._id.toString(), user.role as UserRole, 'refresh');

    // Set tokens as cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
    }); // 1 minutes
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }); // 7 days

    delete user.password;
    delete user.updatedAt;
    delete user.createdAt;
    delete user.__v;

    res
      .status(200)
      .json(handleResponse(200, 'Successfully Logged In', { ...user, accessToken, refreshToken }));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken =
      req?.cookies?.refreshToken || req?.headers?.authorization?.replace('Bearer ', '');

    if (!refreshToken) {
      return res.status(401).json(handleResponse(401, 'No refresh token provided'));
    }

    try {
      const decoded: any = await verifyToken(refreshToken, 'refresh');

      const user = await dbActions.read(User, { query: { _id: decoded.userId } });
      if (!user) {
        return res.status(404).json(handleResponse(404, 'User not found'));
      }

      const newAccessToken = generateToken(user._id.toString(), user.role as UserRole, 'access');

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000,
      }); // 1 minutes

      res.status(200).json(handleResponse(200, 'Token Refreshed', { accessToken: newAccessToken }));
    } catch (error) {
      return res.status(403).json(handleResponse(403, 'Invalid refresh token'));
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// User logout
export const logoutUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json(handleResponse(200, 'User logged out successfully'));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get current user profile
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await dbActions.read(User, {
      query: { _id: req.userId },
    });
    if (!user) {
      return res.status(404).json(handleResponse(404, 'User not found'));
    }

    res.status(200).json(handleResponse(200, 'User profile fetched', user));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updateData = UserUpdateValidator.parse(req.body);
    const user = await dbActions.update(User, {
      query: { _id: req.userId },
      update: updateData,
    });

    if (!user) {
      return res.status(404).json(handleResponse(404, 'User not found'));
    }

    res.status(200).json(handleResponse(200, 'User profile updated', user));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Change user password
export const changeUserPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { oldPassword, newPassword } = z
      .object({
        oldPassword: z.string().min(6),
        newPassword: z.string().min(6),
      })
      .parse(req.body);

    const user = await dbActions.read(User, {
      query: { _id: req.userId },
    });
    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
      return res.status(401).json(handleResponse(401, 'Old password is incorrect'));
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await dbActions.update(User, {
      query: { _id: req.userId },
      update: { password: user.password },
    });

    res.status(200).json(handleResponse(200, 'Password changed successfully'));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Forgot password
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = z
      .object({
        email: z.string().email(),
      })
      .parse(req.body);

    const user = await dbActions.read(User, { query: { email } });
    if (!user) {
      return res.status(404).json(handleResponse(404, 'User not found'));
    }

    const resetToken = generateToken(user._id.toString(), user.role as UserRole, 'access');
    res.status(200).json(handleResponse(200, 'Password reset token sent', resetToken));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Delete user profile
export const deleteUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await dbActions.delete(User, { query: { _id: req.userId } });
    res.status(200).json(handleResponse(200, 'User profile deleted successfully'));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// All users
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search } = querySchema.parse(req.query);

    const query: any = {};

    if (search) {
      query.email = new RegExp(search, 'i');
      query.name = new RegExp(search, 'i');
    }

    const options = {
      query,
      pagination: { page, limit },
    };

    const result = await dbActions.readAll(User, options);

    res.status(200).json(handleResponse(200, 'Users data fetched', result));
  } catch (error) {
    console.error(error);
    next(error);
  }
};
