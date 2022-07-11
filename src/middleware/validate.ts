export const checkProductData = async (req, res, next) => {
  const { title, price, description, image } = req.body;
  const errors = [];
  if (!title) errors.push("Please add a title.");
  if (!price) errors.push("Please add a price.");
  if (!description) errors.push("Please add a description.");
  if (!image) errors.push("Please add an image.");
  if (errors.length > 0) return res.status(401).json({ msg: errors });
  next();
};
