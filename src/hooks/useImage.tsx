import { useState, useEffect } from "react";
import axios from "../axios";

export const useImage = (url: string) => {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setloading] = useState(true);

  const fetchData = () => {
    axios
      .get(url, {
        responseType: "arraybuffer",
      })
      .then((res) => {
        const image64 = Buffer.from(res.data, "binary").toString("base64");
        setImage("data:image/png;base64," + image64);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setloading(false);
      });
  };

  useEffect(() => {
    console.log("Get Image URL ", url);
    fetchData();
  }, [url]);

  return { image, error, loading };
};
