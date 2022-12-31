
class SimpleDateFormat {
    constructor(format) {
        this.dateFormat = format;
    }
    parse(str) {
        const replace_to_regex = {
            "y": "[0-9]{1,4}",
            "M": "[0-9]{1,2}",
            "d": "[0-9]{1,2}",
            "H": "[0-9]{1,2}",
            "m": "[0-9]{1,2}",
            "s": "[0-9]{1,2}",
            "S": "[0-9]{1,3}",
        }

        let temp_str = this.dateFormat;
        for (let _replace_to_regex in replace_to_regex){
            temp_str = temp_str.replace(new RegExp(`[${_replace_to_regex}]+`, 'g'), `(?<${_replace_to_regex}>${replace_to_regex[_replace_to_regex]})`);
        }
        
        if (str.match(new RegExp("^" + temp_str + "$", 'i'))){
            // console.log("^" + temp_str + "$")
            const m_group = str.match(new RegExp("^" + temp_str + "$", 'i')).groups
            let date = new Date();
            for (let label in m_group){
                if (label == "y"){
                    if (m_group[label].length == 2){
                        date.setFullYear(Number(m_group[label]) + 2000)
                    }else{
                        date.setFullYear(Number(m_group[label]));
                    }
                }else if (label == "M"){
                    date.setMonth(Number(m_group[label])-1);
                }else if (label == "d"){
                    date.setDate(Number(m_group[label]));
                }else if (label == "H"){
                    date.setHours(Number(m_group[label]));
                }else if (label == "m"){
                    date.setMinutes(Number(m_group[label]));
                }else if (label == "s"){
                    date.setSeconds(Number(m_group[label]));
                }else if (label == "S"){
                    date.setMilliseconds(Number(m_group[label]));
                }
            }
            return date;
        }else{
            return null;
        }
    }
    parseFormats(formats = [], value){
        for(let f of formats){
            const r = (new SimpleDateFormat(f)).parse(value);
            if (r != null){
                return r;
            }else{
                continue;
            }
        }
        return new Date(value);
    }
    format(date) {
        let result = this.format;

        result = result.replace(/[y]+/g, (match)=>{
            let date_str = this.zeroFill(date.getFullYear().toString(), match.length);
            return date_str.slice(-1 * match.length)
        });
        
        result = result.replace(/[M]+/g, (match)=>{
            let date_str = this.zeroFill((date.getMonth()+1).toString(), match.length);
            return date_str.slice(-1 * match.length)
        })
        
        result = result.replace(/[d]+/g, (match)=>{
            let date_str = this.zeroFill((date.getDate()).toString(), match.length);
            return date_str.slice(-1 * match.length)
        })

        result = result.replace(/[H]+/g, (match)=>{
            let date_str = this.zeroFill((date.getHours()).toString(), match.length);
            return date_str.slice(-1 * match.length)
        })

        result = result.replace(/[m]+/g, (match)=>{
            let date_str = this.zeroFill((date.getMinutes()).toString(), match.length);
            return date_str.slice(-1 * match.length)
        })
        
        result = result.replace(/[s]+/g, (match)=>{
            let date_str = this.zeroFill((date.getSeconds()).toString(), match.length);
            return date_str.slice(-1 * match.length)
        })
        
        result = result.replace(/[S]+/g, (match)=>{
            let date_str = this.zeroFill((date.getMilliseconds()).toString(), match.length, "0", false);
            return date_str.slice(-1 * match.length)
        })

        return result;
    }
    zeroFill(n, digit=2, char="0", pos_fore=true){
        let s = "" + n;
        let res = s;
        for (let i=0; i< digit - s.length ; i++){
            if (pos_fore){
                res = char + res;
            }else{
                res = res + char;
            }
        }
        return res;
    }
}

export { SimpleDateFormat };