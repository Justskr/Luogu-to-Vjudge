// ==UserScript==
// @name         洛谷rmj一键跳转VJudge
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  支持洛谷CF/SPOJ/AtCoder/UVA题目跳转VJudge，修复CF带数字后缀的编号匹配
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
            // 修复CF编号匹配
            const cfMatch = luoguPath.match(/CF(\d+[A-Za-z\d]*)/);
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

