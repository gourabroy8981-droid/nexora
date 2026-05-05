import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProjectFeed() {
    const [projects, setProjects] = useState([]);
    const [comments, setComments] = useState({});
    const [newComments, setNewComments] = useState({});
    const [replyBox, setReplyBox] = useState({});
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    let loggedInUserEmail = null;

    if (token) {
        const decoded = jwtDecode(token);
        loggedInUserEmail = decoded.sub;
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await API.get("/projects");
            setProjects(response.data);
            response.data.forEach((p) => fetchComments(p.id));
        } catch (error) {
            navigate("/");
        }
    };

    const handleDelete = async (projectId) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            await API.delete(`/projects/${projectId}`);
            fetchProjects();
        } catch (err) {
            alert(err.response?.data || "Delete failed");
        }
    };

    const handleLike = async (projectId) => {
        try {
            await API.post(`/projects/${projectId}/like`);
            fetchProjects();
        } catch (error) {
            alert(error.response?.data || "Error liking project");
        }
    };

    const fetchComments = async (projectId) => {
        try {
            const res = await API.get(`/comments/${projectId}`);
            setComments((prev) => ({ ...prev, [projectId]: res.data }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddComment = async (projectId) => {
        const text = newComments[projectId];
        if (!text || !text.trim()) return;
        try {
            await API.post(`/comments/${projectId}`, { content: text });
            setNewComments((prev) => ({ ...prev, [projectId]: "" }));
            fetchComments(projectId);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteComment = async (commentId, projectId) => {
        try {
            await API.delete(`/comments/${commentId}`);
            fetchComments(projectId);
        } catch (err) {
            alert(err.response?.data || "Delete failed");
            console.error(err);
        }
    };

    const handleReply = async (projectId, parentId) => {
        const text = replyBox[parentId];
        if (!text || !text.trim()) return;
        try {
            await API.post(`/comments/${projectId}`, {
                content: text,
                parentId: parentId,
            });
            setReplyBox((prev) => ({ ...prev, [parentId]: "" }));
            fetchComments(projectId);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-[#0B1120] py-6 sm:py-8 md:py-10 px-3 sm:px-4 transition-colors duration-500 font-sans">

            <div className="max-w-5xl mx-auto">

                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-6 sm:mb-8 md:mb-10 text-gray-800 dark:text-white">
                    🚀 Nexora Project Feed
                </h2>

                {projects.length === 0 ? (
                    <p className="text-center text-sm sm:text-base text-gray-500 dark:text-slate-400">
                        No projects available.
                    </p>
                ) : (
                    <div className="grid gap-5 sm:gap-6 md:gap-8">

                        {projects.map((project, index) => (
                            <div
                                key={project.id}
                                className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 md:p-6 transition-all duration-300 hover:shadow-lg"
                            >

                                {project.image && (
                                    <img
                                        src={`http://localhost:8080/uploads/${project.image}`}
                                        alt="Project"
                                        className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover rounded-lg mb-4"
                                    />
                                )}

                                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white">
                                    {project.title}
                                </h3>

                                <p className="text-sm sm:text-base text-gray-600 dark:text-slate-400 mt-2">
                                    {project.description}
                                </p>

                                {/* TECH STACK */}
                                <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
                                    {project.techStack?.split(",").map((tech, i) => (
                                        <span
                                            key={i}
                                            className="bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-white px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                                        >
                    {tech.trim()}
                  </span>
                                    ))}
                                </div>

                                {/* OWNER */}
                                <div className="mt-3 sm:mt-4 text-xs sm:text-sm">
                <span className="font-semibold text-gray-700 dark:text-white">
                  Owner:
                </span>{" "}
                                    <span
                                        className="text-cyan-500 cursor-pointer hover:underline"
                                        onClick={() => navigate(`/profile/${project.ownerId}`)}
                                    >
                  {project.ownerName}
                </span>
                                </div>

                                <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-slate-400">
                                    ❤️ {project.likeCount} Likes
                                </p>

                                {/* BUTTONS */}
                                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6 pt-4 sm:pt-6 border-t gap-3">

                                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">

                                        {project.githubLink && (
                                            <a
                                                href={project.githubLink}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-3 sm:px-4 py-2 bg-slate-800 text-white rounded-lg text-xs sm:text-sm"
                                            >
                                                🐙 GitHub
                                            </a>
                                        )}

                                        {project.liveDemoLink && (
                                            <a
                                                href={project.liveDemoLink}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-3 sm:px-4 py-2 bg-teal-500 text-white rounded-lg text-xs sm:text-sm"
                                            >
                                                🌐 Demo
                                            </a>
                                        )}

                                        <button
                                            onClick={() => navigate(`/chat/${project.ownerId}`)}
                                            className="px-3 sm:px-4 py-2 bg-cyan-500 text-black rounded-lg text-xs sm:text-sm"
                                        >
                                            💬 Message
                                        </button>

                                    </div>

                                    <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">

                                        {project.ownerEmail === loggedInUserEmail && (
                                            <>
                                                <button
                                                    onClick={() => navigate(`/edit-project/${project.id}`)}
                                                    className="px-3 py-2 bg-yellow-500 text-black rounded-lg text-xs sm:text-sm"
                                                >
                                                    ✏️ Edit
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(project.id)}
                                                    className="px-3 py-2 bg-red-600 text-white rounded-lg text-xs sm:text-sm"
                                                >
                                                    🗑 Delete
                                                </button>
                                            </>
                                        )}

                                        <button
                                            onClick={() => handleLike(project.id)}
                                            className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg text-xs sm:text-sm"
                                        >
                                            ❤️ Like
                                        </button>

                                    </div>
                                </div>

                                {/* COMMENTS */}
                                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">

                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <input
                                            type="text"
                                            placeholder="Write a comment..."
                                            value={newComments[project.id] || ""}
                                            onChange={(e) =>
                                                setNewComments((prev) => ({
                                                    ...prev,
                                                    [project.id]: e.target.value,
                                                }))
                                            }
                                            className="flex-1 p-2 rounded-lg bg-gray-100 dark:bg-[#1f2937] dark:text-white text-sm"
                                        />

                                        <button
                                            onClick={() => handleAddComment(project.id)}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm"
                                        >
                                            Post
                                        </button>
                                    </div>

                                    <div className="mt-4 space-y-3">

                                        {(comments[project.id] || []).map((c) => (
                                            <div
                                                key={c.id}
                                                className="text-xs sm:text-sm bg-gray-50 dark:bg-[#1f2937]/50 p-3 rounded-lg"
                                            >

                                                <div className="flex flex-col sm:flex-row justify-between gap-2">

                        <span className="dark:text-white">
                          <strong className="text-cyan-600 dark:text-cyan-400">
                            {c.username}:
                          </strong>{" "}
                            {c.content}
                        </span>

                                                    <div className="flex gap-3 text-xs">
                                                        <button
                                                            onClick={() => handleDeleteComment(c.id, project.id)}
                                                            className="text-red-500 hover:underline"
                                                        >
                                                            Delete
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                setReplyBox((prev) => ({
                                                                    ...prev,
                                                                    [c.id]: !prev[c.id],
                                                                }))
                                                            }
                                                            className="text-blue-500 hover:underline"
                                                        >
                                                            Reply
                                                        </button>
                                                    </div>

                                                </div>

                                                {replyBox[c.id] && (
                                                    <div className="mt-3 pl-3 border-l-2 border-cyan-500">

                                                        <input
                                                            type="text"
                                                            placeholder="Reply..."
                                                            value={replyBox[c.id] || ""}
                                                            onChange={(e) =>
                                                                setReplyBox((prev) => ({
                                                                    ...prev,
                                                                    [c.id]: e.target.value,
                                                                }))
                                                            }
                                                            className="w-full p-2 text-xs sm:text-sm"
                                                        />

                                                        <button
                                                            onClick={() => handleReply(project.id, c.id)}
                                                            className="text-xs text-purple-500 font-bold mt-2"
                                                        >
                                                            SEND
                                                        </button>

                                                    </div>
                                                )}

                                            </div>
                                        ))}

                                    </div>

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </div>
        </div>
    );
}

export default ProjectFeed;