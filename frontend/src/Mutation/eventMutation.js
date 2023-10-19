import {gql}  from '@apollo/client'

const add_Event = gql`

mutation addEvent($name : String! , $description:String!,$dateEnd:Date!,$participantsnumber:Int! ,$imageUrl:String!, $eventCreator: ID! ){
    addevent(name:$name  , description:$description,dateEnd:$dateEnd,participantsnumber:$participantsnumber ,imageUrl:$imageUrl, eventCreator:$eventCreator )
        {
            id
            name
    description
    imageUrl
    eventCreator{
     id
    }
        }      
}

`;


const update_Event = gql`

mutation updateEvent($name : String! , $description:String!,$dateEnd:Date!,$participantsnumber:Int! ,$imageUrl:String!, $id: ID! ){
    updateevent(name:$name  , description:$description,dateEnd:$dateEnd,participantsnumber:$participantsnumber ,imageUrl:$imageUrl, id:$id ){
            id
            name
            description
            imageUrl
            eventCreator{
              firstName
              lastName
              email
            }
    }      
}
`;


const delete_Event = gql`

mutation deleteEvent( $id: ID! ){
    deleteevent( id:$id ){
            id
            name
            description
            imageUrl
            eventCreator{
              firstName
              lastName
              email
            }
    }      
}
`;

export {add_Event,update_Event,delete_Event}