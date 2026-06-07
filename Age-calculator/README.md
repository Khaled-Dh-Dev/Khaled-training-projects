# 📊 User Management & Age Calculator CLI

A robust Node.js Command Line Interface (CLI) application designed for managing user records, calculating exact ages, identifying generational decades, and processing data persistence directly via flat text files (`users.txt`).

## 🚀 Key Features

* **Full CRUD Operations:** Add, view, search, modify, and delete user records seamlessly.
* **Bulletproof Input Validation:** Driven by strict Regular Expressions (`RegEx`) preventing any corrupted or partially-numeric inputs (e.g., rejecting formats like `1993kj`).
* **Float Mutation Prevention:** Advanced control flow logic ensuring navigation choices accept whole integers only—strictly denying decimal tampering (e.g., rejecting `2.5` for row selections).
* **Dynamic Data Calculations:** Computes current age, maps generational decades (e.g., 20s, 30s), and appends data under dynamic safety blocks.

## 🛠️ Built With

* **Node.js** (Core runtime environment)
* **Readline Module** (Asynchronous CLI stream handling)
* **JavaScript (ES6+)**

---