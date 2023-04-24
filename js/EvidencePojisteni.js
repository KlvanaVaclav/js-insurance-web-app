class EvidencePojisteni {
    constructor(zaznamy) {
        this.zaznamy = zaznamy;
    }

    toString() {
        this.zaznamy.forEach(zaznam => {
            console.log(zaznam.toString());
        });
    }


}