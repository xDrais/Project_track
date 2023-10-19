import {gql}  from '@apollo/client'

const getEvents = gql`

query getEvents{
    events
        {
            id
            name
    description
    dateStart
    dateEnd
    participantsnumber
    imageUrl
    participant{
      firstName
      lastName
      email
    }
    
    eventCreator{
      firstName
      lastName
      email
    }
        }
        
    
}

`;
const getEvent = gql`
    query getEvent($id:ID){
        event(id:$id){
            id
            name
    description
    
    dateEnd
    participantsnumber
    imageUrl
    participant{
      firstName
      lastName
      email
    }
    eventCreator{
      firstName
      lastName
      email
    }

            }
        }
`;
export {getEvents,getEvent}