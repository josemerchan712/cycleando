document.addEventListener('DOMContentLoaded', async () => {

  // ── Hamburger ──
  const hamburger  = document.getElementById('hamburger')
  const mobileMenu = document.getElementById('mobile-menu')
  if (hamburger && mobileMenu) {
    let open = false

    const setSpans = (active) => {
      const spans = hamburger.querySelectorAll('span')
      spans[0].style.transform = active ? 'translateY(6.5px) rotate(45deg)'  : ''
      spans[1].style.opacity   = active ? '0' : ''
      spans[2].style.transform = active ? 'translateY(-6.5px) rotate(-45deg)' : ''
    }

    hamburger.addEventListener('click', () => {
      open = !open
      mobileMenu.classList.toggle('open', open)
      setSpans(open)
    })

    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        open = false
        mobileMenu.classList.remove('open')
        setSpans(false)
      })
    })
  }

  // ── Navbar scroll class ──
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar')
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 80)
  }, { passive: true })

  // ── tsParticles v2 (CDN) — contained in #particles-404 ──
  if (window.tsParticles) {
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    window.tsParticles.load('particles-404', {
      fullScreen: { enable: false },
      particles: {
        number: { value: isMobile ? 40 : 80, density: { enable: false } },
        color:  { value: ['#39FF14', '#ffffff'] },
        links:  { enable: true, color: '#39FF14', opacity: 0.3, distance: 120, width: 1 },
        move:   { enable: true, speed: 1.5, outModes: { default: 'bounce' } },
        size:   { value: 3, random: true },
        opacity: { value: 0.6, random: true }
      },
      interactivity: {
        events: {
          onHover: { enable: !isMobile, mode: 'repulse' },
          onClick:  { enable: true,      mode: 'push'   }
        },
        modes: {
          repulse: { distance: 100 },
          push:    { quantity: 4 }
        }
      },
      background: { color: 'transparent' }
    }).catch(err => console.warn('404 particles error:', err))
  }
})
