import { useMutation } from "@tanstack/react-query";
// API base
import API from "./Api";
// Toastify
import { toast } from "react-toastify";
// Cookies
import { useCookies } from "react-cookie";

export const useEditUserApi = () => {
  const [cookies, setCookie] = useCookies([
    "token",
    "verified",
    "membershipNumber",
    "role",
    "isUserSentDataBefore",
  ]);
  return useMutation({
    mutationFn: async (formData) => {
      const res = await API.post(`api/post-user-data`, formData);
      return res.data;
    },

    onSuccess: () => {
      toast.success("تم الارسال");
      setCookie("isUserSentDataBefore", true);
    },

    onError: (err) => {
      console.error(err);
      const errorMessage =
        err?.response?.data?.message || err?.message || "An error occurred";
      // Toastify
      toast.error(errorMessage);
    },
  });
};
