import axios from "axios";

const api = axios.create({
  baseURL: "https://delivery-t91f.onrender.com",
});

api.interceptors.request.use(
  (req) => {
    if (localStorage.getItem("sessionToken")) {
      req.headers.Authorization = `Bearer ${localStorage.getItem(
        "sessionToken"
      )}`;
    }

    return req;
  },
  (err) => console.log(err)
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("sessionToken");
      document.location = "/login";
      return error;
    }
  }
);

export default api;
