import { Button } from '@components'; // Assuming you have a Modal component
import { useNotificationContext, usePostContext, usePrivateModalContext } from '@contexts';
import { deletePostById } from '@services/api'; // Ensure these functions are correctly implemented
import { logger } from '@utils';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { memo, useCallback, useState } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const PostCard = memo(({ post, isOwnProfile }) => {
    const { setPosts, refreshPosts, setSelectedPost } = usePostContext();
    const { togglePrivateModal } = usePrivateModalContext();
    const { showNotification } = useNotificationContext();

    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Handler to delete a post
    const handleDeletePost = useCallback(async () => {
        try {
            setIsDeleting(true);
            await deletePostById(post.postId || post._id);
            setPosts((prevPosts) => prevPosts.filter((p) => p.postId !== post.postId && p._id !== post._id));
            refreshPosts();
            showNotification('Post deleted successfully!', 'success');
        } catch (error) {
            logger.error("Error deleting post:", error);
            showNotification('Failed to delete the post. Please try again.', 'error');
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    }, [post, setPosts, refreshPosts, showNotification]);

    // Confirmation before deleting a post
    const confirmDeletePost = useCallback(() => {
        setShowDeleteModal(true);
    }, []);

    // Handler to open edit post modal
    const handleEditPostModal = useCallback(() => {
        setSelectedPost(post); // Set the selected post before opening the modal
        togglePrivateModal('editPost');
        logger.info("EditPostModal opened for post:", post);
    }, [togglePrivateModal, post, setSelectedPost]);

    const navigate = useNavigate();
    const navigateToPost = useCallback(() => navigate(`/blog/${post.postId || post._id}`), [
        navigate,
        post,
    ]);

    return (
        <motion.div
            className="profile-post-card"
            whileHover={{ scale: 1.02, boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)' }}
            onClick={navigateToPost}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
                if (e.key === 'Enter') navigateToPost();
            }}
            aria-label={`Go to blog post titled ${post.title || 'Untitled'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Post Image */}
            <div className="profile-post-card__image-container">
                {post.imageUrls?.length ? (
                    <img
                        src={post.imageUrls[0]}
                        alt={`Cover image for ${post.title || 'Untitled'}`}
                        className="profile-post-card__image"
                        loading="lazy"
                    />
                ) : post.images?.length ? (
                    <img
                        src={`data:image/jpeg;base64,${post.images[0].data}`}
                        alt={`Cover image for ${post.title || 'Untitled'}`}
                        className="profile-post-card__image"
                        loading="lazy"
                    />
                ) : (
                    <div className="profile-post-card__image-placeholder" aria-label="No cover image available">
                        No Image
                    </div>
                )}
            </div>

            {/* Post Content */}
            <div className="profile-post-card__content">
                <div className="profile-post-card__header">
                    <h4 className="profile-post-card__title">{post.title || 'Untitled'}</h4>
                    <span className="profile-post-card__date">
                        {post.createdAt
                            ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
                            : "Date Unavailable"}
                    </span>
                </div>
                <div className="profile-post-card__category">
                    {post.category && <span className="profile-post-card__category-tag">{post.category}</span>}
                </div>
                {/* <p className="profile-post-card__excerpt">
                    {post.excerpt ? post.excerpt : sanitizeContent(post.content).substring(0, 100) + '...'}
                </p> */}
            </div>

            {/* Post Actions */}
            {isOwnProfile && (
                <div className="profile-post-card__actions">
                    <Button
                        className="button button-edit"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEditPostModal();
                        }}
                        showIcon={true}
                        aria-label="Edit post"
                    >
                        <FiEdit className="icon" /> Edit
                    </Button>
                    <Button
                        className="button button-delete"
                        onClick={(e) => {
                            e.stopPropagation();
                            confirmDeletePost();
                        }}
                        showIcon={true}
                        aria-label="Delete post"
                        disabled={isDeleting}
                    >
                        <FiTrash2 className="icon" /> Delete
                    </Button>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <Modal onClose={() => setShowDeleteModal(false)}>
                    <h2>Confirm Deletion</h2>
                    <p>Are you sure you want to delete this post?</p>
                    <div className="profile-modal-actions">
                        <Button
                            className="button button-delete"
                            onClick={handleDeletePost}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                        </Button>
                        <Button
                            className="button button-edit"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </Modal>
            )}
        </motion.div>
    );
});

PostCard.displayName = 'PostCard';

PostCard.propTypes = {
    post: PropTypes.shape({
        postId: PropTypes.string,
        _id: PropTypes.string,
        content: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        title: PropTypes.string,
        category: PropTypes.string,
        imageUrls: PropTypes.arrayOf(PropTypes.string),
        images: PropTypes.arrayOf(
            PropTypes.shape({
                data: PropTypes.string.isRequired,
            })
        ),
        excerpt: PropTypes.string,
    }).isRequired,
    isOwnProfile: PropTypes.bool.isRequired,
};

export default PostCard;