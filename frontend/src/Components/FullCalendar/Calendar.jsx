import React from 'react'
import { formatDate } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from './event-utils'

import {useQuery} from '@apollo/client'
import  {getEvents} from '../../Query/eventQuerry'



 const Calendar=() =>{
  const {loading,error,data} = useQuery(getEvents)
  const even=[]

  const addevent=(id,namen,date)=>{
    even.push({id:id,title:namen,start:date})

  }
  return (
    <div className='py-5'>
      <h1>Event Calendar</h1>
      {data?.events.map(event => (
             <div key={event.id}>
           {
addevent(event.id,event.name,event.dateStart)
           }
           
             </div>
             ))}

      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView='dayGridMonth'
        weekends={false}
        events={even}
        eventContent={renderEventContent}
      />
    </div>
  )
}

// a custom render function
function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}

export default Calendar