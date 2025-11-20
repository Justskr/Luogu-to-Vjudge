# 一键跳转VJudge脚本 Luogu-to-Vjudge

保命声明：完全开源免费，拒绝商业化。仅供学术研究，严禁用于一切非正当行为。保护知识产权，拒绝抄袭。

## 脚本简介

**洛谷**和**VJudge**是两大高频使用的平台。

洛谷题量丰富、社区活跃，VJudge则支持多平台题目聚合、组队训练，二者结合能大幅提升刷题效率。

随着洛谷 RMJ 死了，刷一些其他 OJ 的题便不是那么太方便了，而 Vjudge 则可以提交 CF、AT、SPOJ等的题目，而且自由度较高，还是比较好用的。

于是，就有了这个脚本（网上的很多脚本由于洛谷新升级都无法使用了）。有很多优点：

### 方便快捷

手动在两个平台间切换题目、查找对应编号，往往要耗费不少时间。而“洛谷一键跳转VJudge”脚本，可以彻底解决跨平台刷题的效率痛点。

脚本为洛谷刷题用户打造（适配洛谷新版 UI），支持**CF、SPOJ、AtCoder、UVA**四大竞赛平台的题目一键跳转，自动识别洛谷题目编号，精准拼接VJudge对应链接，让跨平台刷题“一步到位”。


### 美观大气

在视觉效果方面，与洛谷原生按钮“无缝融合”

![Snipaste 2025 11 20 21 22 57](https://s1.imagehub.cc/images/2025/11/20/c4de87ebbf703f430fda5ffd505b70b0.png)

脚本生成的“跳转VJudge”按钮，**样式、位置完全匹配洛谷按钮**——从背景色、字体、高度到对齐方式，均与原生按钮一致，不会破坏页面美观。点击后自动在新标签页打开VJudge题目，不影响当前洛谷页面的刷题进度。


## 使用指南

### 步骤1：安装脚本管理器

首先安装浏览器的脚本管理扩展（如**Tampermonkey**或**Violentmonkey**），可在浏览器扩展商店直接搜索安装。

相信很多人都喜欢用。比如我，已经装了八个脚本了。

![Snipaste 2025 11 20 21 24 42](https://s1.imagehub.cc/images/2025/11/20/062b313345bc4732ef882f1cf584b74a.png)


### 步骤2：添加“洛谷跳转VJudge”脚本


打开脚本管理器，新建用户脚本，将以下代码复制粘贴并保存：

```javascript
// ==UserScript==
// @name         洛谷rmj一键跳转VJudge
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  支持洛谷CF/SPOJ/AtCoder/UVA题目跳转VJudge，自动匹配各平台链接格式
// @author       Justskr
// @match        https://www.luogu.com.cn/problem/CF*
// @match        https://www.luogu.com.cn/problem/SP*
// @match        https://www.luogu.com.cn/problem/AT*
// @match        https://www.luogu.com.cn/problem/UVA*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function getVjudgeUrl() {
        const luoguUrl = window.location.href;
        const luoguPath = window.location.pathname;

        if (luoguPath.startsWith('/problem/AT_')) {
            const atMatch = luoguPath.match(/AT_(\w+)/);
            return atMatch ? `https://vjudge.net/problem/AtCoder-${atMatch[1]}` : null;
        }
        else if (luoguPath.startsWith('/problem/UVA')) {
            const uvaMatch = luoguPath.match(/UVA(\d+)/);
            return uvaMatch ? `https://vjudge.net/problem/UVA-${uvaMatch[1]}` : null;
        }
        else if (luoguPath.startsWith('/problem/CF')) {
            const cfMatch = luoguPath.match(/CF(\d+[A-Za-z]?)/);
            return cfMatch ? `https://vjudge.net/problem/CodeForces-${cfMatch[1]}` : null;
        }
        else if (luoguPath.startsWith('/problem/SP')) {
            let spojId = null;
            const originalLink = document.querySelector('a[href*="spoj.com/problems/"]');
            if (originalLink) {
                spojId = originalLink.href.split('/problems/')[1].replace('/', '');
            }
            else {
                const pageText = document.body.innerText;
                const spojTextMatch = pageText.match(/SPOJ\s*[-\s:]([A-Za-z0-9_-]+)/i);
                spojId = spojTextMatch ? spojTextMatch[1].trim() : null;
            }
            return spojId ? `https://vjudge.net/problem/SPOJ-${spojId}` : null;
        }

        return null;
    }

    const copyBtn = Array.from(document.querySelectorAll('button')).find(
        btn => btn.innerText.trim() === '复制题目'
    );

    const vjudgeUrl = getVjudgeUrl();
    if (copyBtn && vjudgeUrl) {
        const jumpBtn = document.createElement('button');
        jumpBtn.innerText = '跳转VJudge';

        const copyStyles = window.getComputedStyle(copyBtn);
        [
            'backgroundColor', 'color', 'border', 'borderRadius',
            'padding', 'fontSize', 'fontFamily', 'cursor', 'height',
            'lineHeight', 'textAlign', 'whiteSpace', 'verticalAlign',
            'display', 'marginTop', 'marginBottom'
        ].forEach(styleProp => {
            jumpBtn.style[styleProp] = copyStyles[styleProp];
        });

        jumpBtn.style.marginLeft = '5px';
        jumpBtn.style.minWidth = copyStyles.minWidth || '80px';

        jumpBtn.addEventListener('click', () => {
            window.open(vjudgeUrl, '_blank');
        });

        copyBtn.parentNode.insertBefore(jumpBtn, copyBtn.nextSibling);
    }
    else if (!vjudgeUrl) {
        const platform = luoguPath.match(/\/problem\/(\w+)/)[1].slice(0, 2);
        console.warn(`洛谷${platform}题目跳转VJudge：未找到有效题目标识符，请检查页面格式`);
    }
})();
```


### 步骤3：一键跳转，即刻体验

打开洛谷任意支持平台的题目页（如CF、AtCoder题），页面顶部“复制题目”按钮右侧会出现“跳转VJudge”按钮，点击即可直接跳转到VJudge对应题目，全程无需手动输入编号！


完结撒花。
