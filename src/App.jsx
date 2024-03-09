import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import * as GridPattern from './games/grid_pattern/Game';

function HomePage() {
  return (
    <div className="HomePage">
      <h1>Codebreaker</h1>
      <p>This is a cyberpunk world, we only live in it.</p>
      <p>Practice here for the grids you'll face.</p>
      <ul>
        <li><Link to="/grid-pattern">Grid Pattern</Link></li>
      </ul>
    </div>
  )
}

function App() {
  return (
    <>
      <Router>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/grid-pattern" element={<GridPattern.Game />} />
          </Routes>
        </main>
      </Router>
    </>
  )
}

export default App
