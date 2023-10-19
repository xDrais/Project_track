const asynHandler = require("express-async-handler")
const Project = require('../Models/project.js')



const comment = asynHandler( async(req,res)  =>{
    const { like,msg,user}=req.body
    const { id}=req.params
    const rev={
        like:like,
        msg:msg,
        user:user
    }


    const project = await Project.findById(id);
    console.log(id)
    console.log(project)
    if (!project) {
      return res.json({ message: 'project not found' }).status(404);
    }
    project.comment.push(rev)
    project.save()
    return res.json(project).status(200);
      
 })
 const uncomment = asynHandler( async(req,res)  =>{
    const { comentid}=req.body
    const { id }=req.params
    const project = await Project.findById(id);
    if (!project) {
      return res.json({ message: 'project not found' }).status(404);
    }
    project.comment.map((c)=>{
        if (c._id==comentid) {
            project.comment.pop(c)
        }
    })
    project.save()
    return res.json(project).status(200);
      
 })

 module.exports = {comment,uncomment }