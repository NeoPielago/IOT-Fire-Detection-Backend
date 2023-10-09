import { body, validationResult } from "express-validator";

const errorFormatter = ({ msg, param }) => ({
  msg,
  path: param,
});

const containsLetterAndNumber = (value) =>
  /[a-zA-Z]/.test(value) && /\d/.test(value);

const validateUpdateInput = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .toLowerCase()
    .withMessage("Email must be a valid email")
    .trim(),

  body("contactNo")
    .isNumeric()
    .withMessage("contactNo must be a valid phone number")
    .isLength({ min: 11, max: 11 })
    .withMessage("contactNo must have a length of 11 digits "),

  body("streetName")
    .isLength({ min: 3 })
    .withMessage(
      "streetName cannot be blank and should have a minimum of 3 characters"
    ),

  body("barangay")
    .isLength({ min: 3 })
    .withMessage(
      "barangay cannot be blank and should have a minimum of 3 characters"
    ),

  body("city")
    .isLength({ min: 3 })
    .withMessage(
      "city cannot be blank and should have a minimum of 3 characters"
    ),

  (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    next();
  },
];

const validateRegistration = [
  body("firstName").notEmpty().withMessage("FirstName is required."),

  body("lastName").notEmpty().withMessage("lastName is required."),

  body("contactNo")
    .isNumeric()
    .withMessage("contactNo must be a valid phone number"),

  body("streetName")
    .isLength({ min: 3 })
    .withMessage(
      "streetName cannot be blank and should have a minimum of 3 characters"
    ),

  body("barangay")
    .isLength({ min: 3 })
    .withMessage(
      "barangay cannot be blank and should have a minimum of 3 characters"
    ),

  body("city")
    .isLength({ min: 3 })
    .withMessage(
      "city cannot be blank and should have a minimum of 3 characters"
    ),

  body("email")
    .isEmail()
    .normalizeEmail()
    .toLowerCase()
    .withMessage("Email must be a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password length must be greater than 8 characters")
    .custom(containsLetterAndNumber)
    .withMessage("Password must contain letters and numbers"),

  (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    next();
  },
];

const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .toLowerCase()
    .withMessage("Email must be a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password length must be greater than 8 characters")
    .custom(containsLetterAndNumber)
    .withMessage("Password must contain letters and numbers"),

  (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    next();
  },
];

const validateGetUser = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .toLowerCase()
    .withMessage("Email must be a valid email"),

  (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    next();
  },
];

const validateAdminReg = [
  body("firstName").notEmpty().withMessage("FirstName is required."),

  body("lastName").notEmpty().withMessage("lastName is required."),

  body("email")
    .isEmail()
    .normalizeEmail()
    .toLowerCase()
    .withMessage("Email must be a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password length must be greater than 8 characters")
    .custom(containsLetterAndNumber)
    .withMessage("Password must contain letters and numbers"),

  (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    next();
  },
];

const validateGetAdmin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .toLowerCase()
    .withMessage("Email must be a valid email"),

  (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    next();
  },
];

const validateUpdateAdmin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .toLowerCase()
    .withMessage("Email must be a valid email"),
  body("isRevoked")
    .notEmpty()
    .withMessage("isRevoked value required, when updating admin")
    .isBoolean()
    .withMessage("isRevoked must be a boolean value"),

  (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    next();
  },
];

const validateCreateDevice = [
  body("deviceName")
    .notEmpty()
    .withMessage("deviceName is cannot be empty")
    .isString()
    .withMessage("deviceName must be a string"),
  body("macAddress")
    .notEmpty()
    .withMessage("macAddress is required")
    .isString()
    .withMessage("macAddress must be a string"),
  body("userId")
    .notEmpty()
    .withMessage("userId is required")
    .isString()
    .withMessage("userId must be a string"),

  (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    next();
  },
];

const validateGetAlarmHistory = [
  body("macAddress")
    .notEmpty()
    .withMessage("macAddress is required")
    .isString()
    .withMessage("macAddress must be a string"),

  (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    next();
  },
];

const validateGetDevices = [
  body("userId")
    .notEmpty()
    .withMessage("userId is required")
    .isString()
    .withMessage("userId must be a string"),

  (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    next();
  },
];

//if you need to validate a specific endepoint create one here the export nd import to the route file
export {
  validateUpdateInput,
  validateRegistration,
  validateLogin,
  validateGetUser,
  validateAdminReg,
  validateGetAdmin,
  validateUpdateAdmin,
  validateCreateDevice,
  validateGetAlarmHistory,
  validateGetDevices,
};
