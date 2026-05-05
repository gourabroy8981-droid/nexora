import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function EditProject() {

    const { projectId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        techStack: "",
        githubLink: "",
        liveDemoLink: ""
    });

    // 🔥 NEW: image state
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    // 🔥 FETCH PROJECT DATA
    useEffect(() => {
        fetchProject();
    }, []);

    const fetchProject = async () => {
        try {
            const res = await API.get(`/projects/${projectId}`);
            setFormData({
                title: res.data.title || "",
                description: res.data.description || "",
                techStack: res.data.techStack || "",
                githubLink: res.data.githubLink || "",
                liveDemoLink: res.data.liveDemoLink || ""
            });

            // 🔥 OPTIONAL: show existing image
            if (res.data.image) {
                setPreview(`http://localhost:8080/uploads/${res.data.image}`);
            }

        } catch (err) {
            alert("Failed to load project");
            navigate("/projects");
        }
    };

    // 🔄 HANDLE INPUT CHANGE
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 🖼 HANDLE IMAGE CHANGE
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);

        if (file) {
            setPreview(URL.createObjectURL(file)); // preview before upload
        }
    };

    // 🔥 UPDATE PROJECT
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (loading) return;

        try {
            setLoading(true);

            // 🔥 USE FORMDATA
            const data = new FormData();

            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("techStack", formData.techStack);
            data.append("githubLink", formData.githubLink);
            data.append("liveDemoLink", formData.liveDemoLink);

            if (image) {
                data.append("file", image); // 🔥 image upload
            }

            await API.put(`/projects/${projectId}`, data);

            alert("Project updated successfully!");
            navigate("/projects");

        } catch (err) {
            alert(err.response?.data || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#0B1120] px-3 sm:px-4 py-6">

            <div className="w-full max-w-sm sm:max-w-md
                    bg-white dark:bg-[#111827]
                    border border-gray-200 dark:border-slate-800
                    p-4 sm:p-5 md:p-6 rounded-2xl shadow-md">

                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center text-gray-800 dark:text-white">
                    ✏️ Edit Project
                </h2>

                <form onSubmit={handleUpdate} className="space-y-3">

                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Project Title"
                        required
                        className="input-style py-2 text-sm sm:text-base"
                    />

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Project Description"
                        required
                        rows="3"
                        className="input-style py-2 resize-none text-sm sm:text-base"
                    />

                    <input
                        type="text"
                        name="techStack"
                        value={formData.techStack}
                        onChange={handleChange}
                        placeholder="Tech Stack"
                        required
                        className="input-style py-2 text-sm sm:text-base"
                    />

                    <input
                        type="text"
                        name="githubLink"
                        value={formData.githubLink}
                        onChange={handleChange}
                        placeholder="GitHub Link"
                        className="input-style py-2 text-sm sm:text-base"
                    />

                    <input
                        type="text"
                        name="liveDemoLink"
                        value={formData.liveDemoLink}
                        onChange={handleChange}
                        placeholder="Live Demo"
                        className="input-style py-2 text-sm sm:text-base"
                    />

                    {/* IMAGE INPUT */}
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="input-style py-2 text-sm sm:text-base"
                    />

                    {/* IMAGE PREVIEW */}
                    {preview && (
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-32 sm:h-40 object-cover rounded-lg mt-2"
                        />
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-lg font-medium transition text-sm sm:text-base ${
                            loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-yellow-500 text-black hover:bg-yellow-400"
                        }`}
                    >
                        {loading ? "Updating..." : "Update Project"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default EditProject;