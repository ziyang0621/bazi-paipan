/* 八字 React 移植验收测试：node 直接 import src/lib 模块 */
import {execSync} from 'child_process';
import {computeBazi} from './src/lib/bazi.js';
import {trueSolar} from './src/lib/solarTime.js';
import {PLACES, CITY_LNG} from './src/lib/places.js';

let pass = 0, fail = 0;
function check(name, cond, detail){
  if(cond){ pass++; console.log('✓', name); }
  else{ fail++; console.log('✗', name, detail||''); }
}

// 1. 四柱：1990-06-21 08:58 杭州
{
  const r = computeBazi({name:'', gender:'男', date:'1990-06-21', time:'08:58', place:'杭州', solarTOn:true});
  const sz = r.error ? 'ERROR:'+r.error : r.pillars.map(p=>p.gan+p.zhi).join(' / ');
  check('四柱 庚午/壬午/丁巳/甲辰', sz==='庚午 / 壬午 / 丁巳 / 甲辰', sz);
}

// 2. 真太阳时
{
  const m1 = trueSolar(new Date(1990,5,21,8,58), '杭州', true).minutes;
  const m2 = trueSolar(new Date(2020,5,21,8,58), '杭州', true).minutes;
  const m3 = trueSolar(new Date(1990,5,21,8,58), '乌鲁木齐', true).minutes;
  check('杭州1990 ≈ −61', Math.abs(Math.round(m1)-(-61))<=1, m1);
  check('杭州2020 ≈ −1', Math.abs(Math.round(m2)-(-1))<=1, m2);
  check('乌鲁木齐1990 ≈ −191', Math.abs(Math.round(m3)-(-191))<=1, m3);
}

// 3. PLACES / CITY_LNG 与源码一致
{
  const srcCn = execSync(`grep -o "\\['cn'" /home/hatch/workspace/bazi-site/index.html | wc -l`).toString().trim();
  const srcOs = execSync(`grep -o "\\['os'" /home/hatch/workspace/bazi-site/index.html | wc -l`).toString().trim();
  const newCn = PLACES.filter(p=>p[0]==='cn').length;
  const newOs = PLACES.filter(p=>p[0]==='os').length;
  check(`PLACES 国内 ${newCn}==源码${srcCn}`, String(newCn)===srcCn, `${newCn} vs ${srcCn}`);
  check(`PLACES 海外 ${newOs}==源码${srcOs}`, String(newOs)===srcOs, `${newOs} vs ${srcOs}`);
  check('CITY_LNG 186 条', Object.keys(CITY_LNG).length===186, Object.keys(CITY_LNG).length);
}

// 4. 隐私：全仓库无该敏感词
{
  const n = execSync(`grep -r "开\u5e73" /home/hatch/workspace/bazi-react/src /home/hatch/workspace/bazi-react/index.html 2>/dev/null | wc -l`).toString().trim();
  check('无敏感词', n==='0', n+' 处');
}

// 5. 错误分支
{
  check('空日期报错', computeBazi({date:'',time:'08:58'}).error==='请先选择出生日期 📅');
  check('空时间报错', computeBazi({date:'1990-06-21',time:''}).error==='请先选择出生时间 ⏰');
  const e3 = computeBazi({date:'1990-06-21',time:'08:58',place:'火星',solarTOn:true}).error||'';
  check('未知地报错', e3.indexOf('找不到出生地"火星"')===0, e3);
}

// 6. 细盘/基本信息/星座数据完整性
{
  const r = computeBazi({gender:'男', date:'1990-06-21', time:'08:58', place:'杭州', solarTOn:true});
  check('细盘 6 列', r.xipan.cols.length===6, r.xipan.cols.length);
  check('细盘神煞非空', r.xipan.cols.some(c=>c.shensha.length>0));
  check('基本信息 9 行', r.basic.length===9, r.basic.length);
  check('星座=双子(idx2)', r.xingzuo.myIndex===2, r.xingzuo.myIndex);
  check('大运 9 步', r.dayun.list.length===9, r.dayun.list.length);
  check('流年有数据', r.dayun.list.every(d=>d.liunian.length>0));
}

console.log(`\n${pass} 通过, ${fail} 失败`);
process.exit(fail?1:0);
