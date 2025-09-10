import React from "react";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-legacy-beige max-w-[1800px] mx-auto">
      <Header />
      {children}
    </div>
  );
};
export default Layout;
