const Event = require('../Models/event')
const Project = require('../Models/project')
const {GraphQLID,GraphQLString,GraphQLObjectType, GraphQLList,GraphQLInt,GraphQLNonNull,GraphQLSchema } =require('graphql')
var GraphQLDate = require('graphql-date')
const User = require('../Models/user')
const project = require('../Models/project')

//event crud



const EventType = new GraphQLObjectType({
    name : 'event',
    fields: () =>({
        id: {type:GraphQLID},
        name: {type:GraphQLString},
        description: {type:GraphQLString},
        dateEnd: {type:GraphQLDate},
        dateStart: {type:GraphQLDate},
        participantsnumber:{type:GraphQLInt} ,
        imageUrl: {type:GraphQLString},
        participant: {type:(UserType),
           
        },
        eventCreator: {type:(UserType),
            
        resolve(parent,args){
            return User.findById(parent.eventCreator)
        } }


    })
    ,

})

const UserType = new GraphQLObjectType({
    name : 'user',
    fields: () =>({
        id: {type:GraphQLID},
        email: {type:GraphQLString},
        lastName: {type:GraphQLString},
        firstName: {type:GraphQLString},
        phone: {type:GraphQLString},
        cin: {type:GraphQLInt},
        imageUrl: {type:GraphQLString}
    })
})


const ComentType = new GraphQLObjectType({
    name : 'comment',
    fields: () =>({
        id: {type:GraphQLID},
       
        user: {type:GraphQLObjectType},
        like: {type:GraphQLInt},
        msg: {type:GraphQLString},
        user:{type:UserType,
            resolve(parent,args){
                
                return User.findById(parent.user)
            } },
    })
})

const ProjectType = new GraphQLObjectType({
    name : 'project',
    fields: () =>({
        id: {type:GraphQLID},
        projectCreator: {type:GraphQLObjectType},
        comment: {type:GraphQLList(ComentType)},
        name: {type:GraphQLString},
        name: {type:GraphQLString},
        description: {type:GraphQLString},
        imageUrl: {type:GraphQLString},
        ammounttocollect: {type:GraphQLInt},
        projectCreator: {type:UserType,
            resolve(parent,args){
                
                return User.findById(parent.projectCreator)
            } },
           

            
            
          
    }),
 
})




const Page = (itemType) => {
    return new GraphQLObjectType({
        name: 'PageType',
        fields: () => ({
            totalCount: { type: GraphQLInt,
                resolve(parent,args){
                    return Project.find({projectCreator:parent[0].projectCreator}).count()
                } },
            data: { type: new GraphQLList(itemType),resolve(parent,args){
                return parent;
            } },
        })
    })
}

 //Query
 const RootQuery = new GraphQLObjectType({
    name : 'RootQueryType',
        fields: {
            //get project by user id
            projectbyid:{

                type: Page(ProjectType),
                args:{
                    id:{type:GraphQLID},
                    limit:{type:GraphQLInt},
                    page :{type:GraphQLInt}
                  },
              resolve(parent,args){
                  
                  return Project.find({projectCreator:args.id}).limit(args.page).skip(args.page *((args.limit)-1))
              }
      
           },
                    //get all events

            events:{
                type: new GraphQLList(EventType),
                resolve(parent,args){
                    return Event.find()
                }
            },
                    //get event by id

            event:{
                type :EventType,
                args:{id:{type:GraphQLID}},
                resolve(parent,args){
                    return Event.findById(args.id)
                }
                
            },
                  //get all projects
                    
                  projects:{
                    
                    type: new GraphQLList(ProjectType),
                    args:{limit:{type:GraphQLInt},
                    page :{type:GraphQLInt}
                    },
                    
                    resolve(parent,args){
                        
                        return  Project.find().limit(args.page).skip(args.page *(args.limit-1))
                        
                        
                    }
                },
                //get project by id

                  project:{
                    type :ProjectType,
                    args:{id:{type:GraphQLID}},
                    resolve(parent,args){
                        return Project.findById(args.id)
                    }
            
                 },
                 

        }
    } 
 )





 //mutation

 const mutation = new GraphQLObjectType({
    name:'RootMutationType',
    fields: {
          //add event
        addevent: {           
            type:EventType,
            args:{
                name: {type:new GraphQLNonNull(GraphQLString)},
                description: {type:new GraphQLNonNull(GraphQLString)},
                dateEnd: {type:GraphQLDate},
                participantsnumber:{type:GraphQLInt} ,
                imageUrl: {type:new GraphQLNonNull(GraphQLString)},
                eventCreator: {type:new GraphQLNonNull(GraphQLID)},
            },
            resolve(parent,args){
                const event = Event.create({
                    name: args.name,
                    description:args.description,
                    dateEnd :args.dateEnd,
                    participantsnumber :args.participantsnumber,
                    imageUrl :args.imageUrl,
                    eventCreator: args.eventCreator

                })
                return event
            }
            
        },
        //delete event
        deleteevent:{type: EventType,
            args:{id:{type:new GraphQLNonNull(GraphQLID)}},
            resolve(parent,args){
                return Event.findByIdAndDelete(args.id)
            }
            
    },
    //update event
    updateevent:{
        type:EventType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLID)},
                name: {type:GraphQLString},
                description: {type: (GraphQLString)},
                dateEnd: {type:GraphQLDate},
                participantsnumber:{type:GraphQLInt} ,
                imageUrl: {type: (GraphQLString)},
            },
            resolve(parent,args){
            return Event.findByIdAndUpdate(args.id,
                {
                    $set:{
                        name: args.name,
                        description:args.description,
                        dateEnd :args.dateEnd,
                        participantsnumber :args.participantsnumber,
                        imageUrl :args.imageUrl,
                    }
                })
        }
    },

//add project
    addproject: {           
        type:ProjectType,
        args:{
            name: {type:new GraphQLNonNull(GraphQLString)},
            description: {type:new GraphQLNonNull(GraphQLString)},
            imageUrl: {type:new GraphQLNonNull(GraphQLString)},
            projectCreator: {type:new GraphQLNonNull(GraphQLID)},
            ammounttocollect: {type:new GraphQLNonNull(GraphQLInt)}
        },
        resolve(parent,args){
            const project = Project.create({
                name: args.name,
                description:args.description,
                imageUrl :args.imageUrl,
                projectCreator: args.projectCreator,
                ammounttocollect: args.ammounttocollect
            })
            return project
        }
        
    },
    
        //delete project
        deleteproject:{type: ProjectType,
            args:{id:{type:new GraphQLNonNull(GraphQLID)}},
            resolve(parent,args){
                return Project.findByIdAndDelete(args.id)
            }
            
    },
     //update project
     updateproject:{
        type:ProjectType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLID)},
                name: {type:GraphQLString},
                description: {type: (GraphQLString)},
                imageUrl: {type: (GraphQLString)},
                ammounttocollect: {type:new GraphQLNonNull(GraphQLInt)}

            },
            resolve(parent,args){
            return Project.findByIdAndUpdate(args.id,
                {
                    $set:{
                        name: args.name,
                        description:args.description,
                        imageUrl :args.imageUrl,
                        ammounttocollect :args.ammounttocollect,
                    }
                })
        }
    }







 }




}
 
 
 )










 module.exports = new GraphQLSchema({
 
    query: RootQuery,
    mutation: mutation
 })