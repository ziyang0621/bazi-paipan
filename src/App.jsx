/* 八字排盘 React 版：状态管理 + tab 切换 */
import {useEffect, useRef, useState} from 'react';
import BirthForm from './components/BirthForm.jsx';
import JianPan from './components/JianPan.jsx';
import XiPan from './components/XiPan.jsx';
import Xingzuo from './components/Xingzuo.jsx';

export default function App(){
  const [tab,setTab]=useState('jian');
  const [result,setResult]=useState(null);
  const resultRef=useRef(null);

  function handlePaipan(r){
    setResult(r);
    setTab('jian');
  }
  useEffect(()=>{
    if(result&&resultRef.current){
      try{resultRef.current.scrollIntoView({behavior:'smooth'});}catch(e){}
    }
  },[result]);

  return (
    <>
      <div className="blob a"></div><div className="blob b"></div><div className="blob c"></div>
      <div className="wrap">
        <h1>八字排盘</h1>
        <div className="sub"><span>✨ 输入生日，3 秒看懂你的命盘</span></div>

        <BirthForm onPaipan={handlePaipan}/>

        {result? (
        <div id="result" ref={resultRef}>
          <div className="tabs">
            <button type="button" id="tabJian" className={tab==='jian'?'on':''} onClick={()=>setTab('jian')}>简盘</button>
            <button type="button" id="tabXi" className={tab==='xi'?'on':''} onClick={()=>setTab('xi')}>细盘</button>
            <button type="button" id="tabXz" className={tab==='xz'?'on':''} onClick={()=>setTab('xz')}>星座</button>
          </div>
          <div id="paneJian" className={tab==='jian'?'':'hidden'}>
            <JianPan data={result}/>
          </div>
          <div id="paneXi" className={tab==='xi'?'':'hidden'}>
            <XiPan data={result}/>
          </div>
          <div id="paneXz" className={tab==='xz'?'':'hidden'}>
            <Xingzuo data={result}/>
          </div>
        </div>):null}

        <div className="foot">八字排盘 · 年轻人版 😌<br/>仅供学习娱乐参考</div>
      </div>
    </>
  );
}
