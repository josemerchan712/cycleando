import VanillaTilt from 'vanilla-tilt'

export function initTilt() {
  const cards = document.querySelectorAll('[data-tilt]')
  if (cards.length === 0) return

  VanillaTilt.init(cards, {
    max: 12,
    speed: 400,
    glare: true,
    'max-glare': 0.12,
    perspective: 900,
  })
}
