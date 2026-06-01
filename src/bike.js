import * as THREE from 'three'

export function initBikeScene(canvas) {
  if (!canvas) return null

  const W = window.innerWidth
  const H = window.innerHeight

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(W, H, false)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.3

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100)
  camera.position.set(0, 0.4, 5.8)

  // ── Lights ──
  scene.add(new THREE.AmbientLight(0xffffff, 0.30))

  const dirLight = new THREE.DirectionalLight(0xffffff, 3.0)
  dirLight.position.set(4, 7, 5)
  dirLight.castShadow = true
  dirLight.shadow.mapSize.set(2048, 2048)
  scene.add(dirLight)

  const fillLight = new THREE.DirectionalLight(0xffd060, 0.80)
  fillLight.position.set(-6, 2, -3)
  scene.add(fillLight)

  const accentLight = new THREE.PointLight(0x39ff14, 3.5, 9)
  accentLight.position.set(0.5, -0.5, 3)
  scene.add(accentLight)

  const backLight = new THREE.DirectionalLight(0x3355aa, 0.5)
  backLight.position.set(0, -4, -6)
  scene.add(backLight)

  // ── Materials ──
  // Per user spec: metal parts #1a1a1a r0.15 m0.9, tyres #111 r0.9 m0, accent #39FF14
  const matMetal  = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.15, metalness: 0.9 })
  const matAccent = new THREE.MeshStandardMaterial({ color: 0x39FF14, roughness: 0.15, metalness: 0.6, emissive: 0x39FF14, emissiveIntensity: 0.18 })
  const matTire   = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9,  metalness: 0 })
  const matRim    = new THREE.MeshStandardMaterial({ color: 0xBCC0CA, roughness: 0.12, metalness: 0.96 })
  const matChrome = new THREE.MeshStandardMaterial({ color: 0xEEF2F8, roughness: 0.07, metalness: 0.98 })
  const matSpoke  = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.25, metalness: 0.85 })
  const matRail   = new THREE.MeshStandardMaterial({ color: 0xBBBFCA, roughness: 0.28, metalness: 0.85 })

  // ── Helpers ──

  // Straight cylinder from A to B
  function tube(A, B, r, mat, seg = 10) {
    const dir = new THREE.Vector3().subVectors(B, A)
    const len = dir.length()
    if (len < 1e-6) return new THREE.Object3D()
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, seg), mat)
    mesh.castShadow = true
    mesh.position.copy(A).addScaledVector(dir.normalize(), len / 2)
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
    return mesh
  }

  // Smooth curved tube through an array of THREE.Vector3 points
  function curveTube(pts, r, mat, tubeSeg = 20) {
    const curve = new THREE.CatmullRomCurve3(pts)
    const geo   = new THREE.TubeGeometry(curve, tubeSeg, r, 8, false)
    const mesh  = new THREE.Mesh(geo, mat)
    mesh.castShadow = true
    return mesh
  }

  // ══════════════════════════════════════════════════════════
  //  Key anatomical points  (XY plane, camera looks along -Z)
  //
  //  RA  rear axle          (-1.05,  0.00)
  //  FA  front axle         ( 1.35,  0.00)  ← pushed fwd for clearance
  //  BB  bottom bracket     (-0.02, -0.06)
  //  STT seat tube top      (-0.22,  0.72)
  //  HTB head tube bottom   ( 0.72,  0.28)  ← fork crown
  //  HTT head tube top      ( 0.57,  0.63)
  // ══════════════════════════════════════════════════════════
  const RA  = new THREE.Vector3(-1.05,  0.00, 0)
  const FA  = new THREE.Vector3( 1.35,  0.00, 0)
  const BB  = new THREE.Vector3(-0.02, -0.06, 0)
  const STT = new THREE.Vector3(-0.22,  0.72, 0)
  const HTB = new THREE.Vector3( 0.72,  0.28, 0)
  const HTT = new THREE.Vector3( 0.57,  0.63, 0)

  // Bike group shifted right so hero text on left has room
  const bikeGroup = new THREE.Group()
  bikeGroup.position.set(0.85, 0, 0)
  scene.add(bikeGroup)

  // ── Wheels ──
  // Torus ring is in XY plane by default → face-on circle from +Z camera ✓
  // Wheels spin via rotation.z (in-plane) ✓
  //
  // Spoke layout: 12 cylinders, each bridging hub-flange radius to rim radius.
  //   HUB_R=0.10, RIM_R=0.63, spoke length=0.53, midpoint at r=0.365
  //   At angle a: centre = (sin(a)*0.365, cos(a)*0.365), rotation.z = a
  //   → ends land exactly on HUB_R and RIM_R ✓
  function makeWheel(cx, cy) {
    const grp = new THREE.Group()
    grp.position.set(cx, cy, 0)

    // Tyre — thick rubber outer torus
    grp.add(new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.085, 20, 80), matTire))

    // Rim — narrow metallic inner torus
    grp.add(new THREE.Mesh(new THREE.TorusGeometry(0.645, 0.020, 14, 80), matRim))

    // Hub — solid cylinder along Z (axle axis)
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.22, 20), matChrome)
    hub.rotation.x = Math.PI / 2
    grp.add(hub)

    // Hub flanges
    ;[-0.06, 0.06].forEach(z => {
      const fl = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, 0.012, 20), matChrome)
      fl.rotation.x = Math.PI / 2
      fl.position.z = z
      grp.add(fl)
    })

    // 12 spokes — run from hub-flange edge to rim (not from centre)
    const HUB_R = 0.10, RIM_R = 0.63
    const SPOKE_L = RIM_R - HUB_R          // 0.53
    const MID_R   = (RIM_R + HUB_R) / 2   // 0.365

    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2
      const spk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.007, 0.007, SPOKE_L, 6),
        matSpoke
      )
      spk.position.set(Math.sin(a) * MID_R, Math.cos(a) * MID_R, 0)
      spk.rotation.z = a
      grp.add(spk)
    }

    return grp
  }

  const rearWheel  = makeWheel(RA.x, RA.y)
  const frontWheel = makeWheel(FA.x, FA.y)
  bikeGroup.add(rearWheel, frontWheel)

  // ── Diamond Frame ──
  const zo = 0.050  // Z offset for paired stays

  // Front triangle
  bikeGroup.add(tube(BB,  STT, 0.036, matMetal))       // seat tube (vertical)
  bikeGroup.add(tube(BB,  HTB, 0.042, matMetal))       // down tube (diagonal)
  bikeGroup.add(tube(STT, HTT, 0.032, matMetal))       // top tube (horizontal)
  bikeGroup.add(tube(HTB, HTT, 0.052, matAccent, 14))  // head tube (green accent)

  // Chain stays — BB → rear axle (paired, nearly horizontal)
  bikeGroup.add(tube(BB, new THREE.Vector3(RA.x, RA.y,  zo), 0.020, matMetal))
  bikeGroup.add(tube(BB, new THREE.Vector3(RA.x, RA.y, -zo), 0.020, matMetal))

  // Seat stays — STT → rear axle (paired, diagonal braces)
  bikeGroup.add(tube(STT, new THREE.Vector3(RA.x, RA.y,  zo), 0.016, matMetal))
  bikeGroup.add(tube(STT, new THREE.Vector3(RA.x, RA.y, -zo), 0.016, matMetal))

  // Rear dropout knuckle
  const rdDrop = new THREE.Mesh(new THREE.SphereGeometry(0.038, 10, 10), matChrome)
  rdDrop.position.copy(RA)
  bikeGroup.add(rdDrop)

  // ── Fork — two blades with realistic forward curve ──
  ;[zo, -zo].forEach(z => {
    const pts = [
      new THREE.Vector3(HTB.x,          HTB.y,          0),
      new THREE.Vector3(HTB.x + 0.18,   0.16,           z * 0.8),
      new THREE.Vector3(FA.x  - 0.04,   0.06,           z),
      new THREE.Vector3(FA.x,           FA.y,            z),
    ]
    bikeGroup.add(curveTube(pts, 0.018, matMetal))
  })

  // Fork crown + front dropout
  const forkCrown = new THREE.Mesh(new THREE.SphereGeometry(0.048, 12, 12), matMetal)
  forkCrown.position.copy(HTB)
  bikeGroup.add(forkCrown)

  const fdDrop = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 10), matChrome)
  fdDrop.position.copy(FA)
  bikeGroup.add(fdDrop)

  // ── Stem ──
  const stemTip = new THREE.Vector3(HTT.x + 0.02, HTT.y + 0.22, 0)
  bikeGroup.add(tube(HTT, stemTip, 0.018, matMetal, 10))

  // Stem clamp cylinder
  const clamp = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.060, 14), matChrome)
  clamp.rotation.x = Math.PI / 2
  clamp.position.copy(stemTip)
  bikeGroup.add(clamp)

  // ── Drop handlebars ──
  // Horizontal section: plain tube() — CylinderGeometry, no CatmullRom needed.
  // Curved drop: 5-point CatmullRomCurve3 — stable with ≥ 3 control points.
  ;[-1, 1].forEach(side => {
    const x = stemTip.x, y = stemTip.y, s = side

    // Straight horizontal bar section (use tube, NOT curveTube — avoids
    // degenerate TubeGeometry from a 2-point CatmullRomCurve3)
    bikeGroup.add(tube(
      new THREE.Vector3(x, y, s * 0.03),
      new THREE.Vector3(x, y, s * 0.22),
      0.016, matMetal
    ))

    // Curved drop section (green handlebar tape) — 5 points ✓
    bikeGroup.add(curveTube([
      new THREE.Vector3(x,        y,        s * 0.22),
      new THREE.Vector3(x - 0.01, y - 0.07, s * 0.28),
      new THREE.Vector3(x - 0.04, y - 0.16, s * 0.29),
      new THREE.Vector3(x - 0.07, y - 0.22, s * 0.27),
      new THREE.Vector3(x - 0.09, y - 0.26, s * 0.22),
    ], 0.018, matAccent, 16))
  })

  // ── Seat post ──
  const seatTop = new THREE.Vector3(STT.x - 0.01, STT.y + 0.26, 0)
  bikeGroup.add(tube(STT, seatTop, 0.018, matMetal))

  // ── Saddle — flattened ellipsoid, green ──
  const saddleGeo  = new THREE.SphereGeometry(1, 20, 12)
  const saddleMesh = new THREE.Mesh(saddleGeo, matAccent)
  saddleMesh.scale.set(0.26, 0.055, 0.13)
  saddleMesh.position.copy(seatTop).add(new THREE.Vector3(0.01, 0.055, 0))
  saddleMesh.castShadow = true
  bikeGroup.add(saddleMesh)

  // Saddle rails
  ;[-0.032, 0.032].forEach(z => {
    const rA = new THREE.Vector3(seatTop.x - 0.20, seatTop.y - 0.020, z)
    const rB = new THREE.Vector3(seatTop.x + 0.12, seatTop.y - 0.020, z)
    bikeGroup.add(tube(rA, rB, 0.006, matRail))
  })

  // ── Bottom bracket ──
  const bbShell = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.20, 18), matChrome)
  bbShell.rotation.x = Math.PI / 2
  bbShell.position.copy(BB)
  bikeGroup.add(bbShell)

  // ── Cranks & chainring ──
  const crankGrp = new THREE.Group()
  crankGrp.position.copy(BB)

  // Outer chainring
  crankGrp.add(new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.016, 10, 44), matChrome))
  // Inner ring
  crankGrp.add(new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.009, 8,  44), matMetal))

  // Crank arms (one each side of chainline)
  crankGrp.add(tube(new THREE.Vector3(0, 0,  0.08), new THREE.Vector3(0, -0.23,  0.08), 0.017, matMetal))
  crankGrp.add(tube(new THREE.Vector3(0, 0, -0.08), new THREE.Vector3(0,  0.23, -0.08), 0.017, matMetal))

  // Pedals — small box shapes
  const pedalGeo = new THREE.BoxGeometry(0.12, 0.018, 0.065)
  ;[
    [0, -0.23,  0.08],
    [0,  0.23, -0.08],
  ].forEach(([px, py, pz]) => {
    const pedal = new THREE.Mesh(pedalGeo, matMetal)
    pedal.position.set(px, py, pz)
    crankGrp.add(pedal)
  })

  bikeGroup.add(crankGrp)

  // ── Mouse parallax ──
  const mouse  = { x: 0, y: 0 }
  const smooth = { x: 0, y: 0 }
  const onMouse = e => {
    mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2
    mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
  }
  window.addEventListener('mousemove', onMouse)

  // ── Resize ──
  const onResize = () => {
    const w = window.innerWidth, h = window.innerHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  window.addEventListener('resize', onResize)

  // ── Render loop ──
  let animId, time = 0

  function animate() {
    animId = requestAnimationFrame(animate)
    time += 0.008

    // Smooth mouse parallax
    smooth.x += (mouse.y * 0.14 - smooth.x) * 0.055
    smooth.y += (mouse.x * 0.20 - smooth.y) * 0.055

    // Slow auto-spin + mouse tilt
    bikeGroup.rotation.y = time * 0.28 + smooth.y
    bikeGroup.rotation.x = smooth.x

    // Wheels and crank spin
    const ws = time * 2.2
    rearWheel.rotation.z  = ws
    frontWheel.rotation.z = ws
    crankGrp.rotation.z   = -ws * 0.28

    // Accent light pulse
    accentLight.intensity = 2.8 + Math.sin(time * 1.4) * 1.0

    renderer.render(scene, camera)
  }
  animate()

  return {
    destroy() {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }
}
