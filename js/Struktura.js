import { Pojistenec } from './Pojistenec.js'

export function vytvorDokument() {
    vytvorNav();
    vytvorFormular();
    vytvorTabulku();
}

function vytvorNav() {
    let nav = document.createElement("nav");
    nav.className = 'navbar';
    const links = ['Evidence pojištění', 'O aplikaci'];
    const hrefs = ['./index.html', './info.html'];
    let ul = document.createElement("ul");
    links.forEach(link => {
        let li = document.createElement("li");
        let a = document.createElement("a");
        a.href = hrefs[links.indexOf(link)];
        a.text = link;
        li.appendChild(a);
        ul.appendChild(li);
    });
    nav.appendChild(ul);
    document.body.appendChild(nav);
}

function vytvorTabulku() {
    let table = document.createElement("table");
    let tbody = table.createTBody();
    table.className = 'tabulka'
    const hlavicka = ['Jméno', 'Příjmení', 'Věk', 'Číslo pojištěnce'];
    tbody.appendChild(vytvorHlavicku(hlavicka));
    document.body.appendChild(table);
    loadLocalStorage();
}

function loadLocalStorage() {
    if (localStorage.zaznamy == undefined) return;
    let zaznamy = JSON.parse(localStorage.zaznamy);
    for (let pojistenec of zaznamy) {
        addPojistenecTable(new Pojistenec(pojistenec['jmeno'], pojistenec['prijmeni'], pojistenec['vek'], pojistenec['cisloPojistence']));
    }
}

function vytvorHlavicku(hlavicka) {
    let thead = document.createElement("tr");
    thead.className = 'hlavicka'
    hlavicka.forEach(col => {
        let th = document.createElement("th");
        th.textContent = col;
        thead.appendChild(th);
    });
    return thead;
}

function vytvorFormular() {
    let form = document.createElement("div");
    let submit = document.createElement("input");
    submit.type = 'submit';
    submit.value = 'Přidat záznam';
    submit.className = 'submit'
    form.className = 'formular';
    const labely = ['Jméno', 'Příjmení', 'Věk', 'Číslo pojištěnce']
    let ul = document.createElement("ul");
    labely.forEach(lbl => {
        ul.appendChild(vytvorListItem(lbl));
    });
    submit.onclick = submitClicked;
    form.appendChild(ul);
    form.appendChild(submit);
    document.body.appendChild(form);
}

function submitClicked() {
    let formLen = document.getElementsByClassName('formular')[0].childNodes[0].childNodes.length;
    let listItems = document.getElementsByClassName('formular')[0].childNodes[0].childNodes;
    let items = [];
    for (let i = 0; i < formLen; i++) {
        items.push(listItems[i].childNodes[0].value);
    }
    addPojistenec(items);
}

function addPojistenec(items) {
    if (items[0] == '' && items[1] == '' && items[2] == '' && items[3] == '') {
        alert('Nelze přidat prázdný záznam.');
        return;
    }
    let pojistenec = new Pojistenec(items[0], items[1], items[2], items[3]);
    if (addPojistenecLocalStorage(pojistenec))
        addPojistenecTable(pojistenec);
}

function addPojistenecLocalStorage(pojistenec) {
    let zaznamy = [];
    let pridatp = true;
    if (localStorage.zaznamy != undefined) {
        zaznamy = JSON.parse(localStorage.zaznamy);
    }
    for (let zaznam of zaznamy) {
        if (pojistenec.shallowEquality(zaznam))
            pridatp = false;
    }
    if (!pridatp) {
        alert('Cannot add duplicity.');
        return false
    }
    zaznamy.push(pojistenec);
    localStorage.zaznamy = JSON.stringify(zaznamy);
    return true;
}

function addPojistenecTable(pojistenec) {
    let thead = document.getElementsByClassName('tabulka')[0].childNodes[0];
    thead.innerHTML += pojistenec.toString();
}

function vytvorListItem(lbl) {
    let li = document.createElement("li");
    let input = document.createElement("input");
    if (lbl == 'Věk')
        input.type = 'number';
    else
        input.type = 'text';
    input.id = 'ID' + lbl;
    input.placeholder = lbl;
    li.appendChild(input);
    return li;
}