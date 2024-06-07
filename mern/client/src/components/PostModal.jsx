import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function PostModal({ show, handleClose, createPost }) {
    const [content, setContent] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newPost = { content, postDate: new Date().toLocaleString(), likes: 0 };
            await createPost(newPost);
            setContent("");
            handleClose();
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    const handleChange = (e) => {
        setContent(e.target.value);
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Create a Post!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="postContent">
                        <Form.Control
                            className="text-form"
                            as="textarea"
                            rows={5}
                            value={content}
                            onChange={handleChange}
                            placeholder="Write your post here..."
                        />
                    </Form.Group>
                    <Button className="submit-button" type="submit">
                        Post
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
