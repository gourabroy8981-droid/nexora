import API from "./api";

// 🔥 AUTO ATTACH TOKEN
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// 🔥 HANDLE 403
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 403) {
      alert("Access Denied ❌");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

// 🔹 Get all users
export const getAllUsers = () => API.get("/admin/users");

// 🔹 Block user
export const blockUser = (id) => API.put(`/admin/block/${id}`);

// 🔹 Unblock user
export const unblockUser = (id) => API.put(`/admin/unblock/${id}`);

// 🔴 Soft delete user
export const deleteUser = (id) => API.delete(`/admin/user/${id}`);

// 🗑 Hard delete user from DB
export const hardDeleteUser = (id) => API.delete(`/admin/user/hard/${id}`);