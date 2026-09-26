import { useEffect, useRef, useState } from "react";

/**
 * The hero's lattice: cells lit by travelling wavefronts, with a pointer halo
 * and a click ripple. Scoped to the hero section only — absolutely positioned
 * inside it, not fixed to the viewport.
 *
 * On load it doubles as the intro: cells sample the portrait's luminance and
 * resolve the face out of the grid before the real image crossfades in. This
 * component owns that crossfade (it sets the [data-portrait] element's opacity
 * itself) so the halftone and the photo cannot drift apart.
 *
 * Raw WebGL, one fragment shader, no geometry, no 3D library. Pauses when
 * scrolled out of view or when the tab is hidden, caps DPR, honours
 * reduced-motion, and degrades to a static CSS lattice if WebGL is unavailable
 * or the context is lost for good.
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
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
uniform float uReveal;
uniform vec4  uPortraitRect;   // x, y, w, h in device px (y already flipped)
uniform sampler2D uPortrait;
uniform float uHasPortrait;

// --color-SageGray / --color-gold from index.css
const vec3 SAGE = vec3(0.545, 0.545, 0.451);
const vec3 GOLD = vec3(0.812, 0.639, 0.333);

void main() {
  vec2 p = gl_FragCoord.xy;

  vec2 cellId     = floor(p / uCell);
  vec2 cellCenter = (cellId + 0.5) * uCell;
  vec2 local      = (p - cellCenter) / (uCell * 0.5);
  vec2 uv         = cellCenter / uRes;

  float t = uPhase;

  // Two travelling wavefronts crossing the lattice at different rates.
  float w1 = sin((uv.x * 5.5 + uv.y * 2.5) * 3.14159 - t * 1.15);
  float w2 = sin((uv.x * -3.5 + uv.y * 6.0) * 3.14159 - t * 0.75 + 1.7);
  float energy = smoothstep(0.25, 0.95, w1 * 0.6 + w2 * 0.4);

  // Pointer: steady halo, plus one expanding ring per click.
  float d    = distance(cellCenter, uPointer);
  float halo = smoothstep(uRes.y * 0.28, 0.0, d) * 0.5;
  float age  = max(uTime - uPointerT, 0.0);
  float ring = exp(-pow((d - age * 900.0) / 90.0, 2.0)) * exp(-age * 1.8);

  energy = clamp(energy * (1.0 + uSurge * 0.45) + halo + ring * 1.15, 0.0, 1.4);

  // Keep the lower band calm so the headline stays readable.
  // gl_FragCoord.y is bottom-up, so uv.y == 0.0 is where the type sits.
  energy *= mix(0.18, 1.0, smoothstep(0.0, 0.6, uv.y));

  // Intro: resolve the portrait out of the lattice before the image fades in.
  float portrait = 0.0;
  if (uHasPortrait > 0.5 && uReveal < 1.0) {
    vec2 rel = (cellCenter - uPortraitRect.xy) / uPortraitRect.zw;
    if (rel.x > 0.0 && rel.x < 1.0 && rel.y > 0.0 && rel.y < 1.0) {
      vec3 tex = texture2D(uPortrait, vec2(rel.x, 1.0 - rel.y)).rgb;
      float lum = dot(tex, vec3(0.299, 0.587, 0.114));
      // Bright pixels make the big cells. Inverted, the dark background fills
      // in and the lit face reads as a hole rather than a portrait.
      float shade = smoothstep(0.16, 0.72, lum);
      portrait = shade * (1.0 - smoothstep(0.50, 1.0, uReveal));
    }
  }
  energy = max(energy, portrait * 1.25);

  // Squircle cell.
  float sd     = pow(pow(abs(local.x), 6.0) + pow(abs(local.y), 6.0), 1.0 / 6.0);
  float radius = 0.16 + 0.46 * energy;
  float edge   = 3.0 / uCell;
  float mask   = 1.0 - smoothstep(radius - edge, radius + edge, sd);

  vec3  color = mix(SAGE, GOLD, smoothstep(0.1, 0.95, energy));
  float alpha = mask * (0.10 + 0.62 * energy);

  gl_FragColor = vec4(color * alpha, alpha); // premultiplied
}
`;

const compile = (gl, type, src) => {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s);
    return null;
  }
  return s;
};

const RESTORE_GRACE_MS = 1500;
const REVEAL_SECONDS = 1.9;

const LatticeField = () => {
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
    let texture = null;
    let u = {};
    let ready = false;
    let hasPortrait = 0;

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
    let reveal = reduceMotion.matches ? 1 : 0;
    let introStarted = reduceMotion.matches;
    let introSafety = 0;
    const start = performance.now();

    const now = () => (performance.now() - start) / 1000;

    const portraitEl = () => document.querySelector("[data-portrait]");

    // Whatever happens — texture error, slow decode, lost context — the real
    // portrait must end up visible.
    const finishIntro = () => {
      clearTimeout(introSafety);
      reveal = 1;
      const el = portraitEl();
      if (el) el.style.opacity = "";
    };

    const portraitRect = () => {
      const el = portraitEl();
      if (!el) return [0, 0, 1, 1];
      const r = el.getBoundingClientRect();
      const c = canvas.getBoundingClientRect();
      // relative to the canvas, and gl_FragCoord is bottom-up
      return [
        (r.left - c.left) * dpr,
        (c.bottom - r.bottom) * dpr,
        r.width * dpr,
        r.height * dpr,
      ];
    };

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
      gl.uniform1f(u.reveal, reveal);
      gl.uniform1f(u.hasPortrait, hasPortrait);
      if (hasPortrait && reveal < 1) {
        const r = portraitRect();
        gl.uniform4f(u.portraitRect, r[0], r[1], r[2], r[3]);
      }
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

      if (introStarted && reveal < 1) {
        reveal = Math.min(reveal + dt / REVEAL_SECONDS, 1);
        const el = portraitEl();
        if (el) {
          // image fades in across the back half of the reveal, crossing the
          // halftone as it dissolves
          const o = Math.max(0, Math.min((reveal - 0.45) / 0.45, 1));
          el.style.opacity = String(o);
        }
        if (reveal >= 1) finishIntro();
      }
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
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
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
        reveal: gl.getUniformLocation(program, "uReveal"),
        portraitRect: gl.getUniformLocation(program, "uPortraitRect"),
        portrait: gl.getUniformLocation(program, "uPortrait"),
        hasPortrait: gl.getUniformLocation(program, "uHasPortrait"),
      };

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.uniform1i(u.portrait, 0);

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

    // Kept separate from img.onload: a context loss destroys the texture, so
    // this has to be runnable again after a restore.
    const uploadPortrait = () => {
      if (!ready || gl.isContextLost() || !img || !img.complete) return;
      try {
        // Upload a small RGBA buffer rather than the decoded WebP directly —
        // the lattice only samples one texel per ~22px cell.
        const TW = 128;
        const TH = 128;
        const off = document.createElement("canvas");
        off.width = TW;
        off.height = TH;
        const ctx = off.getContext("2d");
        if (!ctx) throw new Error("no 2d context");

        // Match the <img>'s object-cover / object-top 4:5 crop, or the halftone
        // won't line up with the photo it dissolves into.
        const sw = img.naturalWidth;
        const sh = img.naturalHeight;
        const AR = 4 / 5;
        let cw = sh * AR;
        let ch = sh;
        if (cw > sw) {
          cw = sw;
          ch = sw / AR;
        }
        ctx.drawImage(img, (sw - cw) / 2, 0, cw, ch, 0, 0, TW, TH);
        const pixels = new Uint8Array(ctx.getImageData(0, 0, TW, TH).data.buffer);

        texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, TW, TH, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        if (gl.getError() !== gl.NO_ERROR || gl.isContextLost()) {
          throw new Error("texture upload failed");
        }
        hasPortrait = 1;
      } catch {
        finishIntro();
        return;
      }

      // Hide the real portrait and let the lattice resolve it instead.
      const el = portraitEl();
      if (el) el.style.opacity = "0";
      introStarted = true;
      introSafety = setTimeout(finishIntro, (REVEAL_SECONDS + 2) * 1000);
    };

    let img = null;
    if (!reduceMotion.matches) {
      img = new Image();
      img.decoding = "async";
      img.onload = () => uploadPortrait();
      img.onerror = () => {
        hasPortrait = 0;
        finishIntro();
      };
      img.src = "/images/portrait.webp";
    }

    // Context loss is routine on mobile (backgrounding, memory pressure). Without
    // preventDefault the browser will not attempt to restore it at all.
    const onLost = (e) => {
      e.preventDefault();
      ready = false;
      hasPortrait = 0;
      stop();
      clearTimeout(restoreTimer);
      restoreTimer = setTimeout(() => setFailed(true), RESTORE_GRACE_MS);
    };
    const onRestored = () => {
      clearTimeout(restoreTimer);
      if (!build()) {
        setFailed(true);
        return;
      }
      // The texture died with the context. If the intro had barely begun, this
      // was a hiccup during load — re-arm it. Mid-session, just settle.
      if (reveal < 0.1 && img && img.complete && img.naturalWidth > 0) {
        reveal = 0;
        introStarted = false;
        uploadPortrait();
      } else {
        finishIntro();
      }
      run();
    };

    const toGl = (e) => {
      const r = canvas.getBoundingClientRect();
      pointer = [(e.clientX - r.left) * dpr, (r.bottom - e.clientY) * dpr];
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
    const onScroll = () => {
      const y = window.scrollY;
      surge = Math.min(surge + Math.abs(y - lastScrollY) * 0.012, 1.4);
      lastScrollY = y;
    };
    const onResize = () => {
      resize();
      if (reduceMotion.matches) draw(now());
    };
    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
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
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerout", onLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reduceMotion.addEventListener?.("change", onMotionChange);

    return () => {
      stop();
      io.disconnect();
      clearTimeout(restoreTimer);
      clearTimeout(introSafety);
      const el = portraitEl();
      if (el) el.style.opacity = "";
      if (img) {
        img.onload = null;
        img.onerror = null;
      }
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerout", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMotion.removeEventListener?.("change", onMotionChange);
      if (gl && !gl.isContextLost()) {
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(buffer);
        if (texture) gl.deleteTexture(texture);
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

export default LatticeField;
