import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import path from "path";
import {fileURLToPath} from "url";
import { getDB, initDB } from "./models/db.js";
import authRoutes from "./auth.js";
import userResourceRoutes from "./userResources.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(session({secret:"haclib", resave: false, saveUninitialized: true}));
app.use(express.static(path.join(__dirname, "../frontend")));

// Admin login
const requireLogin = (req, res, next) => {
    if (req.session.loggedIn) return next();
    return res.redirect("/admin-login.html");
};

app.post("/login",(req,res) => {
    const {password}=req.body;
        if (password === process.env.ADMIN_PASS) {
            req.session.loggedIn=true;
            return res.redirect("/admin.html");
        }
        res.send("Incorrect Password");
});

app.post("/logout", (req,res) => {
    req.session.destroy(() => res.redirect("/admin-login.html"));
});

//crud
app.get("/api/resources", async (req,res) => {
    const db = getDB();
    const rows = await db.all("SELECT * FROM resources ORDER BY id DESC");
    res.json(rows);
});

app.post("/api/resources", requireLogin, async (req, res) => {
    const db = getDB();
    const {title, type, author, tags, link, notes, status}=req.body;
    await db.run("INSERT INTO resources (title, type, author, tags, link, notes, status) VALUES (?,?,?,?,?,?,?)", [title, type, author, tags, link, notes, status]);
    res.redirect("/admin.html")
});

app.post("/api/resources/:id/delete", requireLogin, async(req,res) => {
    const db = getDB();
    const {id} = req.params;
    await db.run("DELETE FROM resources WHERE id = ?", [id]);
    res.redirect("/admin.html");
});

//suggestions
app.post("/api/suggestions", async (req, res) => {
    const db = getDB();
    const { title, type, author, tags, link, notes, status } = req.body;
    await db.run("INSERT INTO suggestions (title, type, author, tags, link, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [title, type, author, tags, link, notes, status]);
    res.send("Suggestion submitted!");
});

app.get("/api/suggestions", requireLogin, async (req, res) => {
    const db = getDB();
    const suggestions = await db.all("SELECT * FROM suggestions ORDER BY id DESC");
    res.json(suggestions);
});

app.post("/api/suggestions/:id/approve", requireLogin, async (req, res) => {
    const db = getDB();
    const { id } = req.params;
    const suggestion = await db.get("SELECT * FROM suggestions WHERE id = ?", [id]);
    if (!suggestion) return res.status(404).send("Not found");
    await db.run("INSERT INTO resources (title, type, author, tags, link, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [suggestion.title, suggestion.type, suggestion.author, suggestion.tags, suggestion.link, suggestion.notes, suggestion.status]);
    await db.run("DELETE FROM suggestions WHERE id = ?", [id]);
    res.redirect("/admin.html");
});

app.post("/api/suggestions/:id/delete", requireLogin, async (req, res) => {
    const db = getDB();
    const { id } = req.params;
    await db.run("DELETE FROM suggestions WHERE id = ?", [id]);
    res.redirect("/admin.html");
});

app.use("/auth", authRoutes);
app.use("/api/user/resources", userResourceRoutes);

app.listen(3000, async () => {
    await initDB();
    console.log("HacLib server running on http://localhost:3000");
});
