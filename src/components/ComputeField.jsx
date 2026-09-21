import { useEffect, useRef, useState } from "react";

/**
 * A lattice of cells that light up in travelling wavefronts — threads sweeping
 * across a grid. Pointer adds a halo; a click launches an expanding ring.
 *
 * Raw WebGL on purpose: one full-screen fragment shader, no geometry, no
 * textures, no 3D library. It pauses when scrolled out of view or when the tab
 * is hidden, caps DPR, honours reduced-motion, and degrades to a static CSS
 * lattice if WebGL is unavailable or the context is lost and never restored.
 */

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;

uniform vec2  uRes;
uniform float uTime;
uniform float uPhase;
uniform float uSurge;
uniform vec2  uPointer;
uniform float uPointerT;
uniform float uCell;

// --color-SageGray / --color-gold from index.css
const vec3 SAGE = vec3(0.545, 0.545, 0.451);
const vec3 GOLD = vec3(0.812, 0.639, 0.333);

void main() {
  vec2 p = gl_FragCoord.xy;

  vec2 cellId     = floor(p / uCell);
  vec2 cellCenter = (cellId + 0.5) * uCell;
  vec2 local      = (p - cellCenter) / (uCell * 0.5);

  vec2 uv = cellCenter / uRes;
  float t = uPhase;

  // Two travelling wavefronts crossing the lattice at different rates.
  float w1 = sin((uv.x * 5.5 + uv.y * 2.5) * 3.14159 - t * 1.15);
  float w2 = sin((uv.x * -3.5 + uv.y * 6.0) * 3.14159 - t * 0.75 + 1.7);
  float wave = w1 * 0.6 + w2 * 0.4;
  float energy = smoothstep(0.25, 0.95, wave);

  // Pointer: steady halo, plus one expanding ring per click.
  float d    = distance(cellCenter, uPointer);
  float halo = smoothstep(uRes.y * 0.28, 0.0, d) * 0.5;

  float age   = max(uTime - uPointerT, 0.0);
  float ringR = age * 900.0;
  float ring  = exp(-pow((d - ringR) / 90.0, 2.0)) * exp(-age * 1.8);

  energy = clamp(energy * (1.0 + uSurge * 0.45) + halo + ring * 1.15, 0.0, 1.4);

  // Keep the lower band calm so the headline stays readable.
  // gl_FragCoord.y is bottom-up, so uv.y == 0.0 is where the type sits.
  energy *= mix(0.18, 1.0, smoothstep(0.0, 0.6, uv.y));

  // Squircle cell.
  float sd     = pow(pow(abs(local.x), 6.0) + pow(abs(local.y), 6.0), 1.0 / 6.0);
  float radius = 0.16 + 0.44 * energy;
  float edge   = 3.0 / uCell;
  float mask   = 1.0 - smoothstep(radius - edge, radius + edge, sd);

  vec3  color = mix(SAGE, GOLD, smoothstep(0.1, 0.95, energy));
  float alpha = mask * (0.10 + 0.62 * energy);

  gl_FragColor = vec4(color * alpha, alpha); // premultiplied
}
`;

const compile = (gl, type, src) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

// How long to wait for a lost context to come back before showing the fallback.
const RESTORE_GRACE_MS = 1500;

const ComputeField = () => {
  const canvasRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let gl = null;
    let program = null;
    let vs = null;
    let fs = null;
    let buffer = null;
    let u = {};
    let ready = false;

    let frame = 0;
    let onScreen = true;
    let dpr = 1;
    let pointer = [-9999, -9999];
    let pointerT = -99;
    let restoreTimer = 0;
    let phase = 0;
    let surge = 0;
    let lastFrameT = 0;
    let lastScrollY = window.scrollY;
    const start = performance.now();

    const now = () => (performance.now() - start) / 1000;

    const resize = () => {
      if (!ready) return;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (!w || !h) return;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(u.res, w, h);
      // ~22 CSS px cells on desktop, tighter on small screens
      gl.uniform1f(u.cell, (canvas.clientWidth < 640 ? 15 : 22) * dpr);
    };

    const draw = (t) => {
      if (!ready || gl.isContextLost()) return;
      gl.uniform1f(u.time, t);
      gl.uniform1f(u.phase, phase);
      gl.uniform1f(u.surge, surge);
      gl.uniform2f(u.pointer, pointer[0], pointer[1]);
      gl.uniform1f(u.pointerT, pointerT);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (ts) => {
      frame = requestAnimationFrame(loop);
      const t = (ts - start) / 1000;
      // Clamp dt so a backgrounded tab doesn't resume with one enormous step.
      const dt = lastFrameT ? Math.min(t - lastFrameT, 0.05) : 0.016;
      lastFrameT = t;
      phase += dt * (1 + surge * 2.2);
      surge *= Math.exp(-dt * 3.5);
      draw(t);
    };

    const run = () => {
      if (!ready || frame || !onScreen) return;
      if (reduceMotion.matches) {
        draw(now());
        return;
      }
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (!frame) return;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    // Builds every GL resource. Re-run verbatim after a context restore, since
    // a lost context invalidates all programs, shaders and buffers.
    const build = () => {
      vs = compile(gl, gl.VERTEX_SHADER, VERT);
      fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      if (!vs || !fs) return false;

      program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
      gl.useProgram(program);

      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW
      );
      const aPos = gl.getAttribLocation(program, "aPos");
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      u = {
        res: gl.getUniformLocation(program, "uRes"),
        time: gl.getUniformLocation(program, "uTime"),
        phase: gl.getUniformLocation(program, "uPhase"),
        surge: gl.getUniformLocation(program, "uSurge"),
        pointer: gl.getUniformLocation(program, "uPointer"),
        pointerT: gl.getUniformLocation(program, "uPointerT"),
        cell: gl.getUniformLocation(program, "uCell"),
      };

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      ready = true;
      resize();
      return true;
    };

    gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      powerPreference: "low-power",
    });
    if (!gl || !build()) {
      setFailed(true);
      return;
    }

    // Context loss is routine on mobile (backgrounding, memory pressure). Without
    // preventDefault the browser will not attempt to restore it at all.
    const onLost = (e) => {
      e.preventDefault();
      ready = false;
      stop();
      clearTimeout(restoreTimer);
      restoreTimer = setTimeout(() => setFailed(true), RESTORE_GRACE_MS);
    };
    const onRestored = () => {
      clearTimeout(restoreTimer);
      if (build()) run();
      else setFailed(true);
    };

    const toGl = (e) => {
      const r = canvas.getBoundingClientRect();
      pointer = [
        (e.clientX - r.left) * dpr,
        (r.height - (e.clientY - r.top)) * dpr,
      ];
    };
    const onMove = (e) => toGl(e);
    const onDown = (e) => {
      toGl(e);
      pointerT = now();
      if (reduceMotion.matches) draw(pointerT);
    };
    const onLeave = () => {
      pointer = [-9999, -9999];
    };
    const onResize = () => {
      resize();
      if (reduceMotion.matches) draw(now());
    };
    const onScroll = () => {
      const y = window.scrollY;
      surge = Math.min(surge + Math.abs(y - lastScrollY) * 0.012, 1.4);
      lastScrollY = y;
    };
    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        // Resuming: drop the stale timestamp so dt starts fresh.
        lastFrameT = 0;
        run();
      }
    };
    const onMotionChange = () => {
      stop();
      run();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        onScreen ? run() : stop();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    run();

    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerout", onLeave, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reduceMotion.addEventListener?.("change", onMotionChange);

    return () => {
      stop();
      clearTimeout(restoreTimer);
      io.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerout", onLeave);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMotion.removeEventListener?.("change", onMotionChange);
      if (gl && !gl.isContextLost()) {
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(buffer);
      }
    };
  }, []);

  if (failed) {
    // Static lattice, same palette, no WebGL required.
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-SageGray) 1.5px, transparent 1.6px)",
          backgroundSize: "22px 22px",
          maskImage: "linear-gradient(to top, transparent 8%, black 65%)",
          WebkitMaskImage: "linear-gradient(to top, transparent 8%, black 65%)",
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 z-0 w-full h-full"
    />
  );
};

export default ComputeField;
