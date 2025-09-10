import React from "react";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-legacy-beige">
      <Header />
      {children}
    </div>
  );
};
export default Layout;
