"use client";

import { useEffect } from "react";

export default function ScrollToFeatured() {
  useEffect(() => {
    const section = document.getElementById("featured");
    section?.scrollIntoView({ behavior: "auto" });
  }, []);

  return null;
}