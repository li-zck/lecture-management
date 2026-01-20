const CONTEXT = "api";

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
	? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${CONTEXT}`
	: "http://localhost:8080/api";

export const ROUTES = {
	mainSite: {
		signup: "/sign-up",
		signin: "/sign-in",
		signout: "/sign-out",
		home: "/",
	},

	adminSite: {
		auth: {
			signup: "/admin/sign-up",
			signin: "/admin/sign-in",
		},
		management: {
			student: "/admin/management/student",
			lecturer: "/admin/management/lecturer",
			department: "/admin/management/department",
		},
	},
};

export const APIROUTES = {
	auth: {
		student: {
			signup: "/auth/student/signup",
			signin: "/auth/student/signin",
		},

		lecturer: {
			signup: "/auth/lecturer/signup",
			signin: "/auth/lecturer/signin",
		},
	},

	admin: {
		auth: {
			signup: "/auth/admin/signup",
			signin: "/auth/admin/signin",
		},

		create: {
			admin: {
				each: "/admin/create",
			},
			student: {
				each: "/admin/student/create",
				multiple: "/admin/student/create/multiple",
			},
			lecturer: {
				each: "/admin/lecturer/create",
				multiple: "/admin/lecturer/create/multiple",
			},
			department: {
				each: "/admin/department/create",
				multiple: "/admin/department/create/multiple",
			},
		},

		view: {
			admin: {
				each: "/admin/find/:id",
				all: "/admin/all",
			},
			student: {
				each: "/admin/student/find/:id",
				all: "/admin/student/all",
				find: "/admin/student/find",
			},
			lecturer: {
				each: "/admin/lecturer/find/:id",
				all: "/admin/lecturer/all",
			},
			department: {
				each: "/admin/department/find/:id",
				all: "/admin/department/all",
			},
		},

		update: {
			admin: {
				each: "/admin/update/:id",
			},
			student: {
				each: "/admin/student/update/:id",
			},
			lecturer: {
				each: "/admin/lecturer/update/:id",
			},
			department: {
				each: "/admin/department/update/:id",
			},
		},

		delete: {
			admin: {
				each: "/admin/admin/delete/:id",
				many: "/admin/admin/delete",
			},
			student: {
				each: "/admin/student/delete/:id",
				many: "/admin/student/delete",
			},
			lecturer: {
				each: "/admin/lecturer/delete/:id",
				many: "/admin/lecturer/delete",
			},
			department: {
				each: "/admin/department/delete/:id",
				many: "/admin/department/delete",
			},
		},
	},
};
