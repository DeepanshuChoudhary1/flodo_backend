const express = require('express');
const router = express.Router();
// const taskCrudCtrl = require("../controller/task_crud");
const taskCrudCtrl = require("../controller/task_crud");
// router.get("/", (req, res) => {
//     res.send("Api working perfectly");
// });
router.get("/", taskCrudCtrl.showTask);

router.post("/location", taskCrudCtrl.getLocation);
router.get("/gift", taskCrudCtrl.sendLove);

// for getLocation
router.post("/addTask", taskCrudCtrl.addTask);
router.get("/searchTask", taskCrudCtrl.searchTask);
router.get("/statusFilter", taskCrudCtrl.filterBasedOnStatus);
router.get("/:id", taskCrudCtrl.findTaskById);
router.patch("/update/:id", taskCrudCtrl.updateTask);
router.delete("/delete/:id", taskCrudCtrl.deleteTask);
// -----------------------------------------------------------------

module.exports = router;