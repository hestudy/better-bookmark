import { auth } from "./auth.js";

export const testLogin = () => {
  return auth.api.signInEmail({
    body: {
      email: "test@example.com",
      password: "testtest",
    },
  });
};
