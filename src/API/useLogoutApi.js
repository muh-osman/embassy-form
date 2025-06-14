import { useMutation } from "@tanstack/react-query";
// API base
import API from "./Api";
// Cookies
import { useCookies } from "react-cookie";

export const useLogoutApi = () => {
  // Cookies
  const [cookies, setCookie, removeCookie] = useCookies([
    "token",
    "verified",
    "membershipNumber",
    "role",
    "isUserSentDataBefore",
  ]);

  return useMutation({
    mutationFn: async () => {
      const res = await API.post("api/logout");
      return res.data;
    },

    onSuccess: () => {
      removeCookie("verified");
      removeCookie("token");
      removeCookie("membershipNumber");
      removeCookie("role");
      removeCookie("isUserSentDataBefore");
    },

    onError: (err) => {
      console.error(err);
      removeCookie("verified");
      removeCookie("token");
      removeCookie("membershipNumber");
      removeCookie("role");
      removeCookie("isUserSentDataBefore");
    },
  });
};
