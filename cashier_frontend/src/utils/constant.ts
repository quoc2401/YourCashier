export const roles = [
  { name: "Admin", code: "ADMIN" },
  { name: "Employee", code: "EMPLOYEE" },
];

export const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dynupxxry/image/upload/v1660532211/non-avatar_nw91c3.png";

export const convertParam = (param: string) => {
  return param.replace(/\s+/g, "-");
};