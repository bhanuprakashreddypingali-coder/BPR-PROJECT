import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api"
});

API.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }

        return config;

    },
    (error) => {

        return Promise.reject(error);

    }
);

const AdminService = {

    getDashboard: () => {
        return API.get("/admin/dashboard");
    },

    getUsers: () => {
        return API.get("/admin/users");
    },

    getRestaurants: () => {
        return API.get("/admin/restaurants");
    },

    getFoods: () => {
        return API.get("/admin/foods");
    },

    getOrders: () => {
        return API.get("/admin/orders");
    },

    getPendingOwners: () => {
        return API.get("/admin/owners/pending");
    },

    approveOwner: (id) => {
        return API.put(`/admin/owners/${id}/approve`);
    },

    rejectOwner: (id) => {
        return API.delete(`/admin/owners/${id}/reject`);
    }

};

export default AdminService;