"use client";

import React from "react";
import { useParams } from "react-router-dom";

export default function Page() {
  const { slug } = useParams();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">News Detail</h1>
      <p>Displaying news article: <strong>{slug}</strong></p>
    </div>
  );
}
