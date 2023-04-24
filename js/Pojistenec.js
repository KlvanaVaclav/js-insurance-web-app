export class Pojistenec {
    constructor(j, p, v, tel) {
        this.jmeno = j;
        this.prijmeni = p;
        this.vek = v;
        this.telefonniCislo = tel;
    }

    toString() {
        return `<tr><td>${this.jmeno}</td><td>${this.prijmeni}</td><td>${this.vek}</td><td>${this.telefonniCislo}</td></tr>`
    }

    shallowEquality(zaznam) {
        let keys1 = Object.keys(this);
        let keys2 = Object.keys(zaznam);

        if (keys1.length != keys2.length)
            return false;

        for (let key of keys1) {
            if (this[key] !== zaznam[key])
                return false;
        }
        return true;
    }
}