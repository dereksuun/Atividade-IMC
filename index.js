function Pessoa(altura, peso) {
    if (!altura || !peso) {
        throw new Error("Altura e peso são obrigatórios");
    }
    this.altura = altura;
    this.peso = peso;
}

function Nutricionista(altura, peso) {
    Pessoa.call(this, altura, peso);

    this.imc = function () {
        return this.peso / (this.altura * this.altura);
    };

    this.classificaIMC = function () {
        var imc = this.imc();
        if (imc < 18.5) {
            return "Abaixo do peso";
        }
        if (imc >= 18.5 && imc < 24.9) {
            return "Peso normal";
        }
        if (imc >= 25 && imc < 29.9) {
            return "Sobrepeso";
        }
        return "Obesidade";
    };
}
Nutricionista.prototype = Object.create(Pessoa.prototype);
Nutricionista.prototype.constructor = Nutricionista;

function getCategoriasIMC() {
    return [
        { rotulo: "Abaixo do peso", intervalo: "< 18,5" },
        { rotulo: "Peso normal",    intervalo: "18,5 a 24,9" },
        { rotulo: "Sobrepeso",      intervalo: "25,0 a 29,9" },
        { rotulo: "Obesidade",      intervalo: "≥ 30,0" }
    ];
}

function renderTabelaIMC() {
    var tabela = document.getElementById("tabela-imc");
    if (!tabela) return;

    var tbody = tabela.getElementsByTagName("tbody")[0];
    if (!tbody) {
        tbody = document.createElement("tbody");
        tabela.appendChild(tbody);
    }
    if (tbody.getAttribute("data-built") === "1") return;

    var categorias = getCategoriasIMC();
    for (var i = 0; i < categorias.length; i++) {
        var tr = document.createElement("tr");
        tr.setAttribute("data-rotulo", categorias[i].rotulo);

        var tdRotulo = document.createElement("td");
        tdRotulo.appendChild(document.createTextNode(categorias[i].rotulo));

        var tdIntervalo = document.createElement("td");
        tdIntervalo.appendChild(document.createTextNode(categorias[i].intervalo));

        tr.appendChild(tdRotulo);
        tr.appendChild(tdIntervalo);
        tbody.appendChild(tr);
    }

    tbody.setAttribute("data-built", "1");
}

function destacarLinhaPorRotulo(rotulo) {
    var tabela = document.getElementById("tabela-imc");
    if (!tabela) return;

    var linhas = tabela.getElementsByTagName("tr");
    for (var i = 0; i < linhas.length; i++) {
        var r = linhas[i].getAttribute && linhas[i].getAttribute("data-rotulo");
        if (r === rotulo) {
            if ((" " + linhas[i].className + " ").indexOf(" ativo ") === -1) {
                linhas[i].className = (linhas[i].className ? linhas[i].className + " " : "") + "ativo";
            }
        } else {
            linhas[i].className = (linhas[i].className || "")
                .replace(/\bativo\b/g, "")
                .replace(/\s{2,}/g, " ")
                .replace(/^\s+|\s+$/g, "");
        }
    }
}

function renderizaResultadoIMC(nutricionista) {
    var texto = nutricionista.imc().toFixed(2) + " - " + nutricionista.classificaIMC();
    document.getElementById("imc").innerText = texto;
    destacarLinhaPorRotulo(nutricionista.classificaIMC());
}

function toNumber(v) {
    return parseFloat(String(v || "").replace(",", "."));
}

function actionCalcularIMCBuilder() {
    var alturaEl = document.getElementById("altura");
    var pesoEl = document.getElementById("peso");

    return function actionCalcularIMC(evt) {
        if (evt && evt.preventDefault) evt.preventDefault();

        var altura = toNumber(alturaEl.value);
        var peso = toNumber(pesoEl.value);

        try {
            var nutricionista = new Nutricionista(altura, peso);
            renderizaResultadoIMC(nutricionista);
        } catch (e) {
            alert(e.message || "Dados inválidos. Informe altura e peso corretamente.");
        }
    };
}

window.onload = function () {
    var btn = document.getElementById("calcular");
    if (btn && btn.addEventListener) {
        btn.addEventListener("click", actionCalcularIMCBuilder());
    }
    renderTabelaIMC();
};
