require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { jsonwebtoken, generateJWT } = require("./Jwt");
const passport = require("passport");
const User = require("./User");
const Task = require("./tasks");

const app = express();

app.use(cors({
    origin: ["https://study-app20.netlify.app"],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(passport.initialize());
app.use(cookieParser());


const logActivity = (subtask) => {
    const today = new Date().toISOString().slice(0, 10);
    const existingLog = subtask.activityLog.find(entry => entry.date === today);
  
    if (existingLog) {
      existingLog.count += 1;
    } else {
      subtask.activityLog.push({ date: today, count: 1 });
    }
};
  

require("./Gauth");


app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
      const user = req.user;
      const token = generateJWT({ id: user._id, name: user.name, email: user.email });

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000
      });
    
      res.redirect("https://study-app20.netlify.app/main");
  }
);


app.get("/verify-token", jsonwebtoken, (req, res) => {
    res.status(200).json({ message: "Token is valid", user: req.payload });
});


app.get("/user", jsonwebtoken, async(req,res) =>{
    try {
        const user = await User.findById(req.payload.id);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        res.json({name:user.name});
    } catch (error) {
        res.status(500).json({ message: "Error User Info", error });
    }
});

app.get("/tasks", jsonwebtoken, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.payload.id }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Server error while fetching tasks", error });
    }
});

app.post("/tasks", jsonwebtoken, async (req, res) => {
    try {
        const { title } = req.body;
        
        const newTask = new Task({
            userId: req.payload.id,
            title,
            subtasks: [] 
        });

        await newTask.save();
        res.status(201).json({
            message: "Task created successfully",
            task: newTask,
            taskId: newTask._id // ✅ Return task ID
        });
    } catch (error) {
        console.error("Error creating task:", error.message);
        res.status(500).json({ message: "Server error while creating task", error: error.message });
    }
});

app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findByIdAndDelete(id);
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error deleting task' });
    }
});

app.get('/tasks/:id', async (req, res) => {
    const taskId = req.params.id;
    try {
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});


app.post("/tasks/:taskId/subtasks", async (req, res) => {
    const { taskId } = req.params;
    const name = req.body.name;

    if (!name || name.trim() === "") {
        return res.status(400).json({ message: "Subtask name is required" });
    }

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const newSubtask = {
            title: name,
            superSubtask: [],
            activityLog: logActivity()
        };

        task.subtasks.push(newSubtask);
        await task.save();

        res.status(201).json({ message: "Subtask added successfully", updatedTask: task });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add subtask", error: err.message });
    }
});




