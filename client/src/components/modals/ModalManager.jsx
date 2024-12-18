// ModalManager.jsx
import { EditPostModal, PostModal, RegisterModal, UserManager } from '@components';
import { usePrivateModalContext, usePublicModalContext } from '@contexts';
import { AnimatePresence } from 'framer-motion';

const ModalManager = () => {
    const { modalType: publicModalType, showModal: showPublicModal, togglePublicModal } = usePublicModalContext();
    const { modalType: privateModalType, showModal: showPrivateModal, togglePrivateModal } = usePrivateModalContext();

    return (
        <AnimatePresence mode="wait">
            {showPublicModal && publicModalType === 'register' && (
                <RegisterModal onClose={() => togglePublicModal()} />
            )}
            {showPrivateModal && privateModalType === 'post' && (
                <PostModal onClose={() => togglePrivateModal()} />
            )}
            {showPrivateModal && privateModalType === 'editPost' && (
                <EditPostModal onClose={() => togglePrivateModal()} />
            )}
            {showPrivateModal && privateModalType === 'userSettings' && (
                <UserManager onClose={() => togglePrivateModal()} />
            )}
        </AnimatePresence>
    );
};

export default ModalManager;