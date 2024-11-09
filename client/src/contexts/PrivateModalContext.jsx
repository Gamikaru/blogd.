import { Logger } from '@components';
import { createContext, useContext, useState } from 'react';

// Create PrivateModalContext
const PrivateModalContext = createContext();

// Custom hook to use PrivateModalContext
const usePrivateModalContext = () => useContext(PrivateModalContext);

// Provider component to wrap the app or components that need private modal management
const PrivateModalProvider = ({ children }) => {
    const [privateModalState, setPrivateModalState] = useState({
        showModal: false,
        modalType: null, // Can be 'post', 'editPost', etc.
    });

    // Function to toggle private modal visibility
    const togglePrivateModal = (modalType = null) => {
        Logger.info(`Toggling private modal: ${modalType}`);
        setPrivateModalState((prev) => ({
            showModal: !prev.showModal,
            modalType: !prev.showModal ? modalType : null,
        }));
    };

    return (
        <PrivateModalContext.Provider value={{ ...privateModalState, togglePrivateModal }}>
            {children}
        </PrivateModalContext.Provider>
    );
};

export default PrivateModalProvider;
export { usePrivateModalContext };