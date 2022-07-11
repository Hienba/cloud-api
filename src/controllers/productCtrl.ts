import Products from "../models/products";
import { APIfeatures } from "../lib/features";

const productCtrl = {
  getProducts: async (req, res) => {
    try {
      const features = new APIfeatures(Products.find(), req.query)
        .paginating()
        .sorting()
        .filtering()
        .searching();
      const result = await Promise.allSettled([
        features.query.exec(),
        Products.countDocuments().exec(),
      ]);
      const data = result[0].status === "fulfilled" ? result[0].value : [];
      const count = result[1].status === "fulfilled" ? result[1].value : 0;
      const pagination = {
        total: count,
        limit: features.queryString.limit * 1 || 100,
        page: features.queryString.page * 1 || 1,
        pages: Math.ceil(count / features.queryString.limit),
      };
      const type = req.query.type;
      const response = {
        data,
        pagination,
        type,
      };
      if (type === "more") {
        res.status(200).json(response);
      } else {
        res.status(200).json(response.data);
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  getProduct: async (req, res) => {
    try {
      const product = await Products.findById(req.params.id);

      if (!product)
        return res.status(404).json({ msg: "This product does not exist." });

      return res.status(200).json(product);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  addProduct: async (req, res) => {
    try {
      const { title, price, description, image } = req.body;
      const newProduct = new Products({
        title,
        price,
        description,
        image,
      });
      await newProduct.save();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { title, price, description, image } = req.body;
      const product = await Products.findByIdAndUpdate(
        req.params.id,
        { title, price, description, image },
        {
          new: true,
        }
      );
      if (!product)
        return res.status(404).json({ msg: "This product does not exist." });
      return res.status(200).json(product);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const product = await Products.findByIdAndDelete(req.params.id);
      if (!product)
        return res.status(404).json({ msg: "This product does not exist." });
      return res.status(200).json(product);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
export default productCtrl;
