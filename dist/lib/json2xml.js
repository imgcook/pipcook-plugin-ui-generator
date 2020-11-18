"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function json2xml(obj) {
    let xml = '';
    Object.keys(obj).forEach((prop) => {
        xml += obj[prop] instanceof Array ? '' : `<${prop}>`;
        if (obj[prop] instanceof Array) {
            for (const array in obj[prop]) {
                xml += `<${prop}>`;
                xml += json2xml(new Object(obj[prop][array]));
                xml += `</${prop}>`;
            }
        }
        else if (typeof obj[prop] === 'object') {
            xml += json2xml(new Object(obj[prop]));
        }
        else {
            xml += obj[prop];
        }
        xml += obj[prop] instanceof Array ? '' : `</${prop}>`;
    });
    xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
    return xml;
}
exports.default = json2xml;
//# sourceMappingURL=json2xml.js.map