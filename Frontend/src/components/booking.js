import { useEffect, useState } from "react";

function Bookings() {
  const [events, setEvents] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")); // Get user from localStorage

  useEffect(() => {
    if (!user) {
      console.error("No user found in storage.");
      return;
    }

    fetch(`http://localhost:5000/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientID: user.id }),
    })
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching bookings:", err));
  }, []);

  return (
    <div style={styles.container}>
      <h2>{user.username}'s Bookings</h2>
      {events.length > 0 ? (
        <div style={styles.bookingsContainer}>
          {events.map((event) => (
            <div key={event.EId} style={styles.eventItem}>
              <h3 style={styles.eventTitle}>{event.ENAME}</h3>
              <p style={styles.eventDates}>
                {new Date(event.startDate).toLocaleDateString()} -{" "}
                {new Date(event.endDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.noBookings}>No bookings found.</p>
      )}
    </div>
  );
}

// Inline styles for neatness
const styles = {
  container: { textAlign: "center", padding: "30px", maxWidth: "600px", margin: "auto" },
  bookingsContainer: { listStyleType: "none", padding: 0 },
  eventItem: { borderBottom: "1px solid #ccc", padding: "15px", marginBottom: "10px" },
  eventTitle: { fontSize: "18px", fontWeight: "bold" },
  eventDates: { color: "#666" },
  noBookings: { fontSize: "16px", color: "#888" },
};

export default Bookings;
