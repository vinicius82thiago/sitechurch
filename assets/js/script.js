"use strict";

/*
 * ============================================================
 * IBRG — SCRIPT PRINCIPAL
 * Compatível com o HTML existente
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================
       HELPERS
    ======================================================== */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        Array.from(parent.querySelectorAll(selector));

    const safeText = (value) =>
        String(value ?? "").trim();

    const escapeHTML = (value) => {
        const div = document.createElement("div");
        div.textContent = value;
        return div.innerHTML;
    };


    /* ========================================================
       ANO DO FOOTER
    ======================================================== */

    const yearElement = $("#year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    /* ========================================================
       BARRA DE BOAS-VINDAS
    ======================================================== */

    const welcomeBar = $("#welcomeBar");

    if (welcomeBar) {
        document.body.classList.add("welcome-active");

        window.setTimeout(() => {
            welcomeBar.classList.add("hide");
            document.body.classList.remove("welcome-active");
        }, 2500);
    }


    /* ========================================================
       HEADER / MENU MOBILE
    ======================================================== */

    const menuToggle = $("#menuToggle");
    const navigation = $("#navigation");
    const header = $(".header");

    const fecharMenu = () => {

        if (!navigation || !menuToggle) return;

        navigation.classList.remove("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Abrir menu"
        );

        menuToggle.innerHTML =
            '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    };

    const abrirOuFecharMenu = () => {

        if (!navigation || !menuToggle) return;

        const aberto =
            navigation.classList.toggle("active");

        menuToggle.setAttribute(
            "aria-expanded",
            String(aberto)
        );

        menuToggle.setAttribute(
            "aria-label",
            aberto ? "Fechar menu" : "Abrir menu"
        );

        menuToggle.innerHTML = aberto
            ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
            : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    };

    menuToggle?.addEventListener(
        "click",
        abrirOuFecharMenu
    );

    $$("#navigation a").forEach((link) => {
        link.addEventListener("click", fecharMenu);
    });

    document.addEventListener("click", (event) => {

        if (!navigation?.classList.contains("active")) {
            return;
        }

        if (
            !navigation.contains(event.target) &&
            !menuToggle?.contains(event.target)
        ) {
            fecharMenu();
        }
    });

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {
            fecharMenu();
        }
    });


    /* ========================================================
       HEADER AO ROLAR
    ======================================================== */

    const atualizarHeader = () => {

        header?.classList.toggle(
            "scrolled",
            window.scrollY > 40
        );
    };

    window.addEventListener(
        "scroll",
        atualizarHeader,
        { passive: true }
    );

    atualizarHeader();


    /* ========================================================
       HERO / SLIDER
    ======================================================== */

    const slides = $$(".slide");
    const dots = $$(".dot");
    const nextSlide = $("#nextSlide");
    const prevSlide = $("#prevSlide");
    const hero = $(".hero");

    let currentSlide = 0;
    let sliderTimer = null;
    let touchStartX = 0;

    const mostrarSlide = (index) => {

        if (!slides.length) return;

        currentSlide =
            (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {

            const ativo = i === currentSlide;

            slide.classList.toggle(
                "active",
                ativo
            );

            slide.setAttribute(
                "aria-hidden",
                String(!ativo)
            );
        });

        dots.forEach((dot, i) => {

            const ativo = i === currentSlide;

            dot.classList.toggle(
                "active",
                ativo
            );

            dot.setAttribute(
                "aria-current",
                ativo ? "true" : "false"
            );
        });
    };

    const pararSlider = () => {

        if (sliderTimer !== null) {
            clearInterval(sliderTimer);
            sliderTimer = null;
        }
    };

    const iniciarSlider = () => {

        pararSlider();

        if (slides.length < 2) {
            return;
        }

        sliderTimer = setInterval(() => {
            mostrarSlide(currentSlide + 1);
        }, 6000);
    };

    nextSlide?.addEventListener("click", () => {
        mostrarSlide(currentSlide + 1);
        iniciarSlider();
    });

    prevSlide?.addEventListener("click", () => {
        mostrarSlide(currentSlide - 1);
        iniciarSlider();
    });

    dots.forEach((dot, index) => {

        dot.addEventListener("click", () => {
            mostrarSlide(index);
            iniciarSlider();
        });
    });

    hero?.addEventListener(
        "mouseenter",
        pararSlider
    );

    hero?.addEventListener(
        "mouseleave",
        iniciarSlider
    );

    hero?.addEventListener(
        "touchstart",
        (event) => {

            const touch = event.changedTouches?.[0];

            if (!touch) return;

            touchStartX = touch.clientX;
            pararSlider();
        },
        { passive: true }
    );

    hero?.addEventListener(
        "touchend",
        (event) => {

            const touch = event.changedTouches?.[0];

            if (!touch) return;

            const difference =
                touchStartX - touch.clientX;

            if (Math.abs(difference) >= 50) {

                mostrarSlide(
                    difference > 0
                        ? currentSlide + 1
                        : currentSlide - 1
                );
            }

            iniciarSlider();
        },
        { passive: true }
    );

    mostrarSlide(0);
    iniciarSlider();


    /* ========================================================
       FLIP CARDS
    ======================================================== */

    $$(".flip-card").forEach((card) => {

        card.addEventListener("click", (event) => {

            if (
                event.target.closest("a") ||
                event.target.closest("button")
            ) {
                return;
            }

            card.classList.toggle("active");

            const ativo =
                card.classList.contains("active");

            card.setAttribute(
                "aria-expanded",
                String(ativo)
            );
        });

        card.addEventListener("keydown", (event) => {

            if (
                event.key !== "Enter" &&
                event.key !== " "
            ) {
                return;
            }

            if (
                event.target.closest("a") ||
                event.target.closest("button")
            ) {
                return;
            }

            event.preventDefault();

            card.classList.toggle("active");

            card.setAttribute(
                "aria-expanded",
                String(
                    card.classList.contains("active")
                )
            );
        });
    });


    /* ========================================================
       FORMULÁRIO DE CONTATO
    ======================================================== */

    const contactForm = $("#contactForm");
    const formMessage = $("#formMessage");

    contactForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            if (!contactForm.checkValidity()) {

                contactForm.reportValidity();

                return;
            }

            const name =
                safeText($("#name")?.value);

            const email =
                safeText($("#email")?.value);

            const message =
                safeText($("#message")?.value);

            if (!name || !email || !message) {

                if (formMessage) {
                    formMessage.textContent =
                        "Preencha todos os campos obrigatórios.";

                    formMessage.style.display = "block";
                    formMessage.style.color = "#b42318";
                }

                return;
            }

            const assunto =
                encodeURIComponent(
                    `Contato pelo site - ${name}`
                );

            const corpo =
                encodeURIComponent(
                    [
                        `Nome: ${name}`,
                        `E-mail: ${email}`,
                        "",
                        "Mensagem:",
                        message
                    ].join("\n")
                );

            if (formMessage) {

                formMessage.textContent =
                    "Abrindo seu aplicativo de e-mail...";

                formMessage.style.display =
                    "block";

                formMessage.style.color =
                    "#16803c";
            }

            /*
             * IMPORTANTE:
             *
             * mailto NÃO envia diretamente pelo servidor.
             * Ele abre o aplicativo de e-mail do visitante.
             *
             * Para envio realmente automático será necessário
             * um backend ou serviço de formulário.
             */

            window.location.href =
                `mailto:contato@ibrg.com.br?subject=${assunto}&body=${corpo}`;
        }
    );


    /* ========================================================
       VERSÍCULO DO DIA
    ======================================================== */

    const dailyVerse = $("#dailyVerse");
    const verseReference = $("#verseReference");
    const verseLink = $("#verseLink");
    const newVerse = $("#newVerse");

    const verses = [

        {
            text: "Porque Deus tanto amou o mundo que deu o seu Filho Unigênito, para que todo o que nele crer não pereça, mas tenha a vida eterna.",
            reference: "João 3:16",
            url: "https://www.bible.com/pt/bible/129/JHN.3.16.NVI"
        },

        {
            text: "O Senhor é o meu pastor; nada me faltará.",
            reference: "Salmos 23:1",
            url: "https://www.bible.com/pt/bible/129/PSA.23.1.NVI"
        },

        {
            text: "Tudo posso naquele que me fortalece.",
            reference: "Filipenses 4:13",
            url: "https://www.bible.com/pt/bible/129/PHP.4.13.NVI"
        },

        {
            text: "Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará.",
            reference: "Salmos 37:5",
            url: "https://www.bible.com/pt/bible/129/PSA.37.5.NVI"
        },

        {
            text: "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus.",
            reference: "Isaías 41:10",
            url: "https://www.bible.com/pt/bible/129/ISA.41.10.NVI"
        },

        {
            text: "Eu sou o caminho, a verdade e a vida. Ninguém vem ao Pai senão por mim.",
            reference: "João 14:6",
            url: "https://www.bible.com/pt/bible/129/JHN.14.6.NVI"
        },

        {
            text: "Buscai primeiro o Reino de Deus e a sua justiça, e todas estas coisas vos serão acrescentadas.",
            reference: "Mateus 6:33",
            url: "https://www.bible.com/pt/bible/129/MAT.6.33.NVI"
        },

        {
            text: "Sede fortes e corajosos; não temais, nem vos assusteis.",
            reference: "Deuteronômio 31:6",
            url: "https://www.bible.com/pt/bible/129/DEU.31.6.NVI"
        }

    ];

    const mostrarVersiculo = (index) => {

        if (
            !dailyVerse ||
            !verseReference ||
            !verses[index]
        ) {
            return;
        }

        const verse = verses[index];

        dailyVerse.textContent =
            `“${verse.text}”`;

        verseReference.textContent =
            verse.reference;

        if (verseLink) {

            verseLink.href =
                verse.url;

            verseLink.target =
                "_blank";

            verseLink.rel =
                "noopener noreferrer";
        }
    };

    if (verses.length) {

        /*
         * O dia determina o versículo.
         * Assim todos os visitantes recebem
         * o mesmo versículo no mesmo dia.
         */

        const inicioAno =
            new Date(
                new Date().getFullYear(),
                0,
                1
            );

        const hoje =
            new Date();

        const diferenca =
            Math.floor(
                (
                    hoje - inicioAno
                ) / 86400000
            );

        const index =
            diferenca % verses.length;

        mostrarVersiculo(index);
    }

    newVerse?.addEventListener(
        "click",
        () => {

            if (verses.length < 2) {
                return;
            }

            const atual =
                safeText(
                    dailyVerse?.textContent
                ).replace(/^“|”$/g, "");

            const disponiveis =
                verses.filter(
                    verse =>
                        verse.text !== atual
                );

            const escolhido =
                disponiveis[
                    Math.floor(
                        Math.random() *
                        disponiveis.length
                    )
                ];

            mostrarVersiculo(
                verses.indexOf(escolhido)
            );
        }
    );


    /* ========================================================
       BÍBLIA
    ======================================================== */

    const bookNames = {
        GEN: "Gênesis",
        EXO: "Êxodo",
        LEV: "Levítico",
        NUM: "Números",
        DEU: "Deuteronômio",
        JOS: "Josué",
        JDG: "Juízes",
        RUT: "Rute",
        "1SA": "1 Samuel",
        "2SA": "2 Samuel",
        "1KI": "1 Reis",
        "2KI": "2 Reis",
        "1CH": "1 Crônicas",
        "2CH": "2 Crônicas",
        EZR: "Esdras",
        NEH: "Neemias",
        EST: "Ester",
        JOB: "Jó",
        PSA: "Salmos",
        PRO: "Provérbios",
        ECC: "Eclesiastes",
        SNG: "Cânticos",
        ISA: "Isaías",
        JER: "Jeremias",
        LAM: "Lamentações",
        EZK: "Ezequiel",
        DAN: "Daniel",
        HOS: "Oseias",
        JOL: "Joel",
        AMO: "Amós",
        OBA: "Obadias",
        JON: "Jonas",
        MIC: "Miqueias",
        NAH: "Naum",
        HAB: "Habacuque",
        ZEP: "Sofonias",
        HAG: "Ageu",
        ZEC: "Zacarias",
        MAL: "Malaquias",
        MAT: "Mateus",
        MAR: "Marcos",
        LUK: "Lucas",
        JHN: "João",
        ACT: "Atos",
        ROM: "Romanos",
        "1CO": "1 Coríntios",
        "2CO": "2 Coríntios",
        GAL: "Gálatas",
        EPH: "Efésios",
        PHP: "Filipenses",
        COL: "Colossenses",
        "1TH": "1 Tessalonicenses",
        "2TH": "2 Tessalonicenses",
        "1TI": "1 Timóteo",
        "2TI": "2 Timóteo",
        TIT: "Tito",
        PHM: "Filemom",
        HEB: "Hebreus",
        JAS: "Tiago",
        "1PE": "1 Pedro",
        "2PE": "2 Pedro",
        "1JN": "1 João",
        "2JN": "2 João",
        "3JN": "3 João",
        JUD: "Judas",
        REV: "Apocalipse"
    };

    const chapterCounts = {
        "Gênesis": 50,
        "Êxodo": 40,
        "Levítico": 27,
        "Números": 36,
        "Deuteronômio": 34,
        "Josué": 24,
        "Juízes": 21,
        "Rute": 4,
        "1 Samuel": 31,
        "2 Samuel": 24,
        "1 Reis": 22,
        "2 Reis": 25,
        "1 Crônicas": 29,
        "2 Crônicas": 36,
        "Esdras": 10,
        "Neemias": 13,
        "Ester": 10,
        "Jó": 42,
        "Salmos": 150,
        "Provérbios": 31,
        "Eclesiastes": 12,
        "Cânticos": 8,
        "Isaías": 66,
        "Jeremias": 52,
        "Lamentações": 5,
        "Ezequiel": 48,
        "Daniel": 12,
        "Oseias": 14,
        "Joel": 3,
        "Amós": 9,
        "Obadias": 1,
        "Jonas": 4,
        "Miqueias": 7,
        "Naum": 3,
        "Habacuque": 3,
        "Sofonias": 3,
        "Ageu": 2,
        "Zacarias": 14,
        "Malaquias": 4,
        "Mateus": 28,
        "Marcos": 16,
        "Lucas": 24,
        "João": 21,
        "Atos": 28,
        "Romanos": 16,
        "1 Coríntios": 16,
        "2 Coríntios": 13,
        "Gálatas": 6,
        "Efésios": 6,
        "Filipenses": 4,
        "Colossenses": 4,
        "1 Tessalonicenses": 5,
        "2 Tessalonicenses": 3,
        "1 Timóteo": 6,
        "2 Timóteo": 4,
        "Tito": 3,
        "Filemom": 1,
        "Hebreus": 13,
        "Tiago": 5,
        "1 Pedro": 5,
        "2 Pedro": 3,
        "1 João": 5,
        "2 João": 1,
        "3 João": 1,
        "Judas": 1,
        "Apocalipse": 22
    };

    const bookSelect = $("#bookSelect");
    const chapterInput = $("#chapterInput");
    const readChapter = $("#readChapter");
    const bibleReader = $("#bibleReader");
    const readerResult = $("#readerResult");
    const readerTitle = $("#readerTitle");
    const closeReader = $("#closeReader");
    const externalChapterLink = $("#externalChapterLink");

    const getBibleURL = (code, chapter) =>
        `https://www.bible.com/pt/bible/129/${code}.${chapter}.NVI`;

    const mostrarErroBiblia = (message) => {

        if (!readerResult) return;

        readerResult.innerHTML = "";

        const box =
            document.createElement("div");

        box.className = "reader-error";

        const icon =
            document.createElement("i");

        icon.className =
            "fa-solid fa-circle-exclamation";

        icon.setAttribute(
            "aria-hidden",
            "true"
        );

        const text =
            document.createElement("p");

        text.textContent = message;

        box.append(icon, text);

        readerResult.appendChild(box);
    };

    const atualizarLimiteCapitulo = () => {

        if (!bookSelect || !chapterInput) {
            return;
        }

        const code =
            bookSelect.value;

        const book =
            bookNames[code];

        const max =
            chapterCounts[book];

        if (!max) return;

        chapterInput.min = "1";
        chapterInput.max = String(max);

        const value =
            Number(chapterInput.value);

        if (
            !Number.isInteger(value) ||
            value < 1 ||
            value > max
        ) {
            chapterInput.value = "1";
        }
    };

    const abrirLeitor = () => {

        if (!bibleReader) return;

        bibleReader.removeAttribute("hidden");
        bibleReader.classList.add("active");

        document.body.classList.add(
            "reader-open"
        );
    };

    const fecharLeitor = () => {

        if (!bibleReader) return;

        bibleReader.classList.remove("active");
        bibleReader.setAttribute("hidden", "");

        document.body.classList.remove(
            "reader-open"
        );
    };

    const carregarCapitulo = async () => {

        if (
            !bookSelect ||
            !chapterInput ||
            !readerResult
        ) {
            return;
        }

        const code =
            bookSelect.value;

        const book =
            bookNames[code];

        const chapter =
            Number(chapterInput.value);

        const max =
            chapterCounts[book];

        if (!book || !max) {

            mostrarErroBiblia(
                "Selecione um livro bíblico válido."
            );

            return;
        }

        if (
            !Number.isInteger(chapter) ||
            chapter < 1 ||
            chapter > max
        ) {

            mostrarErroBiblia(
                `${book} possui ${max} capítulo${max > 1 ? "s" : ""}.`
            );

            return;
        }

        abrirLeitor();

        if (readerTitle) {
            readerTitle.textContent =
                `${book} ${chapter}`;
        }

        const bibleURL =
            getBibleURL(
                code,
                chapter
            );

        if (externalChapterLink) {
            externalChapterLink.href =
                bibleURL;

            externalChapterLink.target =
                "_blank";

            externalChapterLink.rel =
                "noopener noreferrer";
        }

        readerResult.innerHTML = `
            <div class="reader-loading">
                <i class="fa-solid fa-spinner fa-spin"
                   aria-hidden="true"></i>
                <p>Carregando a leitura...</p>
            </div>
        `;

        try {

            const apiBook =
                encodeURIComponent(book);

            const url =
                `https://bible-api.com/` +
                `${apiBook}%20${chapter}` +
                `?translation=almeida`;

            const response =
                await fetch(
                    url,
                    {
                        method: "GET",
                        headers: {
                            Accept:
                                "application/json"
                        }
                    }
                );

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}`
                );
            }

            const data =
                await response.json();

            if (
                !Array.isArray(data.verses) ||
                !data.verses.length
            ) {
                throw new Error(
                    "Nenhum versículo encontrado."
                );
            }

            const fragment =
                document.createDocumentFragment();

            data.verses.forEach((verse) => {

                const paragraph =
                    document.createElement("p");

                paragraph.className =
                    "bible-verse";

                const number =
                    document.createElement("strong");

                number.textContent =
                    `${verse.verse} `;

                paragraph.append(
                    number,
                    document.createTextNode(
                        safeText(verse.text)
                    )
                );

                fragment.appendChild(
                    paragraph
                );
            });

            readerResult.replaceChildren(
                fragment
            );

        } catch (error) {

            console.warn(
                "Erro na Bíblia:",
                error
            );

            mostrarErroBiblia(
                "Não foi possível carregar este capítulo agora. Use o botão abaixo para continuar a leitura no Bible.com."
            );
        }
    };

    bookSelect?.addEventListener(
        "change",
        () => {

            if (chapterInput) {
                chapterInput.value = "1";
            }

            atualizarLimiteCapitulo();
        }
    );

    chapterInput?.addEventListener(
        "input",
        atualizarLimiteCapitulo
    );

    chapterInput?.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                event.preventDefault();

                carregarCapitulo();
            }
        }
    );

    readChapter?.addEventListener(
        "click",
        carregarCapitulo
    );

    closeReader?.addEventListener(
        "click",
        fecharLeitor
    );

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                bibleReader?.classList.contains("active")
            ) {
                fecharLeitor();
            }
        }
    );

    atualizarLimiteCapitulo();


    /* ========================================================
       PLANO ANUAL DE LEITURA
    ======================================================== */

    const bibleBooks = Object.entries({
        "Gênesis": 50,
        "Êxodo": 40,
        "Levítico": 27,
        "Números": 36,
        "Deuteronômio": 34,
        "Josué": 24,
        "Juízes": 21,
        "Rute": 4,
        "1 Samuel": 31,
        "2 Samuel": 24,
        "1 Reis": 22,
        "2 Reis": 25,
        "1 Crônicas": 29,
        "2 Crônicas": 36,
        "Esdras": 10,
        "Neemias": 13,
        "Ester": 10,
        "Jó": 42,
        "Salmos": 150,
        "Provérbios": 31,
        "Eclesiastes": 12,
        "Cânticos": 8,
        "Isaías": 66,
        "Jeremias": 52,
        "Lamentações": 5,
        "Ezequiel": 48,
        "Daniel": 12,
        "Oseias": 14,
        "Joel": 3,
        "Amós": 9,
        "Obadias": 1,
        "Jonas": 4,
        "Miqueias": 7,
        "Naum": 3,
        "Habacuque": 3,
        "Sofonias": 3,
        "Ageu": 2,
        "Zacarias": 14,
        "Malaquias": 4,
        "Mateus": 28,
        "Marcos": 16,
        "Lucas": 24,
        "João": 21,
        "Atos": 28,
        "Romanos": 16,
        "1 Coríntios": 16,
        "2 Coríntios": 13,
        "Gálatas": 6,
        "Efésios": 6,
        "Filipenses": 4,
        "Colossenses": 4,
        "1 Tessalonicenses": 5,
        "2 Tessalonicenses": 3,
        "1 Timóteo": 6,
        "2 Timóteo": 4,
        "Tito": 3,
        "Filemom": 1,
        "Hebreus": 13,
        "Tiago": 5,
        "1 Pedro": 5,
        "2 Pedro": 3,
        "1 João": 5,
        "2 João": 1,
        "3 João": 1,
        "Judas": 1,
        "Apocalipse": 22
    });

    const criarPlanoAnual = () => {

        const total =
            bibleBooks.reduce(
                (sum, [, chapters]) =>
                    sum + chapters,
                0
            );

        const base =
            Math.floor(total / 365);

        const extras =
            total % 365;

        const plan = [];

        let bookIndex = 0;
        let chapter = 1;

        for (let day = 1; day <= 365; day++) {

            let remaining =
                base +
                (day <= extras ? 1 : 0);

            const ranges = [];

            while (
                remaining > 0 &&
                bookIndex < bibleBooks.length
            ) {

                const [
                    book,
                    totalChapters
                ] =
                    bibleBooks[bookIndex];

                const available =
                    totalChapters -
                    chapter +
                    1;

                const amount =
                    Math.min(
                        remaining,
                        available
                    );

                ranges.push({
                    book,
                    start: chapter,
                    end:
                        chapter +
                        amount -
                        1
                });

                remaining -= amount;

                if (
                    chapter + amount - 1 >=
                    totalChapters
                ) {

                    bookIndex++;
                    chapter = 1;

                } else {

                    chapter += amount;
                }
            }

            plan.push({
                day,
                ranges
            });
        }

        return plan;
    };

    const annualPlan =
        criarPlanoAnual();


    /* ========================================================
       STORAGE SEGURO
    ======================================================== */

    const storageGet = (key, fallback) => {

        try {

            const value =
                Number(
                    localStorage.getItem(key)
                );

            return Number.isFinite(value)
                ? value
                : fallback;

        } catch {

            return fallback;
        }
    };

    const storageSet = (key, value) => {

        try {
            localStorage.setItem(
                key,
                String(value)
            );
        } catch {
            // Sem acesso ao localStorage.
        }
    };

    const currentYear =
        new Date().getFullYear();

    let savedYear =
        storageGet(
            "annualPlanYear",
            currentYear
        );

    let completedDays =
        storageGet(
            "annualCompletedDays",
            0
        );

    if (savedYear !== currentYear) {

        savedYear =
            currentYear;

        completedDays = 0;

        storageSet(
            "annualPlanYear",
            currentYear
        );

        storageSet(
            "annualCompletedDays",
            0
        );
    }

    completedDays =
        Math.max(
            0,
            Math.min(
                365,
                Math.floor(completedDays)
            )
        );

    let currentDay =
        completedDays >= 365
            ? 365
            : completedDays + 1;


    /* ========================================================
       CARD DE LEITURA DIÁRIA
    ======================================================== */

    const dailyReadingCard =
        $(".daily-reading-card");

    const currentReadingDay =
        $("#currentReadingDay");

    const dailyReadingDate =
        $("#dailyReadingDate");

    const dailyReadingTitle =
        $("#dailyReadingTitle");

    const dailyReadingDescription =
        $("#dailyReadingDescription");

    const annualProgressText =
        $("#annualProgressText");

    const annualProgressBar =
        $("#annualProgressBar");

    const annualProgressPercent =
        $("#annualProgressPercent");

    const nextReadingDay =
        $("#nextReadingDay");

    const completeReading =
        $("#completeReading");

    const nextReading =
        $("#nextReading");

    const dailyReadingStatus =
        $("#dailyReadingStatus");

    const salvarPlano = () => {

        storageSet(
            "annualPlanYear",
            currentYear
        );

        storageSet(
            "annualCurrentDay",
            currentDay
        );

        storageSet(
            "annualCompletedDays",
            completedDays
        );
    };

    const formatarLeitura = (range) => {

        if (range.start === range.end) {
            return `${range.book} ${range.start}`;
        }

        return `${range.book} ${range.start}–${range.end}`;
    };

    const obterLeitura = (day) =>
        annualPlan.find(
            item => item.day === day
        );

    const formatarDataPlano = (day) => {

        const date =
            new Date(
                Date.UTC(
                    currentYear,
                    0,
                    day
                )
            );

        return date.toLocaleDateString(
            "pt-BR",
            {
                day: "2-digit",
                month: "2-digit",
                timeZone: "UTC"
            }
        );
    };

    const mostrarStatusLeitura = (message) => {

        if (!dailyReadingStatus) return;

        dailyReadingStatus.textContent =
            message;

        clearTimeout(
            dailyReadingStatus._timer
        );

        dailyReadingStatus._timer =
            setTimeout(() => {

                dailyReadingStatus.textContent =
                    "";

            }, 3500);
    };

    const atualizarPlano = () => {

        if (!dailyReadingCard) return;

        const concluido =
            completedDays >= 365;

        const day =
            concluido
                ? 365
                : currentDay;

        const reading =
            obterLeitura(day);

        const percent =
            Math.round(
                (completedDays / 365) * 100
            );

        if (currentReadingDay) {
            currentReadingDay.textContent =
                String(day).padStart(2, "0");
        }

        if (dailyReadingDate) {

            dailyReadingDate.textContent =
                concluido
                    ? "Plano concluído"
                    : formatarDataPlano(day);
        }

        if (
            dailyReadingTitle &&
            reading
        ) {

            dailyReadingTitle.textContent =
                reading.ranges
                    .map(formatarLeitura)
                    .join(" • ");
        }

        if (dailyReadingDescription) {

            dailyReadingDescription.textContent =
                concluido
                    ? "Você concluiu todo o plano de leitura anual. Que a Palavra continue guiando seus dias!"
                    : `Leitura correspondente ao Dia ${day} do plano anual.`;
        }

        if (annualProgressText) {

            annualProgressText.textContent =
                `${completedDays} de 365 dias`;
        }

        if (annualProgressBar) {

            annualProgressBar.style.width =
                `${percent}%`;

            annualProgressBar.setAttribute(
                "aria-valuenow",
                String(percent)
            );
        }

        if (annualProgressPercent) {

            annualProgressPercent.textContent =
                `${percent}%`;
        }

        if (nextReadingDay) {

            nextReadingDay.textContent =
                concluido
                    ? "Plano concluído"
                    : `Próxima leitura: Dia ${Math.min(day + 1, 365)}`;
        }

        dailyReadingCard.classList.toggle(
            "completed",
            concluido
        );

        if (completeReading) {

            completeReading.disabled =
                concluido;

            completeReading.innerHTML =
                concluido
                    ? '<i class="fa-solid fa-circle-check" aria-hidden="true"></i> Plano concluído'
                    : '<i class="fa-solid fa-circle-check" aria-hidden="true"></i> Marcar como lido';
        }
    };

    completeReading?.addEventListener(
        "click",
        () => {

            if (completedDays >= 365) {
                return;
            }

            completedDays =
                Math.max(
                    completedDays,
                    currentDay
                );

            currentDay =
                completedDays >= 365
                    ? 365
                    : completedDays + 1;

            salvarPlano();
            atualizarPlano();

            mostrarStatusLeitura(
                completedDays >= 365
                    ? "Parabéns! Você concluiu o plano anual."
                    : "Leitura marcada como concluída!"
            );
        }
    );

    nextReading?.addEventListener(
        "click",
        () => {

            if (completedDays >= 365) {

                mostrarStatusLeitura(
                    "Você já concluiu todo o plano."
                );

                return;
            }

            dailyReadingCard?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    );

    atualizarPlano();


    /* ========================================================
       CALENDÁRIO
    ======================================================== */

    const calendarMonth = $("#calendarMonth");
    const calendarYear = $("#calendarYear");
    const calendarDays = $$(".calendar-day");

    const prevWeek = $("#prevWeek");
    const nextWeek = $("#nextWeek");
    const todayWeek = $("#todayWeek");
    const prevYear = $("#prevYear");
    const nextYear = $("#nextYear");

    if (
        calendarDays.length &&
        calendarMonth
    ) {

        const eventos = [

            {
                dia: 0,
                titulo: "Consagração",
                horario: "08h30"
            },

            {
                dia: 0,
                titulo: "Escola Dominical",
                horario: "09h30 – 11h00"
            },

            {
                dia: 0,
                titulo: "Culto de Ação de Graças",
                horario: "18h00 – 19h00"
            },

            {
                dia: 2,
                titulo: "Culto de Conquistas",
                horario: "20h00 – 21h00"
            },

            {
                dia: 3,
                titulo: "Tarde de Bênção",
                horario: "15h00 – 16h30"
            },

            {
                dia: 3,
                titulo: "Intercessão",
                horario: "20h00 – 21h00"
            },

            {
                dia: 5,
                titulo: "Culto ao Espírito Santo",
                horario: "20h00 – 21h00"
            },

            {
                dia: 6,
                titulo: "Culto dos Jovens",
                horario: "19h00 – 20h00"
            }
        ];

        let calendarDate = new Date();

        const inicioSemana = (date) => {

            const result =
                new Date(date);

            result.setHours(
                0,
                0,
                0,
                0
            );

            result.setDate(
                result.getDate() -
                result.getDay()
            );

            return result;
        };

        const mesmaData = (a, b) =>
            a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate();

        const formatarMes = (date) => {

            const value =
                date.toLocaleDateString(
                    "pt-BR",
                    {
                        month: "long",
                        year: "numeric"
                    }
                );

            return (
                value.charAt(0).toUpperCase() +
                value.slice(1)
            );
        };

        const renderizarCalendario = () => {

            const inicio =
                inicioSemana(calendarDate);

            const hoje =
                new Date();

            calendarMonth.textContent =
                formatarMes(inicio);

            if (calendarYear) {
                calendarYear.textContent =
                    inicio.getFullYear();
            }

            calendarDays.forEach(
                (card, index) => {

                    const date =
                        new Date(inicio);

                    date.setDate(
                        inicio.getDate() +
                        index
                    );

                    const number =
                        $(".day-number", card);

                    const container =
                        $(".day-events", card);

                    if (number) {
                        number.textContent =
                            date.getDate();
                    }

                    card.classList.toggle(
                        "today",
                        mesmaData(date, hoje)
                    );

                    if (!container) {
                        return;
                    }

                    container.replaceChildren();

                    const eventosDoDia =
                        eventos.filter(
                            evento =>
                                evento.dia ===
                                date.getDay()
                        );

                    if (!eventosDoDia.length) {

                        const empty =
                            document.createElement(
                                "span"
                            );

                        empty.className =
                            "calendar-empty";

                        empty.textContent =
                            "Sem programação";

                        container.appendChild(
                            empty
                        );

                        return;
                    }

                    eventosDoDia.forEach(
                        evento => {

                            const item =
                                document.createElement(
                                    "div"
                                );

                            item.className =
                                "calendar-event";

                            const title =
                                document.createElement(
                                    "strong"
                                );

                            title.textContent =
                                evento.titulo;

                            const time =
                                document.createElement(
                                    "span"
                                );

                            time.textContent =
                                evento.horario;

                            item.append(
                                title,
                                time
                            );

                            container.appendChild(
                                item
                            );
                        }
                    );
                }
            );
        };

        prevWeek?.addEventListener(
            "click",
            () => {

                calendarDate.setDate(
                    calendarDate.getDate() - 7
                );

                renderizarCalendario();
            }
        );

        nextWeek?.addEventListener(
            "click",
            () => {

                calendarDate.setDate(
                    calendarDate.getDate() + 7
                );

                renderizarCalendario();
            }
        );

        todayWeek?.addEventListener(
            "click",
            () => {

                calendarDate = new Date();

                renderizarCalendario();
            }
        );

        prevYear?.addEventListener(
            "click",
            () => {

                calendarDate.setFullYear(
                    calendarDate.getFullYear() - 1
                );

                renderizarCalendario();
            }
        );

        nextYear?.addEventListener(
            "click",
            () => {

                calendarDate.setFullYear(
                    calendarDate.getFullYear() + 1
                );

                renderizarCalendario();
            }
        );

        renderizarCalendario();
    }


    /* ========================================================
       FG NEWS
    ======================================================== */

    const noticiaContainer = $("#noticia");
    const pontosContainer = $("#pontos");
    const fgPrev = $("#fgPrev");
    const fgNext = $("#fgNext");
    const fgNews = $(".fg-news");

    let noticias = [];
    let noticiaAtual = 0;
    let newsTimer = null;

    const noticiasPadrao = [

        {
            titulo: "Notícias do mundo cristão",
            descricao:
                "Acompanhe as principais notícias do mundo cristão.",
            categoria: "FG News",
            data: "Folha Gospel",
            imagem: "",
            link: "https://folhagospel.com/"
        },

        {
            titulo: "Igrejas e cristãos em destaque",
            descricao:
                "Confira acontecimentos recentes relacionados à fé cristã.",
            categoria: "FG News",
            data: "Folha Gospel",
            imagem: "",
            link: "https://folhagospel.com/"
        },

        {
            titulo: "Fé, igreja e atualidades",
            descricao:
                "Informação sobre igreja, sociedade e vida cristã.",
            categoria: "FG News",
            data: "Folha Gospel",
            imagem: "",
            link: "https://folhagospel.com/"
        }
    ];

    const pararNoticias = () => {

        if (newsTimer !== null) {

            clearInterval(newsTimer);

            newsTimer = null;
        }
    };

    const iniciarNoticias = () => {

        pararNoticias();

        if (noticias.length <= 1) {
            return;
        }

        newsTimer =
            setInterval(
                () => {
                    mostrarNoticia(
                        noticiaAtual + 1
                    );
                },
                7000
            );
    };

    const atualizarPontos = () => {

        if (!pontosContainer) return;

        $$(".fg-ponto", pontosContainer)
            .forEach((point, index) => {

                const active =
                    index === noticiaAtual;

                point.classList.toggle(
                    "ativo",
                    active
                );

                point.setAttribute(
                    "aria-current",
                    active ? "true" : "false"
                );
            });
    };

    const criarPontos = () => {

        if (!pontosContainer) return;

        pontosContainer.replaceChildren();

        noticias.forEach((_, index) => {

            const button =
                document.createElement("button");

            button.type = "button";

            button.className = "fg-ponto";

            button.setAttribute(
                "aria-label",
                `Ir para a notícia ${index + 1}`
            );

            button.addEventListener(
                "click",
                () => {

                    mostrarNoticia(index);
                    iniciarNoticias();
                }
            );

            pontosContainer.appendChild(
                button
            );
        });

        atualizarPontos();
    };

    const mostrarNoticia = (index = noticiaAtual) => {

        if (
            !noticiaContainer ||
            !noticias.length
        ) {
            return;
        }

        noticiaAtual =
            (
                index + noticias.length
            ) % noticias.length;

        const noticia =
            noticias[noticiaAtual];

        const article =
            document.createElement("article");

        article.className =
            "fg-card";

        const imageBox =
            document.createElement("div");

        imageBox.className =
            "fg-imagem";

        if (noticia.imagem) {

            const img =
                document.createElement("img");

            img.src =
                noticia.imagem;

            img.alt =
                safeText(noticia.titulo);

            img.loading =
                "lazy";

            img.decoding =
                "async";

            img.addEventListener(
                "error",
                () => {

                    imageBox.classList.add(
                        "sem-imagem"
                    );

                    img.remove();
                }
            );

            imageBox.appendChild(img);

        } else {

            imageBox.classList.add(
                "sem-imagem"
            );
        }

        const content =
            document.createElement("div");

        content.className =
            "fg-conteudo";

        const category =
            document.createElement("span");

        category.className =
            "fg-categoria";

        category.textContent =
            noticia.categoria ||
            "FG News";

        const title =
            document.createElement("h2");

        title.textContent =
            noticia.titulo ||
            "Notícia";

        const description =
            document.createElement("p");

        description.textContent =
            noticia.descricao ||
            "Confira esta notícia.";

        const date =
            document.createElement("span");

        date.className =
            "fg-data";

        date.textContent =
            noticia.data ||
            "Folha Gospel";

        const link =
            document.createElement("a");

        link.className =
            "fg-ler";

        link.href =
            noticia.link ||
            "https://folhagospel.com/";

        link.target =
            "_blank";

        link.rel =
            "noopener noreferrer";

        link.textContent =
            "Ler notícia";

        content.append(
            category,
            title,
            description,
            date,
            link
        );

        article.append(
            imageBox,
            content
        );

        noticiaContainer.replaceChildren(
            article
        );

        atualizarPontos();
    };

    const proximaNoticia = () => {

        if (!noticias.length) return;

        mostrarNoticia(
            noticiaAtual + 1
        );
    };

    const noticiaAnterior = () => {

        if (!noticias.length) return;

        mostrarNoticia(
            noticiaAtual - 1
        );
    };

    fgNext?.addEventListener(
        "click",
        () => {

            proximaNoticia();
            iniciarNoticias();
        }
    );

    fgPrev?.addEventListener(
        "click",
        () => {

            noticiaAnterior();
            iniciarNoticias();
        }
    );

    fgNews?.addEventListener(
        "mouseenter",
        pararNoticias
    );

    fgNews?.addEventListener(
        "mouseleave",
        iniciarNoticias
    );

    fgNews?.addEventListener(
        "focusin",
        pararNoticias
    );

    fgNews?.addEventListener(
        "focusout",
        (event) => {

            if (
                !fgNews.contains(
                    event.relatedTarget
                )
            ) {
                iniciarNoticias();
            }
        }
    );

    const extrairTexto = (html) => {

        const temp =
            document.createElement("div");

        temp.innerHTML =
            html || "";

        return safeText(
            temp.textContent
        ).replace(
            /\s+/g,
            " "
        );
    };

    const carregarNoticias = async () => {

        noticias =
            [...noticiasPadrao];

        noticiaAtual = 0;

        criarPontos();
        mostrarNoticia();

        try {

            const feed =
                encodeURIComponent(
                    "https://folhagospel.com/feed/"
                );

            const url =
                `https://api.rss2json.com/v1/api.json` +
                `?rss_url=${feed}&count=10`;

            const response =
                await fetch(
                    url,
                    {
                        method: "GET",
                        cache: "no-store"
                    }
                );

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}`
                );
            }

            const data =
                await response.json();

            if (
                !Array.isArray(data.items) ||
                !data.items.length
            ) {
                throw new Error(
                    "Feed vazio."
                );
            }

            const novas =
                data.items
                    .map(item => {

                        const descricao =
                            extrairTexto(
                                item.description
                            );

                        let dataPublicacao =
                            "Folha Gospel";

                        if (item.pubDate) {

                            const date =
                                new Date(
                                    item.pubDate
                                );

                            if (
                                !Number.isNaN(
                                    date.getTime()
                                )
                            ) {

                                dataPublicacao =
                                    date.toLocaleDateString(
                                        "pt-BR"
                                    );
                            }
                        }

                        return {

                            titulo:
                                safeText(
                                    item.title
                                ) ||
                                "Notícia",

                            descricao:
                                descricao.slice(
                                    0,
                                    180
                                ),

                            categoria:
                                "Notícias Gospel",

                            data:
                                dataPublicacao,

                            imagem:
                                item.thumbnail ||
                                item.enclosure?.link ||
                                "",

                            link:
                                item.link ||
                                "https://folhagospel.com/"
                        };
                    })
                    .filter(
                        item =>
                            item.titulo &&
                            item.link
                    );

            if (novas.length) {

                noticias =
                    novas;

                noticiaAtual = 0;

                criarPontos();
                mostrarNoticia();
            }

        } catch (error) {

            console.warn(
                "Não foi possível carregar o feed de notícias:",
                error
            );

        } finally {

            iniciarNoticias();
        }
    };

    if (noticiaContainer) {

        carregarNoticias();

        /*
         * Atualização a cada 30 minutos.
         */
        setInterval(
            carregarNoticias,
            30 * 60 * 1000
        );
    }


    /* ========================================================
       YOUTUBE
    ======================================================== */

    /*
     * Compatibilidade com iframes existentes.
     *
     * Não substituímos automaticamente os vídeos porque
     * o ID do canal/vídeo precisa vir do HTML.
     */

    $$("iframe[src*='youtube.com'], iframe[src*='youtu.be']")
        .forEach((iframe) => {

            iframe.setAttribute(
                "loading",
                "lazy"
            );

            iframe.setAttribute(
                "title",
                iframe.getAttribute("title") ||
                "Vídeo da Igreja"
            );

            iframe.setAttribute(
                "allow",
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            );

            iframe.setAttribute(
                "allowfullscreen",
                ""
            );
        });


    /* ========================================================
       LINKS EXTERNOS
    ======================================================== */

    $$("a[target='_blank']").forEach((link) => {

        const rel =
            link.getAttribute("rel") || "";

        if (!rel.includes("noopener")) {
            link.setAttribute(
                "rel",
                `${rel} noopener noreferrer`.trim()
            );
        }
    });


    /* ========================================================
       IMAGENS
    ======================================================== */

    $$("img").forEach((image, index) => {

        image.decoding =
            image.decoding || "async";

        /*
         * A primeira imagem pode continuar eager
         * para evitar piora do carregamento inicial.
         */
        if (index > 0) {
            image.loading =
                image.loading || "lazy";
        }
    });


    /* ========================================================
       SMOOTH SCROLL
    ======================================================== */

    $$("a[href^='#']").forEach((link) => {

        link.addEventListener(
            "click",
            (event) => {

                const href =
                    link.getAttribute("href");

                if (
                    !href ||
                    href === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(href);

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        );
    });


    /* ========================================================
       REDUZIR ANIMAÇÕES PARA ACESSIBILIDADE
    ======================================================== */

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

    if (prefersReducedMotion.matches) {

        pararSlider();
        pararNoticias();
    }

    prefersReducedMotion.addEventListener?.(
        "change",
        (event) => {

            if (event.matches) {

                pararSlider();
                pararNoticias();

            } else {

                iniciarSlider();
                iniciarNoticias();
            }
        }
    );


    /* ========================================================
       FINALIZAÇÃO
    ======================================================== */

    document.documentElement.classList.add(
        "js-ready"
    );

    console.log(
        "IBRG: JavaScript carregado com sucesso."
    );

});