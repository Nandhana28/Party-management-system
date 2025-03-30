import { useEffect, useState } from "react";

function Bookings() {
  const [events, setEvents] = useState([]);
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [showFoodPopup, setShowFoodPopup] = useState(false);
  const [showHallPopup, setShowHallPopup] = useState(false);
  const [foodItems, setFoodItems] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState({});
  const [halls, setHalls] = useState([]);
  const [selectedHall, setSelectedHall] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalFoodCost, setTotalFoodCost] = useState(0);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    accountNumber: '',
    pinCode: ''
  });
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const [newEvent, setNewEvent] = useState({
    ENAME: "",
    startDate: "",
    endDate: "",
    location: "",
    etype: "wedding",
    noOfguests: "",
    edescription: ""
  });

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || !user.id) {
      setError("No user found. Please login.");
      return;
    }
    fetchBookings();
    fetchFoodItems();
  }, []);

  useEffect(() => {
    // Calculate total food cost whenever selectedFoods changes
    let total = 0;
    Object.entries(selectedFoods).forEach(([foodId, data]) => {
      const food = foodItems.find(f => f.fid === parseInt(foodId));
      if (food && data.quantity > 0) {
        total += food.rate * data.quantity;
      }
    });
    setTotalFoodCost(total);
  }, [selectedFoods, foodItems]);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/bookings`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify({ clientID: user.id }),
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFoodItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/food-items');
      const data = await response.json();
      setFoodItems(data);
    } catch (err) {
      console.error("Error fetching food items:", err);
    }
  };

  const fetchHalls = async (city) => {
    try {
      const response = await fetch(`http://localhost:5000/halls-by-city/${city}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setHalls(data);
    } catch (err) {
      console.error("Error fetching halls:", err);
      setError("Failed to load halls for this location.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const calculateDaysAndHours = () => {
    if (!newEvent.startDate || !newEvent.endDate) return { days: 0, hours: 0 };
    
    const start = new Date(newEvent.startDate);
    const end = new Date(newEvent.endDate);
    
    if (end < start) {
      setError("End date must be after start date");
      return { days: 0, hours: 0 };
    }
    
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return { days: diffDays, hours: diffDays * 8 };
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!newEvent.ENAME || !newEvent.startDate || !newEvent.endDate || !newEvent.location) {
      setError("Please fill all required fields");
      return;
    }

    const { days, hours } = calculateDaysAndHours();
    if (days === 0) return;

    try {
      setIsLoading(true);
      const eventData = {
        ...newEvent,
        noOfDays: days,
        noOfHours: hours,
        clientID: user.id
      };

      const response = await fetch('http://localhost:5000/create-event', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const eventResult = await response.json();
      setCurrentEvent({
        ...eventResult,
        location: newEvent.location,
        noOfDays: days
      });
      
      setShowEventPopup(false);
      setShowFoodPopup(true);
    } catch (err) {
      console.error('Error creating event:', err);
      setError("Failed to create event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFoodQuantity = (foodId, action) => {
    const food = foodItems.find(f => f.fid === parseInt(foodId));
    if (!food) return;
    
    setSelectedFoods(prev => {
      const current = prev[foodId] || { quantity: 0, special_instructions: '' };
      let newQuantity;
      
      if (action === 'increase') {
        newQuantity = current.quantity + 1;
      } else if (action === 'decrease') {
        newQuantity = Math.max(0, current.quantity - 1);
      } else if (action === 'set' && typeof action.value === 'number') {
        newQuantity = action.value;
      } else {
        newQuantity = current.quantity;
      }
      
      // Calculate item total cost
      const itemTotalCost = food.rate * newQuantity;
      
      return {
        ...prev,
        [foodId]: { 
          ...current, 
          quantity: newQuantity,
          total_cost: itemTotalCost
        }
      };
    });
  };

  const handleManualQuantityChange = (foodId, e) => {
    const value = parseInt(e.target.value) || 0;
    if (value < 0) return;
    
    const food = foodItems.find(f => f.fid === parseInt(foodId));
    if (!food) return;
    
    setSelectedFoods(prev => {
      const current = prev[foodId] || { quantity: 0, special_instructions: '' };
      return {
        ...prev,
        [foodId]: {
          ...current,
          quantity: value,
          total_cost: food.rate * value
        }
      };
    });
  };

  const handleFoodInstructions = (foodId, instructions) => {
    setSelectedFoods(prev => ({
      ...prev,
      [foodId]: { ...prev[foodId], special_instructions: instructions }
    }));
  };

  const handleFoodSubmit = async () => {
    try {
      setIsLoading(true);
      
      // Filter foods with quantity > 0
      const foodsToSubmit = Object.entries(selectedFoods)
        .filter(([_, data]) => data.quantity > 0)
        .map(([foodId, data]) => {
          const food = foodItems.find(f => f.fid === parseInt(foodId));
          return {
            food_id: parseInt(foodId),
            quantity: data.quantity,
            special_instructions: data.special_instructions || '',
            total_cost: food.rate * data.quantity
          };
        });

      // Submit all food selections
      await fetch('http://localhost:5000/save-food-bookings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          client_id: user.id,
          event_id: currentEvent.eventId,
          foodSelections: foodsToSubmit
        })
      });

      // Fetch halls for the location
      await fetchHalls(newEvent.location);
      
      // Show hall selection popup
      setShowFoodPopup(false);
      setShowHallPopup(true);
    } catch (err) {
      console.error('Error saving food selections:', err);
      setError("Failed to save food selections");
    } finally {
      setIsLoading(false);
    }
  };

  const handleHallSelect = (hallId) => {
    setSelectedHall(hallId);
  };

    const handleHallSubmit = async () => {
    if (!selectedHall) {
      setError("Please select a hall");
      return;
    }

    try {
      setIsLoading(true);
      
      const selectedHallObj = halls.find(h => h.hallid === selectedHall);
      const hallAmount = selectedHallObj.hallAmount * currentEvent.noOfDays;
      
      // Save hall booking first
      await fetch('http://localhost:5000/book-hall', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          client_id: user.id,
          event_id: currentEvent.eventId,
          hall_id: selectedHall,
          totalAmount: hallAmount
        })
      });

      // Calculate total amount (food + hall + service charge)
      const serviceCharge = 40000;
      const total = totalFoodCost + hallAmount + serviceCharge;
      setTotalAmount(total);
      
      // Show payment popup
      setShowHallPopup(false);
      setShowPaymentPopup(true);
      
    } catch (err) {
      console.error('Error booking hall:', err);
      setError("Failed to book hall");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
  };
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentProcessing(true);
    setError(null);
  
    // Ensure totalAmount is defined before making the request
    if (totalAmount === undefined || totalAmount <= 0) {
      setError("Invalid payment amount.");
      setPaymentProcessing(false);
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/process-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          client_id: user?.id,
          event_id: currentEvent?.eventId,
          account_number: paymentDetails?.accountNumber,
          total_amount: totalAmount,
        }),
      });
  
      if (!response.ok) {
        let errorMessage = `Payment failed (Error ${response.status})`;
        if (response.status === 401) errorMessage = "Unauthorized: Please log in.";
        if (response.status === 400) errorMessage = "Invalid payment details.";
        if (response.status === 500) errorMessage = "Server error. Try again later.";
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
      if (data.success) {
        setPaymentSuccess(true);
        fetchBookings();
      } else {
        throw new Error(data.error || "Payment failed.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setPaymentProcessing(false);
    }
  };
  
  const closePaymentPopup = () => {
    setShowPaymentPopup(false);
    setPaymentSuccess(false);
    setPaymentDetails({ accountNumber: '', pinCode: '' });
    setSelectedHall(null);
    setSelectedFoods({});
    setCurrentEvent(null);
    setNewEvent({
      ENAME: "",
      startDate: "",
      endDate: "",
      location: "",
      etype: "wedding",
      noOfguests: "",
      edescription: ""
    });
  };

  const getFoodTypeName = (type) => {
    const types = { B: 'Breakfast', L: 'Lunch', S: 'Snacks', D: 'Dinner' };
    return types[type] || type;
  };

  // Define styles object OUTSIDE of the JSX return
  const styles = {
    container: { 
      textAlign: "center", 
      padding: "30px", 
      maxWidth: "800px", 
      margin: "auto",
      position: "relative" 
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px"
    },
    addButton: {
      fontSize: "24px",
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      border: "none",
      backgroundColor: "#4CAF50",
      color: "white",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    bookingsContainer: { 
      listStyleType: "none", 
      padding: 0 
    },
    eventItem: { 
      borderBottom: "1px solid #ccc", 
      padding: "15px", 
      marginBottom: "10px",
      textAlign: "left",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px"
    },
    eventTitle: { 
      fontSize: "18px", 
      fontWeight: "bold",
      marginBottom: "5px",
      color: "#333"
    },
    eventDates: { 
      color: "#666",
      marginBottom: "5px",
      fontSize: "14px"
    },
    eventType: {
      color: "#666",
      fontStyle: "italic",
      fontSize: "14px"
    },
    eventDetails: {
      color: "#555",
      fontSize: "14px",
      margin: "3px 0"
    },
    noBookings: { 
      fontSize: "16px", 
      color: "#888",
      padding: "20px"
    },
    error: {
      color: "#d32f2f",
      backgroundColor: "#fde0e0",
      padding: "10px",
      borderRadius: "4px",
      margin: "10px 0",
      textAlign: "center"
    },
    loading: {
      color: "#666",
      fontStyle: "italic",
      padding: "20px"
    },
    popup: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      backdropFilter: "blur(5px)"
    },
    popupContent: {
      backgroundColor: "white",
      padding: "25px",
      borderRadius: "12px",
      width: "90%",
      maxWidth: "500px",
      maxHeight: "80vh",
      overflowY: "auto",
      position: "relative",
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
    },
    foodPopupContent: {
      backgroundColor: "white",
      padding: "25px",
      borderRadius: "12px",
      width: "90%",
      maxWidth: "800px",
      maxHeight: "90vh",
      overflowY: "auto",
      position: "relative",
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
    },
    closeButton: {
      position: "absolute",
      top: "10px",
      right: "10px",
      background: "none",
      border: "none",
      fontSize: "20px",
      cursor: "pointer"
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "15px"
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "5px",
      textAlign: "left"
    },
    submitButton: {
      padding: "12px",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      marginTop: "20px",
      fontSize: "16px",
      fontWeight: "bold"
    },
    foodGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "20px",
      margin: "20px 0"
    },
    foodCard: {
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "15px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      backgroundColor: "#f9f9f9"
    },
    foodImage: {
      width: "100%",
      height: "150px",
      objectFit: "cover",
      borderRadius: "6px"
    },
    foodInfo: {
      textAlign: "center"
    },
    foodPrice: {
      fontWeight: "bold",
      color: "#4CAF50"
    },
    foodControls: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "15px"
    },
    quantityInput: {
      width: "50px",
      textAlign: "center",
      padding: "5px"
    },
    foodItemTotal: {
      textAlign: "center",
      fontWeight: "bold",
      marginTop: "5px"
    },
    foodCostSummary: {
      backgroundColor: "#f0f8ff",
      padding: "10px",
      borderRadius: "8px",
      marginTop: "10px",
      marginBottom: "10px",
      fontWeight: "bold"
    },
    foodTextarea: {
      width: "100%",
      minHeight: "60px",
      padding: "8px",
      borderRadius: "4px",
      border: "1px solid #ddd",
      resize: "vertical",
      fontSize: "14px"
    }
  };

  if (!user || !user.id) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>Please login to view bookings</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>{user.username}'s Bookings</h2>
        <button 
          style={styles.addButton}
          onClick={() => setShowEventPopup(true)}
          disabled={isLoading}
        >
          +
        </button>
      </div>
      
      {error && <p style={styles.error}>{error}</p>}
      
      {isLoading ? (
        <p style={styles.loading}>Loading...</p>
      ) : events.length > 0 ? (
        <div style={styles.bookingsContainer}>
          {events.map(event => (
            <div key={event.EId} style={styles.eventItem}>
              <h3 style={styles.eventTitle}>{event.ENAME}</h3>
              <p style={styles.eventDates}>
                {new Date(event.startDate).toLocaleDateString()} -{" "}
                {new Date(event.endDate).toLocaleDateString()}
              </p>
              <p style={styles.eventType}>Type: {event.etype}</p>
              <p style={styles.eventDetails}>Guests: {event.noOfguests}</p>
              <p style={styles.eventDetails}>Location: {event.location}</p>
              <p style={styles.eventDetails}>Duration: {event.noOfDays} days</p>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.noBookings}>No bookings found.</p>
      )}

      {/* Event Creation Popup */}
      {showEventPopup && (
        <div style={styles.popup} onClick={() => setShowEventPopup(false)}>
          <div style={styles.popupContent} onClick={e => e.stopPropagation()}>
            <button 
              style={styles.closeButton}
              onClick={() => setShowEventPopup(false)}
              disabled={isLoading}
            >
              ×
            </button>
            <h3>Book New Event</h3>
            <form onSubmit={handleEventSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label>Event Name:</label>
                <input
                  type="text"
                  name="ENAME"
                  value={newEvent.ENAME}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label>Start Date:</label>
                <input
                  type="date"
                  name="startDate"
                  value={newEvent.startDate}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label>End Date:</label>
                <input
                  type="date"
                  name="endDate"
                  value={newEvent.endDate}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label>Location (City):</label>
                <input
                  type="text"
                  name="location"
                  value={newEvent.location}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  placeholder="Enter city name"
                />
              </div>
              
              <div style={styles.formGroup}>
                <label>Event Type:</label>
                <select
                  name="etype"
                  value={newEvent.etype}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                >
                  <option value="wedding">Wedding</option>
                  <option value="christmas">Christmas</option>
                  <option value="corporate">Corporate</option>
                  <option value="birthday">Birthday</option>
                  <option value="conference">Conference</option>
                </select>
              </div>
              
              <div style={styles.formGroup}>
                <label>Number of Guests:</label>
                <input
                  type="number"
                  name="noOfguests"
                  value={newEvent.noOfguests}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <button 
                type="submit" 
                style={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Continue to Food Selection'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Food Selection Popup */}
      {showFoodPopup && (
        <div style={styles.popup} onClick={() => setShowFoodPopup(false)}>
          <div style={styles.foodPopupContent} onClick={e => e.stopPropagation()}>
            <button 
              style={styles.closeButton}
              onClick={() => setShowFoodPopup(false)}
              disabled={isLoading}
            >
              ×
            </button>
            <h3>Select Food Items</h3>
            <div style={styles.foodCostSummary}>
              <p>Total Food Cost: ₹{totalFoodCost.toFixed(2)}</p>
            </div>
            <div style={styles.foodGrid}>
              {foodItems.map(food => (
                <div key={food.fid} style={styles.foodCard}>
                  <img 
                    src={food.url} 
                    alt={food.fName} 
                    style={styles.foodImage}
                  />
                  <div style={styles.foodInfo}>
                    <h4>{food.fName}</h4>
                    <p>{getFoodTypeName(food.ftype)}</p>
                    <p style={styles.foodPrice}>₹{food.rate} per unit</p>
                  </div>
                  <div style={styles.foodControls}>
                    <button 
                      onClick={() => handleFoodQuantity(food.fid, 'decrease')}
                      disabled={isLoading}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={selectedFoods[food.fid]?.quantity || 0}
                      onChange={(e) => handleManualQuantityChange(food.fid, e)}
                      style={styles.quantityInput}
                      disabled={isLoading}
                    />
                    <button 
                      onClick={() => handleFoodQuantity(food.fid, 'increase')}
                      disabled={isLoading}
                    >
                      +
                    </button>
                  </div>
                  <div style={styles.foodItemTotal}>
                    Item Total: ₹{((selectedFoods[food.fid]?.quantity || 0) * food.rate).toFixed(2)}
                  </div>
                  <input
                    type="text"
                    placeholder="Special instructions"
                    value={selectedFoods[food.fid]?.special_instructions || ''}
                    onChange={(e) => handleFoodInstructions(food.fid, e.target.value)}
                    style={styles.foodTextarea}
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>
            <button 
              style={styles.submitButton}
              onClick={handleFoodSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Continue to Hall Selection'}
            </button>
          </div>
        </div>
      )}

      {/* Hall Selection Popup */}
      {showHallPopup && (
        <div style={styles.popup} onClick={() => setShowHallPopup(false)}>
          <div style={styles.popupContent} onClick={e => e.stopPropagation()}>
            <button 
              style={styles.closeButton}
              onClick={() => setShowHallPopup(false)}
              disabled={isLoading}
            >
              ×
            </button>
            <h3>Select Hall</h3>
            {halls.length > 0 ? (
              <div>
                <div style={styles.formGroup}>
                  <label>Available Halls in {newEvent.location}:</label>
                  <select
                    value={selectedHall || ''}
                    onChange={(e) => handleHallSelect(parseInt(e.target.value))}
                    disabled={isLoading}
                  >
                    <option value="">Select a hall</option>
                    {halls.map(hall => (
                      <option key={hall.hallid} value={hall.hallid}>
                        {hall.hallName} - ₹{hall.hallAmount} per day
                      </option>
                    ))}
                  </select>
                </div>
                {selectedHall && (
                  <div style={styles.formGroup}>
                    {halls.find(h => h.hallid === selectedHall) && (
                      <>
                        <p>Selected Hall: {halls.find(h => h.hallid === selectedHall).hallName}</p>
                        <p>Rate: ₹{halls.find(h => h.hallid === selectedHall).hallAmount} per day</p>
                        <p>Total Amount: ₹{halls.find(h => h.hallid === selectedHall).hallAmount * currentEvent.noOfDays}</p>
                      </>
                    )}
                  </div>
                )}

                <div style={{display: "flex", justifyContent: "space-between", marginTop: "20px"}}>
                  <button
                    type="button"
                    style={{...styles.submitButton, backgroundColor: "#6c757d"}}
                    onClick={() => setShowHallPopup(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    style={styles.submitButton}
                    onClick={handleHallSubmit}
                    disabled={!selectedHall || isLoading}
                  >
                    Confirm Selection
                  </button>
                </div>
              </div>
            ) : (
              <p>No halls available in {newEvent.location}</p>
            )}
          </div>
        </div>
      )}
      {showPaymentPopup && (
        <div style={styles.popup} onClick={closePaymentPopup}>
          <div style={styles.popupContent} onClick={e => e.stopPropagation()}>
            <button 
              style={styles.closeButton}
              onClick={closePaymentPopup}
              disabled={paymentProcessing}
            >
              ×
            </button>
            
            {paymentSuccess ? (
              <>
                <div style={{color: "#4CAF50", marginBottom: "20px", textAlign: "center"}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h2 style={{color: "#4CAF50", marginBottom: "20px", textAlign: "center"}}>PAYMENT SUCCESSFUL</h2>
                <p style={{marginBottom: "30px", color: "#666", textAlign: "center"}}>
                  Your payment of ₹{totalAmount.toLocaleString('en-IN')} has been processed successfully.
                </p>
                <button 
                  style={styles.submitButton}
                  onClick={closePaymentPopup}
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <h2 style={{textAlign: "center", marginBottom: "20px"}}>Payment Details</h2>
                <div style={{marginBottom: "25px", textAlign: "center"}}>
                  <h3 style={{fontSize: "24px", color: "#e63946"}}>
                    Total Amount: ₹{totalAmount.toLocaleString('en-IN')}
                  </h3>
                  <p style={{color: "#666", fontSize: "14px"}}>
                    (Including Food, Hall & Service Charge)
                  </p>
                </div>
                <form onSubmit={handlePaymentSubmit} style={styles.form}>
                  <div style={styles.formGroup}>
                    <label>Account Number:</label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={paymentDetails.accountNumber}
                      onChange={handlePaymentInputChange}
                      required
                      disabled={paymentProcessing}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label>4-Digit PIN Code:</label>
                    <input
                      type="password"
                      name="pinCode"
                      value={paymentDetails.pinCode}
                      onChange={handlePaymentInputChange}
                      required
                      maxLength="4"
                      pattern="[0-9]{4}"
                      disabled={paymentProcessing}
                    />
                  </div>
                  {error && <p style={styles.error}>{error}</p>}
                  <button 
                    type="submit" 
                    style={styles.submitButton}
                    disabled={paymentProcessing}
                  >
                    {paymentProcessing ? 'Processing...' : 'Pay Now'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookings;