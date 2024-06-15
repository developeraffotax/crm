import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
  } from "react-router-dom";
import Login from "../Auth/Login/Login";

export default function AuthRoutes() {
  return (
    <>
    <Router>
        <Routes>
            <Route path="/" element = {<Login />}></Route>
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </Router>
    </>
  );
}







