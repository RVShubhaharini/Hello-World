# 📚 Backend Week 1 – Student API Tasks

This repository contains solutions for **Backend Development Week 1 (Tasks 2–5)**.  
The tasks gradually build from Python basics → Flask → FastAPI → a mini Student Directory API.

---

## 🚀 Tasks Overview
- **Task 2 (BE-102)** – Python Refresher (Lists, Dictionaries, JSON)
- **Task 3 (BE-103)** – Flask Basics (Simple API with routes)
- **Task 4 (BE-104)** – FastAPI Basics (Ping API + Student endpoint)
- **Task 5 (BE-105)** – Mini Project: Student Directory API (FastAPI)

---

## 📝 Task 2 – Python Refresher

### Objective
- Store student details as **dictionaries inside a list**  
- Sort the list by **age**  
- Save results in a **JSON file**

### How to Run
```bash
python task2.py

## 📝 Task 3 – Flask Basics

### Objective
- Build a simple **Flask API** with two routes:
  - `/hello` → returns `"Hello, Interns!"`
  - `/students` → returns a **hardcoded JSON list of students**

### How to Run
1. Install Flask (if not already installed):
   ```bash
   pip install flask
python task3.py


## 📝 Task 4 – FastAPI Basics

### Objective
- Build a simple **FastAPI app** with two endpoints:
  - `/ping` → returns `{ "message": "pong" }`
  - `/students/{id}` → returns dummy student details by ID  

### How to Run
1. Install FastAPI and Uvicorn (if not already installed):
   ```bash
   pip install fastapi uvicorn
uvicorn task4:app --reload


## 📝 Task 5 – Mini Project: Student Directory API

### Objective
- Build a **Student Directory API** using **FastAPI**  
- Endpoints:
  - `/students` → returns list of all students (`id, name, age, dept`)  
  - `/students/{id}` → returns details of a specific student  
- Data stored in a **Python list** (MongoDB integration will be added in Week 2)  
- Follow **REST standards** (only GET methods in Week 1)  

### How to Run
1. Install FastAPI and Uvicorn (if not already installed):
   ```bash
   pip install fastapi uvicorn
to run : uvicorn task5:app --reload