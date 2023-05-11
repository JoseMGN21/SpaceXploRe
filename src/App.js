import logo from './logo.svg';
import './App.css';

import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

import Intro from "./Scenes/Intro"


function App() {
  return (
    <Router>
      <Routes>
          <Route exact path='/' element={<Intro/>}></Route>
      </Routes>
    </Router>
)}

export default App;
