const List = require("../models/list");
const Task = require("../models/task");


async function getAllLists (req, res) {
    try {
        const result = await List.find({});
        res.send(result);
    }

    catch (err) {
        console.log(err)
    }
};


async function createList(req, res){
    let list = new List({
        name: req.body.name,
    });
    try {
        const newList = await list.save();
        res.status(201).json(newList);
    }  catch (err) {
        res.status(400).json({ message: err.message})
    }
};

async function getList (req, res) {
    try {
        const list = await List.findById(req.params.id);
        res.send(list);
    }
    catch (err) {
        console.log(err);
    }
};

async function updatedList(req, res){
    try {
        const listUpdated = await List.findByIdAndUpdate(req.params.id, req.body);
        res.json(listUpdated);
    } catch (err) {
        res.status(400).json({ message: err.message});
    }; 
};

async function deletedList(req, res){
    try {
        const listDeleted = await List.findByIdAndRemove(req.params.id); 
      if (listDeleted) {
        res.json({ message: "List deleted with success" });
      } else {
        res.status(404).json({ message: "List don't found" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message }); 
    };
};




async function getAllTasks (req, res) {
    try {
        const result = await Task.find({});
        res.send(result);
    }

    catch (err) {
        console.log(err)
    }
};

async function getTask (req, res) {
     let task = null;
     const searchBy = req.query.searchBy;
     const value = req.query.value;

    try {
        switch (searchBy) {
          case "_id":
            task = await Task.findById(value);
            break;
          case "id_list":
            task = await Task.find({ id_list: value });
            break;
          case "title":
            task = await Task.find({ title: value });
            break;
          default:
            return res
              .status(400)
              .json({ message: "Invalid searchBy parameter" });
        }
        if (task) {
            res.status(200).json(task)
        } else {
            res.status(404).json({message: 'Task not found'})
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({message: 'Internal server error'})
    }
};

async function  addTask (req, res) {

    const id_list = req.body.id_list

    try {
        const listExists = await List.exists({ _id: id_list });
        if (!listExists) {
          throw new Error("List does not exist");
        }

        const new_task = new Task({
          title: req.body.title,
          id_list: id_list,
        });
       
        res.send(new_task);
    } catch (err) {
        console.log(err);
    }
};


async function updatedTask(req, res){
    try {
        const taskUpdated = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(taskUpdated);
    } catch (err) {
        res.status(400).json({ message: err.message});
    }; 
};

async function deletedTask(req, res){
    try {
        const taskDeleted = await Task.findByIdAndRemove(req.params.id); 
      if (taskDeleted) {
        res.json({ message: "Task deleted with success" });
      } else {
        res.status(404).json({ message: "Task not found" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message }); 
    };
};

module.exports = {
    getAllLists,
    createList,
    getList,
    updatedList,
    deletedList,
    getAllTasks,
    getTask,
    addTask,
    updatedTask,
    deletedTask
};