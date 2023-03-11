export const formatDate = (value: any) => {
  let date = new Date(value);
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - offset * 60 * 1000);
  return date.toISOString().split("T")[0];
};

export const prependArray = (value: any, array: any[]) => {
  const newArray = array.slice();
  newArray.unshift(value);
  return newArray;
};

export const formatCurrency = (value: any) => {
  return (
    value &&
    Number(value).toLocaleString("en-US", {
      style: "currency",
      currency: "VND",
    })
  );
};

export const isBool = (value: any) => {
  if (typeof value == "boolean") return true;
  else return false;
};
