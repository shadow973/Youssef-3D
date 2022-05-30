import { useState, useEffect } from "react";
import axios from "../axios";

export const useAxios = (url, method, body = null, headers = null) => {
  console.log("URL ", url, " METHOD ", method);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setloading] = useState(true);

  const fetchData = () => {
    axios({ url, method, data: body })
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setloading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [method, url, body, headers]);

  return { response, error, loading };
};
