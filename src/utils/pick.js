export const pickOption = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

export const pickFilter = (object, keys) => {
  let filters = [];
  keys.forEach((key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      if (key == "categories") {
        filters.push({ categories: { $in: object[key] } });
      }
      if (key == "search") {
        filters.push({ name: { $regex: object[key], $options: "i" } });
      }
      if (key == "orderCode") {
        filters.push({ orderCode: { $regex: object[key], $options: "i" } });
      }
    }
  });

  return Object.keys(filters).length > 0 ? { $and: filters } : {};
};
