import Products from "../models/products.js";
import APIfeatures from "../lib/features.js";

export const getProducts = async (req, res) => {
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
    //count = sum of all products
    const pagination = {
      total: data.length,
      limit: features.queryString.limit * 1 || 100,
      page: features.queryString.page * 1 || 1,
    };
    const type = req.query.type;
    if (type === "more") {
      return res.status(200).json({
        data: data,
        pagination: pagination,
      });
    }
    if (type === "less") {
      return res.status(200).json({
        data: data,
      });
    }
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getProduct = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);

    if (!product)
      return res.status(404).json({ msg: "This product does not exist." });

    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
export const createProduct = async (req, res) => {
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
};
export const updateProduct = async (req, res) => {
  try {
    const { title, price, description, image } = req.body;
    const product = await Products.findByIdAndUpdate(req.params.id, {
      title,
      price,
      description,
      image,
    });
    if (!product)
      return res.status(404).json({ msg: "This product does not exist." });
    return res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const product = await Products.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ msg: "This product does not exist." });
    return res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
