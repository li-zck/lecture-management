/*
 * ----
 * */

import { parsePhoneNumberFromString } from "libphonenumber-js";
import z from "zod";

const schema = z.object({
	phone: z.string().refine(
		(val) => {
			const num = parsePhoneNumberFromString(val, "VN");

			return num?.isValid() ?? false;
		},
		{ message: "Invalid phone number" },
	),
});

const phone = " 8 (800) 555-35-35 ";

console.log(schema.safeParse(phone));
