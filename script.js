const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");

let current = "0";
let justEvaluated = false;

function update() {
    display.textContent = current;
}

function clearAll(){
    current = "0";
    justEvaluated = false;
    update();
}

function clearEntry(){
    // remove last number part
    current = "0";
    update();
}

function backspace(){
    if (justEvaluated) {
        current = "0";
        justEvaluated = false;
        update();
        return;
    }

    if (current.length <= 1) current = "0";
    else current = current.slice(0, -1);

    update();
}

function appendValue(val){
    if (current === "0" && val !== ".") current = val;
    else {
        if (justEvaluated && "0123456789.".includes(val)) {
            current = val;
            justEvaluated = false;
            update();
            return;
        }
        current += val;
    }
    justEvaluated = false;
    update();
}

function safeEval(expr){
    if (!/^[0-9+\-*/().\s]+$/.test(expr)) return "Error";
    try{
        const result = Function("return (" + expr + ")")();
        if (!isFinite(result)) return "Error";
        return result;
    }catch{
        return "Error";
    }
}

function equals(){
    let expr = current.replaceAll("×","*").replaceAll("÷","/");
    if (/[\+\-\*\/.]$/.test(expr)) return;
    const result = safeEval(expr);
    current = result === "Error" ? "Error" : String(result);
    justEvaluated = true;
    update();
}

function percent(){
    let n = parseFloat(current);
    if (isNaN(n)) return;
    current = String(n / 100);
    update();
}

function sqrt(){
    let n = parseFloat(current);
    if (isNaN(n) || n < 0) {
        current = "Error";
    } else {
        current = String(Math.sqrt(n));
    }
    justEvaluated = true;
    update();
}

function sign(){
    if (current === "0") return;
    if (current.startsWith("-")) current = current.slice(1);
    else current = "-" + current;
    update();
}

buttons.forEach(btn=>{
    btn.addEventListener("click", ()=>{
        const value = btn.getAttribute("data-value");
        const action = btn.getAttribute("data-action");

        if (value) appendValue(value);

        if (action === "clear") clearAll();
        if (action === "clearEntry") clearEntry();
        if (action === "back") backspace();
        if (action === "equals") equals();
        if (action === "percent") percent();
        if (action === "sqrt") sqrt();
        if (action === "sign") sign();
    });
});

/* Keyboard support */
document.addEventListener("keydown", (e)=>{
    const k = e.key;

    if ("0123456789".includes(k)) appendValue(k);
    if (k === ".") appendValue(".");
    if (k === "+") appendValue("+");
    if (k === "-") appendValue("-");
    if (k === "*") appendValue("*");
    if (k === "/") appendValue("/");
    if (k === "(") appendValue("(");
    if (k === ")") appendValue(")");

    if (k === "Enter") {
        e.preventDefault();
        equals();
    }
    if (k === "Backspace") backspace();
    if (k === "Escape") clearAll();
});

update();
