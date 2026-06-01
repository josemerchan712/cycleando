export function initFaq() {
  const items = document.querySelectorAll('.faq-item')
  if (!items.length) return

  items.forEach(item => {
    const btn = item.querySelector('.faq-question')
    if (!btn) return

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open')

      // Close every open item first
      items.forEach(other => {
        other.classList.remove('open')
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false')
      })

      // If it wasn't open, open it now
      if (!isOpen) {
        item.classList.add('open')
        btn.setAttribute('aria-expanded', 'true')
      }
    })
  })
}
