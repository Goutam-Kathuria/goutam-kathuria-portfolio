import { useEffect, useRef } from "react";
import * as THREE from "three";

type Point = { x: number; y: number };
const POINTS = 12;

const CURSOR_VERTEX = `
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = vec4(position,1.0); }
`;

const CURSOR_FRAGMENT = `
  precision highp float;
  uniform vec2 uResolution;
  uniform vec2 uHead;
  uniform vec2 uPath[12];
  uniform float uTime;
  uniform float uTrailWidth;
  uniform float uCoreWidth;
  uniform float uHeadSize;
  uniform float uTrailOpacity;
  uniform float uHeadOpacity;
  uniform vec3 uColor;
  varying vec2 vUv;

  float hash(float n){ return fract(sin(n*127.1+uTime*1.37)*43758.5453123); }
  float segmentDistance(vec2 p,vec2 a,vec2 b){
    vec2 ab=b-a; float d=max(dot(ab,ab),0.0001);
    float t=clamp(dot(p-a,ab)/d,0.0,1.0);
    return length(p-mix(a,b,t));
  }

  void main(){
    vec2 pixel=vUv*uResolution; float alpha=0.0; vec3 color=vec3(0.0);
    for(int i=0;i<11;i++){
      vec2 a=uPath[i]*uResolution; vec2 b=uPath[i+1]*uResolution;
      float p=float(i)/10.0; float taper=pow(1.0-p,0.92);
      float width=max(1.0,uTrailWidth*taper);
      float d=segmentDistance(pixel,a,b);
      float glow=1.0-smoothstep(width*0.12,width,d);
      float core=1.0-smoothstep(max(1.0,uCoreWidth*taper*0.48),max(2.0,uCoreWidth*taper),d);
      float grain=0.94+hash(float(i)+p*17.0)*0.06;
      float sa=taper*uTrailOpacity*grain;
      color+=uColor*glow*sa*0.94;
      color+=mix(uColor,vec3(1.0),0.35)*core*sa*1.42;
      alpha=max(alpha,max(glow*sa*0.92,core*sa));
    }
    vec2 head=uHead*uResolution; float hd=distance(pixel,head);
    float hg=1.0-smoothstep(uHeadSize*0.05,uHeadSize,hd);
    float hh=1.0-smoothstep(0.0,uHeadSize*0.32,hd);
    float halo=1.0-smoothstep(uHeadSize,uHeadSize*1.8,hd);
    color+=mix(uColor,vec3(1.0),0.55)*hg*0.92*uHeadOpacity;
    color+=vec3(1.0)*hh*1.55*uHeadOpacity;
    alpha=max(alpha,(hg*0.96+halo*0.28)*uHeadOpacity);
    gl_FragColor=vec4(color,clamp(alpha,0.0,1.0));
  }
`;

function seedHistory(x:number,y:number):Point[]{
  return Array.from({length:POINTS},()=>({x,y}));
}

