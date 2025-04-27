import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import jsPDF from 'jspdf'; // 👈 Import jsPDF

export default function Shopping() {
  const [shoppingList, setShoppingList] = useState([]);

  const fetchShoppingList = async () => {
    try {
      const currentUserUsername = localStorage.getItem('username');
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

  const deleteItem = async (id) => {
    try {
      const currentUserUsername = localStorage.getItem('username');
      const itemRef = doc(db, 'users', currentUserUsername, 'shoppingList', id);
      await deleteDoc(itemRef);
      fetchShoppingList();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Shopping List', 20, 20);

    let y = 30;
    shoppingList.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name} - Quantity: ${item.quantity}`, 20, y);
      y += 10;
    });

    doc.save('shopping-list.pdf');
  };

  useEffect(() => {
    fetchShoppingList();
  }, []);

  return (
    <div className="container">
      <h2>Shopping List</h2>
      <button onClick={downloadPDF}>Download as PDF</button> {/* 👈 New button */}
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
