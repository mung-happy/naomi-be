import Joi from "joi";

const createReview = {
  body: Joi.object().keys({
    productId: Joi.string().required(),
    email: Joi.string().required(),
    name: Joi.string().required(),
    images: Joi.array().items(Joi.string()).max(5).optional(),
    video: Joi.string().optional(),
    score: Joi.number().min(0).max(5).required(),
    content: Joi.string().required(),
  }),
};

const getReviews = {
  query: Joi.object().keys({
    productId: Joi.string().required(),
    comment: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const restoreOrApproveReview = {
  query: Joi.object().keys({
    reviewId: Joi.string().required(),
  }),
};

const deleteReview = {
  params: Joi.object().keys({
    id: Joi.string(),
  }),
};

export { createReview, getReviews, restoreOrApproveReview, deleteReview };
