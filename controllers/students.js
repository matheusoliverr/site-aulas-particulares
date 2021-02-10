const fs = require('fs')
const data = require('../data.json')
const { age, grade, date } = require('../utils.js')

exports.post = function(req,res){

    const keys = Object.keys(req.body)

    for(key of keys){
        if(req.body[key] == "") return res.send("Todos os dados devem ser preenchidos!")
    }

    req.body.birth = Date.parse(req.body.birth)

    let studentId = 1

    const lastStudent = data.students[data.students.length - 1]

    if(lastStudent){
        studentId = lastStudent.id + 1
    }

    const student = {
        ...req.body,
        id: studentId,
        birth_day: date(req.body.birth).birthDay,
    }

    data.students.push(student)

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err){
            return res.send("error")
        }
        return res.redirect(`/students/${studentId}`)
    })  
}

exports.show = function(req,res){
    const { id } = req.params

    const foundStudent = data.students.find(function(student){
        return id == student.id
    })

    if(!foundStudent) res.send("Student not founded!")

    student = {
        ...foundStudent,
        grade: grade(foundStudent.grade),
        age: age(foundStudent.birth)
    }

    return res.render("study/show", {student})
}

exports.table = function(req,res){
    let foundStudent = {}
    let students = []
    for(student of data.students){
        foundStudent = {
            ...student,
            grade: grade(student.grade) 
        }
        students.push(foundStudent)
    }
    
return res.render("study/students", {students} )
}

exports.edit = function(req,res){
    const { id } = req.params

    const foundStudent = data.students.find(function(student){
        return id == student.id
    })

    if(!foundStudent) res.send("Student not founded!")

    const student = {
        ...foundStudent,
        birth: date(foundStudent.birth).iso
    }

    return res.render("study/edit", { student })
}

exports.put = function(req,res){
    const { id } = req.body
    let index = 0

    const foundStudent = data.students.find(function(student, foundIndex){
        if(id == student.id){
            index = foundIndex
            return true
        }
    })

    if(!foundStudent) res.send("Student not founded!")

    const student = {
        ...foundStudent,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.students[index]= student


    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) res.send("Error!")
        return res.redirect(`/students/${student.id}`)
    }
    )
}

exports.delete = function(req,res){
    const { id } = req.body
    
    const remainingStudents = data.students.filter(function(student){
        return student.id != id
    })

    data.students = remainingStudents

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Error!")
        
        return res.redirect("/teachers")
    })
}

