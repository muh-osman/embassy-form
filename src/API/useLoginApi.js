import { useMutation } from "@tanstack/react-query";
// React router
import { useNavigate } from "react-router-dom";
// API base
import API from "./Api";
// Cookies
import { useCookies } from "react-cookie";
// Toastify
import { toast } from "react-toastify";

export const useLoginApi = () => {
  //
  const navigate = useNavigate();
  // Cookies
  const [cookies, setCookie] = useCookies([
    "token",
    "verified",
    "membershipNumber",
    "role",
    "isUserSentDataBefore",
  ]);

  return useMutation({
    mutationFn: async (data) => {
      const res = await API.post("api/login", data);
      return res.data;
    },

    onSuccess: (responseData) => {
      setCookie("verified", responseData.user.email_verified_at);
      setCookie("role", responseData.user.role);
      setCookie("membershipNumber", responseData.user.membership_number);
      setCookie("token", responseData.token);
      setCookie("isUserSentDataBefore", responseData.has_arabic_name);
      navigate("/dashboard", { replace: true });
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
