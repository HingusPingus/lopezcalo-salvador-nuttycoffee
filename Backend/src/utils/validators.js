export const isPlainObject = (value) =>
    typeof value === "object" && value !== null && !Array.isArray(value);

export const isNonEmptyString = (value) =>
    typeof value === "string" && value.trim().length > 0;

export const isPositiveNumber = (value) =>
    typeof value === "number" && Number.isFinite(value) && value > 0;

export const isPositiveInteger = (value) =>
    Number.isInteger(value) && value > 0;

export const isBoolean = (value) =>
    typeof value === "boolean";

export const isUndefined = (value) =>
    value === undefined;
