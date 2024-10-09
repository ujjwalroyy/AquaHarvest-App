import express from "express";
import { isAdmin, isAuth } from "./../middlewares/authMiddleware.js";
import {
  changeOrderStatusController,
  createOrderController,
  getAllOrdersController,
  getMyOrdersCotroller,
  paymetsController,
  singleOrderDetrailsController,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/create", isAuth, createOrderController);

router.get("/my-orders", isAuth, getMyOrdersCotroller);

router.get("/my-orders/:id", isAuth, singleOrderDetrailsController);

router.post("/payments", isAuth, paymetsController);

router.get("/admin/get-all-orders", isAuth, isAdmin, getAllOrdersController);

router.put("/admin/order/:id", isAuth, isAdmin, changeOrderStatusController);


router.get("/admin/get-all-orders", isAuth, isAdmin, getAllOrdersController);
router.put("/admin/order/:id", isAuth, isAdmin, changeOrderStatusController);
export default router;