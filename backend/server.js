const express = require("express");
const session = require("express-session");
import bodyParser from "body-parser";
import path from "path";
import {fileURLToPath} from "url";
import {db,initDB} from "./models/db.js";

const app = express();
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
        if (password === process.env.ADMIN_PASSWORD) {
            req.session.loggedIn=true;
            return res.redirect("/admin.html");
        }
        res.send("Incorrect Password");
});

app.post("/logout", (res,req) => {
    req.session.destroy(() => res.redirect("/admin-login.html"));
});

//crud
app.get("api/resources", async (req,res) => {
    const rows = await db.all("SELECT * FROM resources ORDER BY id DESC");
    res.json(rows);
});

app.post("/api/resources", requireLogin, async (req, res) => {
    const {title, type, author, tags, link, notes, status}=req.body;
    await db.run("INSERT INTO resources (title, type, author, tags, link, notes, status) VALUES (?,?,?,?,?,?,?)", [title, type, author, tags, link, notes, status]);
    res.redirect("/admin.html")
});

app.post("/api/resources/:id/delete", requireLogin, async(req,res) => {
    const {id} = req.params;
    await db.run("DELETE FROM resources WHERE id = ?", [id]);
    res.redirect("/admin.html");
});

app.listen(3000, async () => {
    await initDB();
    console.log("HacLib server running on http://localhost:3000");
});