app.post("/tasks/:taskId/subtasks/:subtaskId/supersubtasks", async (req, res) => {
    const { taskId, subtaskId } = req.params;
    const { title } = req.body;

    try {
        const task = await Task.findById(taskId);
        const subtask = task.subtasks.id(subtaskId);
        subtask.superSubtask.push({ title });
        logActivity(subtask);
        await task.save();
        res.status(200).json({ message: "Super-subtask added" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.put("/tasks/:taskId/subtasks/:subtaskId", async (req, res) => {
    const { taskId, subtaskId } = req.params;
    const { title } = req.body;

    try {
        const task = await Task.findById(taskId);
        const subtask = task.subtasks.id(subtaskId);
        subtask.title = title;
        logActivity(subtask);
        await task.save();
        res.status(200).json({ message: "Subtask updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.delete("/tasks/:taskId/subtasks/:subtaskId", async (req, res) => {
    const { taskId, subtaskId } = req.params;

    try {
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ error: "Task not found" });

        const subtask = task.subtasks.id(subtaskId);
        if (!subtask) return res.status(404).json({ error: "Subtask not found" });
        logActivity(subtask);
        task.subtasks.pull(subtaskId);

        await task.save();

        res.status(200).json({ message: "Subtask deleted successfully" });
    } catch (err) {
        console.error("Delete subtask error:", err);
        res.status(500).json({ error: err.message });
    }
});



app.patch("/tasks/:taskId/subtasks/:subtaskId/supersubtasks/:supId", async (req, res) => {
    const { taskId, subtaskId, supId } = req.params;
    const { isCompleted, comfortLevel } = req.body;

    try {
        const task = await Task.findById(taskId);
        const subtask = task.subtasks.id(subtaskId);
        const superSub = subtask.superSubtask.id(supId);
        logActivity(subtask);
        if (isCompleted !== undefined) superSub.isCompleted = isCompleted;
        if (comfortLevel !== undefined) superSub.comfortLevel = comfortLevel;

        await task.save();
        res.status(200).json({ message: "Super-subtask updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



app.delete('/tasks/:taskId/subtasks/:subtaskId/superTask/:superSubtaskId', async (req, res) => {
    const { taskId, subtaskId, superSubtaskId } = req.params;

    try {
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: "Task not found" });

        const subtask = task.subtasks.id(subtaskId);
        if (!subtask) return res.status(404).json({ message: "Subtask not found" });

        const index = subtask.superSubtask.findIndex(s => s._id.toString() === superSubtaskId);
        if (index === -1) return res.status(404).json({ message: "Super-subtask not found" });

        subtask.superSubtask.splice(index, 1); 
        logActivity(subtask);
        await task.save();

        res.status(200).json({ message: "Super-subtask deleted successfully" });
    } catch (error) {
        console.error("Error deleting super-subtask:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


app.get("/info/tasks/:taskId/subtasks/:subtaskId", async (req, res) => {
    const { taskId, subtaskId } = req.params;

    try {
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ error: "Task not found" });

        const subtask = task.subtasks.id(subtaskId);
        if (!subtask) return res.status(404).json({ error: "Subtask not found" });

        // Calculate % of completed super-subtasks
        const superSubtasks = subtask.superSubtask || [];
        const completed = superSubtasks.filter(s => s.isCompleted);
        const completionPercent = superSubtasks.length
            ? Math.round((completed.length / superSubtasks.length) * 100)
            : 0;

        // Categorize by difficulty level (names, not counts)
        const difficultyStats = {
            easy: superSubtasks.filter(s => s.comfortLevel === "easy").map(s => s.title),
            medium: superSubtasks.filter(s => s.comfortLevel === "medium").map(s => s.title),
            hard: superSubtasks.filter(s => s.comfortLevel === "hard").map(s => s.title),
        };

        res.json({
            subtaskTitle: subtask.title,
            completionPercent,
            difficultyStats
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get("/heat/tasks/:taskId/subtasks/:subtaskId", async (req, res) => {
    const { taskId, subtaskId } = req.params;
    try {
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ error: "Task not found" });
        const subtask = task.subtasks.id(subtaskId);
        if (!subtask) return res.status(404).json({ error: "Subtask not found" });

        const heatMapData = {};
        subtask.activityLog.forEach(({ date, count }) => {
            heatMapData[date] = count;
        });

        res.json(heatMapData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
  


app.post("/signup", async(req,res) =>{
    try {
       const {name,email,password} = req.body;
       const isUserExist=await User.findOne({email});

       if (isUserExist) return res.status(400).json({ message: "User already exists" });

       const newUser = new User({ name, email, password });
       await newUser.save();
       
       const token = generateJWT({ id: newUser._id, email: newUser.email, name: newUser.name});

       res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
       });
        

        res.status(201).json({ message: "User created successfully!", token });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
})

app.post("/login", async(req,res) =>{
    try {
        const {email,password} = req.body;
        const existUser = await User.findOne({email});

        if (!existUser || (password!==existUser.password)) {
            return res.status(400).json({ message: "Wrong credentials" });
        }

        const token = generateJWT({ id: existUser._id, name: existUser.name, email: existUser.email });

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
        });
        res.status(200).json({ message: "User logged in successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});