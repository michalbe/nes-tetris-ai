import {ROM_URL} from "./config.js";
import {NES} from "./nes-driver.js";

let url = ROM_URL;

var req = new XMLHttpRequest();
req.open("GET", url);
req.overrideMimeType("text/plain; charset=x-user-defined");
req.onerror = () => console.log(`Error loading ${url}: ${req.statusText}`);

req.onload = () => {
    if (req.status === 200) {
        // @ts-ignore
        window.nes = new NES(req.responseText);
        // @ts-ignore
        nes.start();
    } else if (req.status === 0) {
        // Aborted, so ignore error
    } else {
        console.log(`Error loading ${url}: ${req.statusText}`);
    }
};

req.send();
