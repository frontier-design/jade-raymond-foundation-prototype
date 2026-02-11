import { useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import jadeVideo from '../assets/videos/jade-video-compressed.mp4'
import AsciiWorker from '../workers/asciiWorker.js?worker'

// Short, curated ramp — fewer chars = less noise = more recognisable shapes
const ASCII_RAMP = ' .,:;+*?%S#@!$%^&(-_=+`~#"'

// Contrast: pixels brighter than this (0-255 luminance) become plain whitespace
const BRIGHTNESS_CUTOFF = 130
// Power curve exponent — values > 1 push mid-tones toward dark
const CONTRAST_GAMMA = 3.0

// Fixed font size (px) — characters never scale, container just shows more or fewer
const CHAR_SIZE = 12
const CHAR_ASPECT = 0.55 // monospace width / height ratio
const TARGET_FPS = 20
const FRAME_INTERVAL = 1000 / TARGET_FPS

// Feature detection for worker path
const SUPPORTS_WORKER =
  typeof OffscreenCanvas !== 'undefined' &&
  typeof createImageBitmap !== 'undefined'

const Wrapper = styled.section`
  position: relative;
  width: ${({ $width }) => $width || '100vw'};
  height: ${({ $height }) => $height || '100vh'};
  overflow: hidden;
  background: transparent;
`

const HiddenVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
`

const DISPLAY_CANVAS_STYLE = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  userSelect: 'none',
}

// ---------------------------------------------------------------------------
// Main-thread fallback: sample pixels + draw ASCII on the display canvas
// ---------------------------------------------------------------------------
function renderFrameMainThread(
  video, samplingCanvas, displayCanvas, wrapper,
  ctxRef, displayCtxRef, prevColsRef, prevRowsRef, fontSize
) {
  if (!ctxRef.current) {
    ctxRef.current = samplingCanvas.getContext('2d', { willReadFrequently: true })
  }
  const ctx = ctxRef.current
  if (!ctx) return

  if (!displayCtxRef.current) {
    displayCtxRef.current = displayCanvas.getContext('2d')
  }
  const dCtx = displayCtxRef.current
  if (!dCtx) return

  const vw = video.videoWidth
  const vh = video.videoHeight
  if (!vw || !vh) return

  const dpr = window.devicePixelRatio || 1
  const charW = fontSize * CHAR_ASPECT
  const charH = fontSize
  const wrapperW = wrapper.clientWidth
  const wrapperH = wrapper.clientHeight
  const cols = Math.floor(wrapperW / charW)
  const rows = Math.floor(wrapperH / charH)
  if (cols <= 0 || rows <= 0) return

  if (cols !== prevColsRef.current || rows !== prevRowsRef.current) {
    samplingCanvas.width = cols
    samplingCanvas.height = rows

    // Scale display canvas buffer for HiDPI / retina
    displayCanvas.width = Math.round(wrapperW * dpr)
    displayCanvas.height = Math.round(wrapperH * dpr)
    dCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
    dCtx.font = `${fontSize}px "Courier New", Courier, monospace`
    dCtx.textBaseline = 'top'
    prevColsRef.current = cols
    prevRowsRef.current = rows
  }

  ctx.drawImage(video, 0, 0, cols, rows)
  const { data } = ctx.getImageData(0, 0, cols, rows)
  const rampLen = ASCII_RAMP.length - 1

  // Clear in CSS-pixel coordinates (the transform handles the scaling)
  dCtx.fillStyle = '#fff'
  dCtx.fillRect(0, 0, wrapperW, wrapperH)
  dCtx.fillStyle = '#cbcbcb'

  for (let y = 0; y < rows; y++) {
    const yOffset = y * cols * 4
    const py = y * charH
    for (let x = 0; x < cols; x++) {
      const idx = yOffset + x * 4
      const luminance = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]
      if (luminance < BRIGHTNESS_CUTOFF) {
        const norm = 1 - luminance / BRIGHTNESS_CUTOFF
        const curved = Math.pow(norm, CONTRAST_GAMMA)
        const char = ASCII_RAMP[Math.min(Math.floor(curved * rampLen), rampLen)]
        dCtx.fillText(char, x * charW, py)
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
function AsciiVideo({ src = jadeVideo, width, height, style, className, fontSize = CHAR_SIZE }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)        // hidden sampling canvas (fallback only)
  const displayCanvasRef = useRef(null) // visible canvas for ASCII output
  const wrapperRef = useRef(null)
  const ctxRef = useRef(null)           // sampling canvas context (fallback)
  const displayCtxRef = useRef(null)    // display canvas context
  const frameIdRef = useRef(null)
  const lastFrameTimeRef = useRef(0)
  const animateRef = useRef(null)
  const directionRef = useRef(1)        // 1 = forward, -1 = backward
  const isVisibleRef = useRef(false)
  const prevColsRef = useRef(0)
  const prevRowsRef = useRef(0)
  const workerRef = useRef(null)
  const workerBusyRef = useRef(false)   // true while worker is processing a frame

  // Draw the grid the worker computed onto the visible display canvas
  const drawWorkerGrid = useCallback((grid, cols, rows) => {
    const displayCanvas = displayCanvasRef.current
    const wrapper = wrapperRef.current
    if (!displayCanvas || !wrapper) return

    if (!displayCtxRef.current) {
      displayCtxRef.current = displayCanvas.getContext('2d')
    }
    const dCtx = displayCtxRef.current
    if (!dCtx) return

    const dpr = window.devicePixelRatio || 1
    const charW = fontSize * CHAR_ASPECT
    const charH = fontSize
    const wrapperW = wrapper.clientWidth
    const wrapperH = wrapper.clientHeight
    const bufferW = Math.round(wrapperW * dpr)
    const bufferH = Math.round(wrapperH * dpr)

    // Resize display canvas for HiDPI / retina if needed
    if (displayCanvas.width !== bufferW || displayCanvas.height !== bufferH) {
      displayCanvas.width = bufferW
      displayCanvas.height = bufferH
      dCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dCtx.font = `${fontSize}px "Courier New", Courier, monospace`
      dCtx.textBaseline = 'top'
    }

    dCtx.fillStyle = '#fff'
    dCtx.fillRect(0, 0, wrapperW, wrapperH)
    dCtx.fillStyle = '#cbcbcb'

    const rampLen = ASCII_RAMP.length - 1
    for (let y = 0; y < rows; y++) {
      const rowOffset = y * cols
      const py = y * charH
      for (let x = 0; x < cols; x++) {
        const val = grid[rowOffset + x]
        if (val > 0) {
          // val is ramp index + 1 (0 means space)
          const char = ASCII_RAMP[Math.min(val - 1, rampLen)]
          dCtx.fillText(char, x * charW, py)
        }
      }
    }
  }, [fontSize])

  // Send a frame to the worker for processing
  const sendFrameToWorker = useCallback(() => {
    const video = videoRef.current
    const worker = workerRef.current
    const wrapper = wrapperRef.current
    if (!video || !worker || !wrapper || workerBusyRef.current) return

    const vw = video.videoWidth
    const vh = video.videoHeight
    if (!vw || !vh) return

    const charW = fontSize * CHAR_ASPECT
    const charH = fontSize
    const cols = Math.floor(wrapper.clientWidth / charW)
    const rows = Math.floor(wrapper.clientHeight / charH)
    if (cols <= 0 || rows <= 0) return

    // Tell worker about dimension changes
    if (cols !== prevColsRef.current || rows !== prevRowsRef.current) {
      if (prevColsRef.current === 0) {
        worker.postMessage({ type: 'init', cols, rows })
      } else {
        worker.postMessage({ type: 'resize', cols, rows })
      }
      prevColsRef.current = cols
      prevRowsRef.current = rows
    }

    // Capture frame as transferable ImageBitmap
    createImageBitmap(video).then((bitmap) => {
      workerBusyRef.current = true
      worker.postMessage({ type: 'frame', bitmap }, [bitmap])
    }).catch(() => {
      // createImageBitmap can fail if video isn't ready — just skip frame
    })
  }, [fontSize])

  // Fallback render (no worker)
  const renderFrameFallback = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const displayCanvas = displayCanvasRef.current
    const wrapper = wrapperRef.current
    if (!video || !canvas || !displayCanvas || !wrapper) return
    renderFrameMainThread(
      video, canvas, displayCanvas, wrapper,
      ctxRef, displayCtxRef, prevColsRef, prevRowsRef, fontSize
    )
  }, [fontSize])

  // ---- Worker lifecycle ----
  useEffect(() => {
    if (!SUPPORTS_WORKER) return

    let worker
    try {
      worker = new AsciiWorker()
    } catch {
      // Worker failed to instantiate — fall back silently
      return
    }
    workerRef.current = worker

    worker.onmessage = (e) => {
      if (e.data.type === 'grid') {
        workerBusyRef.current = false
        drawWorkerGrid(e.data.grid, e.data.cols, e.data.rows)
      }
    }

    return () => {
      worker.terminate()
      workerRef.current = null
    }
  }, [drawWorkerGrid])

  // ---- IntersectionObserver — pause off-screen instances ----
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const observer = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting },
      { threshold: 0 }
    )
    observer.observe(wrapper)
    return () => observer.disconnect()
  }, [])

  // ---- Animation loop ----
  useEffect(() => {
    animateRef.current = (timestamp) => {
      frameIdRef.current = requestAnimationFrame(animateRef.current)
      // Skip all work when off-screen
      if (!isVisibleRef.current) return
      if (timestamp - lastFrameTimeRef.current < FRAME_INTERVAL) return
      lastFrameTimeRef.current = timestamp

      const video = videoRef.current
      if (!video || !video.duration || video.seeking) return

      // Manually scrub the video time for ping-pong playback
      const step = (1 / TARGET_FPS) * directionRef.current
      let next = video.currentTime + step

      const END_BUFFER = 0.15
      if (next >= video.duration - END_BUFFER) {
        next = video.duration - END_BUFFER
        directionRef.current = -1
      } else if (next <= END_BUFFER) {
        next = END_BUFFER
        directionRef.current = 1
      }

      video.currentTime = next
    }
  }, [])

  // Render a new ASCII frame every time the browser finishes seeking
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const onSeeked = () => {
      if (workerRef.current) {
        sendFrameToWorker()
      } else {
        renderFrameFallback()
      }
    }
    video.addEventListener('seeked', onSeeked)
    return () => video.removeEventListener('seeked', onSeeked)
  }, [sendFrameToWorker, renderFrameFallback])

  // Start the rAF loop once the video is loaded
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const startLoop = () => {
      video.pause()
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current)
      frameIdRef.current = requestAnimationFrame(animateRef.current)
    }

    const handleLoaded = () => {
      video.currentTime = 0
      startLoop()
    }

    video.addEventListener('loadeddata', handleLoaded)
    if (video.readyState >= 2) handleLoaded()

    return () => {
      video.removeEventListener('loadeddata', handleLoaded)
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current)
    }
  }, [])

  return (
    <Wrapper
      ref={wrapperRef}
      $width={width}
      $height={height}
      style={style}
      className={className}
      aria-hidden="true"
    >
      <HiddenVideo
        ref={videoRef}
        src={src}
        muted
        playsInline
        crossOrigin="anonymous"
        preload="auto"
      />
      {/* Hidden sampling canvas — only used in main-thread fallback path */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {/* Visible display canvas — ASCII characters drawn here */}
      <canvas ref={displayCanvasRef} style={DISPLAY_CANVAS_STYLE} />
    </Wrapper>
  )
}

export default AsciiVideo
