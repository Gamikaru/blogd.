import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import PostModal from "./PostModal";
import { useCookies } from "react-cookie";

const UserCard = ({ userInitials, user }) => (
	<div className="user-card-container">
		<Card className="user-card">
			<Card.Title>{userInitials}</Card.Title>
			<div className="card-text">
				<ul>
					<li>
						<span>Status: </span> {user.status}
					</li>
					<li>
						<span>Email: </span> {user.email}
					</li>
					<li>
						<span>Birthdate: </span> {user.birthdate}
					</li>
					<li>
						<span>Occupation: </span> {user.occupation}
					</li>
					<li>
						<span>Location: </span> {user.location}
					</li>
				</ul>
			</div>
		</Card>
	</div>
);

const PostsCard = ({ userPosts, showModal, handleLike, setShowModal }) => (
	<div className="post-card-container">
		<Card className="posts-card">
			<Card.Body>
				<Card.Title>Posts</Card.Title>
				{userPosts.length > 0 ? (
					userPosts.map((post, index) => (
						<div key={index}>
							<p>{post.content}</p>
							<p>{post.postDate}</p>
							<Button onClick={() => handleLike(index)}>Like</Button>
							<p>Likes: {post.likes}</p>
						</div>
					))
				) : (
					<p>No posts available.</p>
				)}
				<Button onClick={() => setShowModal(true)}>Make a Post!</Button>
			</Card.Body>
		</Card>
	</div>
);

export default function HomePage() {

	const [cookie, setCookie, removeCookie] = useCookies();

	const [user, setUser] = useState({
		first_name: "",
		last_name: "",
		status: "",
		email: "",
		birthdate: "",
		occupation: "",
		location: "",
	});
	const [userPosts, setUserPosts] = useState([]);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		fetchUser();
		fetchPost();
	}, []);

	const fetchUser = async () => {
		const token = cookie.PassBloggs;
		if (!token) {
			console.error("Token not found in localStorage");
			return;
		}
		try {
			const response = await fetch(`http://localhost:5050/user/${cookie.userID}`, {
				headers: {
				Authorization: `Bearer ${token}`,
				},
			});
			if (!response.ok) {
				throw new Error(`Failed to fetch user data: ${response.statusText}`);
			}
			const data = await response.json();
			console.log(data)
			setUser(data);
		} catch (error) {
			console.error("Error fetching user data:", error);
		}
	};

	const fetchPost = async () => {
		const token = cookie.PassBloggs;
		if (!token) {
			console.error("Token not found in localStorage");
			return;
		}
		try {
			const response = await fetch(
				`http://localhost:5050/post/${cookie.userID}`,
				{
					headers: {
					Authorization: `Bearer ${token}`,
					},
				}
			);
			if (!response.ok) {
				throw new Error(`Failed to fetch user data: ${response.statusText}`);
			}
			const data = await response.json();
			console.log(data);
			setUserPosts(data);
		} catch (error) {
			console.error("Error fetching user data:", error);
		}
	};

	const getInitials = (first_name, last_name) => {
		const firstInitial = first_name ? first_name.charAt(0).toUpperCase() : "";
		const lastInitial = last_name ? last_name.charAt(0).toUpperCase() : "";
		return `${firstInitial}${lastInitial}`;
	};

	const userInitials = getInitials(user.first_name, user.last_name);

	const handleLike = (index) => {
		setUserPosts((prevPosts) => {
			const updatedPosts = [...prevPosts];
			updatedPosts[index].likes += 1;
			return updatedPosts;
		});
	};

	return (
		<div className="main-container">
			<UserCard userInitials={userInitials} user={user} />
			<PostsCard
				userPosts={userPosts}
				showModal={showModal}
				handleLike={handleLike}
				setShowModal={setShowModal}
			/>
			<PostModal
				show={showModal}
				handleClose={() => setShowModal(false)}
			/>
		</div>
	);
}
