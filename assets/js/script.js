
document.addEventListener("DOMContentLoaded", () => {


    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        Array.from(parent.querySelectorAll(selector));

    const safeText = (value) =>
        String(value ?? "").trim();

    const isElement = (element) =>
        element instanceof Element;

    const escapeRegExp = (value) =>
        String(value).replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );


    /* ========================================================
       ANO DO FOOTER
    ======================================================== */

    const yearElement = $("#year");

    if (yearElement) {
        yearElement.textContent =
            String(new Date().getFullYear());
    }


    /* ========================================================
       BARRA DE BOAS-VINDAS
    ======================================================== */

    const welcomeBar = $("#welcomeBar");

    let welcomeTimer = null;

    if (welcomeBar) {

        document.body.classList.add(
            "welcome-active"
        );

        welcomeTimer = window.setTimeout(() => {

            welcomeBar.classList.add("hide");

            document.body.classList.remove(
                "welcome-active"
            );

        }, 2500);
    }


    /* ========================================================
       HEADER / MENU MOBILE
    ======================================================== */

    const menuToggle = $("#menuToggle");
    const navigation = $("#navigation");
    const header = $(".header");

    const fecharMenu = () => {

        if (!navigation || !menuToggle) {
            return;
        }

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

        if (!navigation || !menuToggle) {
            return;
        }

        const aberto =
            navigation.classList.toggle("active");

        menuToggle.setAttribute(
            "aria-expanded",
            String(aberto)
        );

        menuToggle.setAttribute(
            "aria-label",
            aberto
                ? "Fechar menu"
                : "Abrir menu"
        );

        menuToggle.innerHTML = aberto
            ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
            : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    };

    if (menuToggle && navigation) {

        menuToggle.addEventListener(
            "click",
            abrirOuFecharMenu
        );

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Abrir menu"
        );
    }

    $$("#navigation a").forEach((link) => {

        link.addEventListener(
            "click",
            fecharMenu
        );
    });

    document.addEventListener(
        "click",
        (event) => {

            if (
                !navigation?.classList.contains(
                    "active"
                )
            ) {
                return;
            }

            const target = event.target;

            if (
                !navigation.contains(target) &&
                !menuToggle?.contains(target)
            ) {
                fecharMenu();
            }
        }
    );

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {
                fecharMenu();
            }
        }
    );


    /* ========================================================
       HEADER AO ROLAR
    ======================================================== */

    const atualizarHeader = () => {

        if (!header) {
            return;
        }

        header.classList.toggle(
            "scrolled",
            window.scrollY > 40
        );
    };

    window.addEventListener(
        "scroll",
        atualizarHeader,
        {
            passive: true
        }
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
    let touchStartY = 0;

    const mostrarSlide = (index) => {

        if (!slides.length) {
            return;
        }

        currentSlide =
            (
                index + slides.length
            ) % slides.length;

        slides.forEach(
            (slide, indexAtual) => {

                const ativo =
                    indexAtual === currentSlide;

                slide.classList.toggle(
                    "active",
                    ativo
                );

                slide.setAttribute(
                    "aria-hidden",
                    String(!ativo)
                );
            }
        );

        dots.forEach(
            (dot, indexAtual) => {

                const ativo =
                    indexAtual === currentSlide;

                dot.classList.toggle(
                    "active",
                    ativo
                );

                dot.setAttribute(
                    "aria-current",
                    ativo
                        ? "true"
                        : "false"
                );
            }
        );
    };

    const pararSlider = () => {

        if (sliderTimer !== null) {

            window.clearInterval(
                sliderTimer
            );

            sliderTimer = null;
        }
    };

    const iniciarSlider = () => {

        pararSlider();

        if (slides.length < 2) {
            return;
        }

        if (
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
        ) {
            return;
        }

        sliderTimer =
            window.setInterval(
                () => {

                    mostrarSlide(
                        currentSlide + 1
                    );

                },
                6000
            );
    };

    nextSlide?.addEventListener(
        "click",
        () => {

            mostrarSlide(
                currentSlide + 1
            );

            iniciarSlider();
        }
    );

    prevSlide?.addEventListener(
        "click",
        () => {

            mostrarSlide(
                currentSlide - 1
            );

            iniciarSlider();
        }
    );

    dots.forEach(
        (dot, index) => {

            dot.addEventListener(
                "click",
                () => {

                    mostrarSlide(index);

                    iniciarSlider();
                }
            );
        }
    );

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

            const touch =
                event.changedTouches?.[0];

            if (!touch) {
                return;
            }

            touchStartX =
                touch.clientX;

            touchStartY =
                touch.clientY;

            pararSlider();
        },
        {
            passive: true
        }
    );

    hero?.addEventListener(
        "touchend",
        (event) => {

            const touch =
                event.changedTouches?.[0];

            if (!touch) {
                return;
            }

            const differenceX =
                touchStartX -
                touch.clientX;

            const differenceY =
                touchStartY -
                touch.clientY;

            /*
             * Só considera swipe quando o movimento
             * horizontal é maior que o vertical.
             */
            if (
                Math.abs(differenceX) >= 50 &&
                Math.abs(differenceX) >
                Math.abs(differenceY)
            ) {

                mostrarSlide(
                    differenceX > 0
                        ? currentSlide + 1
                        : currentSlide - 1
                );
            }

            iniciarSlider();
        },
        {
            passive: true
        }
    );

    mostrarSlide(0);
    iniciarSlider();


    /* ========================================================
       FLIP CARDS
    ======================================================== */

    $$(".flip-card").forEach((card) => {

        /*
         * Garante que cards interativos sejam acessíveis
         * também pelo teclado.
         */
        if (!card.hasAttribute("tabindex")) {
            card.setAttribute(
                "tabindex",
                "0"
            );
        }

        if (!card.hasAttribute("role")) {
            card.setAttribute(
                "role",
                "button"
            );
        }

        if (!card.hasAttribute("aria-expanded")) {
            card.setAttribute(
                "aria-expanded",
                "false"
            );
        }

        const alternarCard = () => {

            card.classList.toggle(
                "active"
            );

            card.setAttribute(
                "aria-expanded",
                String(
                    card.classList.contains(
                        "active"
                    )
                )
            );
        };

        card.addEventListener(
            "click",
            (event) => {

                if (
                    event.target.closest("a") ||
                    event.target.closest("button") ||
                    event.target.closest("input") ||
                    event.target.closest("select") ||
                    event.target.closest("textarea")
                ) {
                    return;
                }

                alternarCard();
            }
        );

        card.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key !== "Enter" &&
                    event.key !== " "
                ) {
                    return;
                }

                if (
                    event.target.closest("a") ||
                    event.target.closest("button") ||
                    event.target.closest("input") ||
                    event.target.closest("select") ||
                    event.target.closest("textarea")
                ) {
                    return;
                }

                event.preventDefault();

                alternarCard();
            }
        );
    });


    /* ========================================================
       FORMULÁRIO DE CONTATO
    ======================================================== */

    const contactForm = $("#contactForm");
    const formMessage = $("#formMessage");

    const mostrarMensagemFormulario = (
        message,
        color = "#16803c"
    ) => {

        if (!formMessage) {
            return;
        }

        formMessage.textContent =
            message;

        formMessage.style.display =
            "block";

        formMessage.style.color =
            color;

        formMessage.setAttribute(
            "role",
            "status"
        );
    };

    contactForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            if (
                typeof contactForm.checkValidity ===
                "function" &&
                !contactForm.checkValidity()
            ) {

                contactForm.reportValidity();

                return;
            }

            const name =
                safeText(
                    $("#name")?.value
                );

            const email =
                safeText(
                    $("#email")?.value
                );

            const message =
                safeText(
                    $("#message")?.value
                );

            if (
                !name ||
                !email ||
                !message
            ) {

                mostrarMensagemFormulario(
                    "Preencha todos os campos obrigatórios.",
                    "#b42318"
                );

                return;
            }

            /*
             * Validação adicional simples.
             */
            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {

                mostrarMensagemFormulario(
                    "Digite um endereço de e-mail válido.",
                    "#b42318"
                );

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

            mostrarMensagemFormulario(
                "Abrindo seu aplicativo de e-mail..."
            );

            /*
             * IMPORTANTE:
             *
             * mailto apenas abre o aplicativo de e-mail.
             * Não realiza envio automático pelo servidor.
             */
            window.location.href =
                `mailto:contato@ibrg.com.br` +
                `?subject=${assunto}` +
                `&body=${corpo}`;
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
            text:
                "Porque Deus tanto amou o mundo que deu o seu Filho Unigênito, para que todo o que nele crer não pereça, mas tenha a vida eterna.",
            reference:
                "João 3:16",
            url:
                "https://www.bible.com/pt/bible/129/JHN.3.16.NVI"
        },

        {
            text:
                "O Senhor é o meu pastor; nada me faltará.",
            reference:
                "Salmos 23:1",
            url:
                "https://www.bible.com/pt/bible/129/PSA.23.1.NVI"
        },

        {
            text:
                "Tudo posso naquele que me fortalece.",
            reference:
                "Filipenses 4:13",
            url:
                "https://www.bible.com/pt/bible/129/PHP.4.13.NVI"
        },

        {
            text:
                "Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará.",
            reference:
                "Salmos 37:5",
            url:
                "https://www.bible.com/pt/bible/129/PSA.37.5.NVI"
        },

        {
            text:
                "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus.",
            reference:
                "Isaías 41:10",
            url:
                "https://www.bible.com/pt/bible/129/ISA.41.10.NVI"
        },

        {
            text:
                "Eu sou o caminho, a verdade e a vida. Ninguém vem ao Pai senão por mim.",
            reference:
                "João 14:6",
            url:
                "https://www.bible.com/pt/bible/129/JHN.14.6.NVI"
        },

        {
            text:
                "Buscai primeiro o Reino de Deus e a sua justiça, e todas estas coisas vos serão acrescentadas.",
            reference:
                "Mateus 6:33",
            url:
                "https://www.bible.com/pt/bible/129/MAT.6.33.NVI"
        },

        {
            text:
                "Sede fortes e corajosos; não temais, nem vos assusteis.",
            reference:
                "Deuteronômio 31:6",
            url:
                "https://www.bible.com/pt/bible/129/DEU.31.6.NVI"
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

        const verse =
            verses[index];

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

    const obterDiaDoAno = (date = new Date()) => {

        const inicio =
            new Date(
                date.getFullYear(),
                0,
                1
            );

        const inicioDia =
            new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            );

        return Math.floor(
            (
                inicioDia -
                inicio
            ) / 86400000
        );
    };

    if (verses.length) {

        const dayOfYear =
            obterDiaDoAno();

        const index =
            dayOfYear % verses.length;

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
                )
                    .replace(/^“|”$/g, "");

            const disponiveis =
                verses.filter(
                    (verse) =>
                        verse.text !== atual
                );

            if (!disponiveis.length) {
                return;
            }

            const escolhido =
                disponiveis[
                    Math.floor(
                        Math.random() *
                        disponiveis.length
                    )
                ];

            mostrarVersiculo(
                verses.indexOf(
                    escolhido
                )
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
    const externalChapterLink =
        $("#externalChapterLink");

    let bibleRequestController = null;

    const getBibleURL = (
        code,
        chapter
    ) =>
        `https://www.bible.com/pt/bible/129/${code}.${chapter}.NVI`;

    const mostrarErroBiblia = (message) => {

        if (!readerResult) {
            return;
        }

        readerResult.replaceChildren();

        const box =
            document.createElement("div");

        box.className =
            "reader-error";

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

        text.textContent =
            message;

        box.append(
            icon,
            text
        );

        readerResult.appendChild(
            box
        );
    };

    const atualizarLimiteCapitulo = () => {

        if (
            !bookSelect ||
            !chapterInput
        ) {
            return;
        }

        const code =
            bookSelect.value;

        const book =
            bookNames[code];

        const max =
            chapterCounts[book];

        if (!max) {
            return;
        }

        chapterInput.min = "1";
        chapterInput.max =
            String(max);

        const value =
            Number(
                chapterInput.value
            );

        if (
            !Number.isInteger(value) ||
            value < 1 ||
            value > max
        ) {
            chapterInput.value = "1";
        }
    };

    const abrirLeitor = () => {

        if (!bibleReader) {
            return;
        }

        bibleReader.removeAttribute(
            "hidden"
        );

        bibleReader.classList.add(
            "active"
        );

        document.body.classList.add(
            "reader-open"
        );
    };

    const fecharLeitor = () => {

        if (!bibleReader) {
            return;
        }

        if (bibleRequestController) {

            bibleRequestController.abort();

            bibleRequestController = null;
        }

        bibleReader.classList.remove(
            "active"
        );

        bibleReader.setAttribute(
            "hidden",
            ""
        );

        document.body.classList.remove(
            "reader-open"
        );
    };

    const mostrarLoadingBiblia = () => {

        if (!readerResult) {
            return;
        }

        readerResult.innerHTML = `
            <div class="reader-loading">
                <i class="fa-solid fa-spinner fa-spin"
                   aria-hidden="true"></i>
                <p>Carregando a leitura...</p>
            </div>
        `;
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
            safeText(
                bookSelect.value
            );

        const book =
            bookNames[code];

        const chapter =
            Number(
                chapterInput.value
            );

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

        /*
         * Cancela uma requisição anterior.
         */
        if (bibleRequestController) {

            bibleRequestController.abort();
        }

        bibleRequestController =
            new AbortController();

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

        mostrarLoadingBiblia();

        /*
         * Timeout de segurança.
         */
        const timeoutId =
            window.setTimeout(
                () => {

                    bibleRequestController?.abort();

                },
                15000
            );

        try {

            const apiBook =
                encodeURIComponent(
                    book
                );

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
                        },
                        signal:
                            bibleRequestController.signal
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
                !Array.isArray(
                    data?.verses
                ) ||
                !data.verses.length
            ) {

                throw new Error(
                    "Nenhum versículo encontrado."
                );
            }

            const fragment =
                document.createDocumentFragment();

            data.verses.forEach(
                (verse) => {

                    const paragraph =
                        document.createElement(
                            "p"
                        );

                    paragraph.className =
                        "bible-verse";

                    const number =
                        document.createElement(
                            "strong"
                        );

                    number.textContent =
                        `${safeText(
                            verse.verse
                        )} `;

                    paragraph.append(
                        number,
                        document.createTextNode(
                            safeText(
                                verse.text
                            )
                        )
                    );

                    fragment.appendChild(
                        paragraph
                    );
                }
            );

            readerResult.replaceChildren(
                fragment
            );

        } catch (error) {

            if (
                error?.name ===
                "AbortError"
            ) {
                return;
            }

            console.warn(
                "Erro na Bíblia:",
                error
            );

            mostrarErroBiblia(
                "Não foi possível carregar este capítulo agora. Use o botão abaixo para continuar a leitura no Bible.com."
            );

        } finally {

            window.clearTimeout(
                timeoutId
            );

            bibleRequestController =
                null;
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
                bibleReader?.classList.contains(
                    "active"
                )
            ) {

                fecharLeitor();
            }
        }
    );

    atualizarLimiteCapitulo();


    /* ========================================================
       PLANO ANUAL DE LEITURA
       ======================================================== */

    const bibleBooks = Object.entries(
        chapterCounts
    );

    const TOTAL_DIAS_PLANO = 365;

    const criarPlanoAnual = () => {

        const totalCapitulos =
            bibleBooks.reduce(
                (
                    total,
                    [, chapters]
                ) =>
                    total + chapters,
                0
            );

        /*
         * Distribuição equilibrada dos capítulos:
         *
         * total / 365
         *
         * Os dias iniciais recebem os capítulos extras.
         */
        const base =
            Math.floor(
                totalCapitulos /
                TOTAL_DIAS_PLANO
            );

        const extras =
            totalCapitulos %
            TOTAL_DIAS_PLANO;

        const plan = [];

        let bookIndex = 0;
        let chapter = 1;

        for (
            let day = 1;
            day <= TOTAL_DIAS_PLANO;
            day++
        ) {

            let remaining =
                base +
                (
                    day <= extras
                        ? 1
                        : 0
                );

            const ranges = [];

            while (
                remaining > 0 &&
                bookIndex <
                bibleBooks.length
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
                    chapter +
                    amount -
                    1 >=
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

    const storageGet = (
        key,
        fallback
    ) => {

        try {

            const value =
                localStorage.getItem(
                    key
                );

            if (
                value === null ||
                value === ""
            ) {
                return fallback;
            }

            const number =
                Number(value);

            return Number.isFinite(
                number
            )
                ? number
                : fallback;

        } catch {

            return fallback;
        }
    };

    const storageSet = (
        key,
        value
    ) => {

        try {

            localStorage.setItem(
                key,
                String(value)
            );

        } catch {
            /*
             * localStorage pode estar
             * bloqueado pelo navegador.
             */
        }
    };


    /* ========================================================
       ESTADO DO PLANO
       ======================================================== */

    const currentYear =
        new Date().getFullYear();

    const storedYear =
        storageGet(
            "annualPlanYear",
            currentYear
        );

    let savedYear =
        Math.floor(
            storedYear
        );

    let completedDays =
        Math.floor(
            storageGet(
                "annualCompletedDays",
                0
            )
        );

    /*
     * Compatibilidade com versões anteriores
     * que utilizavam annualCurrentDay.
     */
    let currentDay =
        Math.floor(
            storageGet(
                "annualCurrentDay",
                completedDays + 1
            )
        );

    if (
        savedYear !== currentYear
    ) {

        savedYear =
            currentYear;

        completedDays = 0;

        currentDay = 1;

        storageSet(
            "annualPlanYear",
            currentYear
        );

        storageSet(
            "annualCompletedDays",
            0
        );

        storageSet(
            "annualCurrentDay",
            1
        );
    }

    completedDays =
        Math.max(
            0,
            Math.min(
                TOTAL_DIAS_PLANO,
                completedDays
            )
        );

    /*
     * O dia atual sempre representa
     * o próximo dia a ser lido.
     */
    currentDay =
        completedDays >=
        TOTAL_DIAS_PLANO
            ? TOTAL_DIAS_PLANO
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

    const formatarLeitura = (
        range
    ) => {

        if (
            range.start ===
            range.end
        ) {
            return `${range.book} ${range.start}`;
        }

        return (
            `${range.book} ` +
            `${range.start}–${range.end}`
        );
    };

    const obterLeitura = (
        day
    ) =>
        annualPlan.find(
            item =>
                item.day === day
        );

    const formatarDataPlano = (
        day
    ) => {

        /*
         * Usa UTC para evitar problemas
         * de fuso horário perto da meia-noite.
         */
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

    const mostrarStatusLeitura = (
        message
    ) => {

        if (!dailyReadingStatus) {
            return;
        }

        dailyReadingStatus.textContent =
            message;

        if (
            dailyReadingStatus._timer
        ) {

            window.clearTimeout(
                dailyReadingStatus._timer
            );
        }

        dailyReadingStatus._timer =
            window.setTimeout(
                () => {

                    dailyReadingStatus.textContent =
                        "";

                },
                3500
            );
    };

    const atualizarPlano = () => {

        if (!dailyReadingCard) {
            return;
        }

        const concluido =
            completedDays >=
            TOTAL_DIAS_PLANO;

        const day =
            concluido
                ? TOTAL_DIAS_PLANO
                : currentDay;

        const reading =
            obterLeitura(day);

        const percent =
            Math.round(
                (
                    completedDays /
                    TOTAL_DIAS_PLANO
                ) * 100
            );

        if (currentReadingDay) {

            currentReadingDay.textContent =
                String(day).padStart(
                    2,
                    "0"
                );
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
                    .map(
                        formatarLeitura
                    )
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
                `${completedDays} de ${TOTAL_DIAS_PLANO} dias`;
        }

        if (annualProgressBar) {

            annualProgressBar.style.width =
                `${percent}%`;

            annualProgressBar.setAttribute(
                "aria-valuenow",
                String(percent)
            );

            annualProgressBar.setAttribute(
                "aria-valuemin",
                "0"
            );

            annualProgressBar.setAttribute(
                "aria-valuemax",
                "100"
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
                    : `Próxima leitura: Dia ${Math.min(
                        day + 1,
                        TOTAL_DIAS_PLANO
                    )}`;
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

            if (
                completedDays >=
                TOTAL_DIAS_PLANO
            ) {
                return;
            }

            /*
             * Só avança um dia por clique.
             * Isso evita pular leituras.
             */
            completedDays =
                Math.min(
                    TOTAL_DIAS_PLANO,
                    completedDays + 1
                );

            currentDay =
                completedDays >=
                TOTAL_DIAS_PLANO
                    ? TOTAL_DIAS_PLANO
                    : completedDays + 1;

            salvarPlano();
            atualizarPlano();

            mostrarStatusLeitura(
                completedDays >=
                TOTAL_DIAS_PLANO
                    ? "Parabéns! Você concluiu o plano anual."
                    : "Leitura marcada como concluída!"
            );
        }
    );

    nextReading?.addEventListener(
        "click",
        () => {

            if (
                completedDays >=
                TOTAL_DIAS_PLANO
            ) {

                mostrarStatusLeitura(
                    "Você já concluiu todo o plano."
                );

                return;
            }

            dailyReadingCard?.scrollIntoView({
                behavior:
                    window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches
                        ? "auto"
                        : "smooth",
                block:
                    "center"
            });
        }
    );

    atualizarPlano();


    /* ========================================================
       CALENDÁRIO
       ======================================================== */

    const calendarMonth =
        $("#calendarMonth");

    const calendarYear =
        $("#calendarYear");

    const calendarDays =
        $$(".calendar-day");

    const prevWeek =
        $("#prevWeek");

    const nextWeek =
        $("#nextWeek");

    const todayWeek =
        $("#todayWeek");

    const prevYear =
        $("#prevYear");

    const nextYear =
        $("#nextYear");

    if (
        calendarDays.length &&
        calendarMonth
    ) {

        /*
         * dia:
         *
         * 0 = domingo
         * 1 = segunda
         * ...
         * 6 = sábado
         */
        const eventos = [

            {
                dia: 0,
                titulo:
                    "Consagração",
                horario:
                    "08h30"
            },

            {
                dia: 0,
                titulo:
                    "Escola Dominical",
                horario:
                    "09h30 – 11h00"
            },

            {
                dia: 0,
                titulo:
                    "Culto de Ação de Graças",
                horario:
                    "18h00 – 19h00"
            },

            {
                dia: 2,
                titulo:
                    "Culto de Conquistas",
                horario:
                    "20h00 – 21h00"
            },

            {
                dia: 3,
                titulo:
                    "Tarde de Bênção",
                horario:
                    "15h00 – 16h30"
            },

            {
                dia: 3,
                titulo:
                    "Intercessão",
                horario:
                    "20h00 – 21h00"
            },

            {
                dia: 5,
                titulo:
                    "Culto ao Espírito Santo",
                horario:
                    "20h00 – 21h00"
            },

            {
                dia: 6,
                titulo:
                    "Culto dos Jovens",
                horario:
                    "19h00 – 20h00"
            }
        ];

        let calendarDate =
            new Date();

        const inicioSemana = (
            date
        ) => {

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

        const mesmaData = (
            a,
            b
        ) =>
            a.getFullYear() ===
                b.getFullYear() &&
            a.getMonth() ===
                b.getMonth() &&
            a.getDate() ===
                b.getDate();

        const formatarMes = (
            date
        ) => {

            const value =
                date.toLocaleDateString(
                    "pt-BR",
                    {
                        month:
                            "long",
                        year:
                            "numeric"
                    }
                );

            return (
                value.charAt(0).toUpperCase() +
                value.slice(1)
            );
        };

        const renderizarCalendario = () => {

            const inicio =
                inicioSemana(
                    calendarDate
                );

            const hoje =
                new Date();

            calendarMonth.textContent =
                formatarMes(
                    inicio
                );

            if (calendarYear) {

                calendarYear.textContent =
                    String(
                        inicio.getFullYear()
                    );
            }

            calendarDays.forEach(
                (
                    card,
                    index
                ) => {

                    const date =
                        new Date(
                            inicio
                        );

                    date.setDate(
                        inicio.getDate() +
                        index
                    );

                    const number =
                        $(
                            ".day-number",
                            card
                        );

                    const container =
                        $(
                            ".day-events",
                            card
                        );

                    if (number) {

                        number.textContent =
                            String(
                                date.getDate()
                            );
                    }

                    card.classList.toggle(
                        "today",
                        mesmaData(
                            date,
                            hoje
                        )
                    );

                    /*
                     * Guarda a data no elemento,
                     * caso o CSS/HTML precise dela.
                     */
                    card.dataset.date =
                        date.toISOString()
                            .split("T")[0];

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

                    if (
                        !eventosDoDia.length
                    ) {

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
                        (evento) => {

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
                    calendarDate.getDate() -
                    7
                );

                renderizarCalendario();
            }
        );

        nextWeek?.addEventListener(
            "click",
            () => {

                calendarDate.setDate(
                    calendarDate.getDate() +
                    7
                );

                renderizarCalendario();
            }
        );

        todayWeek?.addEventListener(
            "click",
            () => {

                calendarDate =
                    new Date();

                renderizarCalendario();
            }
        );

        prevYear?.addEventListener(
            "click",
            () => {

                calendarDate.setFullYear(
                    calendarDate.getFullYear() -
                    1
                );

                renderizarCalendario();
            }
        );

        nextYear?.addEventListener(
            "click",
            () => {

                calendarDate.setFullYear(
                    calendarDate.getFullYear() +
                    1
                );

                renderizarCalendario();
            }
        );

        renderizarCalendario();
    }


    /* ========================================================
       FG NEWS
       ======================================================== */

    const noticiaContainer =
        $("#noticia");

    const pontosContainer =
        $("#pontos");

    const fgPrev =
        $("#fgPrev");

    const fgNext =
        $("#fgNext");

    const fgNews =
        $(".fg-news");

    let noticias = [];
    let noticiaAtual = 0;
    let newsTimer = null;
    let newsRequestController = null;

    const noticiasPadrao = [

        {
            titulo:
                "Notícias do mundo cristão",

            descricao:
                "Acompanhe as principais notícias do mundo cristão.",

            categoria:
                "FG News",

            data:
                "Folha Gospel",

            imagem:
                "",

            link:
                "https://folhagospel.com/"
        },

        {
            titulo:
                "Igrejas e cristãos em destaque",

            descricao:
                "Confira acontecimentos recentes relacionados à fé cristã.",

            categoria:
                "FG News",

            data:
                "Folha Gospel",

            imagem:
                "",

            link:
                "https://folhagospel.com/"
        },

        {
            titulo:
                "Fé, igreja e atualidades",

            descricao:
                "Informação sobre igreja, sociedade e vida cristã.",

            categoria:
                "FG News",

            data:
                "Folha Gospel",

            imagem:
                "",

            link:
                "https://folhagospel.com/"
        }
    ];

    const pararNoticias = () => {

        if (newsTimer !== null) {

            window.clearInterval(
                newsTimer
            );

            newsTimer = null;
        }
    };

    const iniciarNoticias = () => {

        pararNoticias();

        if (noticias.length <= 1) {
            return;
        }

        if (
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
        ) {
            return;
        }

        newsTimer =
            window.setInterval(
                () => {

                    mostrarNoticia(
                        noticiaAtual + 1
                    );

                },
                7000
            );
    };

    const atualizarPontos = () => {

        if (!pontosContainer) {
            return;
        }

        $$(".fg-ponto", pontosContainer)
            .forEach(
                (
                    point,
                    index
                ) => {

                    const active =
                        index ===
                        noticiaAtual;

                    point.classList.toggle(
                        "ativo",
                        active
                    );

                    point.setAttribute(
                        "aria-current",
                        active
                            ? "true"
                            : "false"
                    );
                }
            );
    };

    const criarPontos = () => {

        if (!pontosContainer) {
            return;
        }

        pontosContainer.replaceChildren();

        noticias.forEach(
            (
                _,
                index
            ) => {

                const button =
                    document.createElement(
                        "button"
                    );

                button.type =
                    "button";

                button.className =
                    "fg-ponto";

                button.setAttribute(
                    "aria-label",
                    `Ir para a notícia ${index + 1}`
                );

                button.addEventListener(
                    "click",
                    () => {

                        mostrarNoticia(
                            index
                        );

                        iniciarNoticias();
                    }
                );

                pontosContainer.appendChild(
                    button
                );
            }
        );

        atualizarPontos();
    };

    const criarImagemSegura = (
        noticia
    ) => {

        const imageBox =
            document.createElement(
                "div"
            );

        imageBox.className =
            "fg-imagem";

        const imageURL =
            safeText(
                noticia.imagem
            );

        if (!imageURL) {

            imageBox.classList.add(
                "sem-imagem"
            );

            return imageBox;
        }

        const img =
            document.createElement(
                "img"
            );

        img.src =
            imageURL;

        img.alt =
            safeText(
                noticia.titulo
            );

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
            },
            {
                once: true
            }
        );

        imageBox.appendChild(
            img
        );

        return imageBox;
    };





    
    const mostrarNoticia = (
        index = noticiaAtual
    ) => {

        if (
            !noticiaContainer ||
            !noticias.length
        ) {
            return;
        }

        noticiaAtual =
            (
                index +
                noticias.length
            ) %
            noticias.length;

        const noticia =
            noticias[
                noticiaAtual
            ];

        const article =
            document.createElement(
                "article"
            );

        article.className =
            "fg-card";

        const imageBox =
            criarImagemSegura(
                noticia
            );

        const content =
            document.createElement(
                "div"
            );

        content.className =
            "fg-conteudo";

        const category =
            document.createElement(
                "span"
            );

        category.className =
            "fg-categoria";

        category.textContent =
            safeText(
                noticia.categoria
            ) ||
            "FG News";

        const title =
            document.createElement(
                "h2"
            );

        title.textContent =
            safeText(
                noticia.titulo
            ) ||
            "Notícia";

        const description =
            document.createElement(
                "p"
            );

        description.textContent =
            safeText(
                noticia.descricao
            ) ||
            "Confira esta notícia.";

        const date =
            document.createElement(
                "span"
            );

        date.className =
            "fg-data";

        date.textContent =
            safeText(
                noticia.data
            ) ||
            "Folha Gospel";

        const link =
            document.createElement(
                "a"
            );

        link.className =
            "fg-ler";

        link.href =
            safeText(
                noticia.link
            ) ||
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

        if (!noticias.length) {
            return;
        }

        mostrarNoticia(
            noticiaAtual + 1
        );
    };

    const noticiaAnterior = () => {

        if (!noticias.length) {
            return;
        }

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

    const extrairTexto = (
        html
    ) => {

        const temp =
            document.createElement(
                "div"
            );

        temp.innerHTML =
            html || "";

        return safeText(
            temp.textContent
        ).replace(
            /\s+/g,
            " "
        );
    };

    const obterDataPublicacao = (
        value
    ) => {

        if (!value) {
            return "Folha Gospel";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "Folha Gospel";
        }

        return date.toLocaleDateString(
            "pt-BR"
        );
    };

    const carregarNoticias = async () => {

        /*
         * Cancela carregamento anterior.
         */
        if (newsRequestController) {

            newsRequestController.abort();
        }

        newsRequestController =
            new AbortController();

        /*
         * Sempre existe um fallback visual.
         */
        noticias =
            [...noticiasPadrao];

        noticiaAtual = 0;

        criarPontos();
        mostrarNoticia();

        const timeoutId =
            window.setTimeout(
                () => {

                    newsRequestController?.abort();

                },
                15000
            );

        try {

            const feed =
                encodeURIComponent(
                    "https://folhagospel.com/feed/"
                );

            const url =
                `https://api.rss2json.com/v1/api.json` +
                `?rss_url=${feed}` +
                `&count=10`;

            const response =
                await fetch(
                    url,
                    {
                        method:
                            "GET",

                        cache:
                            "no-store",

                        headers: {
                            Accept:
                                "application/json"
                        },

                        signal:
                            newsRequestController.signal
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
                !Array.isArray(
                    data?.items
                ) ||
                !data.items.length
            ) {

                throw new Error(
                    "Feed vazio."
                );
            }

            const novas =
                data.items
                    .map(
                        (item) => {

                            const descricao =
                                extrairTexto(
                                    item.description
                                );

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
                                    obterDataPublicacao(
                                        item.pubDate
                                    ),

                                imagem:
                                    safeText(
                                        item.thumbnail
                                    ) ||
                                    safeText(
                                        item.enclosure?.link
                                    ) ||
                                    "",

                                link:
                                    safeText(
                                        item.link
                                    ) ||
                                    "https://folhagospel.com/"
                            };
                        }
                    )
                    .filter(
                        (item) =>
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

            if (
                error?.name !==
                "AbortError"
            ) {

                console.warn(
                    "Não foi possível carregar o feed de notícias:",
                    error
                );
            }

        } finally {

            window.clearTimeout(
                timeoutId
            );

            newsRequestController =
                null;

            iniciarNoticias();
        }
    };

    let newsRefreshTimer =
        null;

    if (noticiaContainer) {

        carregarNoticias();

        /*
         * Atualização a cada 30 minutos.
         */
        newsRefreshTimer =
            window.setInterval(
                carregarNoticias,
                30 * 60 * 1000
            );
    }


    /* ========================================================
       YOUTUBE
       ======================================================== */

    $$(
        "iframe[src*='youtube.com'], iframe[src*='youtu.be']"
    ).forEach(
        (iframe) => {

            iframe.setAttribute(
                "loading",
                "lazy"
            );

            iframe.setAttribute(
                "title",
                iframe.getAttribute(
                    "title"
                ) ||
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
        }
    );


    /* ========================================================
       LINKS EXTERNOS
       ======================================================== */

    $$(
        "a[target='_blank']"
    ).forEach(
        (link) => {

            const rel =
                link.getAttribute(
                    "rel"
                ) || "";

            const tokens =
                rel
                    .split(/\s+/)
                    .filter(Boolean);

            if (
                !tokens.includes(
                    "noopener"
                )
            ) {
                tokens.push(
                    "noopener"
                );
            }

            if (
                !tokens.includes(
                    "noreferrer"
                )
            ) {
                tokens.push(
                    "noreferrer"
                );
            }

            link.setAttribute(
                "rel",
                tokens.join(" ")
            );
        }
    );


        /* ========================================================
   HERO — 3 VÍDEOS EM LOOP INFINITO
   ======================================================== */

const heroVideos = $$(".hero-video-item");
const heroVideoSection = $(".hero-video");
const videoProgress = $(".video-progress");

let videoAtual = 0;
let videoTrocaTimer = null;
let videoProgressAnimation = null;


/*
 * Mostra somente o vídeo atual.
 */
const mostrarVideo = (index) => {

    if (!heroVideos.length) {
        return;
    }

    videoAtual =
        (index + heroVideos.length) %
        heroVideos.length;

    heroVideos.forEach(
        (video, indexAtual) => {

            const ativo =
                indexAtual === videoAtual;

            video.classList.toggle(
                "active",
                ativo
            );

            video.setAttribute(
                "aria-hidden",
                String(!ativo)
            );
        }
    );
};


/*
 * Reinicia a barra de progresso.
 */
const iniciarProgressoVideo = (video) => {

    if (!videoProgress) {
        return;
    }

    if (videoProgressAnimation) {

        cancelAnimationFrame(
            videoProgressAnimation
        );

        videoProgressAnimation = null;
    }

    videoProgress.style.width = "0%";

    const atualizar = () => {

        if (
            !video ||
            !video.duration ||
            !Number.isFinite(
                video.duration
            )
        ) {
            return;
        }

        const porcentagem =
            Math.min(
                100,
                (
                    video.currentTime /
                    video.duration
                ) * 100
            );

        videoProgress.style.width =
            `${porcentagem}%`;

        if (
            !video.paused &&
            !video.ended
        ) {

            videoProgressAnimation =
                requestAnimationFrame(
                    atualizar
                );
        }
    };

    atualizar();
};


/*
 * Vai para o próximo vídeo.
 */
const proximoVideo = async () => {

    if (!heroVideos.length) {
        return;
    }

    const videoAtualElement =
        heroVideos[videoAtual];

    if (videoAtualElement) {

        videoAtualElement.pause();

        videoAtualElement.currentTime = 0;
    }

    const proximoIndex =
        (
            videoAtual + 1
        ) %
        heroVideos.length;

    mostrarVideo(
        proximoIndex
    );

    const proximo =
        heroVideos[proximoIndex];

    if (!proximo) {
        return;
    }

    try {

        proximo.currentTime = 0;

    } catch {
        // Ignora caso o navegador ainda não permita alterar o tempo.
    }

    try {

        await proximo.play();

        iniciarProgressoVideo(
            proximo
        );

    } catch (error) {

        console.warn(
            "Não foi possível reproduzir o vídeo:",
            error
        );
    }
};


/*
 * Quando um vídeo termina,
 * automaticamente chama o próximo.
 */
heroVideos.forEach(
    (video) => {

        video.addEventListener(
            "ended",
            () => {

                proximoVideo();

            }
        );

        video.addEventListener(
            "play",
            () => {

                iniciarProgressoVideo(
                    video
                );

            }
        );
    }
);


/*
 * Inicia o primeiro vídeo.
 */
const iniciarVideosHero = async () => {

    if (!heroVideos.length) {
        return;
    }

    mostrarVideo(0);

    const primeiro =
        heroVideos[0];

    primeiro.muted = true;
    primeiro.playsInline = true;

    try {

        primeiro.currentTime = 0;

    } catch {
        // Ignora.
    }

    try {

        await primeiro.play();

        iniciarProgressoVideo(
            primeiro
        );

    } catch (error) {

        console.warn(
            "Autoplay do vídeo bloqueado:",
            error
        );

        /*
         * Tenta novamente quando o usuário
         * interagir com a página.
         */
        const iniciarComInteracao = () => {

            primeiro.play()
                .then(() => {

                    iniciarProgressoVideo(
                        primeiro
                    );

                })
                .catch(() => {
                    // Navegador continua bloqueando autoplay.
                });

            document.removeEventListener(
                "click",
                iniciarComInteracao
            );

            document.removeEventListener(
                "touchstart",
                iniciarComInteracao
            );
        };

        document.addEventListener(
            "click",
            iniciarComInteracao,
            {
                once: true
            }
        );

        document.addEventListener(
            "touchstart",
            iniciarComInteracao,
            {
                once: true,
                passive: true
            }
        );
    }
};


/*
 * Inicia o sistema.
 */
iniciarVideosHero();


    /* ========================================================
       IMAGENS
       ======================================================== */

    $$("img").forEach(
        (image, index) => {

            image.decoding =
                image.decoding ||
                "async";

            /*
             * Não força lazy na primeira imagem.
             * Isso preserva o carregamento inicial do hero.
             */
            if (
                index > 0 &&
                !image.hasAttribute(
                    "loading"
                )
            ) {

                image.loading =
                    "lazy";
            }
        }
    );


    /* ========================================================
       SMOOTH SCROLL
       ======================================================== */

    $$(
        "a[href^='#']"
    ).forEach(
        (link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const href =
                        link.getAttribute(
                            "href"
                        );

                    if (
                        !href ||
                        href === "#"
                    ) {
                        return;
                    }

                    /*
                     * Evita quebrar o script
                     * caso o href contenha caracteres
                     * inválidos para querySelector.
                     */
                    let target = null;

                    try {

                        target =
                            document.querySelector(
                                href
                            );

                    } catch {
                        return;
                    }

                    if (!target) {
                        return;
                    }

                    event.preventDefault();

                    const reduceMotion =
                        window.matchMedia(
                            "(prefers-reduced-motion: reduce)"
                        ).matches;

                    target.scrollIntoView({
                        behavior:
                            reduceMotion
                                ? "auto"
                                : "smooth",
                        block:
                            "start"
                    });

                    /*
                     * Atualiza a URL sem recarregar
                     * a página.
                     */
                    try {

                        history.pushState(
                            null,
                            "",
                            href
                        );

                    } catch {
                        // Ignora navegadores restritivos.
                    }
                }
            );
        }
    );


    /* ========================================================
       ACESSIBILIDADE — REDUÇÃO DE MOVIMENTO
       ======================================================== */

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

    const atualizarMovimento = (
        reduced
    ) => {

        if (reduced) {

            pararSlider();
            pararNoticias();

        } else {

            iniciarSlider();
            iniciarNoticias();
        }
    };

    if (
        prefersReducedMotion.addEventListener
    ) {

        prefersReducedMotion.addEventListener(
            "change",
            (event) => {

                atualizarMovimento(
                    event.matches
                );
            }
        );

    } else if (
        prefersReducedMotion.addListener
    ) {

        /*
         * Compatibilidade com navegadores antigos.
         */
        prefersReducedMotion.addListener(
            (event) => {

                atualizarMovimento(
                    event.matches
                );
            }
        );
    }


    /* ========================================================
       VISIBILIDADE DA PÁGINA
       ======================================================== */

    /*
     * Evita deixar sliders e notícias rodando
     * enquanto a aba estiver em segundo plano.
     */
    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden
            ) {

                pararSlider();
                pararNoticias();

            } else {

                iniciarSlider();
                iniciarNoticias();
            }
        }
    );


    /* ========================================================
       LIMPEZA AO SAIR DA PÁGINA
       ======================================================== */

    window.addEventListener(
        "pagehide",
        () => {

            pararSlider();
            pararNoticias();

            if (
                newsRefreshTimer !== null
            ) {

                window.clearInterval(
                    newsRefreshTimer
                );

                newsRefreshTimer = null;
            }

            if (
                newsRequestController
            ) {

                newsRequestController.abort();

                newsRequestController =
                    null;
            }

            if (
                bibleRequestController
            ) {

                bibleRequestController.abort();

                bibleRequestController =
                    null;
            }

            if (
                welcomeTimer !== null
            ) {

                window.clearTimeout(
                    welcomeTimer
                );

                welcomeTimer = null;
            }
        }
    );


});
