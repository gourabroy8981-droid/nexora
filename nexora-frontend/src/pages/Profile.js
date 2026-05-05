import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Profile() {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);

    const [profile, setProfile] = useState(null);
    const [projects, setProjects] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);

    // ✅ STATES
    const [mobile, setMobile] = useState("");
    const [bio, setBio] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [loggedInUserId, setLoggedInUserId] = useState(null);

    const navigate = useNavigate();
    const { userId } = useParams();

    useEffect(() => {
        fetchProfile();
    }, [userId]);

    useEffect(() => {
        fetchProjects();
    }, [currentUserId]);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const decoded = jwtDecode(token);
            const email = decoded.sub;

            const userRes = await API.get(`/users/email/${email}`);
            const loggedInId = userRes.data.id;
            setLoggedInUserId(loggedInId);

            const targetId = userId || loggedInId;
            const response = await API.get(`/users/${targetId}/profile`);

            setProfile(response.data);
            setCurrentUserId(response.data.id);
            setIsFollowing(response.data.followingUser || false);
            setMobile(response.data.mobile || "");
            setBio(response.data.bio || "");
        } catch (err) {
            console.error(err);
            navigate("/");
        }
    };

    const fetchProjects = async () => {
        try {
            if (!currentUserId) return;
            const response = await API.get(`/projects/user/${currentUserId}`);
            setProjects(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFollowToggle = async () => {
        try {
            const followerId = loggedInUserId;
            if (followerId.toString() === currentUserId.toString()) return;

            if (isFollowing) {
                await API.delete(`/users/${followerId}/unfollow/${currentUserId}`);
                setIsFollowing(false);
                setProfile((prev) => ({ ...prev, followers: prev.followers - 1 }));
            } else {
                await API.post(`/users/${followerId}/follow/${currentUserId}`);
                setIsFollowing(true);
                setProfile((prev) => ({ ...prev, followers: prev.followers + 1 }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleUpdateProfile = async () => {
        try {
            const formData = new FormData();
            formData.append("mobile", mobile);
            formData.append("bio", bio);
            if (image) formData.append("file", image);

            await API.put("/users/profile", formData);
            await fetchProfile();
            alert("Profile updated!");
            setImage(null);
            setIsEditing(false);
        } catch (err) {
            console.error("ERROR:", err);
        }
    };

    const getBadgeColor = (badge) => {
        switch (badge) {
            case "GOLD": return "text-yellow-500 dark:text-yellow-400 font-bold";
            case "SILVER": return "text-gray-400 dark:text-gray-300 font-bold";
            case "BRONZE": return "text-orange-500 dark:text-orange-400 font-bold";
            default: return "text-slate-400";
        }
    };

    if (!profile)
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0F172A]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
            </div>
        );

    return (
        <div className="min-h-screen bg-[#F3F2EF] dark:bg-[#0F172A] py-4 sm:py-6 md:py-8 px-3 sm:px-4 transition-colors duration-300">

            <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">

                {/* HEADER CARD */}
                <div className="bg-white dark:bg-[#1B2733] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">

                    <div className="h-32 sm:h-40 bg-gradient-to-r from-slate-700 to-slate-900 dark:from-blue-900 dark:to-slate-900"></div>

                    <div className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">

                        <div className="relative flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4">

                            {/* Profile Image */}
                            <div className="-mt-12 sm:-mt-16 relative">
                                <img
                                    src={preview ? preview : profile?.profileImage ? `http://localhost:8080/uploads/${profile.profileImage}` : `https://ui-avatars.com/api/?name=${profile?.name}&background=random`}
                                    alt="profile"
                                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-[#1B2733]"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-wrap gap-2">

                                {loggedInUserId !== currentUserId && (
                                    <button
                                        onClick={handleFollowToggle}
                                        className={`px-4 sm:px-6 py-1.5 rounded-full text-sm font-semibold transition ${
                                            isFollowing
                                                ? "border border-gray-400 text-gray-600"
                                                : "bg-blue-600 text-white"
                                        }`}
                                    >
                                        {isFollowing ? "Following ✓" : "Connect"}
                                    </button>
                                )}

                                {loggedInUserId === currentUserId && (
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="px-4 sm:px-6 py-1.5 border border-blue-600 text-blue-600 rounded-full text-sm font-semibold"
                                    >
                                        {isEditing ? "Cancel" : "Edit Profile"}
                                    </button>
                                )}

                            </div>
                        </div>

                        {/* INFO */}
                        <div className="mt-3 sm:mt-4">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                {profile.name}
                            </h2>

                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 italic">
                                {profile.bio || "Software Engineer | Developer"}
                            </p>

                            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs sm:text-sm text-gray-500">
                                <span>📱 {profile.mobile || "No contact info"}</span>
                                <span>•</span>
                                <span>{profile.followers} followers</span>
                                <span>•</span>
                                <span>{profile.following} connections</span>
                            </div>
                        </div>

                        {/* EDIT FORM */}
                        {isEditing && (
                            <div className="mt-4 sm:mt-6 p-4 sm:p-6 border rounded-xl space-y-3 sm:space-y-4">

                                <input type="file" onChange={handleImageChange} />

                                <input
                                    type="text"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    placeholder="Mobile"
                                    className="w-full p-2 text-sm sm:text-base"
                                />

                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="About"
                                    className="w-full p-2 text-sm sm:text-base"
                                />

                                <button
                                    onClick={handleUpdateProfile}
                                    className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg text-sm"
                                >
                                    Save
                                </button>

                            </div>
                        )}

                    </div>
                </div>

                {/* STATS */}
                <div className="bg-white dark:bg-[#1B2733] border rounded-xl p-4 sm:p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        <Stat label="DevScore" value={profile.devScore} />
                        <Stat label="Badge" value={profile.badge} />
                        <Stat label="Rank" value={`#${profile.rank}`} />
                        <Stat label="Likes" value={profile.totalLikesReceived} />
                    </div>
                </div>

                {/* PROJECTS */}
                <div className="bg-white dark:bg-[#1B2733] border rounded-xl p-4 sm:p-6">

                    {projects.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm">
                            No projects yet
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="bg-white dark:bg-[#24313E] rounded-xl overflow-hidden shadow-sm"
                                >

                                    <div className="h-36 sm:h-44">
                                        {project.image ? (
                                            <img
                                                src={`http://localhost:8080/uploads/${project.image}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-3 sm:p-4">
                                        <h4 className="text-sm sm:text-base font-semibold">
                                            {project.title}
                                        </h4>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                                            {project.description}
                                        </p>
                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}

/* REUSABLE UI COMPONENTS */

function Stat({ label, value, highlight, customClass }) {
    return (
        <div className="p-4 bg-gray-50 dark:bg-[#24313E] rounded-lg border border-gray-100 dark:border-gray-700 text-center hover:bg-gray-100 dark:hover:bg-gray-700/50 transition duration-200">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className={`text-xl font-black ${highlight ? "text-blue-600 dark:text-blue-400" : "text-gray-800 dark:text-gray-100"} ${customClass || ""}`}>
                {value}
            </p>
        </div>
    );
}

export default Profile;