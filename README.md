# 📚 Bookkeeping Website

A local bookkeeping web app powered by Node.js, MySQL, and XAMPP.

---

## 🛠️ Installation Instructions

### 1. Install XAMPP
- Download and install [XAMPP](https://www.apachefriends.org/index.html) if you don’t have it yet.
- Start **XAMPP**, but don’t run any servers yet.

---

### 2. Download and Extract the Project
- Download this repository as a `.zip` file or clone it with Git.
- Extract it to your preferred folder (e.g., `C:\Projects\bookkeeping-site`).

---

### 3. Set Up the Project

#### Open a command prompt and navigate to the project directory:
```bash
cd "path\to\extracted\project"
```
Replace the path with the actual location of the folder.

#### Install dependencies:
```bash
npm install
```
This will download and install all required packages.

---

### 4. Configure the Environment

Create a `.env` file inside the backend directory with the following content (adjust if needed):

```env
SECRET_KEY=your-very-secret-key
DB_HOST=127.0.0.1
DB_PORT=3306
DB_ROOT=root
DB_PASSWORD=
```

If you're using port `3308` for MySQL in XAMPP, change `DB_PORT` to `3308`.

---

### 5. Run the Application

#### Start Apache and MySQL in XAMPP:
- Open **XAMPP Control Panel**
- Click **Start** on both **Apache** and **MySQL**

#### Then go back to your terminal and run:
```bash
npm start
```

This will launch the backend and frontend servers.

---

### 6. Open the Website

Go to:

```
http://localhost:5173/
```

🎉 You should now see your website running locally!

---

## 💬 Notes

- Make sure your database matches the structure expected by the backend (you may import a `.sql` file if provided).
- Default port for MySQL in XAMPP is `3306`. If yours is different, match it in `.env`.
- Ensure `node` and `npm` are installed. You can check with:
  ```bash
  node -v
  npm -v
  ```
