// Import React and MLBShowcase component
import React from "react";
import ReactDOM from "react-dom/client";
import SharePage from "./SharePage";
import "./SharePage";

// Main App component
function App() {
  return (
    <div className="app">
      <SharePage />
    </div>
  );
}

// Export App as the default export
export default App;

// Render the App component to the root element
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
