import errorMessage from "../utils/error.js";
// import { pickOption } from "../utils/pick.js";
import mongoose from "mongoose";
import Review, { reviewStatus } from "../models/Reviews.js";

const getAll = async (req, res) => {
  try {
    const idProduct = new mongoose.Types.ObjectId(req.query.productId);

    // const filter = pickOption(req.query, ["productId", "content"]);
    // if (filter?.productId) {
    //   filter.productId = new mongoose.Types.ObjectId(filter.productId);
    // }
    // filter.status = reviewStatus.reviewed;
    // const options = pickOption(req.query, ["sortBy", "limit", "page"]);

    const review = await Review.aggregate([
      {
        $match: {
          productId: idProduct, // Lọc theo ID sản phẩm
        },
      },
      {
        $group: {
          _id: {
            productId: "$productId", // Nhóm theo productId
            rating: "$score", // Nhóm theo mức sao (rating)
          },
          reviews: { $push: "$$ROOT" }, // Lưu chi tiết review
          count: { $sum: 1 }, // Đếm số lượng review cho mỗi mức sao
        },
      },
      {
        $group: {
          _id: "$_id.productId", // Nhóm lại theo productId
          totalReviews: { $sum: "$count" }, // Tổng số review
          averageRating: {
            $avg: { $multiply: ["$_id.rating"] }, // Tính trung bình theo số lượng
          },
          ratings: {
            $push: {
              rating: "$_id.rating",
              count: "$count",
            },
          },
          allReviews: { $push: "$reviews" }, // Gộp tất cả reviews
        },
      },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          totalReviews: 1,
          averageRating: { $round: ["$averageRating", 2] }, // Làm tròn đến 2 chữ số
          ratings: {
            $map: {
              input: [
                { rating: 1, count: 0 },
                { rating: 2, count: 0 },
                { rating: 3, count: 0 },
                { rating: 4, count: 0 },
                { rating: 5, count: 0 },
              ],
              as: "rating",
              in: {
                rating: "$$rating.rating",
                count: {
                  $ifNull: [
                    {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$ratings",
                            as: "r",
                            cond: { $eq: ["$$r.rating", "$$rating.rating"] },
                          },
                        },
                        0,
                      ],
                    },
                    { count: 0 },
                  ],
                },
              },
            },
          },
          reviews: {
            $reduce: {
              input: "$allReviews",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] },
            },
          },
        },
      },
    ]);

    if (review.length !== 0) {
      res.send(review[0]);
    } else {
      res.send({
        totalReviews: 0,
        averageRating: 0,
        ratings: [
          {
            rating: 1,
            count: {
              count: 0,
            },
          },
          {
            rating: 2,
            count: {
              count: 0,
            },
          },
          {
            rating: 3,
            count: {
              rating: 3,
              count: 0,
            },
          },
          {
            rating: 4,
            count: {
              count: 0,
            },
          },
          {
            rating: 5,
            count: {
              rating: 5,
              count: 0,
            },
          },
        ],
      });
    }
  } catch (err) {
    errorMessage(res, err);
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const filter = pickOption(req.query, ["productId", "content"]);
    if (filter?.productId) {
      filter.productId = new mongoose.Types.ObjectId(filter.productId);
    }
    const options = pickOption(req.query, ["sortBy", "limit", "page"]);
    const result = await reviewService.queryReviewByProduct(filter, options);
    res.send(result);
  } catch (err) {
    errorMessage(res, err);
  }
};

const create = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).send({ message: "Create successfully!" });
  } catch (err) {
    errorMessage(res, err);
  }
};

const approve = async (req, res) => {
  try {
    const review = await reviewService.approveReview(req.query.reviewId);
    res.status(201).send(review);
  } catch (err) {
    errorMessage(res, err);
  }
};

const restore = async (req, res) => {
  try {
    const review = await reviewService.restoreReview(req.query.reviewId);
    res.status(201).send(review);
  } catch (err) {
    errorMessage(res, err);
  }
};

const remove = async (req, res) => {
  try {
    await reviewService.deleteReviewById(req.params.id);
    res.status(203).send();
  } catch (err) {
    errorMessage(res, err);
  }
};

const reviewCotroller = {
  getAll,
  getAllAdmin,
  create,
  approve,
  restore,
  remove,
};

export default reviewCotroller;
