# 📂 **File Manager with React & Appwrite**  
A sleek and responsive file management app built with **ReactJS** and powered by **Appwrite** for file storage. The app allows users to upload, view, and download files with a clean, interactive interface — complete with emoji-based file type indicators. 😎  

---

## 🎨 **Features**
✅ **File Upload/Download:**  
- Drag-and-drop styled upload section with dashed borders.  
- Files uploaded to **Appwrite storage** with generated download links.  

✅ **File Listing with Emojis:**  
- Displays uploaded files with appropriate icons for:  
  - 📚 PDF/Word/TXT files  
  - 📊 Excel/CSV files  
  - 🖼️ Image files  
  - 🎥 Media files (audio/video)  

✅ **Local Storage Support:**  
- File metadata is stored in `localStorage` for persistence across sessions.  

✅ **Responsive & Dark Theme:**  
- Fully responsive design that adapts to all devices.  
- Dark theme with sleek UI and smooth hover effects.  

---

## 🛠️ **Tech Stack**
- **Frontend:** ReactJS (Vite)  
- **Backend/Storage:** Appwrite  
- **UI:** Tailwind-inspired CSS with a dark theme  

---

## 📢 **Note on Project Scope**
Due to being **unwell recently**, I was unable to fully integrate the backend with **Django** for user authentication and advanced file management.  

✅ **What’s Done:**  
- A working **ReactJS + Appwrite** frontend with file upload and listing.  

⚡️ **Scalability Ready:**  
- I can scale this with a Django backend, adding:  
  - User Authentication (JWT/session-based).  
  - User-specific file management with a connected database.  

---

## 🚀 **Setup & Installation**

### 1. **Clone the Repository**
```bash
git clone https://github.com/your-username/file-manager-app.git
cd file-manager-app
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Configure Appwrite**
- Sign up and create a project on [Appwrite](https://appwrite.io/).  
- Add a **bucket** for storing files.  
- Create a `.env` file and add your credentials:
```
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_BUCKET_ID=your_bucket_id
```

### 4. **Run the App**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to see the app running.

---

## 🧩 **How It Works**
1. **Upload Files:** Click or drag files into the dashed border section.  
2. **View File List:** Uploaded files appear in a sleek table with emojis for file types.  
3. **Download Files:** Click on the file name to download.  
4. **Copy URL:** Copy the file’s URL to share with others.  

---

## 🔥 **Potential Improvements**
- 🔐 **User Authentication:** Add login/signup with Django for user-based file management.  
- 🗂️ **Backend Integration:** Implement Django REST API to store and manage file metadata.  
- 📡 **API Security:** Secure Appwrite endpoints with role-based access.  

---

## 📄 **License**
This project is licensed under the [MIT License](LICENSE).  

---

✨ **Feel free to contribute or raise issues if you encounter any!** 😊  
Made with ❤️ by Rushil Sethi 

---