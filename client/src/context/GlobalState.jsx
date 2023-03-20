import axios from "axios";
import React, { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

// { id: 1, text: "Flower", amount: -20 },
// { id: 2, text: "Salary", amount: 300 },
// { id: 3, text: "Book", amount: -10 },
// { id: 4, text: "Camera", amount: 150 },

//initial state
const initialState = {
  transactions: [],
  error: null,
  loading: true,
};

// create context
export const GlobalContext = createContext(initialState);

//Provider component
export const GlobalProvider = ({ children }) => { 
  const [state, dispatch] = useReducer(AppReducer, initialState);

  //Action

  const getTransactions = async () => {
    try {
      const res = await axios.get("/api/v1/transactions");
      dispatch({ type: "GET_TRANSACTIONS", payload: res.data.data });
    } catch (err) {
      dispatch({ type: "TRANSACTION_ERROR", payload: err.response.data.error });
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`/api/v1/transactions/${id}`);
      dispatch({ type: "DELETE", payload: id });
    } catch (err) {
      dispatch({ type: "TRANSACTION_ERROR", payload: err.response.data.error });
    }
  };

  const addTransaction = async(transaction) => {
    const config = {
      headers : {
        'Content-Type' : 'application/json'
      }
    }

   try {
    const res = await axios.post('/api/v1/transactions',transaction,config)
     dispatch({ type: "ADD", payload: res.data.data });
   } catch (err) {
    dispatch({ type: "TRANSACTION_ERROR", payload: err.response.data.error });
   }
  };

  return (
    <GlobalContext.Provider
      value={{
        transactions: state.transactions,
        error: state.error,
        loading: state.loading,
        getTransactions,
        deleteTransaction,
        addTransaction,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
