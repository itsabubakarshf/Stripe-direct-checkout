import React, { useState } from "react";
import ReactDOM from "react-dom";
import { loadStripe } from "@stripe/stripe-js";
import OrderComplete from './OrderComplete'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import CheckoutForm from './CheckoutForm'

const stripePromise = loadStripe(
  "STRIPE_PUBLIC_KEY"
);

const options = {
  mode: "payment",
  amount: 1099,
  currency: "usd",
};


const App = () => (
  <Router>
    <Routes>
      <Route path="/order/complete" element={<OrderComplete />} />
      <Route
        path="/"
        element={
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm />
          </Elements>
        }
      />
    </Routes>
  </Router>
);
export default App;
