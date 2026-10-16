import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ExperienceScene() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = mount.current;
    if (!root) return;

    const canvas = document.createElement("canvas");
    canvas.className = "hero-canvas";
    root.appendChild(canvas);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      canvas.remove();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const resolution = new THREE.Vector2(1, 1);
    const pointer = new THREE.Vector2(0.5, 0.5);
    const targetPointer = new THREE.Vector2(0.5, 0.5);

    const fieldMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uTime: { value: 0 }, uResolution: { value: resolution }, uPointer: { value: pointer } },
      vertexShader: `
        varying vec2 vUv;
        void main(){ vUv=uv; gl_Position=vec4(position,1.0); }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uPointer;

        float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123); }
        float noise(vec2 p){
          vec2 i=floor(p); vec2 f=fract(p); f=f*f*(3.0-2.0*f);
          return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);
        }
        float line(float x,float w){ return 1.0-smoothstep(0.0,w,abs(x)); }

        void main(){
          vec2 uv=vUv-.5;
          float aspect=uResolution.x/max(uResolution.y,1.0);
          uv.x*=aspect;
          vec2 mouse=uPointer-.5; mouse.x*=aspect;
          float t=uTime*.085;

          float n=noise(uv*2.2+vec2(t*.65,-t*.32));
          vec2 p=uv;
          p.x += (n-.5)*.16 + mouse.x*.045;
          p.y += (noise(uv*3.8+t)-.5)*.055 + mouse.y*.04;

          float contour=0.0;
          for(int i=0;i<11;i++){
            float fi=float(i);
            float band=-.54+fi*.105;
            float wave=.035*sin(p.x*(2.4+fi*.12)+t*(1.3+fi*.08)+fi*.67);
            wave += .014*sin(p.x*9.0-t*1.7+fi*1.9);
            contour += line(p.y-(band+wave),.0015)*(1.0-fi*.05);
          }

          vec2 q=p-vec2(.15,.02)-mouse*.07;
          q.x*=.74;
          float radius=length(q);
          float orbit=0.0;
          for(int i=0;i<5;i++){
            float fi=float(i);
            float r=.27+fi*.115+sin(t*.75+fi)*.008;
            orbit += line(radius-r,.00145)*(0.72-fi*.08);
          }

          float diagonal=abs(sin((p.x*.88+p.y*1.1-t*.55)*38.0));
          float grain=smoothstep(.975,1.0,diagonal)*.11;
          float glow=exp(-length(p-mouse*.85)*4.2);
          float moving=exp(-pow(p.x-(sin(t*.8)*.34),2.0)*8.0)*.045;
          float edge=smoothstep(1.42,.34,length(uv*vec2(.86,1.12)));

          vec3 dark=vec3(.10,.105,.095);
          vec3 lime=vec3(.84,1.0,.24);
          vec3 silver=vec3(.55,.57,.51);
          vec3 color=dark*(contour*.46+orbit*.32+grain*.38);
          color+=silver*(contour*.16+orbit*.11);
          color+=lime*(contour*.17+orbit*.17+glow*.11+moving);
          float alpha=(contour*.31+orbit*.25+grain*.35+glow*.06+moving)*edge;
          gl_FragColor=vec4(color,clamp(alpha,0.0,.28));
        }
      `,
    });

    const field = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), fieldMaterial);
    scene.add(field);

    const count = window.innerWidth < 700 ? 110 : 210;
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const radius = .45 + Math.pow(Math.random(), 1.25) * 3.7;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius * 1.18 + .12;
      positions[i * 3 + 1] = Math.sin(angle) * radius * .72;
      seeds[i] = Math.random();
      sizes[i] = .6 + Math.random() * 1.7;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    particleGeometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 1.6) } },
      vertexShader: `
        attribute float aSeed; attribute float aSize; uniform float uTime; uniform float uPixelRatio; varying float vAlpha;
        void main(){
          vec3 p=position;
          p.x += sin(uTime*(.08+aSeed*.12)+aSeed*21.0)*.11;
          p.y += cos(uTime*(.065+aSeed*.1)+aSeed*17.0)*.085;
          vec4 mv=modelViewMatrix*vec4(p,1.0);
          gl_Position=projectionMatrix*mv;
          gl_PointSize=aSize*uPixelRatio*(82.0/max(1.0,-mv.z));
          vAlpha=.08+aSeed*.22;
        }
      `,
      fragmentShader: `
        precision highp float; varying float vAlpha;
        void main(){ vec2 p=gl_PointCoord-.5; float d=length(p); float g=1.0-smoothstep(.02,.5,d); gl_FragColor=vec4(.72,.84,.30,g*vAlpha*.42); }
      `,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    let width = 1;
    let height = 1;
    let raf = 0;
    let visible = true;

    const resize = () => {
      width = root.clientWidth || window.innerWidth;
      height = root.clientHeight || window.innerHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
      renderer.setSize(width, height, false);
      resolution.set(width, height);
    };

    const onPointerMove = (event: PointerEvent) => {
      targetPointer.set(event.clientX / Math.max(window.innerWidth, 1), event.clientY / Math.max(window.innerHeight, 1));
    };

    const onVisibility = () => { visible = document.visibilityState === "visible"; };

    const render = (now: number) => {
      raf = 0;
      if (!visible) {
        raf = window.requestAnimationFrame(render);
        return;
      }
      const t = now * .001;
      fieldMaterial.uniforms.uTime.value = t;
      particleMaterial.uniforms.uTime.value = t;
      pointer.lerp(targetPointer, .035);
      fieldMaterial.uniforms.uPointer.value.copy(pointer);
      const scroll = Math.min(1, (window.scrollY || 0) / Math.max(window.innerHeight, 1));
      particles.rotation.z = t * .004;
      particles.position.x += (((pointer.x-.5)*.30)+.12-particles.position.x)*.012;
      particles.position.y += (((.5-pointer.y)*.16)+.02-particles.position.y)*.012;
      particles.scale.setScalar(1 + scroll*.04);
      renderer.render(scene, camera);
      raf = window.requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility, { passive: true });
    raf = window.requestAnimationFrame(render);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      particleGeometry.dispose();
      particleMaterial.dispose();
      fieldMaterial.dispose();
      field.geometry.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return <div ref={mount} className="hero-scene" aria-hidden="true" />;
}
