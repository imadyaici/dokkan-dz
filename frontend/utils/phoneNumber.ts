import {
	parsePhoneNumberWithError,
	type CountryCode as PhoneNumberLibCountryCode,
	type PhoneNumber,
} from "libphonenumber-js/max";
import { useCallback } from "react";

const getPhoneNumberInstance = (phone: string): PhoneNumber | null => {
	try {
		const phoneNumber = parsePhoneNumberWithError(phone, 'DZ');
		return phoneNumber;
	} catch (error) {
		return null;
	}
};

export const isValidPhoneNumber = (phone: string) =>
	!!getPhoneNumberInstance(phone)?.isValid();

export const usePhoneNumberValidator = () => {
	const isValid = useCallback(
		(phone: string) => {
			if (phone === "") {
				return undefined;
			}

			const valid = isValidPhoneNumber(phone);
			return valid ? undefined : 'invalid value';
		},
		[],
	);

	return isValid;
};
