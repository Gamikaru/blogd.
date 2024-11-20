// src/components/nav/PageInfo.jsx
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';

const PageInfo = ({ welcomeText, categories, location }) => {
    const pageInfoVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    };

    // Determine if the current page is the profile page
    const isProfilePage = location.pathname.startsWith('/profile');

    return (
        <div className="info-and-explore-container">
            {!isProfilePage && (
                <motion.div
                    className={`page-info-message ${
                        welcomeText.isBlogPage ? 'blog-page-info' : ''
                    }`}
                    variants={pageInfoVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h1 className="page-title">{welcomeText.title}</h1>
                    {welcomeText.subtitle && (
                        welcomeText.isBlogPage ? (
                            <p className="page-subtitle blog-subtitle">
                                {welcomeText.subtitle}
                            </p>
                        ) : (
                            <p className="page-subtitle">{welcomeText.subtitle}</p>
                        )
                    )}
                </motion.div>
            )}

            {location.pathname === '/' && (
                <>
                    <div className="explore-links">
                        {categories.map((category) => (
                            <NavLink
                                key={category}
                                to={`/${category.toLowerCase()}`}
                                className="explore-link"
                            >
                                {category}
                            </NavLink>
                        ))}
                    </div>
                    {/* <div>
                        <h2 className="cubes-title">Most Liked</h2>
                    </div> */}
                </>
            )}
        </div>
    );
};

PageInfo.propTypes = {
    welcomeText: PropTypes.shape({
        title: PropTypes.string.isRequired,
        subtitle: PropTypes.string,
        avatarUrl: PropTypes.string,
        isBlogPage: PropTypes.bool, // Added isBlogPage
    }).isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
};

export default React.memo(PageInfo);