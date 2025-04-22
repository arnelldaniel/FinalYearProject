import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase'; // Assuming you've already set up Firebase elsewhere

export default function Shopping() {
  const [shoppingList, setShoppingList] = useState([]);

  // Fetch shopping list from Firebase
  const fetchShoppingList = async () => {
    try {
      const currentUserUsername = localStorage.getItem('username'); // Assuming this is how you handle the logged-in user
      if (!currentUserUsername) {
        alert('Please log in first');
        return;
      }

      const shoppingListRef = collection(db, 'users', currentUserUsername, 'shoppingList');
      const querySnapshot = await getDocs(shoppingListRef);
      const list = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setShoppingList(list);
    } catch (error) {
      console.error('Error getting shopping list:', error);
      alert('Error loading shopping list. Please try again later.');
    }
  };

  // Delete item from shopping list
  const deleteItem = async (id) => {
    try {
      const currentUserUsername = localStorage.getItem('username');
      const itemRef = doc(db, 'users', currentUserUsername, 'shoppingList', id);
      await deleteDoc(itemRef);
      // Refresh the list after deletion
      fetchShoppingList();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  // Load shopping list when the component mounts
  useEffect(() => {
    fetchShoppingList();
  }, []);

  return (
    <div className="container">
      <h2>Shopping List</h2>
      <ul id="shoppingList">
        {shoppingList.length === 0 ? (
          <li>No items found in your shopping list.</li>
        ) : (
          shoppingList.map(item => (
            <li key={item.id}>
              {item.name} - Quantity: {item.quantity}
              <button onClick={() => deleteItem(item.id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
