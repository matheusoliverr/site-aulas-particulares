const express = require('express')
const routes = express.Router()
const teachers = require('./controllers/teachers')
const students = require('./controllers/students')

routes.get("/", function(req,res){
    res.redirect("/teachers")
})

routes.get("/teachers", teachers.table)
routes.get("/teachers/create", function(req,res){
    res.render("teach/create")
})
routes.get("/teachers/:id", teachers.show)
routes.get("/teachers/:id/edit", teachers.edit)
routes.put("/teachers", teachers.put)
routes.delete("/teachers", teachers.delete)
routes.post("/teachers", teachers.post)

routes.get("/students", students.table)
routes.get("/students/create", function(req,res){
    res.render("study/create")
})
routes.get("/students/:id", students.show)
routes.get("/students/:id/edit", students.edit)
routes.put("/students", students.put)
routes.delete("/students", students.delete)
routes.post("/students", students.post)

module.exports = routes