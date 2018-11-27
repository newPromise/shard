import XLSX from "xlsx"
//导出excel

class ExportExcel{
  constructor({data=[],head={},type='xlsx',fileName='data',contentType='application/octet-stream'}){
    this.data=data;
    this.head=head;
    this.type=type;
    this.fileName=fileName+'.'+this.type;
    this.contentType=contentType;
  }
  // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
  getCharCol(n) {
    let temCol = '',
      s = '',
      m = 0
    while (n > 0) {
      m = n % 26 + 1
      // 使用 String.fromCharCode(num) 将 Unicode 值转为字符串
      // num 必须， 创建的字符串中字符的 Unicode 编码
      s = String.fromCharCode(m + 64) + s
      n = (n - m) / 26
    }
    return s
  }
  // 字符串转字符流
  s2ab(str) {
    // 转为 ArrayBuffer 对象
    let buf = new ArrayBuffer(str.length);
    // 转为一个 8 进制
    let view = new Uint8Array(buf);
    // 使用 str.charCodeAt(i) 用于返回指定位置的字符编码
    for (let i = 0; i != str.length; ++i) view[i] = str.charCodeAt(i) & 0xFF;
    return buf;
  }
  setTemplate(){
    let tmpdata = [],//用来保存转换好的json
      keys={},//设置表头
      keyMap = [];//获取键名
    for (let k in this.data[0]) {
      keyMap.push(k);
      keys[k] = k;
    }
    if(Object.keys(this.head).length&&Object.prototype.toString.call(this.head)==="[object Object]"){
      this.data.unshift(this.head);
    }else{
      this.data.unshift(keys);
    }
    // console.log(JSON.stringify(this.data[0]))
    this.data.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
      v: v[k],
      position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
    }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => tmpdata[v.position] = {v: v.v});
    let outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
    let tmpWB = {
      SheetNames: ['mySheet'], //保存的表标题
      Sheets: {
        'mySheet': Object.assign({},
          tmpdata, //内容
          {
            '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
          })
      }
    };
    return new Blob([this.s2ab(XLSX.write(tmpWB,
      {bookType: this.type,bookSST: false, type: 'binary'}//这里的数据是用来定义导出的格式类型
    ))], {
      type: this.contentType
    });
  }
  downloadFile(){
    //创建二进制对象写入转换好的字节流
    let href = URL.createObjectURL(this.setTemplate()); //创建对象超链接
    let a=document.createElement("a");
    a.href = href;
    a.download=this.fileName;
    a.style.display='none';
    //不添加到body 在火狐中不能下载
    document.body.appendChild(a)
    a.click()
  }
}
export default ExportExcel
