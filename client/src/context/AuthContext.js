import Cookies from 'universal-cookie'
import JWT from 'jwt-decode'
import { createContext } from "react";

const cookies = new Cookies()

export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const userToken = cookies.get('diary-user')
  const decodedUser = userToken ? JWT(userToken) : null
  const isAuthenticated = userToken !== undefined
  
  return (
    <AuthContext.Provider
      value={{
        user: decodedUser,
        isAuthenticated: isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

