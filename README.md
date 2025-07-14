# HacLib — Self-Hosted Digital Library

**HacLib** is a public, self-hosted digital library platform where anyone can explore, suggest, and organize books, videos, and resources — with a clean admin panel and moderated content submission.

**Live Demo**: [https://haclib.onrender.com](https://haclib.onrender.com)

---
### 🪟 Windows Docker Users — Special Note

If you're on Windows and see an error like:

```[Error: SQLITE_CANTOPEN: unable to open database file]```


That means SQLite can't create or write to the default `./haclib.db` file inside the Docker container — a common issue on Windows due to file permission behavior in Docker volumes.

#### To Fix This:

1. **Update your `docker-compose.yaml` to add a writable volume:**

```
volumes:
  - ./data:/app/data
```

2. **Create a data/ folder locally in your project root:**

```mkdir data```

3. **Update your db.js file so the database path is absolute inside the container:**

```filename: "/app/data/haclib.db"```
