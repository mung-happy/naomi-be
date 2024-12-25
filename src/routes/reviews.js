import { Router } from "express";
import validate from "../middlewares/validate.js";
import reviewCotroller from "../controllers/reviewController.js";
import {
  createReview,
  deleteReview,
  getReviews,
  restoreOrApproveReview,
} from "../validations/reviews.js";

const routerReview = Router();
routerReview.get("/", validate(getReviews), reviewCotroller.getAll);
routerReview.get("/v2", validate(getReviews), reviewCotroller.getAllAdmin);
routerReview.post("/", validate(createReview), reviewCotroller.create);
routerReview.post(
  "/approve",
  validate(restoreOrApproveReview),
  reviewCotroller.approve
);
routerReview.post(
  "/restore",
  validate(restoreOrApproveReview),
  reviewCotroller.restore
);
routerReview.delete("/:id", validate(deleteReview), reviewCotroller.remove);
export default routerReview;

/**
 * @swagger
 * tags:
 *   name: Review
 *   description: API operations related to user
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     description: Get all reviews.
 *     tags: [Review]
 *     parameters:
 *       - in: query
 *         name: productId
 *         description: The id of the
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         description: Content
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of reviews
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       '200':
 *         description: The list of the user
 *         content:
 *           application/json:
 *             example: {}
 */

/**
 * @swagger
 * /reviews/v2:
 *   get:
 *     summary: Get all reviews
 *     description: Only admins can retrieve all reviews.
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: productId
 *         description: The id of the
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         description: Content
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of reviews
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       '200':
 *         description: The list of the user
 *         content:
 *           application/json:
 *             example: {}
 */

/**
 * @swagger
 * /reviews/approve:
 *   post:
 *     summary: Approve review
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: reviewId
 *         required: true
 *         description: The id of the review Id
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example: {}
 */

/**
 * @swagger
 * /reviews/restore:
 *   post:
 *     summary: Restore review
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: reviewId
 *         required: true
 *         description: The id of the review Id
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example: {}
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - email
 *               - name
 *               - images
 *               - score
 *               - content
 *             properties:
 *               productId:
 *                 type: string
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               video:
 *                 type: string
 *               score:
 *                 type: number
 *               content:
 *                 type: string
 *           example:
 *             productId: "String"
 *             email: "String"
 *             images:
 *               - "url"
 *             video: "String"
 *             score: 0
 *             content: "String"
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example: {}
 */

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a reviews
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the reviews to be deleted
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example: {}
 */
