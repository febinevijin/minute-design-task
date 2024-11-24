import Joi from "joi";

export const userSignUpValidation = Joi.object({
  firstName: Joi.string()
    .min(3) // Ensure at least one character is present
    // .custom((value, helpers) => {
    //   if (value.trim().split(/\s+/).length <= 3) {

    //     return helpers.message(
    //       "first name must be a string with more than 3 words."
    //     );
    //   }
    //   return value;
    // })
    .required(),
  lastName: Joi.string()
    .min(1) // Ensure at least one character is present
    // .custom((value, helpers) => {
    //   if (value.trim().split(/\s+/).length <= 3) {
    //     return helpers.message("Name must be a string with more than 3 words.");
    //   }
    //   return value;
    // })
    .required(),

  email: Joi.string()
    .email({ tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.email": "Email must be valid and end with .com or .net.",
    }),
  userName: Joi.string()
    .min(3) // Ensure at least one character is present
    .required()
    .pattern(/^\S*$/, "no spaces") // This pattern disallows spaces
    .messages({
      "string.pattern.name": "Username should not contain spaces", // Custom error message
    }),

  countryCode: Joi.string()
    .pattern(/^\+\d+$/, "country code")
    .required()
    .messages({
      "string.pattern.name":
        "Country code must start with a '+' followed by digits.",
    }),

  phone: Joi.string()
    .pattern(/^\d{10}$/, "phone number")
    .required()
    .messages({
      "string.pattern.name": "Phone number must be exactly 10 digits long.",
    }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be more than 8 characters long.",
  }),
});
