import { Routes } from "react-router-dom";
import PublicRoutes from "./PublicRoutes"

const AppRoutes = ()=>{
 return(
    <Routes>
        {PublicRoutes}
    </Routes>
 )
}

export default AppRoutes;