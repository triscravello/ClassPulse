// App.js
import AppRoutes from "./AppRoutes";
import './App.css';

function App() {
  return (
    <div className="app-container">
      {/* Don't render sidebar/nav/footer here */}
      <div className="content">
        <main>
          <AppRoutes />
        </main>
      </div>
    </div>
  );
}

export default App;
