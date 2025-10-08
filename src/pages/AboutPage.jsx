import React from "react";

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-3xl font-bold mb-3 text-gray-800 uppercase">Image</h2>
          <div className="border-t-2 border-primary mb-3 w-full"></div>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-3 text-gray-800 uppercase">Description</h2>
          <div className="border-t-2 border-primary mb-3 w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
