import Cookie from "js-cookie";

export default {
  Accept: "application/json",
  "Content-Type": "application/json",
  auth: `Bearer ${Cookie.get("token")}`,
};
