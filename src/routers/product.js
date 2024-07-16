import express from 'express';
import Product from '../models/product.js';
const router = new express.Router();


router.get("/products", async (req, res) => {
  try {
      const allProducts = await Product.find({})
      res.json({ allProducts })
  } catch (error) {
      res.status(500).json({
          msg: "Hubo un error obteniendo los datos"
      })
  }
})

router.get("/product/:id", async (req, res) => {
  const { id } = req.params
  try {
      const product = await Product.findById(id)
      res.json({ product })
  } catch (error) {
      res.status(500).json({
          msg: "Hubo un error obteniendo los datos"
      })
  }
})


export default router;