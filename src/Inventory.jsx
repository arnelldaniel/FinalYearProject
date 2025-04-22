import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase'; // Import Firebase config
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

function Inventory() {
  const [ingredientName, setIngredientName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [category, setCategory] = useState('');
  const [inventory, setInventory] = useState([]);
  const [events, setEvents] = useState([]);
  
  // Get the current user's username from localStorage
  const currentUserUsername = localStorage.getItem('username');
  
  // Categories for the inventory
  const categories = ['Fruits', 'Vegetables', 'Dairy', 'Meat', 'Grains', 'Others'];

  // Function to check expiration status
  function getExpirationColor(expirationDate) {
    const today = new Date();
    const expiration = new Date(expirationDate);
    const diffTime = expiration - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Difference in days
  
    if (diffDays <= 0) {
      return '#FF0000'; // Red for expired
    } else if (diffDays <= 7) {
      return '#FFA500'; // Orange for expiring soon
    }
    return '#008000'; // Green for good
  }

  // Add item to Firestore
  const handleAddItem = async (e) => {
    e.preventDefault();

    if (ingredientName && expirationDate && category) {
      try {
        const userInventoryRef = collection(db, 'users', currentUserUsername, 'inventory');
        await addDoc(userInventoryRef, {
          name: ingredientName,
          expiration: expirationDate,
          category: category
        });

        setIngredientName(''); // Clear input fields
        setExpirationDate('');
        setCategory(''); // Clear category
        loadInventory(); // Reload inventory
      } catch (error) {
        console.error('Error adding document: ', error);
      }
    }
  };

  // Load inventory from Firestore
  const loadInventory = async () => {
    const userInventoryRef = collection(db, 'users', currentUserUsername, 'inventory');
    try {
      const querySnapshot = await getDocs(userInventoryRef);
      const inventoryList = [];
      const calendarEvents = [];
      querySnapshot.forEach((docSnapshot) => {
        const item = docSnapshot.data();
        inventoryList.push({ ...item, id: docSnapshot.id });
        
        // Add event for calendar
        calendarEvents.push({
          title: item.name,
          date: item.expiration,
          backgroundColor: getExpirationColor(item.expiration) // Expiration color
        });
      });

      setInventory(inventoryList);
      setEvents(calendarEvents); // Update calendar events
    } catch (error) {
      console.error('Error getting documents: ', error);
    }
  };

  // Delete an item from the inventory
  const handleDeleteItem = async (itemId) => {
    try {
      await deleteDoc(doc(db, 'users', currentUserUsername, 'inventory', itemId));
      loadInventory(); // Reload inventory
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  // Run loadInventory once when the component mounts
  useEffect(() => {
    loadInventory();
  }, []);

  return (
    <div className="container">
      <h2>Inventory Management</h2>
      
      <form onSubmit={handleAddItem}>
        <label htmlFor="ingredientName">Ingredient:</label>
        <input
          type="text"
          id="ingredientName"
          name="ingredientName"
          placeholder="Enter ingredient name"
          value={ingredientName}
          onChange={(e) => setIngredientName(e.target.value)}
          required
        />
        
        <label htmlFor="expirationDate">Expiration Date:</label>
        <input
          type="date"
          id="expirationDate"
          name="expirationDate"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          required
        />
        
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <button type="submit">Add to Inventory</button>
      </form>

      <h3>Your Inventory</h3>
      <ul>
        {inventory.map((item, index) => {
          const expirationStatus = getExpirationColor(item.expiration);
          return (
            <li key={index}>
              {item.name} - Expiration: {item.expiration} 
              <span style={{ color: expirationStatus === '#FF0000' ? 'red' : expirationStatus === '#FFA500' ? 'orange' : 'green' }}>
                {' '} - {expirationStatus === '#FF0000' ? 'Expired' : expirationStatus === '#FFA500' ? 'Expiring soon' : 'Good'}
              </span>
              <br />
              <span><strong>Category:</strong> {item.category}</span>
              <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
            </li>
          );
        })}
      </ul>

      <h3>Calendar</h3>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
      />
    </div>
  );
}

export default Inventory;
