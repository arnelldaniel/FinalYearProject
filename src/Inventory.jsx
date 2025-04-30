import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Inventory() {
  const [ingredientName, setIngredientName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('g');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [inventory, setInventory] = useState([]);
  const [events, setEvents] = useState([]);

  const currentUserUsername = localStorage.getItem('username');
  const categories = ['Fruits', 'Vegetables', 'Dairy', 'Meat', 'Grains', 'Others'];
  const units = ['g', 'kg', 'ml', 'l', 'pcs'];

  function getExpirationColor(expirationDate) {
    const today = new Date();
    const expiration = new Date(expirationDate);
    const diffTime = expiration - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return '#FF0000';
    if (diffDays <= 7) return '#FFA500';
    return '#008000';
  }

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (ingredientName && expirationDate && category && quantity && unit) {
      try {
        const userInventoryRef = collection(db, 'users', currentUserUsername, 'inventory');
        await addDoc(userInventoryRef, {
          name: ingredientName,
          expiration: expirationDate,
          category: category,
          quantity: quantity,
          unit: unit,
        });

        setIngredientName('');
        setExpirationDate('');
        setCategory('');
        setQuantity('');
        setUnit('g');
        loadInventory();
      } catch (error) {
        console.error('Error adding document: ', error);
      }
    }
  };

  const loadInventory = async () => {
    const userInventoryRef = collection(db, 'users', currentUserUsername, 'inventory');
    try {
      const querySnapshot = await getDocs(userInventoryRef);
      const inventoryList = [];
      const calendarEvents = [];
      querySnapshot.forEach((docSnapshot) => {
        const item = docSnapshot.data();
        inventoryList.push({ ...item, id: docSnapshot.id });
        calendarEvents.push({
          title: item.name,
          date: item.expiration,
          backgroundColor: getExpirationColor(item.expiration)
        });
      });

      setInventory(inventoryList);
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error getting documents: ', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteDoc(doc(db, 'users', currentUserUsername, 'inventory', itemId));
      loadInventory();
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    const matchesSearchQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearchQuery;
  });

  useEffect(() => {
    loadInventory();
  }, []);

  const expirationStatusCounts = filteredInventory.reduce(
    (acc, item) => {
      const status = getExpirationColor(item.expiration);
      if (status === '#FF0000') acc.expired += 1;
      if (status === '#FFA500') acc.expiringSoon += 1;
      if (status === '#008000') acc.good += 1;
      return acc;
    },
    { expired: 0, expiringSoon: 0, good: 0 }
  );

  const expirationChartData = {
    labels: ['Expired', 'Expiring Soon', 'Good'],
    datasets: [
      {
        label: 'Expiration Status',
        data: [expirationStatusCounts.expired, expirationStatusCounts.expiringSoon, expirationStatusCounts.good],
        backgroundColor: ['#FF0000', '#FFA500', '#008000'],
      },
    ],
  };

  return (
    <div className="container">
      <h2>Inventory Management</h2>
      
      <form onSubmit={handleAddItem}>
        <label htmlFor="ingredientName">Ingredient:</label>
        <input
          type="text"
          id="ingredientName"
          value={ingredientName}
          onChange={(e) => setIngredientName(e.target.value)}
          required
        />
        
        <label htmlFor="expirationDate">Expiration Date:</label>
        <input
          type="date"
          id="expirationDate"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          required
        />
        
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <label htmlFor="unit">Unit:</label>
        <select
          id="unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          required
        >
          {units.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>

        <button type="submit">Add to Inventory</button>
      </form>

      <h3>Your Inventory</h3>

      <label htmlFor="categoryFilter">Filter by Category:</label>
      <select
        id="categoryFilter"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Search by ingredient name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <ul>
        {filteredInventory.map((item, index) => {
          const expirationStatus = getExpirationColor(item.expiration);
          return (
            <li key={index}>
              {item.name} - Expiration: {item.expiration}
              <span style={{ color: expirationStatus }}>
                {' '} - {expirationStatus === '#FF0000' ? 'Expired' : expirationStatus === '#FFA500' ? 'Expiring soon' : 'Good'}
              </span>
              <br />
              <strong>Category:</strong> {item.category}<br />
              <strong>Quantity:</strong> {item.quantity} {item.unit}
              <br />
              <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
            </li>
          );
        })}
      </ul>

      <h3>Expiration Status Breakdown</h3>
      <Bar data={expirationChartData} options={{
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Expiration Status of Ingredients'
          },
          legend: {
            position: 'top',
          }
        }
      }} />

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
  