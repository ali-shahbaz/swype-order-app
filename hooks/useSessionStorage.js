import { useState, useEffect } from "react";

const useSessionStorage = (name) => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    const value = sessionStorage.getItem(name);
    const data = !!value ? JSON.parse(value) : undefined;
    setValue(data)
  }, [name])

  return value
}

export default useSessionStorage