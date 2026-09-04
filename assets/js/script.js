document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* ========================================================
       HELPERS
    ======================================================== */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        Array.from(parent.querySelectorAll(selector));

    const safeText = (value) =>
        String(value ?? "").trim();

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    const isReducedMotion = () =>
        prefersReducedMotion.matches;


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
        document.body.classList.add("welcome-active");

        welcomeTimer = window.setTimeout(() => {
            welcomeBar.classList.add("hide");
            document.body.classList.remove("welcome-active");
            welcomeTimer = null;
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

    const alternarMenu = () => {
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
        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Abrir menu"
        );

        menuToggle.addEventListener(
            "click",
            alternarMenu
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
            if (!navigation?.classList.contains("active")) {
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
       HERO / SLIDER DE IMAGENS
    ======================================================== */

    const slides = $$(".slide");
    const dots = $$(".dot");
    const nextSlide = $("#nextSlide");
    const prevSlide = $("#prevSlide");
    const hero = $(".hero");

    let currentSlide = 0;
    let sliderTimer = null;

    const mostrarSlide = (index) => {
        if (!slides.length) {
            return;
        }

        currentSlide =
            (index + slides.length) % slides.length;

        slides.forEach((slide, indexAtual) => {
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
        });

        dots.forEach((dot, indexAtual) => {
            const ativo =
                indexAtual === currentSlide;

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
            window.clearInterval(sliderTimer);
            sliderTimer = null;
        }
    };

    const iniciarSlider = () => {
        pararSlider();

        if (
            slides.length < 2 ||
            isReducedMotion() ||
            document.hidden
        ) {
            return;
        }

        sliderTimer = window.setInterval(() => {
            mostrarSlide(currentSlide + 1);
        }, 6000);
    };

    nextSlide?.addEventListener(
        "click",
        () => {
            mostrarSlide(currentSlide + 1);
            iniciarSlider();
        }
    );

    prevSlide?.addEventListener(
        "click",
        () => {
            mostrarSlide(currentSlide - 1);
            iniciarSlider();
        }
    );

    dots.forEach((dot, index) => {
        dot.addEventListener(
            "click",
            () => {
                mostrarSlide(index);
                iniciarSlider();
            }
        );
    });

    hero?.addEventListener(
        "mouseenter",
        pararSlider
    );

    hero?.addEventListener(
        "mouseleave",
        iniciarSlider
    );

    let touchStartX = 0;
    let touchStartY = 0;

    hero?.addEventListener(
        "touchstart",
        (event) => {
            const touch =
                event.changedTouches?.[0];

            if (!touch) {
                return;
            }

            touchStartX = touch.clientX;
            touchStartY = touch.clientY;

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
                touchStartX - touch.clientX;

            const differenceY =
                touchStartY - touch.clientY;

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

        const possuiControleInterno = (target) =>
            target.closest(
                "a, button, input, select, textarea"
            );

        const alternarCard = () => {
            const ativo =
                card.classList.toggle("active");

            card.setAttribute(
                "aria-expanded",
                String(ativo)
            );
        };

        card.addEventListener(
            "click",
            (event) => {
                if (
                    possuiControleInterno(
                        event.target
                    )
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
                    possuiControleInterno(
                        event.target
                    )
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
                safeText($("#name")?.value);

            const email =
                safeText($("#email")?.value);

            const message =
                safeText($("#message")?.value);

            if (!name || !email || !message) {
                mostrarMensagemFormulario(
                    "Preencha todos os campos obrigatórios.",
                    "#b42318"
                );

                return;
            }

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

    const obterDiaDoAno = (
        date = new Date()
    ) => {
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
                inicioDia - inicio
            ) / 86400000
        );
    };

    if (verses.length) {
        mostrarVersiculo(
            obterDiaDoAno() % verses.length
        );
    }

    newVerse?.addEventListener(
        "click",
        () => {
            if (
                verses.length < 2 ||
                !dailyVerse
            ) {
                return;
            }

            const atual =
                safeText(
                    dailyVerse.textContent
                ).replace(
                    /^“|”$/g,
                    ""
                );

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
    let bibleRequestId = 0;

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

        readerResult.appendChild(box);
    };

    const abrirLeitor = () => {
        if (!bibleReader) {
            return;
        }

        bibleReader.removeAttribute("hidden");
        bibleReader.classList.add("active");

        document.body.classList.add(
            "reader-open"
        );
    };

    const fecharLeitor = () => {
        if (!bibleReader) {
            return;
        }

        bibleRequestId++;

        if (bibleRequestController) {
            bibleRequestController.abort();
            bibleRequestController = null;
        }

        bibleReader.classList.remove("active");
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

        readerResult.replaceChildren();

        const loading =
            document.createElement("div");

        loading.className =
            "reader-loading";

        const icon =
            document.createElement("i");

        icon.className =
            "fa-solid fa-spinner fa-spin";

        icon.setAttribute(
            "aria-hidden",
            "true"
        );

        const text =
            document.createElement("p");

        text.textContent =
            "Carregando a leitura...";

        loading.append(
            icon,
            text
        );

        readerResult.appendChild(
            loading
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
            safeText(bookSelect.value);

        const book =
            bookNames[code];

        const chapter =
            Number(chapterInput.value);

        if (!book) {
            mostrarErroBiblia(
                "Selecione um livro bíblico válido."
            );

            return;
        }

        if (
            !Number.isInteger(chapter) ||
            chapter < 1
        ) {
            mostrarErroBiblia(
                "Digite um número de capítulo válido."
            );

            return;
        }

        if (bibleRequestController) {
            bibleRequestController.abort();
        }

        const requestId =
            ++bibleRequestId;

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

        const controller =
            bibleRequestController;

        const timeoutId =
            window.setTimeout(
                () => {
                    controller.abort();
                },
                15000
            );

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
                        },
                        signal:
                            controller.signal
                    }
                );

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}`
                );
            }

            const data =
                await response.json();

            if (requestId !== bibleRequestId) {
                return;
            }

            if (
                !Array.isArray(data?.verses) ||
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
                    `${safeText(verse.verse)} `;

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
            if (
                error?.name === "AbortError"
            ) {
                return;
            }

            if (requestId !== bibleRequestId) {
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

            if (
                requestId === bibleRequestId
            ) {
                bibleRequestController =
                    null;
            }
        }
    };

    bookSelect?.addEventListener(
        "change",
        () => {
            if (chapterInput) {
                chapterInput.value = "1";
            }
        }
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

    bibleReader?.addEventListener(
        "click",
        (event) => {
            if (
                event.target === bibleReader
            ) {
                fecharLeitor();
            }
        }
    );


    /* ========================================================
       CALENDÁRIO SEMANAL
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

        let calendarDate =
            new Date();

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
                    String(
                        inicio.getFullYear()
                    );
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

                    card.dataset.date =
                        [
                            date.getFullYear(),
                            String(
                                date.getMonth() + 1
                            ).padStart(2, "0"),
                            String(
                                date.getDate()
                            ).padStart(2, "0")
                        ].join("-");

                    if (!container) {
                        return;
                    }

                    container.replaceChildren();

                    const eventosDoDia =
                        eventos.filter(
                            (evento) =>
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
       NOTÍCIAS — FOLHA GOSPEL
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
    let newsRequestId = 0;
    let newsRefreshTimer = null;

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

        if (
            noticias.length <= 1 ||
            isReducedMotion() ||
            document.hidden
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
                (point, index) => {
                    const active =
                        index === noticiaAtual;

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
            (_, index) => {
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
                        mostrarNoticia(index);
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

    const criarImagemSegura = (noticia) => {
        const imageBox =
            document.createElement(
                "div"
            );

        imageBox.className =
            "fg-imagem";

        const imageURL =
            safeText(noticia.imagem);

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
            },
            {
                once: true
            }
        );

        imageBox.appendChild(img);

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
            (index + noticias.length) %
            noticias.length;

        const noticia =
            noticias[noticiaAtual];

        const article =
            document.createElement(
                "article"
            );

        article.className =
            "fg-card";

        const imageBox =
            criarImagemSegura(noticia);

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
            ) || "FG News";

        const title =
            document.createElement(
                "h2"
            );

        title.textContent =
            safeText(
                noticia.titulo
            ) || "Notícia";

        const description =
            document.createElement(
                "p"
            );

        description.textContent =
            safeText(
                noticia.descricao
            ) || "Confira esta notícia.";

        const date =
            document.createElement(
                "span"
            );

        date.className =
            "fg-data";

        date.textContent =
            safeText(
                noticia.data
            ) || "Folha Gospel";

        const link =
            document.createElement(
                "a"
            );

        link.className =
            "fg-ler";

        link.href =
            safeText(noticia.link) ||
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

    const extrairTexto = (html) => {
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
        if (newsRequestController) {
            newsRequestController.abort();
        }

        const requestId =
            ++newsRequestId;

        const controller =
            new AbortController();

        newsRequestController =
            controller;

        noticias =
            [...noticiasPadrao];

        noticiaAtual = 0;

        criarPontos();
        mostrarNoticia();

        const timeoutId =
            window.setTimeout(
                () => {
                    controller.abort();
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
                        method: "GET",
                        cache: "no-store",
                        headers: {
                            Accept:
                                "application/json"
                        },
                        signal:
                            controller.signal
                    }
                );

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}`
                );
            }

            const data =
                await response.json();

            if (requestId !== newsRequestId) {
                return;
            }

            if (
                !Array.isArray(data?.items) ||
                !data.items.length
            ) {
                throw new Error(
                    "Feed vazio."
                );
            }

            const novas =
                data.items
                    .map((item) => {
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
                    })
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

            if (
                requestId === newsRequestId
            ) {
                newsRequestController =
                    null;
            }

            iniciarNoticias();
        }
    };

    if (noticiaContainer) {
        carregarNoticias();

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
    ).forEach((iframe) => {
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

    $$("a[target='_blank']").forEach(
        (link) => {
            const rel =
                link.getAttribute("rel") ||
                "";

            const tokens =
                rel
                    .split(/\s+/)
                    .filter(Boolean);

            if (!tokens.includes("noopener")) {
                tokens.push("noopener");
            }

            if (!tokens.includes("noreferrer")) {
                tokens.push("noreferrer");
            }

            link.setAttribute(
                "rel",
                tokens.join(" ")
            );
        }
    );


    /* ========================================================
       HERO — VÍDEOS EM LOOP
    ======================================================== */

    const heroVideos =
        $$(".hero-video-item");

    const heroVideoSection =
        $(".hero-video");

    const videoProgress =
        $(".video-progress");

    let videoAtual = 0;
    let videoProgressAnimation = null;
    let videoFallbackTimer = null;
    let videoInteractionHandler = null;

    const cancelarProgressoVideo = () => {
        if (videoProgressAnimation !== null) {
            cancelAnimationFrame(
                videoProgressAnimation
            );

            videoProgressAnimation = null;
        }
    };

    const limparFallbackVideo = () => {
        if (videoFallbackTimer !== null) {
            window.clearTimeout(
                videoFallbackTimer
            );

            videoFallbackTimer = null;
        }
    };

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

    const iniciarProgressoVideo = (
        video
    ) => {
        if (!videoProgress) {
            return;
        }

        cancelarProgressoVideo();

        videoProgress.style.width =
            "0%";

        const atualizar = () => {
            if (
                !video ||
                !Number.isFinite(
                    video.duration
                ) ||
                video.duration <= 0
            ) {
                videoProgressAnimation = null;
                return;
            }

            const porcentagem =
                Math.min(
                    100,
                    Math.max(
                        0,
                        (
                            video.currentTime /
                            video.duration
                        ) * 100
                    )
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
            } else {
                videoProgressAnimation =
                    null;
            }
        };

        atualizar();
    };

    const pausarTodosVideos = () => {
        heroVideos.forEach(
            (video) => {
                video.pause();
            }
        );
    };

    const reproduzirVideo = async (
        video
    ) => {
        if (!video) {
            return false;
        }

        limparFallbackVideo();

        video.muted = true;
        video.playsInline = true;

        try {
            await video.play();

            iniciarProgressoVideo(
                video
            );

            return true;

        } catch (error) {
            console.warn(
                "Autoplay do vídeo bloqueado:",
                error
            );

            return false;
        }
    };

    const proximoVideo = async () => {
        if (!heroVideos.length) {
            return;
        }

        limparFallbackVideo();
        cancelarProgressoVideo();

        const atual =
            heroVideos[videoAtual];

        if (atual) {
            atual.pause();

            try {
                atual.currentTime = 0;
            } catch {
                // O navegador pode impedir a alteração neste momento.
            }
        }

        const proximoIndex =
            (
                videoAtual + 1
            ) % heroVideos.length;

        mostrarVideo(
            proximoIndex
        );

        const proximo =
            heroVideos[proximoIndex];

        if (!proximo) {
            return;
        }

        proximo.muted = true;
        proximo.playsInline = true;

        try {
            proximo.currentTime = 0;
        } catch {
            // Ignora.
        }

        const reproduziu =
            await reproduzirVideo(
                proximo
            );

        /*
         * Se o vídeo não conseguir iniciar,
         * tenta avançar automaticamente.
         */
        if (!reproduziu) {
            videoFallbackTimer =
                window.setTimeout(
                    () => {
                        proximoVideo();
                    },
                    1000
                );
            return;
        }

        /*
         * Fallback de segurança:
         * caso o evento "ended" não seja disparado,
         * usa a duração do vídeo.
         */
        if (
            Number.isFinite(
                proximo.duration
            ) &&
            proximo.duration > 0
        ) {
            videoFallbackTimer =
                window.setTimeout(
                    () => {
                        if (
                            proximo ===
                            heroVideos[videoAtual]
                        ) {
                            proximoVideo();
                        }
                    },
                    (
                        proximo.duration * 1000
                    ) + 500
                );
        }
    };

    heroVideos.forEach(
        (video, index) => {
            video.muted = true;
            video.playsInline = true;

            video.setAttribute(
                "preload",
                index === 0
                    ? "auto"
                    : "metadata"
            );

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

            video.addEventListener(
                "pause",
                () => {
                    cancelarProgressoVideo();
                }
            );

            video.addEventListener(
                "error",
                () => {
                    if (
                        index ===
                        videoAtual
                    ) {
                        proximoVideo();
                    }
                }
            );
        }
    );

    const iniciarVideosHero = async () => {
        if (!heroVideos.length) {
            return;
        }

        mostrarVideo(0);

        const primeiro =
            heroVideos[0];

        pausarTodosVideos();

        primeiro.muted = true;
        primeiro.playsInline = true;

        try {
            primeiro.currentTime = 0;
        } catch {
            // Ignora.
        }

        const reproduziu =
            await reproduzirVideo(
                primeiro
            );

        if (!reproduziu) {
            /*
             * Remove listeners antigos antes
             * de registrar a tentativa de interação.
             */
            if (videoInteractionHandler) {
                document.removeEventListener(
                    "click",
                    videoInteractionHandler
                );

                document.removeEventListener(
                    "touchstart",
                    videoInteractionHandler
                );
            }

            videoInteractionHandler =
                async () => {
                    const sucesso =
                        await reproduzirVideo(
                            primeiro
                        );

                    if (sucesso) {
                        document.removeEventListener(
                            "click",
                            videoInteractionHandler
                        );

                        document.removeEventListener(
                            "touchstart",
                            videoInteractionHandler
                        );

                        videoInteractionHandler =
                            null;
                    }
                };

            document.addEventListener(
                "click",
                videoInteractionHandler,
                {
                    passive: true
                }
            );

            document.addEventListener(
                "touchstart",
                videoInteractionHandler,
                {
                    passive: true
                }
            );
        }

        /*
         * Fallback caso o "ended" não aconteça.
         */
        if (
            Number.isFinite(
                primeiro.duration
            ) &&
            primeiro.duration > 0
        ) {
            limparFallbackVideo();

            videoFallbackTimer =
                window.setTimeout(
                    () => {
                        if (
                            primeiro ===
                            heroVideos[videoAtual]
                        ) {
                            proximoVideo();
                        }
                    },
                    (
                        primeiro.duration * 1000
                    ) + 500
                );
        }
    };

    if (heroVideoSection && heroVideos.length) {
        iniciarVideosHero();
    }


    /* ========================================================
       IMAGENS
    ======================================================== */

    $$("img").forEach(
        (image, index) => {
            if (!image.decoding) {
                image.decoding =
                    "async";
            }

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

    $$("a[href^='#']").forEach(
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

                    target.scrollIntoView({
                        behavior:
                            isReducedMotion()
                                ? "auto"
                                : "smooth",
                        block:
                            "start"
                    });

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

    const atualizarMovimento = (
        reduced
    ) => {
        if (reduced) {
            pararSlider();
            pararNoticias();
            cancelarProgressoVideo();
        } else {
            iniciarSlider();
            iniciarNoticias();

            const video =
                heroVideos[videoAtual];

            if (
                video &&
                !video.paused
            ) {
                iniciarProgressoVideo(
                    video
                );
            }
        }
    };

    if (
        typeof prefersReducedMotion.addEventListener ===
        "function"
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
        typeof prefersReducedMotion.addListener ===
        "function"
    ) {
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

    document.addEventListener(
        "visibilitychange",
        () => {
            if (document.hidden) {
                pararSlider();
                pararNoticias();
                cancelarProgressoVideo();
                limparFallbackVideo();

                heroVideos.forEach(
                    (video) => {
                        video.pause();
                    }
                );

            } else {
                iniciarSlider();
                iniciarNoticias();

                const video =
                    heroVideos[videoAtual];

                if (video) {
                    reproduzirVideo(
                        video
                    );
                }
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

            cancelarProgressoVideo();
            limparFallbackVideo();

            if (
                newsRefreshTimer !== null
            ) {
                window.clearInterval(
                    newsRefreshTimer
                );

                newsRefreshTimer = null;
            }

            if (newsRequestController) {
                newsRequestController.abort();
                newsRequestController = null;
            }

            if (bibleRequestController) {
                bibleRequestController.abort();
                bibleRequestController = null;
            }

            heroVideos.forEach(
                (video) => {
                    video.pause();
                }
            );

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
