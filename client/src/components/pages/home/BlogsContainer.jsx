// src/components/BlogsContainer.jsx

import { Button, Spinner } from '@components';
import { usePostContext } from '@contexts';
import { logger } from '@utils';
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { FaFilter, FaSearch } from "react-icons/fa";
import BlogCard from './BlogCard';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const searchInputVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: { width: '200px', opacity: 1 },
};

const filterDropdownVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
};

const BlogsContainer = () => {
    const [cookies] = useCookies(['userID']);
    const { posts, loading, loadPosts } = usePostContext();
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [filters, setFilters] = useState({
        author: "",
        category: "",
        sortBy: "",
    });
    const [search, setSearch] = useState("");

    const filterRef = useRef(null);
    const searchRef = useRef(null);

    useEffect(() => {
        logger.info("Fetching blog posts...");
        loadPosts();
    }, [loadPosts]);

    const getAuthor = useCallback((post) => {
        if (!post?.userId) return "Unknown Author";
        const { firstName = '', lastName = '' } = post.userId;
        return `${firstName} ${lastName}`.trim();
    }, []);

    const handleFilterChange = useCallback((e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    }, []);

    const debouncedHandleSearchChange = useMemo(
        () => debounce((value) => setSearch(value), 300),
        []
    );

    const handleSearchChange = useCallback((e) => {
        debouncedHandleSearchChange(e.target.value);
    }, [debouncedHandleSearchChange]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilterDropdown(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchInput(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            debouncedHandleSearchChange.cancel();
        };
    }, [debouncedHandleSearchChange]);

    const filteredPosts = useMemo(() => {
        if (!posts) return [];
        const searchLower = search.toLowerCase();

        logger.info('Filtering posts:', {
            totalPosts: posts.length,
            filters,
            search: searchLower
        });

        const filtered = posts.filter((post) => {
            const postAuthor = getAuthor(post).toLowerCase();
            const matchesAuthor = !filters.author ||
                postAuthor.includes(filters.author.toLowerCase());
            const matchesCategory = !filters.category ||
                post.category === filters.category;
            const matchesSearch = !search ||
                (post.title?.toLowerCase().includes(searchLower) ||
                    post.content?.toLowerCase().includes(searchLower) ||
                    postAuthor.includes(searchLower));

            logger.debug('Post filter results:', {
                postId: post._id,
                author: postAuthor,
                category: post.category,
                matchesAuthor,
                matchesCategory,
                matchesSearch
            });

            return matchesAuthor && matchesCategory && matchesSearch;
        });

        logger.info('Filtered results:', {
            filteredCount: filtered.length
        });

        return filtered;
    }, [posts, filters, search, getAuthor]);

    const sortedPosts = useMemo(() => {
        const sorted = [...filteredPosts];
        if (filters.sortBy === "name") {
            sorted.sort((a, b) => getAuthor(a).localeCompare(getAuthor(b)));
        } else if (filters.sortBy === "title") {
            sorted.sort((a, b) => a.title?.localeCompare(b.title) || 0);
        }
        return sorted;
    }, [filteredPosts, filters.sortBy, getAuthor]);

    const resetFilters = useCallback(() => {
        setFilters({
            author: "",
            category: "",
            sortBy: "",
        });
        setSearch("");
    }, []);

    if (loading) return <Spinner message="Loading blog posts..." />;
    if (!posts) return <div className="error-message">No posts available</div>;

    return (
        <div className="blogs-container">
            {/* Title and Subtitle Section */}
            <div className="blogs-header">
                <h1 className="blogs-title">Discover</h1>
                <p className="blogs-subtitle">
                    Explore the best blogs crafted by creative minds around the world. Search, filter, and dive into stories that inspire.
                </p>
            </div>
            <div className="filter-search-container">
                {/* Filter Functionality */}
                <div className="filter-container" ref={filterRef}>
                    <Button
                        className="filter-icon"
                        onClick={() => setShowFilterDropdown((prev) => !prev)}
                        variant="iconButton"
                        aria-label="Filter"
                    >
                        <FaFilter />
                    </Button>
                    <AnimatePresence>
                        {showFilterDropdown && (
                            <motion.div
                                className="filter-dropdown"
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={filterDropdownVariants}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                <div className="filter-option">
                                    <label htmlFor="author">Author:</label>
                                    <input
                                        type="text"
                                        id="author"
                                        name="author"
                                        value={filters.author}
                                        onChange={handleFilterChange}
                                        aria-label="Filter by author"
                                    />
                                </div>
                                <div className="filter-option">
                                    <label htmlFor="category">Category:</label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={filters.category}
                                        onChange={handleFilterChange}
                                        aria-label="Filter by category"
                                    >
                                        <option value="">All</option>
                                        <option value="Health and Fitness">Health and Fitness</option>
                                        <option value="Lifestyle">Lifestyle</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Cooking">Cooking</option>
                                        <option value="Philosophy">Philosophy</option>
                                        <option value="Productivity">Productivity</option>
                                        <option value="Art">Art</option>
                                        <option value="Music">Music</option>
                                        <option value="Business">Business</option>
                                        <option value="Business & Finance">Business & Finance</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="filter-option">
                                    <label htmlFor="sortBy">Sort By:</label>
                                    <select
                                        id="sortBy"
                                        name="sortBy"
                                        value={filters.sortBy}
                                        onChange={handleFilterChange}
                                        aria-label="Sort posts"
                                    >
                                        <option value="">None</option>
                                        <option value="name">Author Name</option>
                                        <option value="title">Title</option>
                                    </select>
                                </div>
                                {/* Reset Filters Button */}
                                <div className="filter-option filter-actions">
                                    <Button
                                        onClick={resetFilters}
                                        variant="reset"
                                        aria-label="Reset Filters"
                                    >
                                        Reset Filters
                                    </Button>

                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className="search-container" ref={searchRef}>
                    <Button
                        className="search-icon"
                        onClick={() => setShowSearchInput((prev) => !prev)}
                        variant="iconButton"
                        aria-label="Search"
                    >
                        <FaSearch />
                    </Button>

                    <AnimatePresence>
                        {showSearchInput && (
                            <motion.input
                                type="text"
                                className="search-input"
                                placeholder="Search by author or title"
                                onChange={handleSearchChange}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={searchInputVariants}
                                transition={{ duration: 0.3 }}
                                aria-label="Search input"
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Blog Posts Grid */}
            <AnimatePresence>
                <LayoutGroup>
                    <motion.div
                        className="blog-posts-grid"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        layout
                    >
                        {sortedPosts.length > 0 ? (
                            sortedPosts.map((post) => (
                                <BlogCard
                                    key={post.postId || post._id}
                                    post={post}
                                    author={getAuthor(post)}
                                    cookie={cookies.userID}
                                />
                            ))
                        ) : (
                            <p className="no-posts-message">No blog posts available.</p>
                        )}
                    </motion.div>
                </LayoutGroup>
            </AnimatePresence>
        </div>
    );
};

export default BlogsContainer;