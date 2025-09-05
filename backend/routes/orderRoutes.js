import express from "express";
import {
  createOrder,
  getOrders,
  getOrder,
} from "../controllers/orderController.js";
const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrder);

export default router;
