// dotenv
import dotenv from "dotenv";
import { fetchKockOchRock } from "../src/parser";
dotenv.config();

const main = async () => {
    const r = await fetchKockOchRock();
    console.log(r);
};

main();
