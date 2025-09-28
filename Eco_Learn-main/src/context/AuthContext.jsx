import React, { createContext, useContext, useState, useEffect } from "react";
import { mockUsers } from "../data/mockData.js";
import { supabase, isSupabaseEnabled } from "../lib/supabase.js";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeFromStorage = () => {
      const storedUser = localStorage.getItem("ecolearn_user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          localStorage.removeItem("ecolearn_user");
        }
      }
    };
    initializeFromStorage();
  }, []);

  const login = async (email, password, role) => {
    try {
      if (isSupabaseEnabled && supabase) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .maybeSingle();
        if (error) {
          console.error("Login error (supabase):", error);
        } else if (data) {
          const authedUser = data;
          setUser(authedUser);
          setIsAuthenticated(true);
          localStorage.setItem("ecolearn_user", JSON.stringify(authedUser));
          return true;
        }
      }

      let foundUser = mockUsers.find((u) => u.email === email);
      if (role && foundUser) {
        foundUser = foundUser.role === role ? foundUser : undefined;
      }
      if (foundUser) {
        setUser(foundUser);
        setIsAuthenticated(true);
        localStorage.setItem("ecolearn_user", JSON.stringify(foundUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const signup = async (userData) => {
    try {
      if (isSupabaseEnabled && supabase) {
        const { data, error } = await supabase
          .from("users")
          .insert({
            name: userData.name,
            email: userData.email,
            role: userData.role || "student",
            schoolId: userData.schoolId || "school1",
            gradeLevel: userData.gradeLevel || "secondary",
            points: 0,
            reputationScore: 50,
            streakCount: 0,
            level: 1,
          })
          .select()
          .single();
        if (!error && data) {
          const created = data;
          setUser(created);
          setIsAuthenticated(true);
          localStorage.setItem("ecolearn_user", JSON.stringify(created));
          return true;
        }
      }

      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role || "student",
        schoolId: userData.schoolId || "school1",
        gradeLevel: userData.gradeLevel || "secondary",
        points: 0,
        reputationScore: 50,
        lastActiveDate: new Date().toISOString(),
        streakCount: 0,
        level: 1,
        createdAt: new Date().toISOString(),
        hasCompletedOnboarding: false,
      };
      mockUsers.push(newUser);
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem("ecolearn_user", JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  const updateUserPreferences = (preferences) => {
    if (user) {
      const updatedUser = {
        ...user,
        preferences,
        hasCompletedOnboarding: true,
      };
      setUser(updatedUser);
      localStorage.setItem("ecolearn_user", JSON.stringify(updatedUser));
      const userIndex = mockUsers.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser;
      }
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("ecolearn_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated,
        updateUserPreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
