import { Pojistenec } from './Pojistenec.js'
const labelyPojistencu = ['Jméno', 'Příjmení', 'Věk', 'Telefonní číslo', 'Akce'];
const labelyPojisteni = ['Číslo pojištění', 'Pojištěný', 'Platné do'];

export function createDocument(section) {
    let sectionId = section.id;
    document.body.prepend(createNav());
    if (sectionId == 'index') {
        section.appendChild(createTable('pojistenec'));
    }
    else if (sectionId == 'pojistenci') {
        section.appendChild(createForm());
    }
    else if (sectionId == 'pojisteni') {
        section.appendChild(createTable('pojisteni'))
    }
}

function createNav() {
    let nav = document.createElement('nav');
    nav.className = 'navbar';
    const links = ['Evidence pojištění', 'Pojištěnci', 'Pojištění',];
    const hrefs = ['./index.html', './pojistenci.html', './pojisteni.html'];
    let ul = document.createElement('ul');
    for (let link of links) {
        let li = document.createElement('li');
        let a = document.createElement('a');
        a.href = hrefs[links.indexOf(link)];
        a.text = link;
        li.appendChild(a);
        ul.appendChild(li);
    }
    nav.appendChild(ul);
    return nav;
}

function createTable(type) {
    let labely = [];
    if (type == 'pojistenec')
        labely = labelyPojistencu;
    else if (type == 'pojisteni')
        labely = labelyPojisteni;
    let tableName = document.createElement('h1');
    let table = document.createElement('table');
    let tbody = table.createTBody();

    tableName.textContent = 'Evidence'
    table.className = 'tabulka'

    tbody.prepend(tableName);
    tbody.appendChild(createHeader(labely));
    loadLocalStorage(type);
    return table;
}

function createHeader(header) {
    let thead = document.createElement('tr');
    thead.className = 'header'
    header.forEach(col => {
        let th = document.createElement('th');
        th.textContent = col;
        thead.appendChild(th);
    });
    return thead;
}

function createForm() {
    let img = document.createElement('img')
    let form = document.createElement('div');
    let formNameSpan = document.createElement('span');
    let formName = document.createElement('h1');
    let submit = document.createElement('input');
    let ul = document.createElement('ul');

    img.src = "./images/avatar.png";

    formName.textContent = 'Přidat záznam';

    form.className = 'formular';

    submit.type = 'submit';
    submit.value = 'Přidat záznam';
    submit.className = 'submit';
    submit.onclick = submitClicked;

    for (let lbl of labelyPojistencu) {
        if (lbl == 'Akce') continue;
        ul.appendChild(vytvorListItem(lbl));
    }

    formNameSpan.appendChild(formName);
    form.appendChild(img);
    //form.appendChild(formNameSpan);
    form.appendChild(ul);
    form.appendChild(submit);
    return form;
}

function vytvorListItem(lbl) {
    let li = document.createElement('li');
    let input = document.createElement('input');

    if (lbl == 'Věk')
        input.type = 'number';
    else if (lbl == 'Telefonní číslo') {
        input.type = 'tel';
        input.pattern = '[0-9]{3}-[0-9]{3}-[0-9]{3}';
    }
    else
        input.type = 'text';
    input.id = 'ID' + lbl;
    input.placeholder = lbl;
    li.appendChild(input);
    return li;
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
        addToTable(pojistenec);
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
        alert('Nelze přidat duplicitu.');
        return false
    }
    zaznamy.push(pojistenec);
    localStorage.zaznamy = JSON.stringify(zaznamy);
    return true;
}

function addToTable(pojistenec) {
    let thead = document.getElementsByClassName('tabulka')[0].childNodes[0];
    thead.innerHTML += pojistenec.toString();
}

function loadLocalStorage(type) {
    if (type == 'pojistenec') {
        if (localStorage.zaznamy == undefined) return;
        let zaznamy = JSON.parse(localStorage.zaznamy);
        for (let pojistenec of zaznamy) {
            addToTable(new Pojistenec(pojistenec[labelyPojistencu[0]], pojistenec[labelyPojistencu[1]], pojistenec[labelyPojistencu[2]], pojistenec[labelyPojistencu[3]]));
        }
    }
    else {
        if (localStorage.pojisteni == undefined) return;
        let pojisteni = JSON.parse(localStorage.pojisteni);
        for (let p of pojisteni) {
            addToTable(new Pojistenec(p[labelyPojisteni[0]], p[labelyPojisteni[1]], p[labelyPojisteni[2]]));
        }
    }

}