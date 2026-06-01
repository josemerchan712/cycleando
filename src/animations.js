import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initAnimations() {

  // ── Hero entrance ──
  const heroTl = gsap.timeline({ delay: 0.2 })

  heroTl
    .from('.hero-line', {
      y: '110%',
      opacity: 0,
      duration: 1.1,
      ease: 'power4.out',
      stagger: 0.15,
    })
    .to('.hero-sub', {
      opacity: 1, y: 0,
      duration: 0.8, ease: 'power3.out'
    }, '-=0.5')
    .to('.hero-btn', {
      opacity: 1, y: 0,
      duration: 0.7, ease: 'power3.out'
    }, '-=0.4')

  // ── Particles fade-out on scroll ──
  gsap.to('#particles-canvas', {
    scrollTrigger: {
      trigger: '#hero',
      start: 'center top',
      end: 'bottom top',
      scrub: 0.6,
    },
    opacity: 0,
    ease: 'none',
  })

  // ── Services section ──
  gsap.from('.section-header', {
    scrollTrigger: {
      trigger: '#services',
      start: 'top 80%',
    },
    y: 40, opacity: 0,
    duration: 0.9, ease: 'power3.out'
  })

  // fromTo: GSAP owns both start and end — no CSS state dependency
  gsap.fromTo('.service-card',
    { y: 50, opacity: 0 },
    {
      scrollTrigger: {
        trigger: '.services-grid',
        start: 'top 80%',
      },
      y: 0, opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.15,
    }
  )

  // Service icon draw-in
  gsap.fromTo('.service-card__icon svg',
    { scale: 0.5, opacity: 0 },
    {
      scrollTrigger: {
        trigger: '.services-grid',
        start: 'top 75%',
      },
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: 'back.out(1.7)',
      stagger: 0.2,
    }
  )

  // ── About stats counter — IntersectionObserver, fires once per element ──
  const statNumbers = document.querySelectorAll('.stat-number[data-target]')
  if (statNumbers.length) {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        counterIO.unobserve(entry.target)          // never re-trigger
        const el     = entry.target
        const target = parseInt(el.dataset.target, 10)
        const prefix = el.dataset.prefix || ''
        const suffix = el.dataset.suffix || ''
        const obj    = { val: 0 }
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate() {
            el.textContent = prefix + Math.round(obj.val) + suffix
          }
        })
      })
    }, { threshold: 0.5 })
    statNumbers.forEach(el => counterIO.observe(el))
  }

  // About layout entrance
  gsap.from('.about-stats', {
    scrollTrigger: {
      trigger: '#about',
      start: 'top 75%',
    },
    x: -60, opacity: 0,
    duration: 1.1, ease: 'power3.out'
  })

  gsap.from('.about-text', {
    scrollTrigger: {
      trigger: '#about',
      start: 'top 75%',
    },
    x: 60, opacity: 0,
    duration: 1.1, ease: 'power3.out',
    delay: 0.15,
  })

  // ── Pricing ──
  gsap.fromTo('.price-card',
    { y: 30, opacity: 0 },
    {
      scrollTrigger: { trigger: '#pricing', start: 'top 78%' },
      y: 0, opacity: 1,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.06,
    }
  )

  // ── Reviews ──
  gsap.fromTo('.review-card',
    { y: 40, opacity: 0 },
    {
      scrollTrigger: { trigger: '#reviews', start: 'top 78%' },
      y: 0, opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.12,
    }
  )

  // ── Booking CTA ──
  gsap.from('.booking-inner', {
    scrollTrigger: {
      trigger: '#booking',
      start: 'top 75%',
    },
    y: 60, opacity: 0,
    duration: 1.0, ease: 'power3.out'
  })

  // ── Footer ──
  gsap.from('.footer-inner > *', {
    scrollTrigger: {
      trigger: '#footer',
      start: 'top 85%',
    },
    y: 30, opacity: 0,
    duration: 0.8, ease: 'power3.out',
    stagger: 0.1,
  })

  // ── Navbar scroll ──
  ScrollTrigger.create({
    start: 'top -80',
    onUpdate(self) {
      const nav = document.getElementById('navbar')
      if (nav) nav.classList.toggle('scrolled', self.scroll() > 80)
    }
  })

  // ── Horizontal neon line that follows scroll progress ──
  const progressBar = document.createElement('div')
  progressBar.id = 'scroll-progress'
  progressBar.style.cssText = `
    position:fixed; top:0; left:0; height:2px;
    background:linear-gradient(90deg,#39FF14,#00ff99);
    box-shadow:0 0 8px #39FF14;
    z-index:9998; width:0%; pointer-events:none;
    transition:width 0.1s linear;
  `
  document.body.prepend(progressBar)

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate(self) {
      progressBar.style.width = (self.progress * 100) + '%'
    }
  })
}
