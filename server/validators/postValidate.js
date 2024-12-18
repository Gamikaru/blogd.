// src/validators/postValidate.js

import { body, validationResult } from 'express-validator';

/**
 * Define all valid categories here to maintain consistency.
 */
export const validCategories = [
    'Health and Fitness',
    'Lifestyle',
    'Technology',
    'Cooking',
    'Philosophy',
    'Productivity',
    'Art',
    'Music',
    'Business',
    'Business & Finance',
    'Other'
];

/**
 * Error handling middleware for validation.
 */
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

/**
 * Middleware to validate post creation data.
 */
export const validatePostCreation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('content')
        .trim()
        .isLength({ min: 1 }).withMessage('Content cannot be empty')
        .isLength({ max: 10000 }).withMessage('Content cannot exceed 10,000 characters'),
    body('category')
        .notEmpty().withMessage('Category is required')
        .isIn(validCategories).withMessage('Invalid category'),
    body('tags')
        .optional()
        .isArray().withMessage('Tags must be an array')
        .custom((tags) => tags.every(tag => typeof tag === 'string')).withMessage('Each tag must be a string'),
    handleValidationErrors,
];

/**
 * Middleware to validate post update data.
 */
export const validatePostUpdate = [
    body('title')
        .optional()
        .trim()
        .notEmpty().withMessage('Title cannot be empty')
        .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('content')
        .optional()
        .trim()
        .isLength({ min: 1 }).withMessage('Content cannot be empty')
        .isLength({ max: 10000 }).withMessage('Content cannot exceed 10,000 characters'),
    body('category')
        .optional()
        .notEmpty().withMessage('Category cannot be empty')
        .isIn(validCategories).withMessage('Invalid category'),
    body('tags')
        .optional()
        .isArray().withMessage('Tags must be an array')
        .custom((tags) => tags.every(tag => typeof tag === 'string')).withMessage('Each tag must be a string'),
    handleValidationErrors,
];