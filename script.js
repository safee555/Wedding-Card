/* ==========================================================
   Luxury Wedding Invitation
   script.js
========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const welcomePage = document.getElementById("welcomePage");
    const invitationPage = document.getElementById("invitationPage");
    const openButton = document.getElementById("openInvitation");

    /* -------------------------
       Open Invitation
    -------------------------- */

    if (openButton) {

        openButton.addEventListener("click", function () {

            welcomePage.style.opacity = "0";
            welcomePage.style.transform = "scale(.95)";

            setTimeout(function () {

                welcomePage.style.display = "none";

                invitationPage.style.display = "flex";

                invitationPage.style.opacity = "0";

                invitationPage.style.transform = "translateY(40px)";

                setTimeout(function () {

                    invitationPage.style.transition = "1s";

                    invitationPage.style.opacity = "1";

                    invitationPage.style.transform = "translateY(0)";

                    window.scrollTo({

                        top: 0,

                        behavior: "smooth"

                    });

                }, 100);

            }, 700);

        });

    }

    /* -------------------------
       Countdown Timer
    -------------------------- */

    const weddingDate = new Date("December 18, 2026 16:30:00").getTime();

    function updateCountdown() {

        const now = new Date().getTime();

        const difference = weddingDate - now;

        if (difference <= 0) {

            document.getElementById("days").innerHTML = "00";
            document.getElementById("hours").innerHTML = "00";
            document.getElementById("minutes").innerHTML = "00";
            document.getElementById("seconds").innerHTML = "00";

            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));

        const hours = Math.floor(

            (difference % (1000 * 60 * 60 * 24))

            / (1000 * 60 * 60)

        );

        const minutes = Math.floor(

            (difference % (1000 * 60 * 60))

            / (1000 * 60)

        );

        const seconds = Math.floor(

            (difference % (1000 * 60))

            / 1000

        );

        document.getElementById("days").innerHTML = String(days).padStart(2, "0");

        document.getElementById("hours").innerHTML = String(hours).padStart(2, "0");

        document.getElementById("minutes").innerHTML = String(minutes).padStart(2, "0");

        document.getElementById("seconds").innerHTML = String(seconds).padStart(2, "0");

    }

    updateCountdown();

    setInterval(updateCountdown, 1000);

    /* -------------------------
       Fade Animation on Scroll
    -------------------------- */

    const observer = new IntersectionObserver(function (entries) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {

                entry.target.classList.add("fade-up");

            }

        });

    }, {

        threshold: 0.15

    });

    document.querySelectorAll(

         ".event-box,.venue,.schedule,.dua-box,footer"

    ).forEach(function (element) {

        observer.observe(element);

    });

    /* -------------------------
       Button Hover Glow
    -------------------------- */

    if (openButton) {

        openButton.addEventListener("mouseenter", function () {

            openButton.classList.add("glow");

        });

        openButton.addEventListener("mouseleave", function () {

            openButton.classList.remove("glow");

        });

    }

    /* -------------------------
       Keyboard Shortcut
       Press Enter
    -------------------------- */

    document.addEventListener("keydown", function (e) {

        if (

            e.key === "Enter" &&

            welcomePage.style.display !== "none"

        ) {

            openButton.click();

        }

    });

    /* -------------------------
       Floating Stars
    -------------------------- */

    const stars = document.querySelector(".stars");

    if (stars) {

        let position = 0;

        setInterval(function () {

            position++;

            stars.style.backgroundPosition =

                "0 " + position + "px";

        }, 80);

    }

    /* -------------------------
       Floating Moon
    -------------------------- */

    const moon = document.querySelector(".moon");

    if (moon) {

        let angle = 0;

        setInterval(function () {

            angle += 0.03;

            moon.style.transform =

                "translateY(" +

                Math.sin(angle) * 8 +

                "px)";

        }, 20);

    }

    /* -------------------------
       Card Entrance
    -------------------------- */

    const card = document.querySelector(".card");

    if (card) {

        card.style.opacity = "0";

        card.style.transform = "scale(.95)";

        setTimeout(function () {

            card.style.transition = "1.2s";

            card.style.opacity = "1";

            card.style.transform = "scale(1)";

        }, 800);

    }

    /* -------------------------
       Scroll To Top
    -------------------------- */

    window.addEventListener("beforeunload", function () {

        window.scrollTo(0, 0);

    });

});

/* ==========================================
   Luxury Gold Dust Particles
========================================== */

const particleContainer = document.querySelector(".particles");

    if (particleContainer) {
        for (let i = 0; i < 120; i++) {
            const particle = document.createElement("span");

            const size = Math.random() * 3 + 1;

            particle.style.width = size + "px";
            particle.style.height = size + "px";
            particle.style.left = Math.random() * 100 + "vw";
            particle.style.top = Math.random() * 100 + "vh";

            particle.style.animationDuration = (18 + Math.random() * 25) + "s";
            particle.style.animationDelay = (-Math.random() * 40) + "s";
            particle.style.opacity = 0.2 + Math.random() * 0.8;

            particleContainer.appendChild(particle);
        }
    }

