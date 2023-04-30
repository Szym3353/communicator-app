import Cookie from "js-cookie";

export default function getHeaders(): HeadersInit | undefined {
  const object: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  let token = Cookie.get("token");
  token && (object.auth = `Bearer ${token}`);

  return object;
}
