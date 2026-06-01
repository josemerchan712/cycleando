import { tsParticles } from '@tsparticles/engine'
import { loadSlim } from '@tsparticles/slim'

let slimLoaded = false

export async function initParticles(containerId = 'particles-canvas') {
  if (!slimLoaded) {
    await loadSlim(tsParticles)
    slimLoaded = true
  }

  const isMobile = window.matchMedia('(max-width: 768px)').matches

  await tsParticles.load({
    id: containerId,
    options: {
      fpsLimit: 60,
      particles: {
        number: {
          value: isMobile ? 40 : 80,
          density: { enable: false }
        },
        color: { value: ['#39FF14', '#ffffff', '#1a1a1a'] },
        shape: { type: 'circle' },
        opacity: {
          value: { min: 0.2, max: 0.7 },
          animation: { enable: true, speed: 0.5, sync: false }
        },
        size: {
          value: { min: 1, max: 3 },
          animation: { enable: false }
        },
        links: {
          enable: true,
          color: '#39FF14',
          opacity: 0.25,
          distance: 120,
          width: 1
        },
        move: {
          enable: true,
          speed: 1.2,
          direction: 'none',
          random: true,
          straight: false,
          outModes: { default: 'bounce' }
        }
      },
      interactivity: {
        detectsOn: 'window',
        events: {
          onHover: { enable: !isMobile, mode: 'repulse' },
          onClick:  { enable: true,      mode: 'push'    },
          resize:   { enable: true }
        },
        modes: {
          repulse: { distance: 100, duration: 0.4 },
          push:    { quantity: 4 }
        }
      },
      background: { color: 'transparent' },
      fullScreen:  { enable: false }   // contained inside #particles-canvas
    }
  })
}
