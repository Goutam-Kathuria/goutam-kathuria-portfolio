import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export default function LoadingScreen(){
  const [visible,setVisible]=useState(true);
  const [progress,setProgress]=useState(0);
  useEffect(()=>{
    let frame=0;let start=performance.now();
    const tick=(now:number)=>{const p=Math.min(100,Math.floor(((now-start)/1150)*100));setProgress(p);if(p<100)frame=requestAnimationFrame(tick);else window.setTimeout(()=>setVisible(false),180);};
    frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
  },[]);
  return <AnimatePresence>{visible&&<motion.div className="loading-screen" initial={{opacity:1}} exit={{opacity:0,transition:{duration:.55,ease:"easeInOut"}}}><div className="loader-top"><span>GK / DEV</span><span>LOADING PORTFOLIO</span></div><div className="loader-center"><div className="loader-word">GOUTAM<br/><em>KATHURIA</em></div><div className="loader-line"><i style={{width:`${progress}%`}}/></div><div className="loader-progress">{String(progress).padStart(3,"0")} %</div></div><div className="loader-bottom"><span>PORTFOLIO / 2026</span><span>GOUTAM KATHURIA / 2026</span></div></motion.div>}</AnimatePresence>;
}
