const taskSchema = require("../models/task_schema");
// -------------------------showtasks-------------------------------

exports.showTask = async (req, res) => {
    try {
        const tasks = await taskSchema.find();

        return res.status(200).json({
            success: true,
            message: "All Task Fetch Successfully",
            data: tasks,
        });
    }
    catch (e) {
        console.log(e);
        return res.status(401).json({
            success: false,
            message: e,
        });
    }
}

exports.searchTask = async (req, res) => {
    let { q } = req.query;
    console.log("your title value is ", q);
    try {
        const tasks = await taskSchema.find({
            'title': { $regex: q, $options: "i" }  // case-insensitive search
        }).limit(10);

        return res.status(200).json({
            success: true,
            message: "Search Task Successfully",
            data: tasks,
        });

    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message,
        });
    }
};

exports.filterBasedOnStatus = async (req, res) => {
    let { q } = req.query;

    try {
        const tasks = await taskSchema.find({
            status: { $regex: q, $options: "i" }  // case-insensitive search
        });

        return res.status(200).json({
            success: true,
            message: "Search Task Successfully",
            data: tasks,
        });

    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message,
        });
    }
};

// -------------------------addtaks-------------------------------
exports.addTask = async (req, res) => {
    const progressStatus = req.body.status;
    const { title, id } = req.body.blockedBy;
    try {
        if (progressStatus != "Done") {
            if (id) {
                console.log("your block id is not null ");
                const existsTaskData = await taskSchema.findById(id);
                const fromBlockDate = new Date(existsTaskData.dueDate);
                const toBlockDate = new Date(req.body.dueDate);

                if (fromBlockDate > toBlockDate) {
                    return res.status(409).json({
                        success: false,
                        message: "The date of the task must be bigger than the priority tasks"
                    });
                }

                const task = await taskSchema.insertOne(req.body);
                return res.status(201).json({
                    success: true,
                    message: `Task Sucessfully added`,
                    data: task
                });
            } else if (title) {
                const existsTaskData = await taskSchema.findOne({ "title": title });
                if (existsTaskData) {
                    const fromBlockDate = new Date(existsTaskData.dueDate);
                    const toBlockDate = new Date(req.body.dueDate);

                    if (fromBlockDate > toBlockDate) {
                        return res.status(409).json({
                            success: false,
                            message: "The date of the task must be bigger than the priority tasks"
                        });
                    }
                    req.body.blockedBy.id = existsTaskData.id;

                    const task = await taskSchema.insertOne(req.body);
                    return res.status(201).json({
                        success: true,
                        message: `Task added Successfully ${existsTaskData}`,
                        data: task,
                    });
                } else {
                    return res.status(404).json({
                        success: false,
                        message: `Title not found`,
                    });
                }
            } else {
                const task = await taskSchema.insertOne(req.body);
                return res.status(201).json({
                    success: true,
                    message: "Task added Successfully",
                    data: task
                });
            }
        } else {
            if (title != null || id != null) {
                return res.status(409).json({
                    success: false,
                    message: "You can't block this task besuse this task is Completed",

                });
            } else {
                const task = await taskSchema.insertOne(req.body);
                return res.status(201).json({
                    success: true,
                    message: "Task added Successfully",
                    data: task
                });

            }

        }

    }
    catch (e) {
        console.log("error for connect adding task", e);
        let message = e.message || "Something went wrong";
        if (e.code === 11000) {
            const field = Object.keys(e.keyValue)[0]; // e.g. title
            message = `${field} already exists`;
        }

        if (e.name === "ValidationError") {
            message = Object.values(e.errors)
                .map(err => err.message)
                .join(", ");
        }

        res.status(409).json({
            success: false,
            message: message
        });
    }

}
// -------------------------update Task-------------------------------

exports.updateTask = async (req, res) => {
    try {
        console.log(`your id ${req.params.id}`);
        const id = req.params.id;
        const { status } = req.body;
        if (status === "Done") {
            req.body.blockedBy = { "title": null, 'id': null };



            await taskSchema.updateMany({ "blockedBy.id": id }, { $set: { "blockedBy.title": null, "blockedBy.id": null } });

            const task = await taskSchema.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

            return res.status(200).json({
                success: true,
                message: "Task Updated Successfully",
                data: task

            });
        }
        // const toBlockDate = new Date(req.body.dueDate);
        const blockId = await taskSchema.blockedBy.id;



        if (blockId != null) {
            const blockedData = await taskSchema.findById(blockId);
            const existEditableData = await taskSchema.findById(id);
            const toBlockDate = new Date(existEditableData.dueDate);
            const fromBlockDate = new Date(blockedData.dueDate);


            // console.log(`fromdate is ${fromBlockDate} and toBlockDate ${toBlockDate}`)

            if (fromBlockDate > toBlockDate) {

                return res.status(409).json({
                    success: false,
                    message: "The date of the task must be bigger than the priority tasks"
                });
            }
        }

        const task = await taskSchema.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        return res.status(200).json({
            success: true,
            message: "Task Update Successfully",
            data: task
        });
    }
    catch (e) {
        let message = e.message || "Something went wrong";
        console.log("error for updating the code is ", e);
        res.json({
            success: false,
            message: message
        });

        // console.log(e);
        // let message = "Something went wrong";
        // if (e.code === 11000) {
        //     const field = Object.keys(e.keyValue)[0]; // e.g. title
        //     message = `${field} already exists`;
        // }

        // if (e.name === "ValidationError") {
        //     message = Object.values(e.errors)
        //         .map(err => err.message)
        //         .join(", ");
        // }

        // res.status(400).json({
        //     success: false,
        //     message: message
        // });
    }

}

// -------------------------delete Task-------------------------------

exports.deleteTask = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(`your id ${req.params.id}`)
        const task = await taskSchema.findById(id);
        const isBlockedTask = task.blockedBy.title != null;
        if (task) {
            if (isBlockedTask) {
                return res.status(409).json({
                    success: false,
                    message: "Task can't be delete due to task is block",

                });
            }
            await taskSchema.updateMany({ "blockedBy.id": id }, { $set: { "blockedBy.title": null, "blockedBy.id": null } });

            const task = await taskSchema.findByIdAndDelete(req.params.id, req.body, { new: true, runValidators: true });

            return res.status(200).json({
                success: true,
                message: "Task Delete Successfully",
                data: task
            });

        } else {
            return res.status(404).json({
                success: false,
                message: "Not found this item",
            });
        }
    }

    catch (e) {
        let message = e.message || "Something went wrong";
        res.json({
            success: false,
            message: message
        });

    }
}

// single task find by id
exports.findTaskById = async (req, res) => {
    try {
        const id = req.params.id;
        // console.log(`your id ${req.params.id}`)
        const task = await taskSchema.findById(id);

        if (task) {
            return res.status(200).json({
                success: true,
                message: "Task fetch Successfully",
                data: task
            });
        } else {
            return res.status(200).json({
                success: true,
                message: "Task Not found",

            });

        }
    }

    catch (e) {
        let message = e.message || "Something went wrong";
        res.json({
            success: false,
            message: message
        });

    }


}