import { useEffect, useState } from "react";

// where data is stored
export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  /* T is a generic type
    initial value is either type T (generic type), or a function that will return type T */
  const [value, setValue] = useState<T>(() => {
    const jsonValue = localStorage.getItem(key);
    if (jsonValue == null) {
      //storing with the json format
      if (typeof initialValue === "function") {
        return (initialValue as () => T)(); // casting to the type T so typescript always knows it will always return type T
      } else {
        return initialValue; // case if its a function
      }
    } else {
      return JSON.parse(jsonValue); // if theres nothing already there, take the data as the initial value passed in
    }
  }); // checking to see if the data is already in local storage

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);
  // save data in local storage any time value or key changes

  return [value, setValue] as [T, typeof setValue];
  // array retruned will always have value of type T and type of setValue
}
