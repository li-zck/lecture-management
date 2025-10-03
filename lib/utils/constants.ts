const CONTEXT = "api";

export const BACKEND_URL =
	`${process.env.NEXT_PUBLIC_BACKEND_URL}/${CONTEXT}` ||
	"http://localhost:8080/api";

export const ROUTES = {
	signup: "sign-up",
	signin: "sign-in",
	signout: "sign-out",
};
