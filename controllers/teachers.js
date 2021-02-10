const fs = require('fs')
const data = require('../data.json')
const { age, graduation, date } = require('../utils.js')
 
exports.post = function(req,res){

    const keys = Object.keys(req.body)

    for(key of keys){
        if(req.body[key] == "") return res.send("Todos os dados devem ser preenchidos!")
    }

    req.body.birth = Date.parse(req.body.birth)
    req.body.creation_date = Date.now()

    let teacherId = 1

    const lastTeacher = data.teachers[data.teachers.length - 1]

    if(lastTeacher){
        teacherId = lastTeacher.id + 1
    }

    req.body.id = teacherId

    data.teachers.push(req.body)

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err){
            return res.send("error")
        }
        return res.redirect(`/teachers/${req.body.id}`)
    })  
}

exports.show = function(req,res){
    const { id } = req.params

    const foundTeacher = data.teachers.find(function(teacher){
        return id == teacher.id
    })

    if(!foundTeacher) res.send("Teacher not founded!")

    teacher = {
        ...foundTeacher,
        age: age(foundTeacher.birth),
        education_level:  graduation(foundTeacher.education_level),
        acting_area: foundTeacher.acting_area.split(","),
        creation_date: Intl.DateTimeFormat("pt-BR").format(foundTeacher.creation_date).split("-")

    }

    teacher.creation_date[1] = `0${teacher.creation_date[1]}`.slice(-2)
    teacher.creation_date[0] = `0${teacher.creation_date[0]}`.slice(-2)

    return res.render("teach/show", {teacher})
}

exports.edit = function(req,res){
    const { id } = req.params

    const foundTeacher = data.teachers.find(function(teacher){
        return id == teacher.id
    })

    if(!foundTeacher) res.send("Teacher not founded!")

    const teacher = {
        ...foundTeacher,
        birth: date(foundTeacher.birth).iso
    }

    return res.render("teach/edit", { teacher })
}

exports.put = function(req,res){
    const { id } = req.body
    let index = 0

    const foundTeacher = data.teachers.find(function(teacher, foundIndex){
        if(id == teacher.id){
            index = foundIndex
            return true
        }
    })

    if(!foundTeacher) res.send("Teacher not founded!")

    const teacher = {
        ...foundTeacher,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.teachers[index]= teacher


    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) res.send("Error!")
        return res.redirect(`/teachers/${teacher.id}`)
    }
    )
}

exports.delete = function(req,res){
    const { id } = req.body
    
    const remainingTeachers = data.teachers.filter(function(teacher){
        return teacher.id != id
    })

    data.teachers = remainingTeachers

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Error!")
        
        return res.redirect("/teachers")
    })
}

exports.table = function(req,res){
    let foundTeacher = {}
    let teachers = []
    for(teacher of data.teachers){
        foundTeacher = {
            ...teacher,
            acting_area: teacher.acting_area.split(",")
        }
        teachers.push(foundTeacher)
    }
    
return res.render("teach/teachers", {teachers} )
}