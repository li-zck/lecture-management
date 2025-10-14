import { compare, hash } from "bcryptjs";

export const hashPassword = async (password: string) => {
	const salt = 10;
	return await hash(password, salt);
};

export const validatePassword = async ({
	password,
	passwordHash,
}: {
	password: string;
	passwordHash: string;
}) => {
	return await compare(password, passwordHash);
};
