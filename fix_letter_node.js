const fs = require('fs');
const path = 'index.html';
let s = fs.readFileSync(path, 'utf8');
s = s.replace(/\u2019/g, "'");
s = s.replace("ride.'<br><br>", "ride.<br><br>");
s = s.replace(" Here'          Happy", "          Happy");
fs.writeFileSync(path, s);
console.log('Done');
