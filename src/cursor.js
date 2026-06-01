export function initCursor() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches
  if (isMobile) return

  const cursor = document.getElementById('cursor')
  const dot = document.getElementById('cursor-dot')
  const ring = document.getElementById('cursor-ring')
  if (!cursor || !dot || !ring) return

  let mx = 0, my = 0
  let rx = 0, ry = 0

  document.addEventListener('mousemove', e => {
    mx = e.clientX
    my = e.clientY
  })

  // Smooth ring follow
  function loop() {
    rx += (mx - rx) * 0.12
    ry += (my - ry) * 0.12

    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`

    requestAnimationFrame(loop)
  }
  loop()

  // Expand on hover triggers
  document.querySelectorAll('.hover-trigger').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'))
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'))
  })

  // Hide/show on leave/enter window
  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0' })
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1' })
}

export function initNav() {
  const hamburger = document.getElementById('hamburger')
  const mobileMenu = document.getElementById('mobile-menu')
  const mobileLinks = document.querySelectorAll('.mobile-link')
  let isOpen = false

  if (!hamburger || !mobileMenu) return

  hamburger.addEventListener('click', () => {
    isOpen = !isOpen
    mobileMenu.classList.toggle('open', isOpen)
    // Animate hamburger to X
    const spans = hamburger.querySelectorAll('span')
    if (isOpen) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)'
      spans[1].style.opacity = '0'
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)'
    } else {
      spans[0].style.transform = ''
      spans[1].style.opacity = ''
      spans[2].style.transform = ''
    }
  })

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      isOpen = false
      mobileMenu.classList.remove('open')
      const spans = hamburger.querySelectorAll('span')
      spans[0].style.transform = ''
      spans[1].style.opacity = ''
      spans[2].style.transform = ''
    })
  })
}
