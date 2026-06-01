const FORMSPREE = 'https://formspree.io/f/maqkzgdl'

// ─────────────────────────────────────────────────────────────
//  SERVICE DATA
// ─────────────────────────────────────────────────────────────
const SERVICES = {
  bicicletas: {
    number: '01',
    title: 'Taller de Bicicletas',
    intro: 'Reparamos bicicletas de ciudad, montaña y carretera de todas las marcas. Más de 8 años de experiencia y herramientas profesionales para una puesta a punto perfecta.',
    icon: `<svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="34" stroke="#39FF14" stroke-width="3"/><circle cx="40" cy="40" r="6" fill="#39FF14"/><line x1="40" y1="6" x2="40" y2="74" stroke="#39FF14" stroke-width="1.5" opacity="0.4"/><line x1="6" y1="40" x2="74" y2="40" stroke="#39FF14" stroke-width="1.5" opacity="0.4"/><line x1="11.5" y1="11.5" x2="68.5" y2="68.5" stroke="#39FF14" stroke-width="1.5" opacity="0.4"/><line x1="68.5" y1="11.5" x2="11.5" y2="68.5" stroke="#39FF14" stroke-width="1.5" opacity="0.4"/></svg>`,
    repairs: [
      { name: 'Reparación de pinchazo (rueda exterior)', price: 'Desde 5€' },
      { name: 'Cambio de cubierta / neumático',          price: 'Desde 12€' },
      { name: 'Cambio de cámara de aire',                price: 'Desde 8€' },
      { name: 'Ajuste o cambio de frenos',               price: 'Desde 15€' },
      { name: 'Ajuste o cambio de desviadores',          price: 'Desde 20€' },
      { name: 'Limpieza y lubricación completa',         price: 'Desde 25€' },
      { name: 'Puesta a punto básica',                   price: 'Desde 40€' },
      { name: 'Revisión completa + ajuste general',      price: 'Desde 65€' },
      { name: 'Cambio de transmisión completa',          price: 'Consultar' },
    ],
  },
  patinetes: {
    number: '02',
    title: 'Taller de Patinetes',
    intro: 'Especialistas en patinetes eléctricos de todas las marcas: Xiaomi, Cecotec, Ninebot, Kaabo y más. Diagnóstico electrónico con herramientas específicas para cada modelo.',
    icon: `<svg viewBox="0 0 80 80" fill="none"><rect x="14" y="35" width="52" height="8" rx="4" stroke="#39FF14" stroke-width="3"/><circle cx="22" cy="58" r="10" stroke="#39FF14" stroke-width="3"/><circle cx="58" cy="58" r="10" stroke="#39FF14" stroke-width="3"/><path d="M36 35V20H48V35" stroke="#39FF14" stroke-width="3" stroke-linecap="round"/><path d="M48 22H58" stroke="#39FF14" stroke-width="2.5" stroke-linecap="round"/></svg>`,
    repairs: [
      { name: 'Diagnóstico electrónico completo',        price: 'Desde 15€' },
      { name: 'Reparación o cambio de motor',            price: 'Desde 45€' },
      { name: 'Cambio de batería principal',             price: 'Desde 85€' },
      { name: 'Reparación de controlador (BMS)',         price: 'Desde 35€' },
      { name: 'Cambio de neumático / cámara',            price: 'Desde 18€' },
      { name: 'Ajuste o cambio de frenos',               price: 'Desde 15€' },
      { name: 'Cambio de display / pantalla',            price: 'Desde 30€' },
      { name: 'Actualización o modificación firmware',   price: 'Desde 20€' },
      { name: 'Revisión completa',                       price: 'Desde 55€' },
    ],
  },
  electrificacion: {
    number: '03',
    title: 'Electrificación de Bicis',
    intro: 'Transforma tu bici convencional en una eléctrica personalizada. Te asesoramos en la elección del kit según tu bici, tipo de uso y presupuesto. Instalación profesional con garantía.',
    icon: `<svg viewBox="0 0 80 80" fill="none"><path d="M44 10L20 44H38L36 70L60 36H42L44 10Z" stroke="#39FF14" stroke-width="3" stroke-linejoin="round"/></svg>`,
    repairs: [
      { name: 'Kit motor buje trasero 250W (básico)',    price: 'Desde 350€' },
      { name: 'Kit motor buje trasero 500W (premium)',   price: 'Desde 550€' },
      { name: 'Kit motor central 250W (mid-drive)',      price: 'Desde 650€' },
      { name: 'Kit motor central 500W (mid-drive)',      price: 'Desde 850€' },
      { name: 'Batería 36V 10Ah adicional',              price: 'Desde 200€' },
      { name: 'Display LCD / TFT + configuración',       price: 'Incluido en kit' },
      { name: 'Mano de obra e instalación',              price: 'Incluida en kit' },
      { name: 'Asesoramiento personalizado',             price: 'Gratuito' },
    ],
  },
}

