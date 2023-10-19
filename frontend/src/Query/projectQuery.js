import {gql}  from '@apollo/client'

const getProjects = gql`

query getProjects($limit:Int,$page:Int){
    projects(limit:$limit,page:$page)
        {
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

const getProject = gql`
    query getProject($id:ID){
        project(id:$id){
            id
            name
    description
    imageUrl
    ammounttocollect
    comment{
        id
        like
        msg
        user{
            
            firstName
            lastName
        }
    }
    projectCreator{
      firstName
      lastName
      email
    }
        }
        }
`;
const projectbyid = gql`
    query projectbyid($id:ID,$limit:Int,$page:Int){
        projectbyid(id:$id,limit:$limit,page:$page){
            totalCount
            data{
                id
            name
            description
            projectCreator{
            firstName
            lastName
            email
            }
            }
        }
    }
`;
export {getProject,getProjects,projectbyid}