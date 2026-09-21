# 八字排盘 · React 版

在线地址：https://bazi-pan.netlify.app

单文件旧版已重构为 React + Vite 项目，方便后续维护与功能迭代。

## 功能

- 生辰输入：姓名（可选）、性别、阳历生日、出生时间、出生地（国内省→市两级选择＋海外城市搜索，186 个城市带经度）
- 简盘 / 细盘 / 星座 三个 Tab
- 四柱、十神、藏干、五行统计、大运、流年
- 胎元、胎息、命宫、身宫、空亡、十二长生、自坐、纳音、常见神煞
- 真太阳时校正（含中国 1986–1991 历史夏令时、时差方程）
- 十二星座详解（性格 / 爱情 / 事业 / 财运 / 幸运物 / 绝配 / 毒舌短评 / 星座×八字联动）

## 开发

```bash
npm install
npm run dev      # 本地开发
npm run build    # 打包，产物为 dist/index.html（单文件，含内联 CSS/JS）
```

## 回归测试

```bash
node test-bazi.mjs   # 纯数据排盘逻辑测试
```

## 部署

构建产物 `dist/index.html` 直接部署到 Netlify 站点 `bazi-pan` 即可（单文件，无外部资源）。

## 目录结构

- `src/lib/` — 纯数据逻辑：排盘（bazi.js）、常量表（constants.js）、城市经度（places.js）、真太阳时（solarTime.js）、星座资料（xingzuo.js）
- `src/components/` — 出生表单、出生地选择器、简盘、细盘、星座
- `src/App.jsx` — 状态管理与 Tab 切换
