from fastapi import FastAPI, HTTPException

app = FastAPI(title="Student Directory API")

# Sample student data (Python list)
students = [
    {"id": 1, "name": "Shubha", "age": 22, "dept": "CSE"},
    {"id": 2, "name": "Harini", "age": 20, "dept": "ECE"},
    {"id": 3, "name": "Raju", "age": 21, "dept": "ME"}
]

# GET /students → list all students
@app.get("/students")
def get_students():
    return students

# GET /students/{id} → get student by ID
@app.get("/students/{id}")
def get_student(id: int):
    for student in students:
        if student["id"] == id:
            return student
    raise HTTPException(status_code=404, detail="Student not found")
