import React, { useEffect, useRef, useState } from 'react'

export interface OrbitingItem {
  src: string
  scale?: number
}

export interface OrbitingRing {
  items: OrbitingItem[]
  radius: number
  duration?: number
  speed?: number
  reverse?: boolean
  iconSize?: number
  path?: boolean
}

interface OrbitingCirclesWebGLProps {
  rings: OrbitingRing[]
  size?: number
  className?: string
  fallback: React.ReactNode
}

interface LoadedTexture {
  texture: WebGLTexture
  aspect: number
}

const VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  uniform vec2 u_resolution;
  uniform vec2 u_center;
  uniform vec2 u_size;
  varying vec2 v_texCoord;

  void main() {
    vec2 pos = u_center + a_position * u_size;
    vec2 zeroToOne = pos / u_resolution;
    vec2 clipSpace = zeroToOne * 2.0 - 1.0;
    gl_Position = vec4(clipSpace.x, -clipSpace.y, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform sampler2D u_texture;
  varying vec2 v_texCoord;

  void main() {
    gl_FragColor = texture2D(u_texture, v_texCoord);
  }
`

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function createWebGLProgram(gl: WebGLRenderingContext): {
  program: WebGLProgram
  vs: WebGLShader
  fs: WebGLShader
} | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
  if (!vs || !fs) return null

  const program = gl.createProgram()
  if (!program) return null
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    return null
  }

  return { program, vs, fs }
}

/**
 * Rasterizes an image/SVG onto an offscreen 2D canvas before uploading to WebGL.
 * This avoids browser-specific SVG-to-texture bugs (black boxes) and lets us
 * preserve the natural aspect ratio cleanly.
 */
function loadImageTexture(
  gl: WebGLRenderingContext,
  src: string,
  targetPx: number,
  onLoaded: (loaded: LoadedTexture) => void,
  isCancelled: () => boolean,
) {
  const img = new Image()
  img.onload = () => {
    if (isCancelled()) return

    const w = img.naturalWidth || targetPx
    const h = img.naturalHeight || targetPx
    const aspect = w / h

    const offscreen = document.createElement('canvas')
    offscreen.width = aspect >= 1 ? targetPx : Math.max(1, Math.round(targetPx * aspect))
    offscreen.height = aspect >= 1 ? Math.max(1, Math.round(targetPx / aspect)) : targetPx

    const ctx = offscreen.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, offscreen.width, offscreen.height)
    ctx.drawImage(img, 0, 0, offscreen.width, offscreen.height)

    const texture = gl.createTexture()
    if (!texture) return

    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, offscreen)

    onLoaded({ texture, aspect })
  }
  img.src = src
}

export function OrbitingCirclesWebGL({
  rings,
  size = 300,
  className,
  fallback,
}: OrbitingCirclesWebGLProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
    })
    if (!gl) {
      setSupported(false)
      return
    }

    const compiled = createWebGLProgram(gl)
    if (!compiled) {
      setSupported(false)
      return
    }
    const { program, vs, fs } = compiled

    gl.useProgram(program)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    const quadBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -0.5, -0.5, 0, 0,
         0.5, -0.5, 1, 0,
        -0.5,  0.5, 0, 1,
        -0.5,  0.5, 0, 1,
         0.5, -0.5, 1, 0,
         0.5,  0.5, 1, 1,
      ]),
      gl.STATIC_DRAW,
    )

    const aPosition = gl.getAttribLocation(program, 'a_position')
    const aTexCoord = gl.getAttribLocation(program, 'a_texCoord')
    gl.enableVertexAttribArray(aPosition)
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 16, 0)
    gl.enableVertexAttribArray(aTexCoord)
    gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 16, 8)

    const uResolution = gl.getUniformLocation(program, 'u_resolution')
    const uCenter = gl.getUniformLocation(program, 'u_center')
    const uSize = gl.getUniformLocation(program, 'u_size')

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.uniform2f(uResolution, size, size)

    const textures = new Map<string, LoadedTexture>()
    let cancelled = false
    const rasterSize = Math.ceil(64 * dpr)

    for (const ring of rings) {
      for (const item of ring.items) {
        if (textures.has(item.src)) continue
        loadImageTexture(
          gl,
          item.src,
          rasterSize,
          (loaded) => textures.set(item.src, loaded),
          () => cancelled,
        )
      }
    }

    let rafId = 0
    const startTime = performance.now()
    const half = size / 2

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      for (const ring of rings) {
        const duration = (ring.duration ?? 20) / (ring.speed ?? 1)
        const dir = ring.reverse ? -1 : 1
        const iconSize = ring.iconSize ?? 30
        const count = ring.items.length
        if (count === 0) continue

        for (let i = 0; i < count; i++) {
          const item = ring.items[i]
          const loaded = textures.get(item.src)
          if (!loaded) continue

          const baseAngle = (Math.PI * 2 * i) / count
          const angle = baseAngle + dir * ((elapsed / duration) * Math.PI * 2)
          const x = half + Math.sin(angle) * ring.radius
          const y = half + Math.cos(angle) * ring.radius

          const scaled = iconSize * (item.scale ?? 1)
          const drawW = loaded.aspect >= 1 ? scaled : scaled * loaded.aspect
          const drawH = loaded.aspect >= 1 ? scaled / loaded.aspect : scaled

          gl.bindTexture(gl.TEXTURE_2D, loaded.texture)
          gl.uniform2f(uCenter, x, y)
          gl.uniform2f(uSize, drawW, drawH)
          gl.drawArrays(gl.TRIANGLES, 0, 6)
        }
      }

      rafId = requestAnimationFrame(render)
    }

    rafId = requestAnimationFrame(render)

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      for (const { texture } of textures.values()) {
        gl.deleteTexture(texture)
      }
      gl.deleteBuffer(quadBuffer)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [rings, size])

  if (!supported) {
    return <>{fallback}</>
  }

  return (
    <div
      className={className}
      style={{ width: size, height: size }}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        version='1.1'
        className='absolute inset-0 pointer-events-none size-full'
      >
        {rings.map(
          (ring, idx) =>
            ring.path !== false && (
              <circle
                key={idx}
                className='stroke-1 stroke-black/10 dark:stroke-white/10'
                cx='50%'
                cy='50%'
                r={ring.radius}
                fill='none'
              />
            ),
        )}
      </svg>
      <canvas
        ref={canvasRef}
        className='absolute inset-0 pointer-events-none size-full'
      />
    </div>
  )
}
