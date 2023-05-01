import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import AddRes from "./pages/AddRes"
import ViewRes from "./pages/ViewRes"
import Search from "./pages/Search"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addres" element={<AddRes />} />
        <Route path="/viewres" element={<ViewRes />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
