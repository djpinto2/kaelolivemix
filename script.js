document.addEventListener('DOMContentLoaded', function() {
  const menuIcon = document.querySelector('.menu-icon');
  const navUl = document.querySelector('nav ul');
  menuIcon.addEventListener('click', function() {
    navUl.classList.toggle('active');
  });
});

window.addEventListener('DOMContentLoaded', function() {
  const introGate = document.getElementById('intro-gate');
  const intro = document.getElementById('intro');
  const mainContent = document.getElementById('main-content');
  const audio = document.getElementById('intro-audio');

  // Ocultar intro y mostrar solo el gate al inicio
  intro.style.display = 'none';
  mainContent.style.display = 'none';
  if (introGate) introGate.style.display = 'flex';
  audio.muted = true; // Asegurar que el audio esté muteado al entrar al sitio

  // Al hacer click en el gate, mostrar intro y reproducir audio
  if (introGate) {
    introGate.addEventListener('click', function() {
      introGate.classList.add('fade-out');
      setTimeout(() => {
        introGate.style.display = 'none';
        intro.style.display = 'flex';
        playIntroAudio();
        audio.muted = false; // Quitar mute inmediatamente tras el clic
        // Detener música y mostrar contenido principal después de 7.5 segundos
        setTimeout(() => {
          audio.pause();
          audio.currentTime = 0;
          intro.classList.add('fade-out');
          setTimeout(() => {
            intro.style.display = 'none';
            mainContent.style.display = 'block';
            // Mostrar la sidebar y el botón de menú después de la intro
            const sidebar = document.getElementById('sidebar');
            if (sidebar) sidebar.style.display = '';
            const sidebarToggle = document.getElementById('sidebar-toggle');
            if (sidebarToggle) sidebarToggle.style.display = '';
          }, 1200);
        }, 7500);
      }, 1200); // Espera a que termine el fade-out del intro-gate
    });
  }

  // Función para reproducir el audio de la intro
  function playIntroAudio() {
    audio.muted = true; // Iniciar en mute para autoplay
    audio.currentTime = 4;
    audio.volume = 1.0;
    audio.play();
  }

  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const menuItems = document.querySelectorAll('.sidebar-menu li');
  const pageContent = document.getElementById('page-content');

  // Función para cargar sección
  function loadSection(section) {
    let file = '';
    switch(section) {
      case 'about': file = 'about.html'; break;
      case 'genres': file = 'genres.html'; break;
      case 'clubs': file = 'clubs.html'; break;
      case 'contact': file = 'contact.html'; break;
      case 'gallery': file = 'gallery.html'; break;
      case 'videos': file = 'videos.html'; break;
      case 'contactme': file = 'contactme.html'; break;
      case 'seeclubs': file = 'seeclubs.html'; break;
      case 'spotify': file = 'spotify.html'; break;
      case 'curso': file = 'curso.html'; break;
      default: file = 'about.html';
    }
    // Loader animado
    pageContent.innerHTML = `<div class='loader'><span class='loader-dot'></span><span class='loader-dot'></span><span class='loader-dot'></span></div>`;
    fetch(file)
      .then(res => res.text())
      .then(html => {
        pageContent.innerHTML = html;
        if (section === 'about') initLoginPanel();
      });
  }

  // Sidebar toggle para sidebar moderna
  const modernSidebar = document.querySelector('.sidebar.sidebar-modern');
  if (sidebarToggle && modernSidebar) {
    // Click: abrir/cerrar sidebar en cualquier dispositivo
    sidebarToggle.addEventListener('click', function() {
      modernSidebar.classList.toggle('open');
      // Overlay en móvil
      if (window.innerWidth <= 800) {
        if (modernSidebar.classList.contains('open')) {
          mainContent.classList.add('sidebar-overlay');
        } else {
          mainContent.classList.remove('sidebar-overlay');
        }
      }
    });
    // Hover: abrir sidebar en desktop
    sidebarToggle.addEventListener('mouseenter', function() {
      if (window.innerWidth > 800) modernSidebar.classList.add('open');
    });
    modernSidebar.addEventListener('mouseleave', function() {
      if (window.innerWidth > 800) modernSidebar.classList.remove('open');
    });
  }

  menuItems.forEach(item => {
    item.addEventListener('click', function() {
      // Animación de click
      item.classList.add('clicked');
      setTimeout(() => item.classList.remove('clicked'), 220);
      // Resaltar activo
      menuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      // Cargar sección
      const sectionId = item.getAttribute('data-section');
      loadSection(sectionId);
      // Cerrar barra en mobile y quitar overlay
      if(window.innerWidth <= 800 && modernSidebar) {
        modernSidebar.classList.remove('open');
        mainContent.classList.remove('sidebar-overlay');
      }
    });
  });
  // Por defecto, resaltar About y cargarlo
  menuItems[0].classList.add('active');
  loadSection('about');

  // Delegar clicks en enlaces internos con data-goto
  pageContent.addEventListener('click', function(e) {
    const link = e.target.closest('a[data-goto]');
    if (link) {
      e.preventDefault();
      const sectionId = link.getAttribute('data-goto');
      // Simular click en el menú lateral
      const menuItems = document.querySelectorAll('.sidebar-menu li');
      menuItems.forEach(item => {
        if (item.getAttribute('data-section') === sectionId) {
          item.click();
        }
      });
    }
  });

  // Top navbar SPA navigation
  const topNavbarLinks = document.querySelectorAll('.top-navbar-link');
  topNavbarLinks.forEach(link => {
    link.addEventListener('click', function() {
      // Resaltar activo
      topNavbarLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      // Simular click en el menú lateral
      const sectionId = link.getAttribute('data-section');
      const menuItems = document.querySelectorAll('.sidebar-menu li');
      menuItems.forEach(item => {
        if (item.getAttribute('data-section') === sectionId) {
          item.click();
        }
      });
    });
  });
  // Sincronizar barra superior con barra lateral
  menuItems.forEach(item => {
    item.addEventListener('click', function() {
      topNavbarLinks.forEach(l => l.classList.remove('active'));
      const sectionId = item.getAttribute('data-section');
      topNavbarLinks.forEach(link => {
        if (link.getAttribute('data-section') === sectionId) {
          link.classList.add('active');
        }
      });
    });
  });

  // Interactividad para videos en la sección Videos
  function setupInteractiveVideos() {
    const videos = document.querySelectorAll('.interactive-video');
    videos.forEach(video => {
      video.muted = true;
      video.autoplay = true;
      video.loop = true;
      video.play();
      video.addEventListener('mouseenter', () => {
        // Mutear todos los demás videos
        videos.forEach(v => { if (v !== video) v.muted = true; });
        video.muted = false;
      });
      video.addEventListener('mouseleave', () => {
        video.muted = true;
      });
      video.addEventListener('click', () => {
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      });
    });
  }
  // Llamar a la función cada vez que se carga la sección de videos
  const observer = new MutationObserver(() => {
    if (document.querySelector('.videos-gallery')) {
      setupInteractiveVideos();
    }
  });
  observer.observe(pageContent, { childList: true, subtree: true });

  // --- LOGIN PANEL LOGIC ---
  function initLoginPanel() {
    const loginPanel = document.getElementById('login-panel');
    const registerPanel = document.getElementById('register-panel');
    // --- LOGIN ---
    if (loginPanel) {
      const loginBtn = document.getElementById('login-btn');
      const loginUser = document.getElementById('login-user');
      const loginPass = document.getElementById('login-pass');
      const loginError = document.getElementById('login-error');
      loginBtn.addEventListener('click', function() {
        const user = loginUser.value.trim();
        const pass = loginPass.value.trim();
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const found = users.find(u => u.user === user && u.pass === pass);
        if (found) {
          // Guardar sesión persistente
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userMail', found.mail);
          loginPanel.style.display = 'none';
          if (registerPanel) registerPanel.style.display = 'none';
          addCursoSidebar();
          loadSection('curso');
        } else {
          loginError.textContent = 'Usuario o contraseña incorrectos o no registrado';
        }
      });
    }
    // --- REGISTRO ---
    if (registerPanel) {
      const registerBtn = document.getElementById('register-btn');
      const registerUser = document.getElementById('register-user');
      const registerPass = document.getElementById('register-pass');
      const registerMail = document.getElementById('register-mail');
      const registerError = document.getElementById('register-error');
      const registerSuccess = document.getElementById('register-success');
      // Mostrar panel de registro al hacer click en el enlace
      const showRegister = document.getElementById('show-register');
      if (showRegister && loginPanel) {
        showRegister.addEventListener('click', function(e) {
          e.preventDefault();
          registerPanel.style.display = 'flex';
          loginPanel.style.display = 'none';
        });
      }
      registerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const user = registerUser.value.trim();
        const pass = registerPass.value.trim();
        const mail = registerMail.value.trim();
        const payment = document.getElementById('register-payment').value;
        registerError.textContent = '';
        registerSuccess.textContent = '';
        if (!user || !pass || !mail || !payment) {
          registerError.textContent = 'Completa todos los campos y elige un método de pago';
          return;
        }
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(u => u.user === user)) {
          registerError.textContent = 'El usuario ya existe';
          return;
        }
        // Si es MercadoPago, primero redirigir y pedir confirmación antes de registrar
        if (payment === 'mercadopago') {
          window.open('https://mpago.la/11JWS5Y', '_blank');
          const pageContent = document.getElementById('page-content');
          if (pageContent) {
            pageContent.innerHTML = `<div style='max-width:420px;margin:48px auto;padding:36px 28px;background:rgba(24,24,24,0.97);border-radius:18px;box-shadow:0 4px 32px #ff910044,0 1.5px 8px #000a;text-align:center;'>
              <h3 style='color:#ff9100;font-family:Poppins,sans-serif;'>Confirma tu pago</h3>
              <p style='color:#fff;font-size:1.1em;margin-bottom:24px;'>Por favor, realiza el pago mediante <b>MercadoPago</b> en la pestaña que se abrió.<br>Cuando hayas terminado, haz clic en el botón de abajo para completar tu registro y acceder al curso.</p>
              <button id='confirm-payment-btn' style='background:#ff9100;color:#181818;font-weight:700;font-size:1.1em;padding:12px 32px;border:none;border-radius:8px;cursor:pointer;'>Ya realicé el pago</button>
            </div>`;
            document.getElementById('confirm-payment-btn').addEventListener('click', function() {
              users.push({ user, pass, mail, payment });
              localStorage.setItem('users', JSON.stringify(users));
              registerUser.value = '';
              registerPass.value = '';
              registerMail.value = '';
              document.getElementById('register-payment').selectedIndex = 0;
              registerPanel.style.display = 'none';
              // Agregar ítem de Curso a la sidebar si no existe
              addCursoSidebar();
              // Navegar a la página de curso
              const menuItems = document.querySelectorAll('.sidebar-menu li');
              let foundCurso = false;
              menuItems.forEach(item => {
                if (item.getAttribute('data-section') === 'curso') {
                  item.click();
                  foundCurso = true;
                }
              });
              if (!foundCurso) {
                loadSection('curso');
              }
            });
          }
          return;
        }
        // Para otros métodos de pago, registro y acceso inmediato
        users.push({ user, pass, mail, payment });
        localStorage.setItem('users', JSON.stringify(users));
        registerUser.value = '';
        registerPass.value = '';
        registerMail.value = '';
        document.getElementById('register-payment').selectedIndex = 0;
        registerPanel.style.display = 'none';
        // Agregar ítem de Curso a la sidebar si no existe
        addCursoSidebar();
        // Navegar a la página de curso
        const menuItems = document.querySelectorAll('.sidebar-menu li');
        let foundCurso = false;
        menuItems.forEach(item => {
          if (item.getAttribute('data-section') === 'curso') {
            item.click();
            foundCurso = true;
          }
        });
        if (!foundCurso) {
          loadSection('curso');
        }
      });
    }
  }

  // Función reutilizable para agregar el ítem de curso a la sidebar
  function addCursoSidebar() {
    const sidebarMenu = document.querySelector('.sidebar-menu');
    if (sidebarMenu && !sidebarMenu.querySelector('li[data-section="curso"]')) {
      const li = document.createElement('li');
      li.setAttribute('data-section', 'curso');
      li.style.position = 'relative';
      li.innerHTML = `<span class=\"sidebar-icon\"> 
        <svg width=\"24\" height=\"24\" fill=\"none\" stroke=\"#181818\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" viewBox=\"0 0 24 24\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\" fill=\"#181818\"/><path d=\"M16 2v4M8 2v4\" stroke=\"#fff\"/><path d=\"M12 12h4\" stroke=\"#fff\"/><path d=\"M12 16h4\" stroke=\"#fff\"/></svg> 
      </span><span class=\"sidebar-label\">Curso</span>`;
      // Submenú de clases
      const submenu = document.createElement('ul');
      submenu.className = 'curso-submenu';
      submenu.style.position = 'absolute';
      submenu.style.left = '100%';
      submenu.style.top = '0';
      submenu.style.background = 'rgba(24,24,24,0.98)';
      submenu.style.borderRadius = '12px';
      submenu.style.boxShadow = '0 4px 24px #ff910044';
      submenu.style.padding = '10px 0';
      submenu.style.margin = '0';
      submenu.style.display = 'none';
      submenu.style.minWidth = '160px';
      submenu.style.zIndex = '10010';
      const clases = [
        { id: 'clase1', label: 'Clase 1: Introducción' },
        { id: 'clase2', label: 'Clase 2: Técnicas' }
      ];
      clases.forEach(clase => {
        const subLi = document.createElement('li');
        subLi.textContent = clase.label;
        subLi.style.color = '#fff';
        subLi.style.padding = '10px 18px';
        subLi.style.cursor = 'pointer';
        subLi.style.fontFamily = "'Poppins',sans-serif";
        subLi.style.fontSize = '1em';
        subLi.style.transition = 'background 0.2s, color 0.2s';
        subLi.addEventListener('mouseenter', () => {
          subLi.style.background = '#ff9100';
          subLi.style.color = '#181818';
        });
        subLi.addEventListener('mouseleave', () => {
          subLi.style.background = 'none';
          subLi.style.color = '#fff';
        });
        subLi.addEventListener('click', function(e) {
          e.stopPropagation();
          loadSection('curso');
          setTimeout(() => {
            const el = document.getElementById(clase.id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 400);
          if(window.innerWidth <= 800) {
            const modernSidebar = document.querySelector('.sidebar.sidebar-modern');
            const mainContent = document.getElementById('main-content');
            if (modernSidebar) modernSidebar.classList.remove('open');
            if (mainContent) mainContent.classList.remove('sidebar-overlay');
          }
        });
        submenu.appendChild(subLi);
      });
      li.appendChild(submenu);
      li.addEventListener('mouseenter', function() { submenu.style.display = 'block'; });
      li.addEventListener('mouseleave', function() { submenu.style.display = 'none'; });
      li.addEventListener('click', function() {
        li.classList.add('clicked');
        setTimeout(() => li.classList.remove('clicked'), 220);
        document.querySelectorAll('.sidebar-menu li').forEach(i => i.classList.remove('active'));
        li.classList.add('active');
        loadSection('curso');
        if(window.innerWidth <= 800) {
          const modernSidebar = document.querySelector('.sidebar.sidebar-modern');
          const mainContent = document.getElementById('main-content');
          if (modernSidebar) modernSidebar.classList.remove('open');
          if (mainContent) mainContent.classList.remove('sidebar-overlay');
        }
      });
      sidebarMenu.appendChild(li);
    }
  }
});

window.addEventListener('DOMContentLoaded', async function() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const userMail = localStorage.getItem('userMail');
  if (isLoggedIn && userMail) {
    // Chequea con el backend si el usuario pagó
    const res = await fetch('http://localhost:3001/api/check-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mail: userMail })
    });
    const data = await res.json();
    if (data.paid) {
      addCursoSidebar();
      loadSection('curso');
      // (Opcional: oculta paneles de login/registro si están visibles)
    } else {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userMail');
    }
  }
});