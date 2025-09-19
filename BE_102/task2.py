import json 

students=[{'name':'shubha','age':21,'roll no':53},{'name':'harini','age':20,'roll no':23},
          {'name':'raj','age':2,'roll no':50}]

students_sorted=sorted(students,key=lambda x:x['age'])

with open("students.json","w") as json_file:
    json.dump(students_sorted,json_file,indent=4)

print("Student data has been sorted and printed as json file")