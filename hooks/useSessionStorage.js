import { useState, useEffect } from "react";

const useSessionStorage = (name) => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    const value = sessionStorage.getItem(name);
    const initData = !!value ? JSON.parse(value) : undefined;
    setValue(initData)
  }, [name])

  return value
}

export default useSessionStorage