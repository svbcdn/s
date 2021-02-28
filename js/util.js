((global) => {
  function query() {
    let squery = location.search.replace(/^\?\s*/, '').split(/&|&amp;/g);
    let map = {};
    squery.forEach((part, i) => {
      let kv = part.split('=');
      let key = kv[0].trim();
      let value = decodeURIComponent((kv[1] || '').trim());
      map[key] = value;
    });
    return map;
  }
  function download(content, filename) {
    if (!content) return;
    // 创建隐藏的可下载链接
    var eleLink = document.createElement('a');
    eleLink.download = filename||'';
    eleLink.style.display = 'none';
    // 字符内容转变成blob地址
    var blob = content instanceof Blob ? content : new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
  }
  function downloadImage(url) {
    var img = new Image();
    img.onload = function() {
      var canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext('2d');
      // 将img中的内容画到画布上
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // 将画布内容转换为Blob
      canvas.toBlob((blob) => {
        // blob转为同源url
        var blobUrl = window.URL.createObjectURL(blob);
        download(blobUrl)
      });
    };
    img.src = url;
    // 必须设置，否则canvas中的内容无法转换为blob
    img.setAttribute('crossOrigin', 'Anonymous');
  }

  function showIframe(url, domId){
    setTimeout(()=>{
      let iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.setAttribute("id", "ifrmmme");
      iframe.setAttribute("width", "100%");
      iframe.setAttribute("minHeight", "400px");
      iframe.setAttribute("scrolling", "yes");
      iframe.setAttribute("allowtransparency", "yes");
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("border", "0");
      iframe.style.height = window.innerHeight +'px';
      document.querySelector("#"+domId).appendChild(iframe);
    }, 100);
  }
  function delIframe(){
   let iframe = document.querySelector('#ifrmmme');
   iframe && iframe.parentElement.removeChild(iframe)
  }
  global.util = {
    query,
    download,
    downloadImage,
    async fetch(...args){
      let v = await axios(...args);
      return v.data;
    },
    showIframe,
    delIframe
  };
})(window);
