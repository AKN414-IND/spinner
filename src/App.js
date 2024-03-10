import React, { useState, useCallback, useMemo, useReducer } from 'react';
import { db } from './firebaseConfig';
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import './App.css';
import Spinner from './Spinner'; 

import { useSpinTheWheel } from './useSpinTheWheel';

const coupons = [
  { id: 1, item: "10% Off", image: "10off.png", probability: 50 },
  { id: 2, item: "20% Off", image: "20off.png", probability: 30 },
  { id: 3, item: "30% Off", image: "30off.png", probability: 15 },
  { id: 4, item: "50% Off", image: "50off.png", probability: 5 },
];

const initialState = { email: '', name: '', phone: '', isSpinning: false, selectedCoupon: null, error: '' };

function reducer(state, action) {
  switch (action.type) {
    case 'FORM_UPDATE':
      return { ...state, [action.field]: action.value };
    case 'SPIN_START':
      return { ...state, isSpinning: true };
    case 'SPIN_STOP':
      return { ...state, isSpinning: false, selectedCoupon: action.coupon };
    case 'SET_ERROR':
      if (state.error !== action.error) { // Prevent unnecessary state updates
        return { ...state, error: action.error };
      }
      return state;
    default:
      throw new Error();
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { email, name, phone, isSpinning, selectedCoupon, error } = state;

  const handleChange = useCallback((e) => {
    dispatch({ type: 'FORM_UPDATE', field: e.target.name, value: e.target.value });
  }, []);

  const spinTheWheel = useSpinTheWheel(coupons, dispatch);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_ERROR', error: '' });

    const participantsRef = collection(db, "participants");
    const q = query(participantsRef, where("email", "==", email), where("phone", "==", phone));

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        dispatch({ type: 'SET_ERROR', error: "You have already participated." });
        return;
      }

      await addDoc(participantsRef, { email, name, phone, hasSpun: true });
      spinTheWheel();
    } catch (err) {
      dispatch({ type: 'SET_ERROR', error: "An error occurred. Please try again." });
    }
  };

  const form = useMemo(() => (
    <form onSubmit={handleSubmit} className="auth-form">
      <input type="email" name="email" value={email} onChange={handleChange} placeholder="Email" required />
      <input type="tel" name="phone" value={phone} onChange={handleChange} placeholder="Phone Number" required />
      <input type="text" name="name" value={name} onChange={handleChange} placeholder="Name" required />
      <button type="submit" disabled={isSpinning}>Participate Now</button>
    </form>
  ), [email, phone, name, isSpinning, handleSubmit, handleChange]);

  return (
    <div className="app">
      <header className="header">
        <h1>Welcome to Our Spin-to-Win Event!</h1>
        <p>Try your luck and win discount coupons for our clothing store!</p>
        {error && <p className="error">{error}</p>}
      </header>
      {form}
      {isSpinning && <Spinner />}
      {selectedCoupon && (
        <div className="coupon-result">
          <img src={selectedCoupon.image} alt={selectedCoupon.item} />
          <p>Congratulations! You've won {selectedCoupon.item}!</p>
        </div>
      )}
    </div>
  );
}

export default App;
