import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { UserUpdateValidator, UserValidator } from './validator';
import { dbActions } from '../../db/dbActions';
import User, { UserRole } from './model';
import { handleResponse } from '../../utils/helper';
import { generateToken, verifyToken } from '../../utils';
import { querySchema } from '../../types';

// Register a new user
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = UserValidator.parse(req.body);

    // Check if user already exists
    const existingUser = await dbActions.read(User, { query: { email: userData.email } });
    if (existingUser) {
      return res.status(409).json(handleResponse(409, 'User with this email already exists'));
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = new User({ ...userData, password: hashedPassword });
    await dbActions.create(User, newUser);

    res.status(201).json(handleResponse(201, 'User registered successfully'));
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
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Create a sanitized user object without sensitive data
    const sanitizedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      isActive: user.isActive,
    };

    res.status(200).json(
      handleResponse(200, 'Successfully Logged In', {
        user: sanitizedUser,
        accessToken,
        refreshToken,
      })
    );
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

    const decoded: any = await verifyToken(refreshToken, 'refresh');

    if (!decoded || !decoded.userId) {
      return res.status(403).json(handleResponse(403, 'Invalid refresh token'));
    }

    const user = await dbActions.read(User, { query: { _id: decoded.userId } });
    if (!user) {
      return res.status(404).json(handleResponse(404, 'User not found'));
    }

    const newAccessToken = generateToken(user._id.toString(), user.role as UserRole, 'access');

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(200).json(handleResponse(200, 'Token Refreshed', { accessToken: newAccessToken }));
  } catch (error) {
    console.error(error);
    return res.status(403).json(handleResponse(403, 'Invalid or expired refresh token'));
  }
};

// User logout
export const logoutUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Clear cookies
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json(handleResponse(200, 'User logged out successfully'));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get current user profile
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json(handleResponse(401, 'User not authenticated'));
    }

    const user = await dbActions.read(User, {
      query: { _id: req.userId },
    });

    if (!user) {
      return res.status(404).json(handleResponse(404, 'User not found'));
    }

    // Remove sensitive data
    const sanitizedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };

    res.status(200).json(handleResponse(200, 'User profile fetched', sanitizedUser));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json(handleResponse(401, 'User not authenticated'));
    }

    const updateData = UserUpdateValidator.parse(req.body);

    // Don't allow role updates through this endpoint
    delete updateData.role;

    const updatedUser = await dbActions.update(User, {
      query: { _id: req.userId },
      update: updateData,
    });

    if (!updatedUser) {
      return res.status(404).json(handleResponse(404, 'User not found'));
    }

    // Remove sensitive data from response
    const sanitizedUser = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profileImage: updatedUser.profileImage,
      isActive: updatedUser.isActive,
    };

    res.status(200).json(handleResponse(200, 'User profile updated', sanitizedUser));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Change user password
export const changeUserPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json(handleResponse(401, 'User not authenticated'));
    }

    const { oldPassword, newPassword } = z
      .object({
        oldPassword: z.string().min(6),
        newPassword: z.string().min(6),
      })
      .parse(req.body);

    const user = await dbActions.read(User, {
      query: { _id: req.userId },
    });

    if (!user) {
      return res.status(404).json(handleResponse(404, 'User not found'));
    }

    if (!(await bcrypt.compare(oldPassword, user.password))) {
      return res.status(401).json(handleResponse(401, 'Old password is incorrect'));
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await dbActions.update(User, {
      query: { _id: req.userId },
      update: { password: hashedNewPassword },
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
      // For security, don't reveal if user exists or not
      return res
        .status(200)
        .json(handleResponse(200, 'If the email exists, a password reset link will be sent'));
    }

    // Generate a short-lived reset token (15 minutes)
    const resetToken = generateToken(user._id.toString(), user.role as UserRole, 'access');

    // In a real application, send this token via email
    // For now, return it (but in production, don't return the token in response)
    res.status(200).json(handleResponse(200, 'Password reset token generated', { resetToken }));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Delete user profile
export const deleteUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json(handleResponse(401, 'User not authenticated'));
    }

    await dbActions.delete(User, { query: { _id: req.userId } });

    // Clear cookies after deletion
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json(handleResponse(200, 'User profile deleted successfully'));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get all users (Admin/Moderator only)
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search } = querySchema.parse(req.query);

    const query: any = {};

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }

    const options = {
      query,
      pagination: { page, limit },

      select: '-password -__v',
    };

    const result = await dbActions.readAll(User, options);

    res.status(200).json(handleResponse(200, 'Users data fetched', result));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Reset password with token
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = z
      .object({
        token: z.string(),
        newPassword: z.string().min(6),
      })
      .parse(req.body);

    const decoded: any = await verifyToken(token, 'access');

    if (!decoded || !decoded.userId) {
      return res.status(403).json(handleResponse(403, 'Invalid or expired reset token'));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await dbActions.update(User, {
      query: { _id: decoded.userId },
      update: { password: hashedPassword },
    });

    res.status(200).json(handleResponse(200, 'Password reset successfully'));
  } catch (error) {
    console.error(error);
    next(error);
  }
};
