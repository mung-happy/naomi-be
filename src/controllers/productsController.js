import slugify from "slugify";
import Products from "../models/Products.js";
import { productValid } from "../validations/products.js";
import Categories from "../models/Categories.js";
import Review from "../models/Reviews.js";

class ProductsCotroller {
  async getAll(req, res) {
    try {
      const limit = req.query.limit || undefined;
      let products;
      // if (req.query.category) {
      //   const category = await Categories.findOne({
      //     categorySlug: req.query.category,
      //   });
      //   products = await Products.find({ id_category: category._id });
      // } else if (req.query.category_id) {
      //   products = await Products.find({ id_category: req.query.category_id });
      // } else if (req.query.gender) {
      //   products = await Products.find({ gender: req.query.gender });
      // } else {
      // }
      products = await Products.aggregate([
        {
          $lookup: {
            from: "Reviews", // Tên của collection chứa các đánh giá
            localField: "_id", // Trường _id trong collection Products kết nối với productId trong Reviews
            foreignField: "productId", // Trường productId trong Reviews
            as: "reviews", // Các đánh giá sẽ được lưu vào mảng `reviews`
          },
        },
        {
          $addFields: {
            averageRating: {
              $avg: "$reviews.score", // Tính trung bình điểm số (score) từ các đánh giá
            },
          },
        },
        {
          $project: {
            // Trả về tất cả trường từ collection Products
            _id: 1,
            name: 1, // Ví dụ bạn có trường `name`
            price: 1, // Ví dụ bạn có trường `price`
            description: 1, // Ví dụ bạn có trường `description`
            images: 1, // Nếu bạn muốn trả về chi tiết tất cả các review
            averageRating: 1, // Trả về điểm rating trung bình
            originalPrice: 1,
            slug: 1,
          },
        },
        {
          $limit: parseInt(limit), // Hạn chế số lượng sản phẩm trả về
        },
      ]);
      res.status(200).json({
        message: "Lấy dữ liệu thành công!",
        data: products,
      });
    } catch (err) {
      res.status(500).json({
        name: err.name,
        message: err.message,
      });
    }
  }

  async getDetail(req, res) {
    try {
      const product = await Products.findOne({ slug: req.params.slug });
      if (!product) {
        res.status(400).json({
          message: "Sản phẩm không tồn tại!",
        });
        return;
      }

      res.status(200).json({
        message: "Lấy dữ liệu thành công!",
        data: product,
      });
    } catch (err) {
      res.status(500).json({
        name: err.name,
        message: err.message,
      });
    }
  }

  async getProductSame(req, res) {
    try {
      const product = await Products.find({
        slug: { $ne: req.params.slug },
      }).limit(8);
      res.status(200).json({
        message: "Lấy dữ liệu thành công!",
        data: product,
      });
    } catch (err) {
      res.status(500).json({
        name: err.name,
        message: err.message,
      });
    }
  }

  async create(req, res) {
    try {
      // validation
      const { error } = productValid.validate(req.body);
      if (error) {
        res.status(400).json({
          message: error.details.map((error) => error.message),
        });
        return;
      }

      const data = { ...req.body };
      data.slug = slugify(data.name, { lower: true });

      const productExists = await Products.findOne({ slug: data.slug });
      if (productExists) {
        res.status(404).json({
          message: "Sản phẩm đã tồn tại",
        });
        return;
      }
      const product = await Products.create(data);
      if (!product) {
        res.status(404).json({
          message: "Tạo sản phẩm thất bại",
        });
        return;
      }
      res
        .status(200)
        .json({ message: "Tạo sản phẩm thành công!", newProduct: product });
    } catch (err) {
      res.status(500).json({
        name: err.name,
        message: err.message,
      });
    }
  }

  async update(req, res) {
    try {
      // validation
      const { error } = productValid.validate(req.body);
      if (error) {
        res.status(400).json({
          message: error.details.map((error) => error.message),
        });
        return;
      }

      const data = { ...req.body };
      data.slug = slugify(data.name, { lower: true });
      if (data.slug != req.params.slug) {
        const productExists = await Products.findOne({
          slug: data.slug,
        });
        if (productExists) {
          res.status(404).json({
            message: "Sản phẩm đã tồn tại",
          });
          return;
        }
      }

      const product = await Products.findOneAndUpdate(
        { slug: req.params.slug },
        data,
        {
          new: true,
        }
      );
      if (!product) {
        res.status(404).json({
          message: "Cập nhật sản phẩm thất bại",
        });
        return;
      }

      res.status(200).json({
        message: "Cập nhật sản phẩm thành công",
        data: product,
      });
    } catch (err) {
      res.status(500).json({
        name: err.name,
        message: err.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const data = await Products.findByIdAndDelete(req.params.id);
      if (!data) {
        return res.status(400).json({
          message: "Xoá thất bại!",
        });
      }
      return res.status(200).json({
        message: "Xoá thành công!",
        data: data,
      });
    } catch (err) {
      res.status(500).json({
        name: err.name,
        message: err.message,
      });
    }
  }
}

export default new ProductsCotroller();
