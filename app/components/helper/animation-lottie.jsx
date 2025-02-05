"use client";

import Lottie from "lottie-react";
import { useEffect, useRef, useState } from "react";

const AnimationLottie = ({ animationPath, width }) => {
  const [isClient, setIsClient] = useState(false);
  const lottieRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return a placeholder with similar dimensions during SSR
    return <div style={{ width: width || "95%", height: "300px" }} />;
  }

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationPath,
    style: {
      width: width || "95%",
    },
  };

  return <Lottie {...defaultOptions} ref={lottieRef} />;
};

export default AnimationLottie;
