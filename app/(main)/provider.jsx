"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useUser as useUserQuery } from "@/app/hooks/useUser";
import { useAddCredits } from "@/app/hooks/useCredits";

const UserContext = createContext(null);

export function UserProvider({ userId, children }) {
  const userQuery = useUserQuery(userId);
  const addCreditsMutation = useAddCredits();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (userQuery) setUser(userQuery);
  }, [userQuery]);

  const tryFree = async () => {
    const credits = await addCreditsMutation({ userId });
    setUser((prev) => ({ ...prev, credits }));
    return credits;
  };

  return (
    <UserContext.Provider value={{ user, tryFree }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}



