import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from '../services/api';

export default function CalendarPage({ onSelectTask, refreshTrigger }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, [refreshTrigger]);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/calendar/events/');
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEventClick = (info) => {
    onSelectTask({
      id: info.event.id,
      title: info.event.title.split(': ')[1] || info.event.title,
      project_name: info.event.extendedProps.project_name,
      status: info.event.extendedProps.status,
      priority: info.event.extendedProps.priority,
      hours_worked: info.event.extendedProps.hours_worked,
      description: info.event.extendedProps.description,
      technologies: info.event.extendedProps.technologies,
      remarks: info.event.extendedProps.remarks,
      work_date: info.event.startStr,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View your work history by date.</p>
      </div>

      <div className="bg-white dark:bg-[#181C24] border border-gray-200 dark:border-[#282F3E] rounded-xl p-5 shadow-sm transition-colors">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          eventClick={handleEventClick}
          height="75vh"
        />
      </div>
    </div>
  );
}