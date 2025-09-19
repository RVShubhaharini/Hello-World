from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/hello')
def hello():
    return "Hello, Interns!"

@app.route('/students')
def students():
    student_list = [
        {'name':'shubha','age':21,'roll_no':53},
        {'name':'harini','age':20,'roll_no':23},
        {'name':'raj','age':22,'roll_no':50}
    ]
    return jsonify(student_list)

if __name__ == "__main__":
    app.run(debug=True)
