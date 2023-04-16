
export const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dynupxxry/image/upload/v1660532211/non-avatar_nw91c3.png";

export const convertParam = (param: string) => {
  return param.replace(/\s+/g, "-");
};

export const WARN_LEVELS = {
  0: "WARN_OFF",
  1: "WARN_SIMPLE",
  2: "WARN_MEDIUM",
}