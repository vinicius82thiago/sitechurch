const slides = document.querySelectorAll(".slide");

let current = 0;

function nextSlide(){

    slides[current].classList.remove("active");

    current++;

    if(current >= slides.length){
        current = 0;
    }

    slides[current].classList.add("active");
}

setInterval(nextSlide, 5000);