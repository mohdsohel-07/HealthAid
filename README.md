# 🩺 HealthAid – Smart Health Awareness & Assistance Platform

> 🌿 **Empowering users with smart, accessible, and verified health insights.**  
> HealthAid provides symptom-based guidance, personalized remedies, and nearby facility navigation — all in one user-friendly platform.

---

## 🧭 Overview

HealthAid is a **web-based health guidance platform** designed to help users:
- Analyze symptoms and get safe home remedies 💊  
- Write descriptions of diseases or symptoms for detailed insights 📝  
- Find nearby hospitals, clinics, and pharmacies 🏥  
- Save, view, and download medical records securely 💾  

---

## ✨ Key Features (at a Glance)

| 💡 Feature | 🩹 Description |
|-------------|----------------|
| **🧠 Symptom Analyzer** | Choose from **15+ common symptoms** or describe your condition. Get AI-based recommendations, remedies, and next steps. |
| **💬 Disease Description Input** | Type a disease name or custom description — HealthAid suggests care options and precautions. |
| **📍 Nearby Facility Finder** | Uses **Google Maps API** to locate nearby **hospitals, clinics, or pharmacies**, complete with directions. |
| **📑 Personal Health Records** | Add, view, and download your records in **key: value** format (no complex JSON). |
| **🌐 Multilingual Support** | Available in **English and Hindi**. |
| **💻 Responsive Design** | Built with mobile-first design, works seamlessly across all devices. |

---

## 🧰 Tech Stack

| Layer | Tools Used |
|-------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6), Material Icons |
| **Mapping API** | Google Maps JavaScript API + Places API |
| **Data Storage** | LocalStorage (Browser-based) |
| **Export Format** | Readable text file (`key: value` style) |

---

## 🧩 Project Structure
```
HealthAid/
│
├── index.html # Main webpage structure
├── style.css # Custom design and responsive styles
├── script.js # Interactive logic and Maps API integration
└── README.md # Project documentation (this file)
```


---

## 🚀 Setup & Installation

### 1️⃣ Clone the repository:

git clone https://github.com/yourusername/healthaid.git
2️⃣ Open the project folder:

Copy code
cd healthaid
3️⃣ Add your Google Maps API Key:
Replace the placeholder key in index.html:

html

<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>
4️⃣ Run the app:
Simply open index.html in your browser or use:


npx live-server
🗺️ How the Nearby Search Works
Click "Nearby" in the navigation bar.

Choose a facility type (hospital, clinic, pharmacy).

Grant location access to see the results on the interactive map.

Click "Directions" to open Google Maps navigation.

🩺 Symptom Analyzer
Select from 15+ main symptoms (e.g., fever, cough, chest pain, nausea, fatigue, etc.)

Enter severity and duration.

Optionally write a detailed description of your disease/symptoms.

Receive suggestions for:

✅ Possible causes

🏠 Home remedies

💊 Doctor-approved medications

⚠️ When to see a doctor

📂 Record Management
Save personal records locally (date, condition, notes).

Export as a clean .txt file with format:


Copy code
Date: 2025-10-30
Condition: Fever
Notes: Mild fever for 2 days, took paracetamol.
Import or clear records anytime.

🎨 Design Highlights
Modern card-based layout

Light teal and white color palette

Smooth animations & transitions

Responsive grid and flex layout

Mobile-friendly navigation bar

---
🧑‍💻 Contributors

Name	Role	GitHub
Mohd Sohel	Developer & Designer	github.com/mohdsohel-07

---


📜 License

This project is licensed under the MIT License – free to use, modify, and distribute.


---


🩷 "HealthAid – Protecting plants, people, and the planet for a greener future."


