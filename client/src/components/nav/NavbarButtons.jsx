// client/src/components/nav/NavbarButtons.jsx
import { Button } from '@components';
import React from "react";
import { FaFeather, FaSearch, FaUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const NavbarButtons = ({ togglePrivateModal, showUserDropdown, setShowUserDropdown }) => {
    const iconVariants = {
        hover: { scale: 1.1 },
        tap: { scale: 0.95 },
    };

    return (
        <>
            <div className="navbar-links">
                <NavLink to="/" className="nav-link" end>
                    Home
                </NavLink>
                <NavLink to="/admin" className="nav-link">
                    Admin
                </NavLink>
                <NavLink to="/network" className="nav-link">
                    Network
                </NavLink>
            </div>
            <Button
                className="search-icon"
                whileHover="hover"
                whileTap="tap"
                variants={iconVariants}
                aria-label="Search"
                variant="iconButton"
                icon={FaSearch}
            />
            <Button
                className="create-post-icon"
                onClick={() => togglePrivateModal("post")}
                whileHover="hover"
                whileTap="tap"
                variants={iconVariants}
                aria-label="Create Post"
                variant="iconButton"
                icon={FaFeather}
            />
            <Button
                className="user-icon"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                whileHover="hover"
                whileTap="tap"
                variants={iconVariants}
                aria-label="User menu"
                variant="iconButton"
                icon={FaUser}
            />
        </>
    );
};

export default NavbarButtons;