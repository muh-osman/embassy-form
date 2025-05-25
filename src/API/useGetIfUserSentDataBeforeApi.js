import { useQuery } from "@tanstack/react-query";
// API
import API from "./Api";
// Cookies
import { useCookies } from "react-cookie";

export const fetchIfUserSentDataBefore = async () => {
  const res = await API.get("api/is-send-data-before");
  return res.data;
};

export default function useGetIfUserSentDataBeforeApi() {
  // Cookie
  const [cookies, setCookie] = useCookies([
    "token",
    "verified",
    "membershipNumber",
    "role",
  ]);

  const membershipNumber = cookies.membershipNumber;

  return useQuery({
    queryKey: ["isUserSentDataBefore", membershipNumber],
    queryFn: () => fetchIfUserSentDataBefore(),
  });
}
