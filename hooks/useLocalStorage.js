import { useState, useEffect } from "react";

const useLocalStorage = (name) => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    const value = localStorage.getItem(name);
    const data = !!value ? JSON.parse(value) : undefined;
    setValue(data)
  }, [name])

  return value
}

export default useLocalStorage