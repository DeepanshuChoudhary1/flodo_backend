const express = require('express');
const router = express.Router();
const taskCrudCtrl = require("../controller/task_crud");

// router.get("/", (req, res) => {
//     res.send("Api working perfectly");
// });
router.get("/", taskCrudCtrl.showTask);
router.get("/:id", taskCrudCtrl.findTaskById);
router.post("/addTask", taskCrudCtrl.addTask);
router.get("/searchTask", taskCrudCtrl.searchTask);
router.get("/statusFilter", taskCrudCtrl.filterBasedOnStatus);
router.patch("/update/:id", taskCrudCtrl.updateTask);
router.delete("/delete/:id", taskCrudCtrl.deleteTask);

module.exports = router;