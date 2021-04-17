const {Order} = require('../models/order');
const express = require('express');
const { createOrder,getOrders,getOrder, upadateOrderStatus ,deleteOrder, test, getTotalSales, getTotalCount,getUserOrder} = require('../controllers/orders');
const router = express.Router();


router.post("/",createOrder);
router.get(`/`, getOrders);
router.get(`/:id`, getOrder);
router.put(`/:id`, upadateOrderStatus);
router.delete(`/:id`, deleteOrder);
router.get('/get/totalsales',getTotalSales)
router.get('/get/count',getTotalCount)
router.get(`/get/userorders/:userid`,getUserOrder)
module.exports =router;








/** example 
 * 
 * {
    "orderItem":[{
        "quantity":3,
        "product":"60719cbbee7deb0ba045bd15"
    },
    {
        "quantity":5,
        "product":"6071ac10ed07562740c3b371"
    }
    ],
    "user":"6072bc70990e4312e88bd6c8",
    "shippingAddress1":"hehhehehhehehhe",
    "city":"india",
    "phone":326585552,
    "zip":"2352152",
    "totalPrice":253.36

}
 */