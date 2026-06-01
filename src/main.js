import './style.css'
import { initAnimations } from './animations.js'
import { initNav } from './cursor.js'
import { initTilt } from './tilt.js'
import { initModal, initServiceModal } from './modal.js'
import { initFaq } from './faq.js'

window.addEventListener('pageshow', (event) => {
  if (event.persisted) location.reload()
})

function initAll() {
  

  initNav()
  const bookingApi = initModal()
  initServiceModal(bookingApi)
  initAnimations()
  initTilt()
  initFaq()

  document.querySelectorAll('.service-card__cta').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopImmediatePropagation()
      e.preventDefault()
      bookingApi?.openBookingModal(btn.dataset.service || '')
    })
  })

  const heroBtn = document.getElementById('hero-cta')
  if (heroBtn) heroBtn.classList.add('hero-btn')
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll)
} else {
  initAll()
}
