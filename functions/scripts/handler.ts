// dotenv
import dotenv from "dotenv";
import { fetchSodexo } from "../src/parser";
dotenv.config();

const main = async () => {
    const r = await fetchSodexo();
    console.log(r);
};

main();
