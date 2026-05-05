import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function CreateProject() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    githubLink: "",
    liveDemoLink: ""
  });

  // ✅ NEW: image state
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      // ✅ NEW: use FormData
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("techStack", formData.techStack);
      data.append("githubLink", formData.githubLink);
      data.append("liveDemoLink", formData.liveDemoLink);

      if (image) {
        data.append("file", image); // 🔥 image added
      }

      await API.post("/projects", data);

      navigate("/projects");

    } catch (error) {
      alert(error.response?.data || "Failed to create project");
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

          {/* Title */}
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-white text-center">
            🚀 Create Project
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">

            <input
                type="text"
                name="title"
                placeholder="Project Title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-style py-2 text-sm sm:text-base"
            />

            <textarea
                name="description"
                placeholder="Project Description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="2"
                className="input-style py-2 resize-none text-sm sm:text-base"
            />

            <input
                type="text"
                name="techStack"
                placeholder="Tech Stack"
                value={formData.techStack}
                onChange={handleChange}
                required
                className="input-style py-2 text-sm sm:text-base"
            />

            <input
                type="text"
                name="githubLink"
                placeholder="GitHub Link"
                value={formData.githubLink}
                onChange={handleChange}
                className="input-style py-2 text-sm sm:text-base"
            />

            <input
                type="text"
                name="liveDemoLink"
                placeholder="Live Demo"
                value={formData.liveDemoLink}
                onChange={handleChange}
                className="input-style py-2 text-sm sm:text-base"
            />

            {/* IMAGE INPUT */}
            <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="input-style py-2 text-sm sm:text-base"
            />

            <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-lg font-medium transition text-sm sm:text-base ${
                    loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-cyan-500 text-black hover:bg-cyan-400"
                }`}
            >
              {loading ? "Creating..." : "Create"}
            </button>

          </form>

        </div>
      </div>
  );
}

export default CreateProject;