export default function CustomCursor(){
  const ref=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const node=ref.current;
    if(!node || !window.matchMedia("(pointer:fine)").matches) return;
    document.documentElement.classList.add("has-custom-cursor");

    const canvas=document.createElement("canvas");
    canvas.className="custom-cursor-canvas";
    node.appendChild(canvas);

    let renderer:THREE.WebGLRenderer;
    try{
      renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:"high-performance"});
    }catch{
      document.documentElement.classList.remove("has-custom-cursor");
      canvas.remove();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1,2));
    renderer.setClearColor(0x000000,0);
    const scene=new THREE.Scene();
    const camera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
    const geometry=new THREE.PlaneGeometry(2,2);
    const resolution=new THREE.Vector2(window.innerWidth,window.innerHeight);
    const head=new THREE.Vector2(0.5,0.5);
    const path=Array.from({length:POINTS},()=>new THREE.Vector2(0.5,0.5));
    const material=new THREE.ShaderMaterial({
      transparent:true,depthWrite:false,depthTest:false,blending:THREE.AdditiveBlending,
      uniforms:{
        uResolution:{value:resolution},uHead:{value:head},uPath:{value:path},uTime:{value:0},
        uTrailWidth:{value:10},uCoreWidth:{value:4},uHeadSize:{value:32},
        uTrailOpacity:{value:0},uHeadOpacity:{value:0},uColor:{value:new THREE.Color("#dfff55")}
      },
      vertexShader:CURSOR_VERTEX,fragmentShader:CURSOR_FRAGMENT,
    });
    scene.add(new THREE.Mesh(geometry,material));

    let width=window.innerWidth,height=window.innerHeight;
    let targetX=width*0.5,targetY=height*0.5,headX=targetX,headY=targetY;
    let speed=0,targetSpeed=0,lastMove=performance.now(),lastFrame=lastMove,raf=0,fadeTimer=0,sparkTimer=0;
    let visible=false,resting=true,trailOpacity=0,headOpacity=0;
    let pointerPath=seedHistory(targetX,targetY),smoothedPath=seedHistory(targetX,targetY);

    const setUniforms=()=>{
      for(let i=0;i<POINTS;i++){
        path[i].set(smoothedPath[i].x/width,1-smoothedPath[i].y/height);
      }
      head.set(headX/width,1-headY/height);
    };

    const resize=()=>{
      width=window.innerWidth;height=window.innerHeight;resolution.set(width,height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1,2));
      renderer.setSize(width,height,false);
    };

    const move=(event:PointerEvent)=>{
      const nx=event.clientX,ny=event.clientY; const dx=nx-targetX,dy=ny-targetY;
      const distance=Math.hypot(dx,dy);
      if(resting){pointerPath=seedHistory(nx,ny);smoothedPath=seedHistory(nx,ny);resting=false;}
      if(distance>2.5){pointerPath.unshift({x:nx,y:ny});pointerPath=pointerPath.slice(0,POINTS);}
      targetX=nx;targetY=ny;targetSpeed=Math.min(1,distance/24);lastMove=performance.now();visible=true;
      if(fadeTimer) window.clearTimeout(fadeTimer);
      if(!raf) raf=requestAnimationFrame(render);
    };
    const leave=()=>{
      if(fadeTimer) window.clearTimeout(fadeTimer);
      fadeTimer=window.setTimeout(()=>{visible=false;},160);
    };
    const click=(event:PointerEvent)=>{
      const fragment=document.createDocumentFragment();
      for(let i=0;i<7;i++){
        const spark=document.createElement("i");const angle=Math.random()*Math.PI*2;const dist=7+Math.random()*18;
        spark.className="cursor-spark";
        spark.style.setProperty("--click-x",`${event.clientX}px`);
        spark.style.setProperty("--click-y",`${event.clientY}px`);
        spark.style.setProperty("--dx",`${Math.cos(angle)*dist}px`);
        spark.style.setProperty("--dy",`${Math.sin(angle)*dist}px`);
        spark.style.setProperty("--spark-rotate",`${angle*180/Math.PI+90}deg`);
        spark.style.setProperty("--spark-length",`${3+Math.random()*4}px`);
        spark.style.setProperty("--delay",`${Math.round(Math.random()*25)}ms`);
        fragment.appendChild(spark);
      }
      document.body.appendChild(fragment);
      if(sparkTimer) window.clearTimeout(sparkTimer);
      sparkTimer=window.setTimeout(()=>document.querySelectorAll(".cursor-spark").forEach((el)=>el.remove()),420);
    };

    function render(now:number){
      raf=0; const dt=Math.min(0.032,Math.max(0.001,(now-lastFrame)/1000));lastFrame=now;
      const follow=1-Math.pow(0.0000001,dt);headX+=(targetX-headX)*follow;headY+=(targetY-headY)*follow;
      if(now-lastMove>50) targetSpeed*=Math.pow(0.004,dt);
      speed+=(targetSpeed-speed)*(1-Math.pow(0.0008,dt));
      if(speed<0.0005){speed=0;resting=true;}
      const trailFollow=0.24+speed*0.13;
      smoothedPath[0].x+=(headX-smoothedPath[0].x)*0.82;smoothedPath[0].y+=(headY-smoothedPath[0].y)*0.82;
      for(let i=1;i<POINTS;i++){
        const source=pointerPath[Math.min(i-1,pointerPath.length-1)]||pointerPath[pointerPath.length-1];
        const point=smoothedPath[i],f=Math.min(0.62,trailFollow+i*0.0025);
        point.x+=(source.x-point.x)*f;point.y+=(source.y-point.y)*f;
      }
      const targetHead=visible?0.94:0,targetTrail=visible?Math.min(1,speed*2.5+(speed>0.012?0.12:0)):0;
      headOpacity+=(targetHead-headOpacity)*(1-Math.pow(0.00015,dt));
      trailOpacity+=(targetTrail-trailOpacity)*(1-Math.pow(0.00035,dt));
      material.uniforms.uTime.value=now*0.001;
      material.uniforms.uTrailWidth.value=10+speed*26;
      material.uniforms.uCoreWidth.value=3.4+speed*9;
      material.uniforms.uHeadSize.value=31+speed*9;
      material.uniforms.uTrailOpacity.value=trailOpacity;material.uniforms.uHeadOpacity.value=headOpacity;setUniforms();
      renderer.render(scene,camera);
      if(visible||headOpacity>0.006||trailOpacity>0.006||speed>0.001) raf=requestAnimationFrame(render);
    }

    resize();window.addEventListener("resize",resize,{passive:true});window.addEventListener("pointermove",move,{passive:true});window.addEventListener("pointerleave",leave,{passive:true});window.addEventListener("pointerdown",click,{passive:true});
    raf=requestAnimationFrame(render);
    return()=>{
      document.documentElement.classList.remove("has-custom-cursor");
      if(raf) cancelAnimationFrame(raf);if(fadeTimer) window.clearTimeout(fadeTimer);if(sparkTimer) window.clearTimeout(sparkTimer);
      window.removeEventListener("resize",resize);window.removeEventListener("pointermove",move);window.removeEventListener("pointerleave",leave);window.removeEventListener("pointerdown",click);
      document.querySelectorAll(".cursor-spark").forEach((el)=>el.remove());geometry.dispose();material.dispose();renderer.dispose();canvas.remove();
    };
  },[]);

  return <div ref={ref} className="custom-cursor" aria-hidden="true"/>;
}
