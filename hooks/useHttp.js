"use client";
import { useState, useCallback, useEffect } from "react";

async function sendHttpRequest(url, config) {
  const response = await fetch(url, config);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export default function useHttp(url, config, initialData) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [data, setData] = useState(initialData);

  const sendRequest = useCallback(
    async function sendRequest(data) {
      setIsLoading(true);
      try {
        const resData = await sendHttpRequest(url, {
          ...config,
          body: JSON.stringify(data),
        });

        setData(resData);
      } catch (error) {
        console.log(error);
        setError("Something went wrong");
      }
      setIsLoading(false);
    },
    [url, config]
  );

  // Send the request when the component mounts.
  useEffect(() => {
    if ((config && (config.method === "GET" || !config.method)) || !config) {
      sendRequest();
    }
  }, [sendRequest, config]);

  return {
    isLoading,
    error,
    data,
    sendRequest, // send the request upon user's interaction (e.g. form submission)
  };
}
