import { countries } from "@/constants/flags";

//funcion para buscar una bandera
const getfindFlag = (code)=>{
    const country = countries.find(c=> c.code == code);

    return country ? country : code;
}

export default getfindFlag;