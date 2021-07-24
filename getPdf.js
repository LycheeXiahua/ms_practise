const puppeteer = require('puppeteer');
const fs = require('fs');

(async ()=>{

   //指定存放pdf的文件夹
   const folder = 'vueDoc'
   fs.mkdir(folder,()=>{ console.log('文件夹创建成功') })

    //启动无头浏览器
   const browser = await puppeteer.launch({headless:true }) //PDF 生成仅在无界面模式支持, 调试完记得设为 true
   const page = await browser.newPage();
   await page.goto('https://cn.vuejs.org/v2/guide/index.html'); //默认会等待页面load事件触发

   // 1) 已知Vue文档左侧菜单结构为：.menu-root>li>a
   // 获取所有一级链接
   const urls = await page.evaluate(()=>{
      return new Promise( resolve => {
         const aNodes = $('.menu-root>li>a')
         const urls = aNodes.map(n=>{
               return aNodes[n].href
         })        
         resolve(urls);
      })
   })

   // 2）遍历 urls, 逐个访问并生成 pdf
   for( let i = 0; i<urls.length; i++ ){
      const url = urls[i], 
         tmp = url.split('/'),
         fileName = tmp[tmp.length-1].split('.')[0]
      await page.goto(url); //默认会等待页面load事件触发
      await page.pdf({path: `./${folder}/${i}_${fileName}.pdf`}); //指定生成的pdf文件存放路径
      console.log(`${i}_${fileName}.pdf 已生成`)
   }

   page.close()
   browser.close();
})()