// ─────────────────────────────────────────────────────────────
//  BOOKING MODAL
// ─────────────────────────────────────────────────────────────
export function initModal() {
  const overlay       = document.getElementById('booking-modal')
  const closeBtn      = document.getElementById('modal-close')
  const form          = document.getElementById('booking-form')
  const successPanel  = document.getElementById('modal-success')
  const serviceSelect = document.getElementById('f-service')

  if (!overlay) return

  function openBookingModal(presetService = '') {
    if (presetService && serviceSelect) serviceSelect.value = presetService

    // Always reset to form view — use style.display (not hidden attr)
    // so the CSS display:flex on .modal-success never leaks through
    if (successPanel) successPanel.style.display = 'none'
    if (form)         form.style.display = ''

    // Clear any stale error
    const errEl = document.getElementById('booking-error')
    if (errEl) { errEl.textContent = ''; errEl.style.display = 'none' }

    // Reset validation highlights
    form?.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'))

    // Re-enable submit button if it was disabled from a previous attempt
    const btn = form?.querySelector('[type="submit"]')
    if (btn) { btn.disabled = false; const s = btn.querySelector('span'); if (s) s.textContent = 'Enviar solicitud' }

    overlay.classList.add('open')
    document.body.style.overflow = 'hidden'

    setTimeout(() => {
      overlay.querySelector('input:not([type="date"]), select')?.focus()
    }, 350)
  }

  function closeBookingModal() {
    overlay.classList.remove('open')
    document.body.style.overflow = ''
  }

  // Wire [data-open-modal] triggers (booking CTA, service reserve buttons, etc.)
  document.querySelectorAll('[data-open-modal]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault()
      e.stopPropagation()   // prevent bubbling into service-detail card handler
      openBookingModal(el.dataset.service || '')
    })
  })

  closeBtn?.addEventListener('click', closeBookingModal)
  overlay.addEventListener('click', e => { if (e.target === overlay) closeBookingModal() })
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeBookingModal()
  })

  // ── Form submit ──
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault()

      // Clear previous validation state
      form.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'))
      const errorMessage = document.getElementById('booking-error')
      if (errorMessage) { errorMessage.textContent = ''; errorMessage.style.display = 'none' }

      // Validate required fields
      const nameField    = form.querySelector('[name="name"]')
      const phoneField   = form.querySelector('[name="phone"]')
      const serviceField = form.querySelector('[name="service"]')
      const dateField    = form.querySelector('[name="date"]')

      let valid = true
      if (!nameField?.value.trim())  { nameField.closest('.form-group').classList.add('has-error');    valid = false }
      if (!phoneField?.value.trim()) { phoneField.closest('.form-group').classList.add('has-error');   valid = false }
      if (!serviceField?.value)      { serviceField.closest('.form-group').classList.add('has-error'); valid = false }
      if (!dateField?.value)         { dateField.closest('.form-group').classList.add('has-error');    valid = false }

      if (!valid) {
        form.querySelector('.form-group.has-error')?.querySelector('input, select')?.focus()
        return
      }

      // Disable submit while sending
      const submitBtn  = form.querySelector('[type="submit"]')
      const submitSpan = submitBtn?.querySelector('span')
      if (submitBtn)  submitBtn.disabled = true
      if (submitSpan) submitSpan.textContent = 'Enviando…'

      // Collect data — exact field names Formspree will receive
      const data = {
        name:    nameField.value,
        phone:   phoneField.value,
        service: serviceField.value,
        date:    dateField.value,
        message: form.querySelector('[name="message"]') ? form.querySelector('[name="message"]').value : ''
      }

      try {
        const response = await fetch(FORMSPREE, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })

        if (response.ok) {
          form.reset()
          form.style.display = 'none'
          successPanel.style.display = 'flex'   // reveal success panel
          setTimeout(closeBookingModal, 5000)
        } else {
          if (errorMessage) {
            errorMessage.textContent = 'Error al enviar. Llámanos al 952 02 48 05'
            errorMessage.style.display = 'block'
          }
          if (submitBtn)  submitBtn.disabled = false
          if (submitSpan) submitSpan.textContent = 'Enviar solicitud'
        }
      } catch(err) {
        if (errorMessage) {
          errorMessage.textContent = 'Error al enviar. Llámanos al 952 02 48 05'
          errorMessage.style.display = 'block'
        }
        if (submitBtn)  submitBtn.disabled = false
        if (submitSpan) submitSpan.textContent = 'Enviar solicitud'
      }
    })

    // Clear field error as soon as user corrects it
    form.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('input',  () => el.closest('.form-group')?.classList.remove('has-error'))
      el.addEventListener('change', () => el.closest('.form-group')?.classList.remove('has-error'))
    })
  }

  // Expose opener so service modal can call it
  return { openBookingModal }
}

