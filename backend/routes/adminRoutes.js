import express from "express";
import {
  getAllUsers,
  getAllOrders,
  getAllProducts,
  addProduct,
} from "../controllers/adminController.js";
const router = express.Router();

router.get("/users", getAllUsers);
router.get("/orders", getAllOrders);
router.get("/products", getAllProducts);

// Add product (admin only)
router.post("/products", addProduct);

export default router;
