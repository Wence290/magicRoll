/**
 * FORMULARIO DE CONTACTO - JAVASCRIPT INTERACTIVO
 * Maneja validación, animaciones y envío del formulario
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================
    // ELEMENTOS DEL DOM
    // ============================
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.submit-btn');
    const inputs = form.querySelectorAll('.form-control');
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    
    // ============================
    // VALIDACIÓN EN TIEMPO REAL
    // ============================
    
    // Función para validar email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Función para validar teléfono
    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
    
    // Validación individual de campos
    function validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        const isRequired = field.hasAttribute('required');
        
        // Limpiar clases previas
        field.classList.remove('is-valid', 'is-invalid');
        
        // Validar campo vacío requerido
        if (isRequired && !value) {
            field.classList.add('is-invalid');
            return false;
        }
        
        // Validaciones específicas por tipo
        switch (fieldType) {
            case 'email':
                if (value && !isValidEmail(value)) {
                    field.classList.add('is-invalid');
                    return false;
                }
                break;
                
            case 'tel':
                if (value && !isValidPhone(value)) {
                    field.classList.add('is-invalid');
                    return false;
                }
                break;
                
            case 'text':
                if (isRequired && value.length < 2) {
                    field.classList.add('is-invalid');
                    return false;
                }
                break;
                
            case 'textarea':
                if (isRequired && value.length < 10) {
                    field.classList.add('is-invalid');
                    return false;
                }
                break;
        }
        
        // Si llegamos aquí, el campo es válido
        if (value || !isRequired) {
            field.classList.add('is-valid');
        }
        return true;
    }
    
    // Agregar validación en tiempo real a todos los inputs
    inputs.forEach(input => {
        // Validación al perder el foco
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Validación al escribir (con debounce)
        let timeoutId;
        input.addEventListener('input', function() {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if (this.value.trim()) {
                    validateField(this);
                }
            }, 500);
        });
    });
    
    // ============================
    // EFECTOS VISUALES
    // ============================
    
    // Efecto de typing en el placeholder del textarea
    const textarea = document.getElementById('mensaje');
    const originalPlaceholder = textarea.placeholder;
    const typingTexts = [
        'Cuéntanos sobre tu proyecto...',
        'Necesito cortinas para motorhome...',
        'Busco proveedor para mi taller...',
        'Quiero cotizar para 5 unidades...',
        originalPlaceholder
    ];
    
    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    
    function typeEffect() {
        const currentText = typingTexts[currentTextIndex];
        
        if (textarea === document.activeElement) {
            // Si el usuario está escribiendo, parar el efecto
            return;
        }
        
        if (!isDeleting) {
            // Escribiendo
            textarea.placeholder = currentText.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            
            if (currentCharIndex === currentText.length) {
                isDeleting = true;
                setTimeout(typeEffect, 2000); // Pausa antes de borrar
                return;
            }
        } else {
            // Borrando
            textarea.placeholder = currentText.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            
            if (currentCharIndex === 0) {
                isDeleting = false;
                currentTextIndex = (currentTextIndex + 1) % typingTexts.length;
            }
        }
        
        setTimeout(typeEffect, isDeleting ? 50 : 100);
    }
    
    // Iniciar efecto de typing solo si el textarea no está enfocado
    textarea.addEventListener('focus', function() {
        this.placeholder = originalPlaceholder;
    });
    
    textarea.addEventListener('blur', function() {
        if (!this.value) {
            setTimeout(typeEffect, 1000);
        }
    });
    
    // Iniciar el efecto
    setTimeout(typeEffect, 2000);
    
    // ============================
    // ANIMACIONES DE INTERACCIÓN
    // ============================
    
    // Efecto ripple en las tarjetas de producto
    const productCards = document.querySelectorAll('.form-check-label');
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 2;
            `;
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Agregar animación CSS para el ripple
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // ============================
    // ENVÍO DEL FORMULARIO
    // ============================
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validar todos los campos
        let isFormValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            // Mostrar mensaje de error
            showNotification('Por favor, completa todos los campos correctamente.', 'error');
            
            // Scroll al primer campo inválido
            const firstInvalidField = form.querySelector('.is-invalid');
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                firstInvalidField.focus();
            }
            return;
        }
        
        // Mostrar estado de carga
        setLoadingState(true);
        
        try {
            // Recopilar datos del formulario
            const formData = new FormData(form);
            const data = {
                nombre: formData.get('nombre'),
                email: formData.get('email'),
                telefono: formData.get('telefono'),
                empresa: formData.get('empresa'),
                productos: formData.getAll('productos[]'),
                mensaje: formData.get('mensaje'),
                timestamp: new Date().toISOString()
            };
            
            // Simular envío (reemplazar con tu endpoint real)
            await simulateFormSubmission(data);
            
            // Mostrar mensaje de éxito
            showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
            
            // Limpiar formulario
            form.reset();
            inputs.forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
            });
            
            // Animar confirmación
            animateSuccess();
            
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            showNotification('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.', 'error');
        } finally {
            setLoadingState(false);
        }
    });
    
    // ============================
    // FUNCIONES AUXILIARES
    // ============================
    
    function setLoadingState(isLoading) {
        if (isLoading) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }
    
    function showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} notification-popup`;
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
                <span>${message}</span>
                <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
        `;
        
        // Estilos para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            max-width: 500px;
            border-radius: 0.75rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove después de 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    async function simulateFormSubmission(data) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Aquí iría tu lógica real de envío
        console.log('Datos del formulario:', data);
        
        // Para testing, puedes descomentar la siguiente línea para simular un error
        // throw new Error('Error simulado');
        
        return { success: true };
    }
    
    function animateSuccess() {
        // Crear confetti effect
        const colors = ['#2563eb', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                createConfetti(colors[Math.floor(Math.random() * colors.length)]);
            }, i * 20);
        }
    }
    
    function createConfetti(color) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${color};
            left: ${Math.random() * 100}vw;
            top: -10px;
            z-index: 9999;
            border-radius: 50%;
            animation: confetti-fall 3s linear forwards;
            pointer-events: none;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
    
    // Agregar animaciones CSS adicionales
    const additionalStyles = document.createElement('style');
    additionalStyles.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes confetti-fall {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
        
        .notification-popup {
            animation: slideInRight 0.3s ease-out;
        }
    `;
    document.head.appendChild(additionalStyles);
    
    // ============================
    // MEJORAS DE ACCESIBILIDAD
    // ============================
    
    // Navegación por teclado mejorada
    form.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            const formElements = [...form.querySelectorAll('input, textarea, button')].filter(el => !el.disabled);
            const currentIndex = formElements.indexOf(e.target);
            const nextElement = formElements[currentIndex + 1];
            
            if (nextElement) {
                nextElement.focus();
            } else {
                form.dispatchEvent(new Event('submit'));
            }
        }
    });
    
    console.log('🚀 Formulario de contacto inicializado correctamente');
});