// ─────────────────────────────────────────────────────────────
//  SERVICE DETAIL MODAL
// ─────────────────────────────────────────────────────────────
export function initServiceModal(bookingApi) {
  const overlay    = document.getElementById('service-modal')
  const closeBtn   = document.getElementById('service-modal-close')
  const titleEl    = document.getElementById('svc-modal-title')
  const numberEl   = document.getElementById('svc-number')
  const iconEl     = document.getElementById('svc-icon')
  const introEl    = document.getElementById('svc-intro')
  const listEl     = document.getElementById('svc-repairs-list')
  const reserveBtn = document.getElementById('svc-reserve-btn')

  if (!overlay) return

  function openServiceModal(serviceKey) {
    const data = SERVICES[serviceKey]
    if (!data) return

    // Populate content
    numberEl.textContent = data.number
    iconEl.innerHTML     = data.icon
    titleEl.textContent  = data.title
    introEl.textContent  = data.intro

    listEl.innerHTML = data.repairs.map(r => `
      <li>
        <span class="svc-repair-name">${r.name}</span>
        <span class="svc-repair-price">${r.price}</span>
      </li>
    `).join('')

    // Wire the reserve button to open booking modal with correct service
    if (reserveBtn) reserveBtn.dataset.service = serviceKey

    overlay.classList.add('open')
    document.body.style.overflow = 'hidden'
  }

  function closeServiceModal() {
    overlay.classList.remove('open')
    document.body.style.overflow = ''
  }

  // Service card click — whole card opens service detail
  // Skip if the click target is a booking button (it has data-open-modal)
  document.querySelectorAll('[data-open-service]').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('[data-open-modal]')) return
      openServiceModal(card.dataset.openService)
    })
    // Keyboard a11y
    card.setAttribute('role', 'button')
    card.setAttribute('tabindex', '0')
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        openServiceModal(card.dataset.openService)
      }
    })
  })

  closeBtn?.addEventListener('click', closeServiceModal)
  overlay.addEventListener('click', e => { if (e.target === overlay) closeServiceModal() })
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeServiceModal()
  })

  // The "Reservar" button inside the service modal opens the booking modal,
  // then closes the service modal
  reserveBtn?.addEventListener('click', e => {
    e.preventDefault()
    e.stopPropagation()
    closeServiceModal()
    const serviceKey = reserveBtn.dataset.service || ''
    // Small delay so the first modal finishes closing
    setTimeout(() => bookingApi?.openBookingModal(serviceKey), 50)
  })
}
