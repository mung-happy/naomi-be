import Joi from "joi";

export const productValid = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Tên sản phẩm không để trống!",
    "any.required": "Tên sản phẩm là bắt buộc!",
    "string.min": "Tên sản phẩm phải có ít nhất 3 ký tự!",
    "string.max": "Tên sản phẩm phải có ít hơn 255 ký tự!",
  }),
  price: Joi.number().greater(0).required().messages({
    "number.empty": "Giá không được để trống!",
    "any.required": "Giá là bắt buộc!",
    "number.base": "Giá là số nguyên!",
    "number.greater": "Giá phải lớn 0!",
  }),
  salePrice: Joi.number().greater(0).required().messages({
    "number.empty": "Giá khuyến mãi không được để trống!",
    "any.required": "Giá khuyến mãi là bắt buộc!",
    "number.base": "Giá khuyến mãi là số nguyên!",
    "number.greater": "Giá khuyến mãi phải lớn 0!",
  }),
  desc: Joi.string().required().messages({
    "string.empty": "Tên sản phẩm không để trống!",
    "any.required": "Tên sản phẩm là bắt buộc!",
  }),
  images: Joi.array().min(1).max(5).required().messages({
    "array.empty": "Hình ảnh không để trống!",
    "any.required": "Hình ảnh là bắt buộc!",
    "array.min": "Phải có ít nhất 1 hình ảnh!",
    "array.max": "Không thể có nhiều hơn 5 hình ảnh!",
  }),
}).options({ abortEarly: false });
