import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import MealPlanner from "./pages/MealPlanner";
import Recipes from "./pages/Recipes";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          {/* Page routes injected by build */}
                  <Route path="/" element={<MealPlanner />} />
          <Route path="/recipes" element={<Recipes />} />
</Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;