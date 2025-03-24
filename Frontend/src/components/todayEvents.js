import React, { useEffect, useState } from 'react';
import "../Styles/todayEvents.css";

const TodayEvents = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
const todayDate = new Date().toLocaleDateString(); // You can format it as needed

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/today-events');
        const data = await response.json();

        if (data.events) {
          setEvents(data.events);
        } else {
          setEvents([]);
        }
      } catch (err) {
        setError('Error fetching events');
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h1>Today's Events</h1>
      <p><strong>Date:</strong> {todayDate}</p> {/* Display today's date */}

      {error && <p>{error}</p>}
      {events.length > 0 ? (
        events.map((event, index) => {
          const startDate = new Date(event.startDate);
          const endDate = new Date(event.endDate);
          const duration = event.noOfHours || 'Not Available';
          const participants = event.noOfguests || 'Not Available';

          return (
            <div key={index} className="event">
              <h3>{event.ENAME}</h3>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>From:</strong> {startDate.toLocaleString()} <strong>to</strong> {endDate.toLocaleString()}</p>
              <p><strong>Duration:</strong> {duration} hours</p>
              <p><strong>Participants:</strong> {participants}</p>
            </div>
          );
        })
      ) : (
        <p>No events found for today.</p>
      )}
    </div>
  );
};

export default TodayEvents;
