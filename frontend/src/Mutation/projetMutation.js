import {gql}  from '@apollo/client'

const add_Project = gql`

mutation addProject($name : String! , $description:String! ,$imageUrl:String!,$ammounttocollect:Int!, $projectCreator: ID! ){
    addproject(name:$name  , description:$description ,imageUrl:$imageUrl,ammounttocollect:$ammounttocollect, projectCreator:$projectCreator )
        {
            id
            name
    description
    imageUrl
    ammounttocollect
    projectCreator{
     id
    }
        }      
}

`;


const update_Project = gql`

mutation updateProject($name : String! , $description:String! ,$imageUrl:String!,$ammounttocollect:Int!, $id: ID! ){
  updateproject(name:$name  , description:$description ,imageUrl:$imageUrl, ammounttocollect:$ammounttocollect,id:$id ){
            id
            name
            description
            imageUrl
            ammounttocollect
            projectCreator{
              firstName
              lastName
              email
            }
    }      
}
`;


const delete_Project = gql`

mutation deleteProject( $id: ID! ){
  deleteproject( id:$id ){
            id
            name
            description
            imageUrl
            ammounttocollect
            projectCreator{
              firstName
              lastName
              email
            }
    }      
}
`;

export {add_Project,update_Project,delete_Project}