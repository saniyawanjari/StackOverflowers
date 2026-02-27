import Product from "../models/product.js";
// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { search, category, shape, gender, maxPrice, badge } = req.query;
    const query = {};
    if (category) query.category = category;
    if (shape)    query.shape    = shape;
    if (gender)   query.gender   = { $in: [gender, 'unisex'] };
    if (badge)    query.badge    = { $regex: badge, $options: 'i' };
    if (maxPrice) query.price    = { $lte: parseInt(maxPrice) };
    if (search) {
      const q = { $regex: search, $options: 'i' };
      query.$or = [{ name: q }, { brand: q }, { style: q }, { tags: q }, { description: q }];
    }
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// GET /api/products/stock/all
export const getAllStock = async (req, res) => {
  try {
    const products = await Product.find({}, 'id name brand stock category badge price');
    res.json(products);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ id: parseInt(req.params.id) });
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.json(product);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// PATCH /api/products/:id/stock
export const updateStock = async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      { stock },
      { new: true }
    );
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.json({ message: `Stock updated to ${stock}`, product });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Internal: decrease stock when order placed
export const decreaseStock = async (items) => {
  for (const item of items) {
    await Product.findOneAndUpdate(
      { id: item.productId, stock: { $gt: 0 } },
      { $inc: { stock: -(item.quantity || 1) } }
    );
  }
};
