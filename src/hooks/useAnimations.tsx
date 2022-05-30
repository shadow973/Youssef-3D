import { useState, useEffect } from "react";
import axios from "../axios";

export const useAnimations = (animations: any[]) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setloading] = useState(true);

  const fetchData = () => {
    const promises = [];
    console.log("in Use Animation Animations", animations);
    for (let a of animations) {
      promises.push(axios.get("/animations/" + a.animationid));
    }
    Promise.all(promises)
      .then((res) => {
        const formattedResponse = res.map((data) => ({
          animationid: data.data.data.Animation.animationid,
          animation: JSON.parse(data.data.data.Animation.animationfile),
        }));
        setResponse(formattedResponse);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setloading(false);
      });
  };

  useEffect(() => {
    if (animations.length) fetchData();
    else {
      setloading(false);
    }
  }, [animations]);

  return { response, error, loading };
};
