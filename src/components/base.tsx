import React from "react";

export default function Base({children}) {
  return (
    <div className="container mx-auto mt-4 px-4">
      {children}
    </div>
  )
}
