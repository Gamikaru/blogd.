// controllers/commentController.js

import mongoose from 'mongoose';
import Comment from '../models/comment.js';
import Post from '../models/post.js';
import logger from '../utils/logger.js';

/**
 * Helper function to handle errors
 */
const sendError = (res, error, message, statusCode = 500) => {
    logger.error(`${message}:`, error);
    res.status(statusCode).json({
        error: true,
        message,
        details: error.message || error,
    });
};

/**
 * Create a new comment.
 */
export const createComment = async (req, res) => {
    logger.info('Creating new comment with data:', req.body);
    try {
        const { content, postId } = req.body;
        const { userId } = req.user;

        if (!content || !postId) {
            logger.error('Comment Creation: Missing required fields.');
            return sendError(res, new Error('Validation Error'), 'Please provide all required fields', 400);
        }

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            logger.error('Comment Creation: Invalid postId:', postId);
            return sendError(res, new Error('Invalid postId'), 'The provided postId is not a valid ObjectId', 400);
        }

        const post = await Post.findById(postId);
        if (!post) {
            logger.error('Comment Creation: Post not found with ID:', postId);
            return sendError(res, new Error('Post Not Found'), 'No post found with the provided postId', 404);
        }

        const newComment = new Comment({
            content,
            postId,
            userId,
        });

        await newComment.save();
        logger.info('Comment created successfully with ID:', newComment._id);
        return res.status(201).json({
            message: 'Comment created successfully',
            comment: {
                commentId: newComment._id,
                content: newComment.content,
                postId: newComment.postId,
                userId: newComment.userId,
                createdAt: newComment.createdAt,
            },
        });
    } catch (error) {
        sendError(res, error, 'Server error during comment creation');
    }
};

/**
 * Get a single comment by ID.
 */
export const getCommentById = async (req, res) => {
    const { commentId } = req.params;
    logger.info('Fetching comment with ID:', commentId);
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            logger.error('Comment not found with ID:', commentId);
            return sendError(res, new Error('Comment Not Found'), 'Comment not found', 404);
        }
        logger.info('Comment fetched successfully with ID:', commentId);
        return res.status(200).json(comment);
    } catch (error) {
        sendError(res, error, 'Server error retrieving the comment');
    }
};

/**
 * Update a comment by ID.
 */
export const updateComment = async (req, res) => {
    const { content } = req.body;
    const { userId } = req.user;
    const { commentId } = req.params;

    logger.info('Updating comment with ID:', commentId);
    if (!content) {
        logger.error('Comment Update: No content provided.');
        return sendError(res, new Error('Validation Error'), 'Please enter some content to update', 400);
    }

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            logger.error('Comment not found with ID:', commentId);
            return sendError(res, new Error('Comment Not Found'), 'Comment not found', 404);
        }

        if (comment.userId.toString() !== userId.toString()) {
            logger.error('Unauthorized user ID:', userId, 'attempted to update comment ID:', commentId);
            return sendError(res, new Error('Unauthorized'), 'Unauthorized user', 401);
        }

        comment.content = content;
        await comment.save();
        logger.info('Comment updated successfully with ID:', commentId);
        return res.status(200).json({
            message: 'Comment updated successfully',
            comment,
        });
    } catch (error) {
        sendError(res, error, 'Server error during comment update');
    }
};

/**
 * Delete a comment by ID.
 */
export const deleteComment = async (req, res) => {
    const { userId } = req.user;
    const { commentId } = req.params;

    logger.info('Deleting comment with ID:', commentId);
    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            logger.error('Comment not found with ID:', commentId);
            return sendError(res, new Error('Comment Not Found'), 'Comment not found', 404);
        }

        if (comment.userId.toString() !== userId.toString()) {
            logger.error('Unauthorized user ID:', userId, 'attempted to delete comment ID:', commentId);
            return sendError(res, new Error('Unauthorized'), 'Unauthorized user', 401);
        }

        await comment.deleteOne();
        logger.info('Comment deleted successfully with ID:', commentId);
        return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        sendError(res, error, 'Server error during comment deletion');
    }
};

/**
 * Like a comment by ID.
 */
export const likeComment = async (req, res) => {
    const { commentId } = req.params;
    logger.info('Liking comment with ID:', commentId);

    try {
        const result = await Comment.findByIdAndUpdate(
            commentId,
            { $inc: { likes: 1 } },
            { new: true }
        );

        if (!result) {
            logger.error('Comment not found with ID:', commentId);
            return sendError(res, new Error('Comment Not Found'), 'Comment not found', 404);
        }

        logger.info('Comment liked successfully with ID:', commentId);
        return res.status(200).json({
            message: 'Comment liked successfully',
            likes: result.likes,
        });
    } catch (error) {
        sendError(res, error, 'Server error during comment like');
    }
};

/**
 * Unlike a comment by ID.
 */
export const unlikeComment = async (req, res) => {
    const { commentId } = req.params;
    logger.info('Unliking comment with ID:', commentId);

    try {
        const result = await Comment.findByIdAndUpdate(
            commentId,
            { $inc: { likes: -1 } },
            { new: true }
        );

        if (!result) {
            logger.error('Comment not found with ID:', commentId);
            return sendError(res, new Error('Comment Not Found'), 'Comment not found', 404);
        }

        logger.info('Comment unliked successfully with ID:', commentId);
        return res.status(200).json({
            message: 'Comment unliked successfully',
            likes: result.likes,
        });
    } catch (error) {
        sendError(res, error, 'Server error during comment unlike');
    }
};

/**
 * Reply to a comment by parent comment ID.
 */
export const replyToComment = async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const { userId } = req.user;

    logger.info('Replying to comment with ID:', commentId);
    if (!content || content.length < 1) {
        logger.error('Reply Creation: No content provided.');
        return sendError(res, new Error('Validation Error'), 'Reply content is required', 400);
    }

    try {
        const parentComment = await Comment.findById(commentId);

        if (!parentComment) {
            logger.error('Parent comment not found with ID:', commentId);
            return sendError(res, new Error('Comment Not Found'), 'Parent comment not found', 404);
        }

        const newComment = new Comment({
            content,
            userId,
            parentId: commentId,
            postId: parentComment.postId,
            likes: 0,
            replies: [],
        });

        await newComment.save();

        parentComment.replies.push(newComment._id);
        await parentComment.save();

        logger.info('Reply created successfully with ID:', newComment._id);
        return res.status(201).json({ success: true, comment: newComment });
    } catch (error) {
        sendError(res, error, 'Server error during reply creation');
    }
};

/**
 * Get a list of comments for a particular post.
 */
export const getCommentsByPost = async (req, res) => {
    const { postId } = req.params;
    logger.info('Fetching comments for post ID:', postId);

    try {
        const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
        logger.info('Comments fetched successfully for post ID:', postId);
        return res.status(200).json(comments);
    } catch (error) {
        sendError(res, error, 'Server error retrieving comments for the post');
    }
};