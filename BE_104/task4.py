from fastapi import FastAPI
from typing import Optional

app = FastAPI()

# Route 1: /ping
@app.get("/ping")
def ping():
    return {"message": "pong"}

# Route 2: /students/{id}
@app.get("/students/{id}")
def get_student(id: int):
    # Dummy student data
    dummy_students = {
        1: {"name": "Shubha", "age": 22, "roll_no": 101},
        2: {"name": "Harini", "age": 20, "roll_no": 102},
        3: {"name": "Raju", "age": 21, "roll_no": 103}
    }
    student = dummy_students.get(id, {"error": "Student not found"})
    return student
