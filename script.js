document.addEventListener('DOMContentLoaded', () => {
    const guestFinder = document.getElementById('guest-finder');
    const invitationContent = document.getElementById('invitation-content');
    const searchInput = document.getElementById('guest-search-input');
    const searchButton = document.getElementById('search-button');
    const errorMessage = document.getElementById('error-message');
    
    let guests = [];

    // 1. Cargar datos de invitados desde JSON
    fetch('guests.json')
        .then(response => response.json())
        .then(data => {
            guests = data;
        })
        .catch(error => {
            console.error('Error fetching guests.json:', error);
            errorMessage.textContent = 'El sistema de invitaciones no está disponible momentáneamente.';
        });

    // 2. Buscar al invitado y mostrar la invitación
    const findAndDisplayInvitation = () => {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            errorMessage.textContent = 'Por favor, introduce tu nombre.';
            return;
        }

        const foundGuest = guests.find(guest => guest.name.toLowerCase() === query);

        if (foundGuest) {
            personalizeInvitation(foundGuest);

            guestFinder.style.transition = 'opacity 0.7s ease-out';
            guestFinder.style.opacity = '0';
            setTimeout(() => {
                guestFinder.style.display = 'none';
                invitationContent.style.display = 'block';
                window.getComputedStyle(invitationContent).opacity; 
            }, 700);
            
        } else {
            errorMessage.textContent = "No pudimos encontrar tu nombre. Por favor, revisa la ortografía.";
        }
    };

    // 3. Rellenar detalles específicos del invitado Y CREAR EL ENLACE DE WHATSAPP
    const personalizeInvitation = (guest) => {
        // --- Texto de bienvenida (sin cambios) ---
        document.getElementById('guest-name').textContent = `Estimado/a ${guest.name}`;
        const passesText = guest.passes > 1 ? `${guest.passes} personas` : `1 persona`;
        document.getElementById('guest-passes').textContent = passesText;

        // --- ¡NUEVA LÓGICA PARA WHATSAPP! ---
        const whatsAppButton = document.getElementById('whatsapp-link');

        // ¡¡IMPORTANTE!! Cambia este número por tu número de teléfono real (incluyendo el código de país).
        const phoneNumber = '+50588174264'; 
        
        // Creamos el mensaje personalizado con el nombre del invitado.
        const rawMessage = `¡Hola! Soy ${guest.name} y me gustaría confirmar mi asistencia (${passesText}) a la boda. ¡Muchas gracias!`;
        
        // Codificamos el mensaje para que funcione correctamente en una URL (convierte espacios a %20, etc.)
        const encodedMessage = encodeURIComponent(rawMessage);

        // Construimos la URL final de WhatsApp
        const finalUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

        // Asignamos la URL personalizada al botón
        whatsAppButton.href = finalUrl;
        
        // Iniciar el contador (sin cambios)
        setupCountdown();
    };

    // 4. Lógica del contador (sin cambios)
    const setupCountdown = () => {
        const weddingDate = new Date("October 26, 2025 16:00:00").getTime();
        const countdownElement = document.getElementById('countdown');

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            if (distance < 0) {
                clearInterval(interval);
                countdownElement.innerHTML = "<div>¡El gran día ha llegado!</div>";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownElement.innerHTML = `
                <div>${days}<span>Días</span></div>
                <div>${hours}<span>Horas</span></div>
                <div>${minutes}<span>Minutos</span></div>
                <div>${seconds}<span>Segundos</span></div>
            `;
        }, 1000);
    };
    
    // Event Listeners (sin cambios)
    searchButton.addEventListener('click', findAndDisplayInvitation);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            findAndDisplayInvitation();
        }
    });
});