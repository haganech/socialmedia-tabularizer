javascript:(
    async function(){
        const is_chrome_extension = (chrome && chrome.storage)? true : false;
        console.log("This is executing on chrome_extension: " + is_chrome_extension);
        const prefix = "io_github_haganech";
        
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
        
        class CosignSimilarity {
            constructor() {
            }
        
            cosign(a, b){
                let sum_of_ab = 0;
                let sum_of_a = 0;
                let sum_of_b = 0;
                for (let i=0; i<a.length; i++){
                    sum_of_ab = sum_of_ab + (a[i] * b[i]);
                    sum_of_a = sum_of_a + (a[i] ** 2);
                    sum_of_b = sum_of_b + (b[i] ** 2);
                }
        
                return (sum_of_ab / (Math.sqrt(sum_of_a) * Math.sqrt(sum_of_b)));
            }
        
            compare(input_string1, input_string2, k_ngram = 1){
                const ngramTokenizer = new NgramTokenizer([...Array(k_ngram).keys()].map(i => ++i), " 　.".split(""));
                ngramTokenizer.initialize([input_string1, input_string2]);
                return this.cosign(ngramTokenizer.embed(input_string1), ngramTokenizer.embed(input_string2));
            }
        }
        
        class NgramTokenizer {
                
            constructor(_n, _stop_words = null) {
                this.n = [];
                if(Array.isArray(_n)){
                    this.n = _n;
                }else{
                    this.n.push(_n);
                }

                if (_stop_words){
                    this.stop_words = _stop_words;
                }else{
                    this.stop_words = [
                        /^[\u0000-\u00BF]{1}$/,
                        /^[あ-ヿ（）【】「」『』、。！？…年月日人大小]{1}$/,
                        /^[\n\r\t 　（）【】「」『』].*/,
                        /.*[\n\r\t 　（）【】「」『』]$/,
                        /^(at|on|of|th|ing|he|He|she|She|you|You|an)$/,
                        /^(です|ます|って|った|した|する|ない|から|して|てく|たい|しま|ます|ました|します|まし|いま|ため|など|こと|ている|ある|いる|である|この|その|あの|どの|これ|それ|あれ|どれ)$/,
                        /[／【】\t\r\n]/,
                    ];
                }
            
                this.tag_patterns = [
                    /(^|[ 　】])[!#！＃]{1}(?<tag>[^ #\|｜]+)/g,
                    /【[!#！＃]*(?<tag>[^】]+)】/g,
                    /\([!#！＃]*(?<tag>[^)]+)\)/g,
                    /（[!#！＃]*(?<tag>[^）]+)）/g,
                ]

                this.split_words = [
                    "|", "｜"
                ]

                this.tokened_dict = {};  // raw_count. unique_count
                this.maximum_character_length_in_word = 1;
                this.minimum_character_length_in_word = 1;
                this.maximum_token_count = 0;
                this.mainimum_token_count = 0;
                this.number_of_documents = 0;
                this.maximum_unique_tag_count = 0;
                this.maximum_tag_count = 0;
            }

            initialize(str_array = []){
                this.number_of_documents = str_array.length;
                let tags = new Set();

                for (let _s of str_array){
                    if (_s == null || _s == undefined) continue;
                    _s = this.normalizeJapaneseCharacter(_s);
                    const distinct_words_in_this_sentence = new Set();
                    for (const i of this.n){
                        for (let j=0; j<_s.length; j++){
                            // console.log(_s.substring(j, j+i))

                            if(_s.length - j < i){
                                break;
                            }

                            const target_word = _s.substring(j, j+i);
                            if (this.split_words.reduce((accumulator, currentValue) => (accumulator || target_word.includes(currentValue)), false)){
                                continue;
                            }
                            
                            let matched_stop_words = false;
                            for (const _stop_words of this.stop_words){
                                if((typeof _stop_words) == "string" && _stop_words == target_word){
                                    matched_stop_words = true;
                                    break;
                                }else if((typeof _stop_words) != "string" && target_word.match(_stop_words)){
                                    matched_stop_words = true;
                                    break;
                                }
                            }

                            if (matched_stop_words){
                                continue;
                            }

                            this.addToDic(this.tokened_dict, target_word, {raw_count: 1, unique_count: (distinct_words_in_this_sentence.has(target_word)? 0 : 1)});
                            distinct_words_in_this_sentence.add(target_word)
                            this.maximum_character_length_in_word = Math.max(...[this.maximum_character_length_in_word, target_word.length])
                            this.maximum_token_count = Math.max(...[this.maximum_token_count, this.tokened_dict[target_word].raw_count])
                        }
                    }

                    let _tags_in_this_doc = new Set();
                    for (const tag_pattern of this.tag_patterns){
                        for (const found of _s.matchAll(tag_pattern)){
                            const tag = found.groups.tag;
                            if (tag in this.tokened_dict && _tags_in_this_doc.has(tag) == false){
                                this.addToDic(this.tokened_dict, tag, {tag_count: 1});
                                this.maximum_tag_count += 1;
                                _tags_in_this_doc.add(tag);
                                tags.add(tag);
                            }
                        }
                    }
                }
                
                this.maximum_unique_tag_count = Array.from(tags).length;

                // Array.from(tags).map((m)=> console.log(m));
                // console.log(this.tokened_dict)
                return this.tokened_dict;
            }

            tokenize(str, minimum_count_threshold = 0, with_count = false){
                const _s = this.normalizeJapaneseCharacter(str);
                let _temp_tokened_dict = {};
                for (const i of this.n){
                    for (let j=0; j<_s.length; j++){
                        if(_s.length - j < i){
                            break;
                        }
                        
                        const target_word = _s.substring(j, j+i);
                        let matched_stop_words = false;
                        for (const _stop_words of this.stop_words){
                            if((typeof _stop_words) == "string" && _stop_words == target_word){
                                matched_stop_words = true;
                                continue;
                            }else if((typeof _stop_words) != "string" && target_word.match(_stop_words)){
                                matched_stop_words = true;
                                continue;
                            }
                        }

                        if (matched_stop_words){
                            continue;
                        }

                        this.addToDic(_temp_tokened_dict, target_word, 1);
                    }
                }

                if(with_count == true){
                    return _temp_tokened_dict;
                }else{
                    return Object.keys(_temp_tokened_dict);
                }
            }

            embed(str, minimum_count_threshold = 0){
                const _temp_tokened_dict = this.tokenize(this.normalizeJapaneseCharacter(str), minimum_count_threshold, true)

                let _result_embeded_arr = [];
                for (const key of Object.keys(this.tokened_dict)){
                    _result_embeded_arr.push((key in _temp_tokened_dict)? (_temp_tokened_dict[key] / this.maximum_token_count) : 0);
                }

                return _result_embeded_arr;
            }

            getTokenWords(){
                return Object.keys(this.tokened_dict);
            }

            getTokenedDict(){
                return this.tokened_dict;
            }
            
            isDict(v){
                return typeof v==='object' && v!==null && !(v instanceof Array) && !(v instanceof Date);
            }

            addToDic(dic, key, val){
                if (this.isDict(val)){
                    if (key in dic){
                        for (let _inside_val_key in val){
                            if (_inside_val_key in dic[key]){
                                dic[key][_inside_val_key] = dic[key][_inside_val_key] + val[_inside_val_key];
                            }else{
                                dic[key][_inside_val_key] = val[_inside_val_key];
                            }
                        }
                    }else{
                        dic[key] = val;
                    }
                }else{
                    if (key in dic){
                        dic[key] = dic[key] + val;
                    }else{
                        dic[key] = val;
                    }
                }
            }

            normalizeJapaneseCharacter(str){
                if (str == null || str == undefined) return str;

                let from = [
                    'ｶﾞ', 'ｷﾞ', 'ｸﾞ', 'ｹﾞ', 'ｺﾞ', 'ｻﾞ', 'ｼﾞ', 'ｽﾞ', 'ｾﾞ', 'ｿﾞ', 'ﾀﾞ', 'ﾁﾞ', 'ﾂﾞ', 'ﾃﾞ', 'ﾄﾞ',
                    'ﾊﾞ', 'ﾋﾞ', 'ﾌﾞ', 'ﾍﾞ', 'ﾎﾞ', 'ﾊﾟ', 'ﾋﾟ', 'ﾌﾟ', 'ﾍﾟ', 'ﾎﾟ', 'ｳﾞ', 'ﾜﾞ', 'ｦﾞ',
                    'ｱ', 'ｲ', 'ｳ', 'ｴ', 'ｵ', 'ｶ', 'ｷ', 'ｸ', 'ｹ', 'ｺ', 'ｻ', 'ｼ', 'ｽ', 'ｾ', 'ｿ',
                    'ﾀ', 'ﾁ', 'ﾂ', 'ﾃ', 'ﾄ', 'ﾅ', 'ﾆ', 'ﾇ', 'ﾈ', 'ﾉ', 'ﾊ', 'ﾋ', 'ﾌ', 'ﾍ', 'ﾎ',
                    'ﾏ', 'ﾐ', 'ﾑ', 'ﾒ', 'ﾓ', 'ﾔ', 'ﾕ', 'ﾖ', 'ﾗ', 'ﾘ', 'ﾙ', 'ﾚ', 'ﾛ', 'ﾜ', 'ｦ', 'ﾝ',
                    'ｧ', 'ｨ', 'ｩ', 'ｪ', 'ｫ', 'ｯ', 'ｬ', 'ｭ', 'ｮ', 'ｰ', '｡', '､', '｢', '｣',
                    '０', '１', '２', '３', '４', '５', '６', '７', '８', '９',
                    'Ａ', 'Ｂ', 'Ｃ', 'Ｄ', 'Ｅ', 'Ｆ', 'Ｇ', 'Ｈ', 'Ｉ', 'Ｊ', 'Ｋ', 'Ｌ', 'Ｍ', 'Ｎ',
                    'Ｏ', 'Ｐ', 'Ｑ', 'Ｒ', 'Ｓ', 'Ｔ', 'Ｕ', 'Ｖ', 'Ｗ', 'Ｘ', 'Ｙ', 'Ｚ',
                    'ａ', 'ｂ', 'ｃ', 'ｄ', 'ｅ', 'ｆ', 'ｇ', 'ｈ', 'ｉ', 'ｊ', 'ｋ', 'ｌ', 'ｍ', 'ｎ',
                    'ｏ', 'ｐ', 'ｑ', 'ｒ', 'ｓ', 'ｔ', 'ｕ', 'ｖ', 'ｗ', 'ｘ', 'ｙ', 'ｚ', '　'
                ];
                let to = [
                    'ガ', 'ギ', 'グ', 'ゲ', 'ゴ', 'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ', 'ダ', 'ヂ', 'ヅ', 'デ', 'ド',
                    'バ', 'ビ', 'ブ', 'ベ', 'ボ', 'パ', 'ピ', 'プ', 'ペ', 'ポ', 'ヴ', 'ヷ', 'ヺ',
                    'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ', 'サ', 'シ', 'ス', 'セ', 'ソ',
                    'タ', 'チ', 'ツ', 'テ', 'ト', 'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
                    'マ', 'ミ', 'ム', 'メ', 'モ', 'ヤ', 'ユ', 'ヨ', 'ラ', 'リ', 'ル', 'レ', 'ロ', 'ワ', 'ヲ', 'ン',
                    'ァ', 'ィ', 'ゥ', 'ェ', 'ォ', 'ッ', 'ャ', 'ュ', 'ョ', 'ー', '。', '、', '「', '」',
                    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
                    'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
                    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
                    'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ' '
                ]

                let res_string = str;
                for (let i=0; i<from.length; i++){
                    res_string = res_string.replaceAll(from[i], to[i]);
                }
                return res_string;
            }
        }

        class TagSuggester{
        
            constructor() {
                this.max_result_count = 40;
                this.min_count_threshold = 1;
                this.ngram = 32;
            
                this.rate_similar = 0.8
                this.rate_duplicate = 0.1;
                this.rate_idf_max = 0.3;
                this.bias_count = 1;
                this.bias_idf = 0.3;
                this.bias_length = 0.99;
                this.bias_tag_count = 0.999;
            }
        
            suggest(input_sentences, max_result_count = this.max_result_count){
                // Get the tokenized list and count
                const ngramTokenizer = new NgramTokenizer([...Array(this.ngram).keys()].map(i => ++i));
                let temp_result_dict = ngramTokenizer.initialize(input_sentences);
                
                // Reshape the data from dic to list, and calculate the basis scores
                let temp_result_arr_within_threshold = [];
                for (let _temp_result_dict_key in temp_result_dict){
                    if(temp_result_dict[_temp_result_dict_key]["raw_count"] > this.min_count_threshold){
                        
                        let key = _temp_result_dict_key;
                        let raw_count = temp_result_dict[_temp_result_dict_key]["raw_count"];
                        let unique_count = temp_result_dict[_temp_result_dict_key]["unique_count"];
                        let tag_count = ("tag_count" in temp_result_dict[_temp_result_dict_key])? temp_result_dict[_temp_result_dict_key]["tag_count"] : 0;
        
                        let a_count_score = unique_count / ngramTokenizer.maximum_token_count;
                        let a_idf_score = ((ngramTokenizer.number_of_documents * this.rate_idf_max) - Math.abs(ngramTokenizer.number_of_documents * this.rate_idf_max - unique_count)) * (1 / this.rate_idf_max) / ngramTokenizer.number_of_documents;
        
                        let a_length_score = key.length / ngramTokenizer.maximum_character_length_in_word;
                        let a_tag_score = tag_count / (ngramTokenizer.maximum_tag_count + 1);
                        
                        temp_result_arr_within_threshold.push({
                            key: key,
                            raw_count: raw_count,
                            unique_count: unique_count,
                            tag_count: tag_count,
                            
                            count_score: a_count_score,
                            idf_score: a_idf_score,
                            length_score: a_length_score,
                            tag_score: a_tag_score,
                        });
                    }
                }
        
                // Normalize and update the score
                for (const score_column of ["count_score", "idf_score", "length_score", "tag_score"]){
                    if (temp_result_arr_within_threshold.length == 0) break;
                    let minimum_in_arr = temp_result_arr_within_threshold[0][score_column];
                    let maximum_in_arr = minimum_in_arr;
                    for (let item of temp_result_arr_within_threshold){
                        let _temp_log_score = item[score_column];
                        if (_temp_log_score > maximum_in_arr){
                            maximum_in_arr = _temp_log_score;
                        }else if (_temp_log_score < minimum_in_arr){
                            minimum_in_arr = _temp_log_score;
                        }
                    }
        
                    const log_adjusting_num = 1.00001;
                    const min_adjustment = 0 - minimum_in_arr;
                    const max_adjustment = Math.log(log_adjusting_num + maximum_in_arr);
        
                    for (let item of temp_result_arr_within_threshold){
                        item[score_column] = Math.log(log_adjusting_num + item[score_column] + min_adjustment) / max_adjustment;
                    }
                }
        
                // Calculate final score
                let count_score_max = 0.0000000001;
                let tag_score_max = 0.0000000001;
                for (let item of temp_result_arr_within_threshold){
                    let a_score = 1;
                    a_score = (a_score * (1 - this.bias_count)) + (a_score * this.bias_count * item["count_score"])
                    a_score = (a_score * (1 - this.bias_idf)) + (a_score * this.bias_idf * item["idf_score"])
                    a_score = (a_score * (1 - this.bias_length)) + (a_score * this.bias_length * item["length_score"])
                    a_score = (a_score * (1 - this.bias_tag_count)) + (a_score * this.bias_tag_count * item["tag_score"])
                    item["score"] = a_score;

                    count_score_max = (item["count_score"] > count_score_max)? item["count_score"] : count_score_max;
                    tag_score_max = (item["tag_score"] > tag_score_max)? item["tag_score"] : tag_score_max;
                }
                
                temp_result_arr_within_threshold.sort((a, b) =>{
                    return b.score - a.score;
                });
                
                let temp_result_arr_avoiding_similar_word = [];
                const cosignSimilarity = new CosignSimilarity();
                
                // for(let _temp_result_arr of temp_result_arr_within_threshold){
                //     if (["!shorts", "shorts", "ヴァイオレット"].includes(_temp_result_arr.key)){
                //         console.log(_temp_result_arr)
                //     }
                // }

                for(let _temp_result_arr of temp_result_arr_within_threshold){
                    // console.log(_temp_result_arr.score + " " + _temp_result_arr.key)
                    let skip = false;
                    let to_replace = [];
                    for (const _final_result_arr of temp_result_arr_avoiding_similar_word){
                        let _key_to_evaluate = _final_result_arr.key.toLowerCase().replaceAll(/[#（）【】「」『』、。！？]/g, "")
                        let _key_evaluated = _temp_result_arr.key.toLowerCase().replaceAll(/[#（）【】「」『』、。！？]/g, "")
                        
                        if (cosignSimilarity.compare(_key_to_evaluate, _key_evaluated, 2) > this.rate_similar){
                            // console.log(_key_to_evaluate + " " + _key_evaluated + " " + _temp_result_arr.key.length)
                            if (_key_to_evaluate.length < _key_evaluated.length) {
                                if ((Math.abs(_final_result_arr.count_score - _temp_result_arr.count_score)) / count_score_max < this.rate_duplicate
                                    && _final_result_arr.tag_score <= _temp_result_arr.tag_score){
                                    // console.log(_final_result_arr.key + " <- " + _temp_result_arr.key + " " + ((Math.abs(_final_result_arr.tag_score - _temp_result_arr.tag_score)) / tag_score_max))
                                    to_replace.push(_final_result_arr.key);
                                }else{
                                    // skip = true;
                                    // break;
                                }
                            }else{
                                skip = true;
                                // console.log(_key_evaluated + "  was skipped because of LOWER LENGTH  " + _key_to_evaluate + " " + cosignSimilarity.compare(_key_to_evaluate, _key_evaluated, 2))
                                break;
                            }
                        }else if (_key_to_evaluate.includes(_key_evaluated)){
                            skip = true;
                            // console.log(_key_evaluated + "  was skipped because of INCLUDE  " + _key_to_evaluate + " " + cosignSimilarity.compare(_key_to_evaluate, _key_evaluated, 2))
                            break;
                        }
                    }
        
                    if (to_replace.length > 0){
                        for (let _to_replace of to_replace){
                            let ind_to_be_removed = -1
                            for (let i=0; i < temp_result_arr_avoiding_similar_word.length; i++){
                                if (temp_result_arr_avoiding_similar_word[i].key == _to_replace){
                                    ind_to_be_removed = i;
                                    break;
                                }
                            }
            
                            if (ind_to_be_removed > -1){
                                temp_result_arr_avoiding_similar_word.splice(ind_to_be_removed, 1);
                            }
                        }
                        to_replace = [];
                    }
        
                    if(skip){
                        continue;
                    }
        
                    temp_result_arr_avoiding_similar_word.push(_temp_result_arr);
        
                    if (temp_result_arr_avoiding_similar_word.length >= max_result_count){
                        break;
                    }
                }
        
                return temp_result_arr_avoiding_similar_word;
            }
        }

        class JsonPathFinder {
            constructor() {}
            
            find(rootObj, nestedPathStringArray = [], returnSingle = true, returnIfError = undefined, separator = '/'){
                if ((typeof nestedPathStringArray) == "string"){
                    nestedPathStringArray = [nestedPathStringArray];
                }
        
                let all_matched_obj = [];
        
                for (const nestedPathString of nestedPathStringArray){
                    try{
                        let [path_parsed, object_store] = this._splitToken(nestedPathString);
                        // console.log(path_parsed)
                        // console.log(object_store)
                        const current_objs = this._resolveToken(rootObj, [rootObj], path_parsed, object_store, separator);
                        if (current_objs != null && current_objs != undefined && current_objs instanceof Array && current_objs.length > 0){
                            if (returnSingle == true){
                                return current_objs[0][current_objs[0].length -1];
                            }else{
                                for (const current_obj of current_objs){
                                    all_matched_obj.push(current_obj[current_obj.length -1]);
                                }
                            }
                        }
                    }catch(e){
                        console.warn(e)
                    }
                }
        
                if(all_matched_obj.length > 0){
                    return all_matched_obj
                }else{
                    // console.warn(JSON.stringify(nestedPathStringArray) + " was not found in")
                    // console.warn(rootObj)
                    return returnIfError;
                }
            }
        
            _splitToken(path_original, object_store = {}, separator = '/'){
                let path_parsed = this._escape(path_original)
        
                const regex_tokens = [
                    {
                        regex: /(?:[^0-9A-Za-z_#]+|^)([-]{0,1}[0-9]+[.]{0,1}[0-9]*)(?:[^0-9A-Za-z_#]+|$)/,  // -1234.5
                        prefix: "N",
                        type: "number",
                        resolve: (root, object_tree, value, object_store, separator) => {
                            return Number(value.replace(/[^-0-9.]/g, ""));
                        }
                    },
                    {
                        regex: /[ ]*("[^"]+")[ ]*/,     // "any text"
                        prefix: "S",
                        type: "string",
                        resolve: (root, object_tree, value, object_store, separator) => {
                            return this._unescape(value.toString().replace(/^"/, "").replace(/"$/, ""));
                        }
                    },
                    {
                        regex: /[ ]*('[^']+')[ ]*/,     // 'any text'
                        prefix: "S",
                        type: "string",
                        resolve: (root, object_tree, value, object_store, separator) => {
                            return this._unescape(value.toString().replace(/^'/, "").replace(/'$/, ""));
                        }
                    },
                    {
                        regex: /([A-Za-z_][A-Za-z0-9_]*[ ]*\([0-9A-Z<>\$ ,]*\))/,      //  contains(./a, 'aaa')
                        prefix: "M",
                        type: "method",
                        resolve: (root, object_tree, value, object_store, separator) => {
                            let [orig, method_name, method_arg] = value.match(/([A-Za-z_][A-Za-z0-9_]*)[ ]*\(([^\(\)]*)\)/);
                            let args = [];
                            if (this.trim(method_arg) != ""){
                                for (const _args of method_arg.split(",")){
                                    args.push(this._resolveToken(root, object_tree, this.trim(_args), object_store, separator));
                                }
                            }
                            method_name = method_name.toLowerCase();
                            const current_object = object_tree[object_tree.length -1];
        
                            const methods = {
                                "contains": (args)=>{
                                    if (args.length >= 2){
                                        if (args[0].length > 0 && args[0][0].length > 0 && (typeof args[0][0][args[0][0].length - 1]) == 'string'){
                                            let evaluate_text = ""
                                            if ((typeof args[0]) == 'string'){
                                                evaluate_text = args[0]
                                            }else if(args[0] instanceof Array && args[0][0] instanceof Array){
                                                evaluate_text = args[0][0][args[0][0].length - 1].toString()
                                            }
                                            return evaluate_text.includes(args[1].toString())
                                        }
                                    }else{
                                        return null;
                                    }
                                },
                                "text": (args)=>{
                                    if ((typeof current_object) == 'string'){
                                        return current_object.toString();
                                    }else{
                                        "";
                                    }
                                }
                            }
        
                            if (method_name in methods){
                                return methods[method_name](args);
                            }else{
                                return false;
                            }
                        }
                    },
                    {
                        regex: /(?:[^A-Za-z$\/.]|^)(([.\/]*[A-Za-z_*][A-Za-z0-9_]*)(\/[A-Za-z_*]*[A-Za-z0-9_]*)*)/,     // //a1/a2/*/a4//b1
                        prefix: "P",
                        type: "path_simple",
                        resolve: (root, object_tree, value, object_store, separator) => {
                            return this._resolvePath(root, object_tree, value, object_store, separator);
                        }
                    },
                    {
                        regex: /(?:[^A-Za-z$\/.]|^)([A-Za-z._\/][^\[\]<>= (),]+\[<\$[BCMP][0-9]+>\])/,   // //a1/a2[./b4 = 'test']
                        prefix: "P",
                        type: "path_with_condition",
                        resolve: (root, object_tree, value, object_store, separator) => {
                            let [orig, path, condition_tag] = value.match(/([^\[ ]+)[ ]*\[[ ]*([^\] ]+)[ ]*\]/);
                            let candidates = this._resolvePath(root, object_tree, path, object_store, separator);
                            let candidates_after_condition = [];
                            for (const candidate of candidates){
                                const res = this._resolveToken(root, candidate, condition_tag, object_store, separator)
                                if (this._resolveConditionValue(res) == true){
                                    candidates_after_condition.push(candidate)
                                }
                            }
                            return candidates_after_condition;
                        }
                    },
                    {
                        regex: /(?:[^A-Za-z$\/.]|^)(<\$[BP][0-9]+>\[<\$[BCMP][0-9]+>\])/,   // <$P1>[<$C1>]
                        prefix: "P",
                        type: "path_with_condition_tag",
                        resolve: (root, object_tree, value, object_store, separator) => {
                            let [orig, path_tag, condition_tag] = value.match(/([^\[ ]+)[ ]*\[[ ]*([^\] ]+)[ ]*\]/);
                            let candidates = this._resolveToken(root, object_tree, path_tag, object_store, separator);
                            let candidates_after_condition = [];
                            for (const candidate of candidates){
                                const res = this._resolveToken(root, candidate, condition_tag, object_store, separator)
                                if (res === true || ((res instanceof Array) && res.length > 0)){
                                    candidates_after_condition.push(candidate)
                                }
                            }
                            return candidates_after_condition;
                        }
                    },
                    {
                        regex: /(?:[^A-Za-z$\/.]|^)((<\$[AP][0-9]+>){2,})/,
                        prefix: "P",
                        type: "path_list",
                        resolve: (root, object_tree, value, object_store, separator) => {
                            return this._resolveToken(root, object_tree, value, object_store, separator);
                        }
                    },
                    {
                        regex: /(?:[^A-Za-z$\/.]|^)(<\$[PB][0-9]+>\[<\$[N][0-9]+>\])/,  // /a/b/c[2]
                        prefix: "A",
                        type: "array",
                        resolve: (root, object_tree, value, object_store, separator) => {
                            let [orig, path_tag, order_tag] = value.match(/(<\$[PB][0-9]+>)\[(<\$[N][0-9]+>)\]/);
                            let candidates = this._resolveToken(root, object_tree, path_tag, object_store, separator);
                            let order_num = Number(this._resolveToken(root, object_tree, order_tag, object_store, separator)) -1;
                            let new_candidates = []
                            for (const candidate of candidates){
                                const current_object = candidate[candidate.length -1];
                                if (current_object instanceof Array && current_object.length > order_num && current_object[order_num]){
                                    let new_ancester = candidate.slice();
                                    new_ancester.push(current_object[order_num]);
                                    new_candidates.push(new_ancester)
                                }else if(order_num == 0 && (current_object instanceof Array) == false && current_object != null){
                                    new_candidates.push(candidate);
                                }
                            }
                            return new_candidates;
                        }
                    },
                    {
                        regex: /(<\$[A-Z][0-9]+>[ ]*(?:=|<=|>=|<|>|!=)[ ]*<\$[A-Z][0-9]+>)/i,
                        prefix: "C",
                        type: "condition_first_priority",
                        resolve: (root, object_tree, value, object_store, separator) => {
                            return this._resolveCondition(root, object_tree, value, object_store, separator);
                        }
                    },
                    {
                        regex: /(<\$[A-Z][0-9]+>[ ]*(?:and|or)[ ]*<\$[A-Z][0-9]+>)/i,
                        prefix: "C",
                        type: "condition_second_priority",
                        resolve: (root, object_tree, value, object_store, separator) => {
                            return this._resolveCondition(root, object_tree, value, object_store, separator);
                        }
                    },
                    {
                        regex: /[ ]*(\([ ]*<\$[A-Z][0-9]+>[ ]*\))[ ]*/,
                        prefix: "B",
                        type: "block",
                        resolve: (root, object_tree, value, object_store, separator) => {
                            let [orig, path_tag] = value.match(/\([ ]*(<\$[A-Z][0-9]+>)[ ]*\)/);
                            return this._resolveToken(root, object_tree, path_tag, object_store, separator);
                        }
                    },
                ]
        
                recur: for(let i=0; i<10; i++){
                    let isHit = false;
                    for (const regex_token of regex_tokens){
                        let path_replaced = this._replaceToken(path_parsed, object_store, regex_token)
                        if (path_parsed.toString() !== path_replaced.toString()){
                            path_parsed = path_replaced;
                            continue recur;
                        }
                    }
                    break recur;
                }
                // console.log(path_parsed)
                // console.log(object_store)
                return [path_parsed, object_store]
            }
            
            _replaceToken(str, object_store, regex_obj){
                let hit_array;
                let r = new RegExp(regex_obj.regex, 'g');
                while ((hit_array = r.exec(str)) !== null) {
                    if (regex_obj.type == 'method' && hit_array[1].match(/^(AND|OR)[^A-Za-z]+.*/i)){
                        continue;
                    }
                    if (regex_obj.type.match('path') && hit_array[1].match(/^(AND|OR|CONTAINS).*/i)){
                        continue;
                    }
                    // if(regex_obj.type == 'path_z'){
                    //     console.log(hit_array[0])
                    //     console.log(hit_array)
                    // }
                    let seq = this.iferror(()=>{ return Object.keys(object_store).join("").match(new RegExp(regex_obj.prefix, 'g')) }, "").length;
                    let temp_str = str.split("")
                    let tag = `<$${regex_obj.prefix}${seq+1}>`;
                    object_store[tag] = {
                        value: hit_array[1],
                        type: regex_obj.type,
                        resolve: regex_obj.resolve
                    };
                    const str_after_replace = hit_array[0].replace(hit_array[1], tag);
                    temp_str.splice(r.lastIndex - hit_array[0].length, hit_array[0].length, str_after_replace);
                    str = temp_str.join("")
        
                    if (regex_obj.type.match('path_list')){
                        let i = 0
                        for (const _tag of hit_array[1].match(/<\$[A-Z][0-9]+>/g)){
                            if (i != 0){
                                let reversed_text = this._reverseObjectStore(_tag, object_store);
                                if (reversed_text.match(/^\/.*/)){
                                    let [new_text, new_object_store] = this._splitToken("." + reversed_text, object_store);
                                    object_store = new_object_store
                                    object_store[_tag] = object_store[new_text];
                                }
                            }
                            i++;
                        }
                    }
                }
                return str;
            }
        
            _reverseObjectStore(path_parsed, object_store){
                // console.log("_reverseObjectStore")
                let _path_parsed = path_parsed;
                recur: for(let i=0; i<1000; i++){
                    let isHit = false;
                    for (const tag of Object.keys(object_store)){
                        if(_path_parsed.match(tag.replace(/\$/g, "\\$"))){
                            _path_parsed = _path_parsed.replace(tag, object_store[tag].value)
                            continue recur;
                        }
                    }
                    break recur;
                }
                return _path_parsed;
            }
        
            _resolveCondition(root, object_tree, value, object_store, separator = "/"){
                let [orig, v1_tag, operator, v2_tag] = value.match(/(<\$[A-Z][0-9]+>)[ ]*(=|<=|>=|<|>|!=|and|or)[ ]*(<\$[A-Z][0-9]+>)/i);
                let v1_raw = this._resolveToken(root, object_tree, v1_tag, object_store, separator);
                let v1 = v1_raw;
                if (v1_raw instanceof Array && v1_raw.length > 0){
                    if (v1_raw[0] instanceof Array && v1_raw[0].length > 0){
                        v1 = v1_raw[0][v1_raw[0].length - 1]
                    }
                }
                let v2_raw = this._resolveToken(root, object_tree, v2_tag, object_store, separator);
                let v2 = v2_raw;
                if (v2_raw instanceof Array && v2_raw.length > 0){
                    if (v2_raw[0] instanceof Array && v2_raw[0].length > 0){
                        v2 = v2_raw[0][v2_raw[0].length - 1]
                    }
                }
        
                if (operator.toLowerCase() == "="){
                    return (v1 == v2);
                }else if (operator.toLowerCase() == "!="){
                    return (v1 != v2);
                }else if (operator.toLowerCase() == "<"){
                    return (v1 < v2);
                }else if (operator.toLowerCase() == ">"){
                    return (v1 > v2);
                }else if (operator.toLowerCase() == "<="){
                    return (v1 <= v2);
                }else if (operator.toLowerCase() == ">="){
                    return (v1 >= v2);
                }else if (operator.toLowerCase() == "and"){
                    return (this._resolveConditionValue(v1_raw) && this._resolveConditionValue(v2_raw))
                }else if (operator.toLowerCase() == "or"){
                    return (this._resolveConditionValue(v1_raw) || this._resolveConditionValue(v2_raw))
                }else{
                    return false;
                }
            }
        
            _resolveConditionValue(v1_raw){
                let v1 = v1_raw;
                if (v1_raw instanceof Array && v1_raw.length > 0){
                    if (v1_raw[0] instanceof Array && v1_raw[0].length > 0){
                        v1 = v1_raw[0][v1_raw[0].length - 1]
                    }
                }
                
                if((v1_raw instanceof Array) && v1_raw.length > 0){
                    return true
                }else if ((typeof v1) == 'boolean' && v1 === true){
                    return true
                }else if ((typeof v1) == 'number' && v1 > 0){
                    return true
                }else if ((typeof v1) == 'string' && v1.length > 0){
                    return true
                }else{
                    return false;
                }
            }
        
            _resolveToken(root, object_tree, path_parsed, object_store, separator = "/"){
                let result_objects = [object_tree];
        
                // console.log(object_store)
                // console.log(path_parsed)
                for (const tag of path_parsed.match(/<\$[A-Z][0-9]+>/g)){
                    let new_candidates = [];
                    for(const _object_tree of result_objects){
                        // console.log(tag + " : " + object_store[tag].value + ", num_of_tree : " + object_tree.length)
                        const res = object_store[tag].resolve(root, _object_tree, object_store[tag].value, object_store, separator)
                        if (res instanceof Array){
                            new_candidates.push(...object_store[tag].resolve(root, _object_tree, object_store[tag].value, object_store, separator));
                        }else{
                            new_candidates.push(res);
                        }
                        
                    }
                    result_objects = new_candidates;
                }
        
                if (result_objects.length == 1 && (result_objects[0] instanceof Array) == false && this.isDict(result_objects[0]) == false){
                    return result_objects[0];
                }else{
                    return result_objects;
                }
            }
        
            _resolvePath(root, object_tree, input_string, object_store, separator = "/"){
                let temp_input_string = input_string;
                temp_input_string = input_string.replace(/\.\.\//g, '<PARENT>/')
                temp_input_string = temp_input_string.replace(/^\/\//g, '<ROOT_RECUR>/')
                temp_input_string = temp_input_string.replace(/^\//g, '<ROOT>/')
                temp_input_string = temp_input_string.replace(/^\.(?:\/)/g, '<CURRENT>/')
                temp_input_string = temp_input_string.replace(/\/\//g, '/<RECUR>/')
                temp_input_string = temp_input_string.replace(/\*/g, '<WILDCARD>')
                let temp_input_tokens = temp_input_string.split(separator)
        
                let candidates = [
                    object_tree.slice()
                ]
        
                for (let i=0; i<temp_input_tokens.length; i++){
                    const temp_input_token = temp_input_tokens[i];
                    // console.log("temp_input_token " + temp_input_token)
                    let new_candidates = []
                    candidate_loop: for (let candidate of candidates){
                        if (temp_input_token == "<PARENT>"){
                            new_candidates.push(candidate.slice(0, candidate.length-1));
                            continue;
                        }else if (temp_input_token == "<ROOT>"){
                            new_candidates = [[root]]
                            break candidate_loop;
                        }else if (temp_input_token == "<ROOT_RECUR>"){
                            new_candidates.push(...this._searchPath([[root]], temp_input_tokens[i+1]))
                            break candidate_loop;
                        }else if (temp_input_token == "<CURRENT>"){
                            new_candidates.push(candidate.slice());
                            continue;
                        }else if (temp_input_token == "<RECUR>"){
                            new_candidates.push(...this._searchPath([candidate], temp_input_tokens[i+1]))
                        }else if (temp_input_token == "<WILDCARD>"){
                            const current_object = candidate[candidate.length -1];
                            if(this.isDict(current_object)){
                                for (const k of Object.keys(current_object)){
                                    let new_ancester = candidate.slice();
                                    new_ancester.push(current_object[k]);
                                    new_candidates.push(new_ancester)
                                }
                            }else if (current_object instanceof Array){
                                for (const v of current_object){
                                    let new_ancester = candidate.slice();
                                    new_ancester.push(v);
                                    new_candidates.push(new_ancester)
                                }
                            }
                        }else{
                            const current_object = candidate[candidate.length -1];
                            if (this.isDict(current_object) && (temp_input_token in current_object)){
                                let new_ancester = candidate.slice()
                                new_ancester.push(current_object[temp_input_token]);
                                new_candidates.push(new_ancester);
                            }
                        }
                    }
                    // console.log(new_candidates)
                    candidates = new_candidates;
                    if (temp_input_token == "<RECUR>" || temp_input_token == "<ROOT_RECUR>"){
                        i = i + 1;
                    }
                }
        
                return candidates;
            }
        
            _searchPath(candidates, next_object_key){
                let result_candidates = []
                for (const candidate of candidates){
                    const current_object = candidate[candidate.length - 1];
                    if (this.isDict(current_object) && (next_object_key in current_object)){
                        let new_ancester = candidate.slice();
                        new_ancester.push(current_object[next_object_key]);
                        result_candidates.push(new_ancester)
                    }
        
                    if(this.isDict(current_object)){
                        let new_candidates = [];
                        for (const k of Object.keys(current_object)){
                            let new_ancester = candidate.slice();
                            new_ancester.push(current_object[k]);
                            new_candidates.push(new_ancester)
                        }
                        result_candidates.push(...this._searchPath(new_candidates, next_object_key));
                    }else if (current_object instanceof Array){
                        let new_candidates = [];
                        for (const v of current_object){
                            let new_ancester = candidate.slice();
                            new_ancester.push(v);
                            new_candidates.push(new_ancester)
                        }
                        result_candidates.push(...this._searchPath(new_candidates, next_object_key));
                    }
                }
                return result_candidates;
            }
        
        
            _escape(str){
                let temp_str = str.replace(/\\\\/g, (matched)=>{
                    return "<$#" + matched.charCodeAt(1) + ">";
                })
                temp_str = temp_str.replace(/\\./g, (matched)=>{
                    return "<$#" + matched.charCodeAt(1) + ">";
                })
                return temp_str;
            }
        
            _unescape(str){
                return str.replace(/\<\$#([0-9]+)>/g, (matched, p1, offset)=>{
                    console.log(matched)
                    console.log(p1)
                    console.log(offset)
                    return "\\" + String.fromCharCode(Number(p1));
                })
            }
        
            isDict(v) {
                return typeof v==='object' && v!==null && !(v instanceof Array) && !(v instanceof Date);
            }
            trim(str){
                return str.toString().replaceAll(/^[ 　\t\n\r]+/g, "").replaceAll(/[ 　\t\n\r]+$/g, "");
            }
            iferror(closure, return_value_if_error){
                try{
                    // console.log(closure)
                    let result = closure();
                    // console.log(result)
                    if (result){
                        return result;
                    }else{
                        return return_value_if_error;
                    }
                }catch(e){
                    // console.error(e)
                    return return_value_if_error;
                }
            }
        }

        let video_list_raw = [];
        let video_list_optimized = [];

        const default_numeric_columns = ["duration", "publishDate", "viewCount", "comments", "likes", "mylistCount", "reply_count", "favorite_count", "retweet_count", "quote_count"];
        const default_target_display_columns = ["thumbnail_url", "title", "duration", "publishDate", "category", "type", "viewCount", "comments", "likes"];
        const default_target_search_columns = ["title", "shortDescription"];
        const search_date_format_field = ["publishDate"];
        const column_graphical_view = ["duration", "viewCount", "comments", "likes", "mylistCount", "reply_count", "favorite_count", "retweet_count", "quote_count"];

        let retriever_parameters = {
            retrieve_detail : true,
            stop_loading: false,
            current_retrieve_uuid: "",
            crawling_term: 7 * 24 * 60 * 60 * 1000,
            retriever: null,
            service_name : ""
        };

        let optimize_parameters = {
            parseDateViewAndTimeFormat : true,
            filter_text : "",
            filter_text_target_column : ["title"],
            column_filter : {},
        };

        let render_parameters = {
            showThubmnail : true,
        };

        let sort_parameters = {
            sort_order: "desc",
            sort_key: "publishDate",
        };
        
        let escapeHTMLPolicy;
        if(typeof trustedTypes !== 'undefined'){
            escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
                createHTML: (string) => string
            });
        }else{
            escapeHTMLPolicy = {
                createHTML: (string) => string
            }
        }

        let youtubeRetriever = {
            interval : 200,
            refresher : null,
            messenger : null,
            api_key : "",
            username : "",
            url_channel : "",
            url_base : "",
            url_subdomain: "",
            x_goog_pageid : "",
            x_goog_visitor_id: "",
            api_context : {},
            channel_detail: {},

            i8n_labels : {
                "Videos" : ["Videos", "動画", "影片", "视频", "影片"],
                "Shorts" : ["Shorts", "ショート"],
                "Streams" : ["Live", "ライブ", "直播", "直播"],
                "LIVE" : ["LIVE", "ライブ"],
                "SHORTS" : ["SHORTS", "ショート"],
                "CC" : ["CC", "字幕"],
                "Stream" : ["Stream", "配信"],
            },

            initialize : async (url, _refresher_func, _messenger_func) =>{
                const it = youtubeRetriever;

                it.refresher = _refresher_func;
                it.messenger = _messenger_func;

                let url_m = url.match(/^(https:\/\/(www|m)\.youtube\.com)(\/channel\/)([-A-Za-z0-9_]+)(\/|$)/);
                if (url_m == null){
                    url_m = url.match(/^(https:\/\/(www|m)\.youtube\.com)(\/c\/)([^\/]+)(\/|$)/);
                }
                if (url_m == null){
                    url_m = url.match(/^(https:\/\/(www|m)\.youtube\.com)(\/)(@[^\/]+)(\/|$)/);
                }
                if(url_m != null && url_m.length > 2){
                    it.username = url_m[4];
                    it.url_channel = url_m[1] + url_m[3] + url_m[4];
                    it.url_base = url_m[1];
                    it.url_subdomain = url_m[2];
                    return true;
                }else{
                    return false;
                }
            },

            retrieve : async (_retriever_parameters) =>{
                const it = youtubeRetriever;
                const uuid = crypto.randomUUID();
                retriever_parameters.current_retrieve_uuid = uuid;

                let msg_rough_list = "Now retrieving Rough list ..."
                let elm_msg_rough_list = await it.messenger.info(msg_rough_list)

                for (const mediaType of [
                    {url_suffix : "/videos", title_in_json : "Videos"},
                    {url_suffix : "/shorts", title_in_json : "Shorts"},
                    {url_suffix : "/streams", title_in_json : "Streams"},
                ]){
                    // console.log(mediaType.url_suffix)

                    if (_retriever_parameters.stop_loading === true){
                        it.messenger.warn("Loading has been stopped manually", 3000);
                        break;
                    }

                    if (retriever_parameters.current_retrieve_uuid !== uuid){
                        break;
                    }

                    let continuationRequestId = await it.getInitialPageData(mediaType);
                    await sleep(it.interval)
                    for (let i=0; i<10000; i++){
                        // if (i>1) break;
                        // console.log(`continuationRequestJson : ${continuationRequestJson}`)

                        if (_retriever_parameters.stop_loading === true){
                            it.messenger.warn("Loading has been stopped manually", 3000);
                            break;
                        }

                        if (retriever_parameters.current_retrieve_uuid !== uuid){
                            break;
                        }

                        if(continuationRequestId != null){
                            continuationRequestId = await it.getContinationPageData(continuationRequestId);
                            await it.messenger.update_msg(elm_msg_rough_list, `${msg_rough_list} ${mediaType.title_in_json} Page: ${i+1}`)
                            console.log(`${mediaType.title_in_json} Page: ${i+1}`)
                            await sleep(it.interval)
                        }else{
                            break;
                        }
                    }
                }

                it.refresher.renderer.draw_gradient_graph();
                it.messenger.close(elm_msg_rough_list);
                it.messenger.success("Rough list is completed", 3000)
    
                const msg_detail_list = "Now retrieving Detailed list ..."
                let elm_msg_detail_list = await it.messenger.info(msg_detail_list)

                if (_retriever_parameters.retrieve_detail == true){
                    for (let i=0; i<it.refresher.video_list_raw.length; i++){
                        if (_retriever_parameters.stop_loading == true){
                            it.messenger.warn("Loading has been stopped manually", 3000);
                            break;
                        }
                        
                        if (retriever_parameters.current_retrieve_uuid !== uuid){
                            break;
                        }

                        let a = await it.getVideoPageData(it.refresher.video_list_raw[i][it.refresher.key], clone(it.refresher.video_list_raw[i]))
                        let b = await it.optimize_item_detail(a)
                        await it.refresher.update(b)
                        await it.messenger.update_msg(elm_msg_detail_list, `${msg_detail_list} ${i+1} / ${it.refresher.video_list_raw.length}`)
                        await sleep(it.interval)
                    }
                }

                it.messenger.close(elm_msg_detail_list);
                it.refresher.renderer.draw_gradient_graph();
                it.messenger.success("Detailed list is completed", 3000)
            },

            getInitialPageData : async (mediaType) =>{
                const it = youtubeRetriever;
                let temp_output_raw = "";

                try{
                    // Get first page of /video
                    url = it.url_channel + mediaType.url_suffix;
                    const response = await fetch(url, {
                        method: 'GET', // *GET, POST, PUT, DELETE, etc.
                        // credentials: 'include',
                    });
                    const restext = await response.text();
                    // console.log(restext)

                    let ytInitialData_json = restext.match(/ytInitialData = (.+?);<\/script>/)[1];
                    ytInitialData_json = unescapeEmbeddedJsonString(ytInitialData_json);
                    // console.log(ytInitialData_json)
                    temp_output_raw = ytInitialData_json;
                    const ytInitialData_obj = JSON.parse(ytInitialData_json);
                    
                    let ytcfgSet_json = restext.match(/^ytcfg\.set\((.+?)\);/m)[1];
                    // temp_output_raw = ytcfgSet_json;
                    ytcfgSet_json = unescapeEmbeddedJsonString(ytcfgSet_json);
                    const ytcfgSet_obj = JSON.parse(ytcfgSet_json);


                    if (tryNestedObj(ytInitialData_obj, "responseContext.mainAppWebResponseContext.datasyncId")){
                        let temp_x_goog_pageid = ytInitialData_obj.responseContext.mainAppWebResponseContext.datasyncId.match(/([0-9]+)\|\|([0-9]*)/);
                        if (temp_x_goog_pageid[2] != ""){
                            it.x_goog_pageid = temp_x_goog_pageid[1];
                        }
                    }else if (tryNestedObj(ytcfgSet_obj, "DATASYNC_ID")){
                        let temp_x_goog_pageid = ytcfgSet_obj["DATASYNC_ID"].match(/([0-9A-Za-z]+)\|\|([0-9A-Za-z]*)/);
                        if (temp_x_goog_pageid[2] != ""){
                            it.x_goog_pageid = temp_x_goog_pageid[1];
                        }
                    }
                    it.x_goog_visitor_id = tryNestedObj(ytInitialData_obj, "responseContext.webResponseContextExtensionData.ytConfigData.visitorData");

                    let channel_detail = {};
                    channel_detail["channel_id"] = ytInitialData_obj.metadata.channelMetadataRenderer.externalId;
                    channel_detail["channel_title"] = ytInitialData_obj.metadata.channelMetadataRenderer.title;
                    channel_detail["channel_url"] = ytInitialData_obj.metadata.channelMetadataRenderer.ownerUrls[0];
                    if (ytInitialData_obj.metadata.channelMetadataRenderer.avatar.thumbnails.length > 0){
                        channel_detail["channel_image"] = ytInitialData_obj.metadata.channelMetadataRenderer.avatar.thumbnails[0].url;
                    }else{
                        channel_detail["channel_image"] = "";
                    }
                    channel_detail["channel_description"] = ytInitialData_obj.metadata.channelMetadataRenderer.description;
                    channel_detail["channel_keywords"] = ytInitialData_obj.metadata.channelMetadataRenderer.keywords;
                    channel_detail["channel_subscribers"] = customNumberConverter(tryNestedObj(ytInitialData_obj, [
                        "header.c4TabbedHeaderRenderer.subscriberCountText.simpleText",
                        "header.c4TabbedHeaderRenderer.subscriberCountText.runs[0].text",
                    ]));
                    it.refresher.update_attr(channel_detail)
                    it.channel_detail = channel_detail;

                    let _continuation = "";

                    for(const tab of tryNestedObj(ytInitialData_obj, ["contents.twoColumnBrowseResultsRenderer.tabs", "contents.singleColumnBrowseResultsRenderer.tabs"])){
                        if(tab.tabRenderer){
                            if(it.i8n_labels[mediaType.title_in_json].includes(tab.tabRenderer.title) && 
                                tab.tabRenderer.content.richGridRenderer.contents
                            ){
                                for (const content of tab.tabRenderer.content.richGridRenderer.contents){
                                    if(content.richItemRenderer){
                                        let video_detail = {};
                                        if (mediaType.url_suffix == "/shorts" && content.richItemRenderer.content.reelItemRenderer){
                                            let videoRenderer = content.richItemRenderer.content.reelItemRenderer;
                                            video_detail["channel_id"] = channel_detail["channel_id"];
                                            video_detail["channel_title"] = channel_detail["channel_title"];
                                            video_detail["channel_url"] = channel_detail["channel_url"];
                                            video_detail["video_id"] = videoRenderer.videoId;
                                            video_detail["title"] = videoRenderer.headline.simpleText;
                                            video_detail["video_url"] =  it.url_base + videoRenderer.navigationEndpoint.commandMetadata.webCommandMetadata.url;
                                            video_detail["thumbnail_url"] = videoRenderer.thumbnail.thumbnails[0].url;
                                            if ("viewCountText" in videoRenderer && "simpleText" in videoRenderer.viewCountText){
                                                video_detail["viewCount"] = customNumberConverter(videoRenderer.viewCountText.simpleText);
                                            }
                                            video_detail["publishDate"] = tryNestedObj(videoRenderer, "navigationEndpoint.reelWatchEndpoint.overlay.reelPlayerOverlayRenderer.reelPlayerHeaderSupportedRenderers.reelPlayerHeaderRenderer.timestampText.simpleText");
                                            video_detail["duration"] = 0;
                                            video_detail["isLiveContent"] = "";
                                            video_detail["isLiveNow"] = false;
                                            video_detail["isShort"] = true;
                                            video_detail["lengthSimpleText"] = "";
                                        }else{
                                            // console.log(content)
                                            let videoRenderer = tryNestedObj(content.richItemRenderer, [
                                                "content.videoRenderer",
                                                "content.compactVideoRenderer",
                                                "content.videoWithContextRenderer"
                                            ]);
                                            video_detail["channel_id"] = channel_detail["channel_id"];
                                            video_detail["channel_title"] = channel_detail["channel_title"];
                                            video_detail["channel_url"] = channel_detail["channel_url"];
                                            video_detail["video_id"] = videoRenderer.videoId;
                                            video_detail["title"] = tryNestedObj(videoRenderer, [
                                                "title.runs[0].text",
                                                "headline.runs[0].text"
                                            ]);
                                            video_detail["video_url"] =  it.url_base + videoRenderer.navigationEndpoint.commandMetadata.webCommandMetadata.url;
                                            video_detail["thumbnail_url"] = videoRenderer.thumbnail.thumbnails[0].url;
                                            if ("viewCountText" in videoRenderer && "simpleText" in videoRenderer.viewCountText){
                                                video_detail["viewCount"] = customNumberConverter(videoRenderer.viewCountText.simpleText);
                                            }
                                            if ("publishedTimeText" in videoRenderer){
                                                video_detail["publishDate"] = videoRenderer.publishedTimeText.simpleText;
                                            }
                                            video_detail["duration"] = ((_thumbnailOverlays)=>{
                                                for (const _thumbnailOverlay of _thumbnailOverlays){
                                                    if("thumbnailOverlayTimeStatusRenderer" in _thumbnailOverlay){
                                                        return convertColonTimeToSec(_thumbnailOverlay.thumbnailOverlayTimeStatusRenderer.text.simpleText);
                                                    }
                                                }
                                                return "";
                                            })(videoRenderer.thumbnailOverlays);
                                            if (video_detail["publishDate"]){
                                                video_detail["isLiveContent"] = (video_detail["publishDate"].match(it.i8n_labels.Stream.join("|")))? "Streaming": "";
                                            }
                                            video_detail["isLiveNow"] = false;
                                            video_detail["isShort"] = (mediaType.url_suffix == "/shorts")? true : false;
                                            video_detail["lengthSimpleText"] = "";
                                            for(const _thumbnailOverlays of videoRenderer.thumbnailOverlays){
                                                if(_thumbnailOverlays.thumbnailOverlayTimeStatusRenderer){
                                                    const _temp_text = _thumbnailOverlays.thumbnailOverlayTimeStatusRenderer.text.simpleText;
                                                    if (contains(it.i8n_labels["LIVE"], _temp_text)){
                                                        video_detail["isLiveNow"] = true;
                                                    }else if (contains(it.i8n_labels["SHORTS"], _temp_text)){
                                                        video_detail["isShort"] = true;
                                                    }else{
                                                        video_detail["lengthSimpleText"] = _temp_text;
                                                    }
                                                }
                                            }
                                        }

                                        const date_mills_of_this_video = customDateConverter(video_detail["publishDate"]).getTime();
                                        if ((new Date()).getTime() - retriever_parameters.crawling_term > date_mills_of_this_video){
                                            _continuation = null;
                                            break;
                                        }
                                        
                                        // console.log(video_detail)
                                        // console.log(await it.optimize_item_simple(video_detail))
                                        await it.refresher.append(await it.optimize_item_simple(video_detail))
                                    }else if(content.continuationItemRenderer){
                                        _continuation = content.continuationItemRenderer.continuationEndpoint.continuationCommand.token;
                                    }
                                }
                            }
                        }
                    }
                    
                    // console.log(restext);
                    const ytcfg_json = restext.match(/({"CLIENT_CANARY_STATE":.+?})\);/)[1];
                    // console.log(ytcfg_json);
                    const ytcfg_obj = JSON.parse(ytcfg_json);
                    
                    it.api_key = ytcfg_obj.INNERTUBE_API_KEY;
                    it.api_context = ytcfg_obj.INNERTUBE_CONTEXT;
                    
                    // console.log(_continuation)
                    if(_continuation == null || _continuation == ""){
                        return null;
                    }else{
                        return _continuation;
                    }
                }catch(e){
                    console.error(e);
                    if (typeof temp_output_raw == 'string'){
                        console.log(temp_output_raw);
                    }else{
                        console.log(JSON.stringify(temp_output_raw));
                    }
                    it.messenger.danger(e.toString(), 10000)
                }
            },

            requestApi : async (_url, continuationRequestJson) =>{
                const it = youtubeRetriever;
                let temp_target_json = "";

                try{
                    // console.log(continuationRequestJson)
                    // console.log(_url)
                    const t = Math.floor((new Date().getTime())/1000);
                    let sha1 = "";
                    if (document.cookie && document.cookie.match(/SAPISID=(.+?);/)){
                        sha1 = await digestMessage(t + " " + document.cookie.match(/SAPISID=(.+?);/)[1] + ` https://${it.url_subdomain}.youtube.com`)
                    }

                    // console.log("it.x_goog_pageid : " + it.x_goog_pageid)
                    // console.log("it.x_goog_visitor_id : " + it.x_goog_visitor_id)
                    // console.log("sha1 for authorization : " + sha1)
                    let _response = null;
                    if (sha1 != ""){
                        // console.log(_url)
                        // console.log(continuationRequestJson)
                        _headers = {
                            'Content-Type': 'application/json',
                            'authorization': `SAPISIDHASH ${t}_${sha1}`,

                            'x-goog-authuser': '0',
                            'x-goog-visitor-id': it.x_goog_visitor_id,
                            // 'x-origin': `https://${it.url_subdomain}.youtube.com`,
                            // 'x-youtube-bootstrap-logged-in': 'true',
                            // 'x-youtube-client-name': '1',
                            // 'x-youtube-client-version': '2.20221122.06.00',
                        }
                        
                        if (it.x_goog_pageid != ""){
                            _headers['x-goog-pageid'] = it.x_goog_pageid
                        }

                        _response = await fetch(_url, {
                            method: 'POST', // *GET, POST, PUT, DELETE, etc.
                            headers: _headers,
                            body: JSON.stringify(continuationRequestJson),
                            // credentials: 'include',
                        });
                    }else{
                        _response = await fetch(_url, {
                            method: 'POST', // *GET, POST, PUT, DELETE, etc.
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(continuationRequestJson),
                            // credentials: 'include',
                        });
                    }
                    const _resjson = await _response.json();
                    return _resjson;
                }catch(e){
                    console.error(e);
                    console.error(temp_target_json);
                    it.messenger.danger(e.toString(), 10000)
                }
            },

            getContinationPageData : async (continuationRequestId) =>{
                const it = youtubeRetriever;
                let temp_target_json = "";

                try{
                    const continuationRequestJson = {
                        "context": it.api_context,
                        "continuation": continuationRequestId
                    }
                    const _url = `https://${it.url_subdomain}.youtube.com/youtubei/v1/browse?key=${it.api_key}&prettyPrint=false`.toString();
                    const _resjson = await it.requestApi(_url, continuationRequestJson);
                    temp_target_json = _resjson;
                    // console.log(_resjson);

                    if (_resjson.onResponseReceivedActions == null){
                        console.warn("Couldn't get the list of data")
                        console.warn(_resjson)
                        it.messenger.danger("Couldn't get the list of data", 10000)
                        await sleep(1000)
                        return null;
                    }
        
                    let _continuation = "";
                    for(const item of _resjson.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems){
                        let video_detail = {};
                        video_detail["channel_id"] = it.channel_detail["channel_id"];
                        video_detail["channel_title"] = it.channel_detail["channel_title"];
                        video_detail["channel_url"] = it.channel_detail["channel_url"];

                        if(item.gridVideoRenderer){
                            video_detail["video_id"] = item.gridVideoRenderer.videoId;
                            video_detail["title"] = item.gridVideoRenderer.title.runs[0].text;
                            video_detail["video_url"] = it.url_base + item.gridVideoRenderer.navigationEndpoint.commandMetadata.webCommandMetadata.url;
                            video_detail["thumbnail_url"] = item.gridVideoRenderer.thumbnail.thumbnails[0].url;
                            video_detail["viewCount"] = customNumberConverter(item.gridVideoRenderer.viewCountText.simpleText);
                            video_detail["publishDate"] = item.gridVideoRenderer.publishedTimeText.simpleText;
                            video_detail["duration"] = ((_thumbnailOverlays)=>{
                                for (const _thumbnailOverlay of _thumbnailOverlays){
                                    if("thumbnailOverlayTimeStatusRenderer" in _thumbnailOverlay){
                                        return convertColonTimeToSec(_thumbnailOverlay.thumbnailOverlayTimeStatusRenderer.text.simpleText);
                                    }
                                }
                                return "";
                            })(item.gridVideoRenderer.thumbnailOverlays);
                            video_detail["isLiveContent"] = (video_detail["publishDate"].match(it.i8n_labels.Stream.join("|")))? "Streaming": "";
                            video_detail["isLiveNow"] = false;
                            video_detail["isShort"] = false;
                            video_detail["lengthSimpleText"] = "";
                            video_detail["shortDescription"] = "";
                            for(const _thumbnailOverlays of item.gridVideoRenderer.thumbnailOverlays){
                                if(_thumbnailOverlays.thumbnailOverlayTimeStatusRenderer){
                                    const _temp_text = _thumbnailOverlays.thumbnailOverlayTimeStatusRenderer.text.simpleText;
                                    if (contains(it.i8n_labels["LIVE"], _temp_text)){
                                        video_detail["isLiveNow"] = true;
                                    }else if (contains(it.i8n_labels["SHORTS"], _temp_text)){
                                        video_detail["isShort"] = true;
                                    }else{
                                        video_detail["lengthSimpleText"] = _temp_text;
                                    }
                                }
                            }
                            // console.log(video_detail)
                            await it.refresher.append(await it.optimize_item_simple(video_detail))
                        }else if(item.richItemRenderer && item.richItemRenderer.content.reelItemRenderer){
                            video_detail["video_id"] = item.richItemRenderer.content.reelItemRenderer.videoId;
                            video_detail["title"] = item.richItemRenderer.content.reelItemRenderer.headline.simpleText;
                            video_detail["video_url"] = it.url_base + item.richItemRenderer.content.reelItemRenderer.navigationEndpoint.commandMetadata.webCommandMetadata.url;
                            video_detail["thumbnail_url"] = item.richItemRenderer.content.reelItemRenderer.thumbnail.thumbnails[0].url;
                            video_detail["viewCount"] = customNumberConverter(item.richItemRenderer.content.reelItemRenderer.viewCountText.simpleText);
                            video_detail["publishDate"] = tryNestedObj(item, "richItemRenderer.content.reelItemRenderer.navigationEndpoint.reelWatchEndpoint.overlay.reelPlayerOverlayRenderer.reelPlayerHeaderSupportedRenderers.reelPlayerHeaderRenderer.timestampText.simpleText");
                            video_detail["shortDescription"] = "";
                            video_detail["duration"] = 0;
                            video_detail["isLiveContent"] = ""
                            video_detail["isLiveNow"] = false;
                            video_detail["isShort"] = true;
                            video_detail["lengthSimpleText"] = "";
                            // console.log(video_detail)
                            await it.refresher.append(await it.optimize_item_simple(video_detail))
                        }else if(item.richItemRenderer && item.richItemRenderer.content.videoRenderer){
                            video_detail["video_id"] = item.richItemRenderer.content.videoRenderer.videoId;
                            video_detail["title"] = item.richItemRenderer.content.videoRenderer.title.runs[0].text;
                            video_detail["video_url"] = it.url_base + item.richItemRenderer.content.videoRenderer.navigationEndpoint.commandMetadata.webCommandMetadata.url;
                            video_detail["thumbnail_url"] = item.richItemRenderer.content.videoRenderer.thumbnail.thumbnails[0].url;
                            video_detail["viewCount"] = customNumberConverter(tryNestedObj(item, "richItemRenderer.content.videoRenderer.viewCountText.simpleText"));
                            video_detail["publishDate"] = tryNestedObj(item, "richItemRenderer.content.videoRenderer.publishedTimeText.simpleText");
                            if (item.richItemRenderer.content.videoRenderer.descriptionSnippet){
                                video_detail["shortDescription"] = item.richItemRenderer.content.videoRenderer.descriptionSnippet.runs[0].text;
                            }else{
                                video_detail["shortDescription"] = "";
                            }
                            if (item.richItemRenderer.content.videoRenderer.lengthText){
                                video_detail["duration"] = convertColonTimeToSec(item.richItemRenderer.content.videoRenderer.lengthText.simpleText);
                            }
                            video_detail["isLiveContent"] = (video_detail["publishDate"] && video_detail["publishDate"].match(it.i8n_labels.Stream.join("|")))? "Streaming": "";
                            video_detail["isLiveNow"] = false;
                            video_detail["isShort"] = false;
                            video_detail["lengthSimpleText"] = "";

                            // console.log(video_detail)
                            await it.refresher.append(await it.optimize_item_simple(video_detail))
                        }else if(item.continuationItemRenderer){
                            _continuation = item.continuationItemRenderer.continuationEndpoint.continuationCommand.token;
                        }
                        
                        const date_mills_of_this_video = customDateConverter(video_detail["publishDate"]).getTime();
                        if ((new Date()).getTime() - retriever_parameters.crawling_term > date_mills_of_this_video){
                            _continuation = null;
                            break;
                        }
                    }
        
                    // console.log(_continuation)
                    if(_continuation == null || _continuation == ""){
                        return null;
                    }else{
                        return _continuation;
                    }
                }catch(e){
                    console.error(e);
                    console.error(temp_target_json);
                    it.messenger.danger(e.toString(), 10000)
                }
            },

            getVideoPageData : async (_video_url, video_detail = {}) =>{
                // console.log(`getVideoPageData : ${_video_url} ${video_detail.title}`)
                const it = youtubeRetriever;

                // Get first page of /video
                try{
                    const _response = await fetch(_video_url);
                    const _restext = await _response.text();
                    const ytInitialPlayerResponse_json = _restext.match(/var ytInitialPlayerResponse = (\{.+?)(;var |;<\/script>)/)[1];
                    // console.log(ytInitialPlayerResponse_json)
                    const ytInitialPlayerResponse_obj = JSON.parse(ytInitialPlayerResponse_json);
                    video_detail["lengthSeconds"] = ytInitialPlayerResponse_obj.videoDetails.lengthSeconds;
                    video_detail["shortDescription"] = ytInitialPlayerResponse_obj.videoDetails.shortDescription;
                    video_detail["tags"] = ytInitialPlayerResponse_obj.videoDetails.keywords;
                    video_detail["viewCount"] = ytInitialPlayerResponse_obj.microformat.playerMicroformatRenderer.viewCount;
                    video_detail["isLiveContent"] = ytInitialPlayerResponse_obj.videoDetails.isLiveContent;
                    video_detail["category"] = ytInitialPlayerResponse_obj.microformat.playerMicroformatRenderer.category;
                    video_detail["publishDate"] = ytInitialPlayerResponse_obj.microformat.playerMicroformatRenderer.publishDate;
                    
                    let ytInitialData_json = _restext.match(/var ytInitialData = (.+?);<\/script>/)[1];
                    ytInitialData_json = unescapeEmbeddedJsonString(ytInitialData_json);

                    // console.log(ytInitialData_json)
                    const ytInitialData_obj = JSON.parse(ytInitialData_json);
        
                    video_detail["comments"] = "";
                    for(const _engagementPanel of ytInitialData_obj.engagementPanels){
                        if (_engagementPanel.engagementPanelSectionListRenderer.panelIdentifier == "comment-item-section" &&
                            "contextualInfo" in _engagementPanel.engagementPanelSectionListRenderer.header.engagementPanelTitleHeaderRenderer){
                            video_detail["comments"] = customNumberConverter(_engagementPanel.engagementPanelSectionListRenderer.header.engagementPanelTitleHeaderRenderer.contextualInfo.runs[0].text)
                        }
                    }
                
                    video_detail["likes"] = "";
                    if(ytInitialData_obj.contents && ytInitialData_obj.contents.twoColumnWatchNextResults){
                        for(const c of ytInitialData_obj.contents.twoColumnWatchNextResults.results.results.contents){
                            if (c.videoPrimaryInfoRenderer){
                                for (const c2 of c.videoPrimaryInfoRenderer.videoActions.menuRenderer.topLevelButtons){
                                    if (c2.segmentedLikeDislikeButtonRenderer){
                                        video_detail["likes"] = customNumberConverter(c2.segmentedLikeDislikeButtonRenderer.likeButton.toggleButtonRenderer.defaultText.simpleText);
                                    }
                                }
                            }
                        }
                    }else if (ytInitialData_obj.contents && ytInitialData_obj.contents.singleColumnWatchNextResults){
                        for(const c of ytInitialData_obj.contents.singleColumnWatchNextResults.results.results.contents){
                            if (c.slimVideoActionBarRenderer){
                                for (const c2 of c.slimVideoActionBarRenderer.buttons){
                                    if (c2.segmentedLikeDislikeButtonRenderer){
                                        video_detail["likes"] = customNumberConverter(c2.segmentedLikeDislikeButtonRenderer.likeButton.toggleButtonRenderer.defaultText.simpleText);
                                    }
                                }
                            }
                        }
                    }

                    if (ytInitialData_obj.overlay && ytInitialData_obj.overlay.reelPlayerOverlayRenderer){
                        // SHORTS view
                        video_detail["comments"] = customNumberConverter(ytInitialData_obj.overlay.reelPlayerOverlayRenderer.viewCommentsButton.buttonRenderer.text.simpleText);
                        video_detail["likes"] = customNumberConverter(ytInitialData_obj.overlay.reelPlayerOverlayRenderer.likeButton.likeButtonRenderer.likeCount);
                        // let _viewCountText = ytInitialData_obj.overlay.reelPlayerOverlayRenderer.menu.menuRenderer.items[0].menuServiceItemRenderer.serviceEndpoint.signalServiceEndpoint.actions[0].openPopupAction.popup.reelDescriptionSheetRenderer.viewCountText.runs;
                        // for (let _v of _viewCountText){
                        //     if(_v.text.match(/[0-9, .]+/)){
                        //         video_detail["viewCount"] = _v.text.replaceAll(/[^0-9.]/g, "");
                        //     }
                        // }
                    }

                    const continuous_id_topComments = (new JsonPathFinder()).find(ytInitialData_obj, "//itemSectionRenderer[./sectionIdentifier = 'comment-item-section']//token")
                    if (continuous_id_topComments){
                        video_detail["topComments"] = await it.getTopComments(continuous_id_topComments);
                    }

                    const continuous_id_transcription = (new JsonPathFinder()).find(ytInitialData_obj, "//getTranscriptEndpoint//params")
                    if (continuous_id_transcription){
                        video_detail["transcriptions"] = await it.getTranscription(continuous_id_transcription);
                    }
                    
                    // const continuous_liveChatComments = (new JsonPathFinder()).find(ytInitialData_obj, "//liveChatRenderer//continuation")
                    // if (continuous_liveChatComments){
                    //     video_detail["liveChatComments"] = await it.getChatReplay(continuous_liveChatComments);
                    // }
                    
                    const chapters = (new JsonPathFinder()).find(ytInitialData_obj, "//chapters")
                    if (chapters){
                        video_detail["chapters"] = (new JsonPathFinder()).find(chapters, "//title/simpleText", false);
                    }

                }catch(e){
                    console.error(e);
                    it.messenger.danger(e.toString(), 10000)
                }
    
                return video_detail;
            },

            getTopComments : async (continuationRequestId) =>{
                const it = youtubeRetriever;
                let temp_target_json = "";

                try{
                    const continuationRequestJson = {
                        "context": it.api_context,
                        "continuation": continuationRequestId
                    }
                    const _url = `https://${it.url_subdomain}.youtube.com/youtubei/v1/next?key=${it.api_key}&prettyPrint=false`.toString();
                    const _resjson = await it.requestApi(_url, continuationRequestJson);
                    temp_target_json = _resjson;
                    // console.log(_resjson);

                    const results = [];

                    const contentTexts = (new JsonPathFinder()).find(_resjson, "//contentText", false, [])
                    for (const contentText of contentTexts){
                        results.push((new JsonPathFinder()).find(contentText, "//text", false).join(""))
                    }

                    // console.log(results)
                    return results;

                }catch(e){
                    console.error(e);
                    console.error(temp_target_json);
                    it.messenger.danger(e.toString(), 10000)
                }
            },
            
            getTranscription : async (continuationRequestId) =>{
                const it = youtubeRetriever;
                let temp_target_json = "";

                try{
                    const continuationRequestJson = {
                        "context": it.api_context,
                        "params": continuationRequestId
                    }
                    const _url = `https://${it.url_subdomain}.youtube.com/youtubei/v1/get_transcript?key=${it.api_key}&prettyPrint=false`.toString();
                    const _resjson = await it.requestApi(_url, continuationRequestJson);
                    temp_target_json = _resjson;
                    // console.log(_resjson);

                    const results = [];

                    const contentTexts = (new JsonPathFinder()).find(_resjson, "//transcriptSegmentRenderer", false, [])
                    for (const contentText of contentTexts){
                        results.push((new JsonPathFinder()).find(contentText, "//text", false).join(""))
                    }

                    // console.log(results)
                    return results;

                }catch(e){
                    console.error(e);
                    console.error(temp_target_json);
                    it.messenger.danger(e.toString(), 10000)
                }
            },
            
            getChatReplay : async (continuationRequestId) =>{
                const it = youtubeRetriever;
                let temp_target_json = "";

                try{
                    const results = [];
                    const ids = {};

                    let new_continuationRequestId = continuationRequestId;
                    let playerOffsetMs = 0;

                    while(continuationRequestId){
                        const continuationRequestJson = {
                            "context": it.api_context,
                            "continuation": continuationRequestId,
                            "currentPlayerState": {
                                "playerOffsetMs" : playerOffsetMs
                            }
                        }
                        const _url = `https://${it.url_subdomain}.youtube.com/youtubei/v1/live_chat/get_live_chat_replay?key=${it.api_key}&prettyPrint=false`.toString();
                        // console.log(continuationRequestId)
                        // console.log(playerOffsetMs)
                        const _resjson = await it.requestApi(_url, continuationRequestJson);
                        temp_target_json = _resjson;
                        // console.log(_resjson);

                        let new_playerOffsetMs = playerOffsetMs;
                        const contentTexts = (new JsonPathFinder()).find(_resjson, "//replayChatItemAction", false, [])
                        for (const contentText of contentTexts){
                            const _message_text = (new JsonPathFinder()).find(contentText, "//message//text");
                            const _id = (new JsonPathFinder()).find(contentText, "//id");
                            if (_message_text && _message_text.includes("Live chat replay is on") == false && (_id in ids) == false){
                                results.push(_message_text)
                                ids[_id] = _message_text
                                
                                const _purchaseAmountText = (new JsonPathFinder()).find(contentText, "//purchaseAmountText/simpleText");
                                if (_purchaseAmountText){
                                    console.log(_id + " " + _message_text + " " + _purchaseAmountText);
                                }
                            }
                            
                            new_playerOffsetMs = Number((new JsonPathFinder()).find(contentText, "//videoOffsetTimeMsec"));
                        }
                        new_continuationRequestId = (new JsonPathFinder()).find(_resjson, "//liveChatReplayContinuationData/continuation")
                        
                        if (playerOffsetMs == new_playerOffsetMs){
                            break;
                        }else{
                            playerOffsetMs = new_playerOffsetMs;
                        }
                        await sleep(200)
                    }

                    // console.log(results)
                    return results;

                }catch(e){
                    console.error(e);
                    console.error(temp_target_json);
                    it.messenger.danger(e.toString(), 10000)
                }
            },

            optimize_item_simple : async (item)=>{
                let new_item = {
                    "channel_id": item.channel_id,
                    "channel_title": item.channel_title,
                    "channel_url": item.channel_url,

                    "video_id": item.video_id,
                    "video_url" : item.video_url.replaceAll(/&.+$/gi, ""),
                    "thumbnail_url" : item.thumbnail_url,
                    "title": (item.title)? item.title : "",
                    "duration": item.duration? item.duration: 0,
                    "publishDate": (item.publishDate)? customDateConverter(item.publishDate): new Date(),
                    "category": "",
                    "type": ((i)=>{
                        if(i.isShort) {return "Youtube Shorts"}
                        else if (i.isLiveContent) {return "Streaming"}
                        else {return ""}
                    })(item),
                    "tags": [],
                    "viewCount": Number((item.viewCount)? item.viewCount: 0),
                    "comments":"",
                    "likes":"",
                    "shortDescription" : item.shortDescription,
                }
                return new_item;
            },
            optimize_item_detail : async (item)=>{
                try{
                    let new_item = {
                        "channel_id": item.channel_id,
                        "channel_title": item.channel_title,
                        "channel_url": item.channel_url,

                        "video_id": item.video_id,
                        "video_url" : item.video_url.replaceAll(/&.+$/gi, ""),
                        "thumbnail_url" : item.thumbnail_url,
                        "title": item.title,
                        "duration": Number(item.lengthSeconds),
                        "publishDate": new Date((new Date(item.publishDate)).getTime() + ((new Date(item.publishDate)).getTimezoneOffset() * 60 * 1000)),
                        "category": item.category,
                        "type": ((i)=>{
                            if (i.isLiveContent) {return "Streaming"}
                            else {return i.type}
                        })(item),
                        "tags": isNullOrEmpty(item.tags)? [] : item.tags.map(x => x.toUpperCase()),
                        "viewCount": Number(item.viewCount),
                        "comments": Number(item.comments),
                        "likes": Number(item.likes),
                        "shortDescription" : item.shortDescription,
                        "topComments" : (item.topComments)? item.topComments : [],
                        "transcriptions" : (item.transcriptions)? item.transcriptions : [],
                        "chapters" : (item.chapters)? item.chapters : [],
                    }
                    return new_item;
                }catch(e){
                    console.error(e)
                    return null;
                }
            }
        }

        let twitchRetriever = {
            interval : 1000,
            refresher : null,
            messenger : null,
            username : "",
            url_channel : "",
            url_base : "",
            api_url : "https://gql.twitch.tv/gql",

            channel_detail : {},
            
            clientId : "",
            deviceId : "",
            clientSessionId: "",
            
            initialize : async (url, _refresher_func, _messenger_func) =>{
                const it = twitchRetriever;

                it.refresher = _refresher_func;
                it.messenger = _messenger_func;

                let url_m = url.match(/^(https:\/\/(www|m)\.twitch\.tv)\/([-A-Za-z0-9_]+)(\/|$)/);
                if(url_m != null && url_m.length > 2){
                    it.username = url_m[3];
                    it.url_channel = url_m[1] + "/"+ url_m[3];
                    it.url_base = url_m[1];
                    
                    it.clientId = "";
                    it.deviceId = "";
                    it.clientSessionId = "";

                    return true;
                }else{
                    return false;
                }

            },
            
            retrieve : async (_retriever_parameters) =>{
                const it = twitchRetriever;
                const uuid = crypto.randomUUID();
                retriever_parameters.current_retrieve_uuid = uuid;

                let msg_rough_list = "Now retrieving Rough list ..."
                let elm_msg_rough_list = await it.messenger.info(msg_rough_list)

                await it.getInitialPageData();
                let cursor = await it.getContinationPageData(null);
                await sleep(it.interval)
                for (let i=0; i<10000; i++){
                    if(cursor != null){
                        if (_retriever_parameters.stop_loading == true){
                            it.messenger.warn("Loading has been stopped manually", 3000);
                            break;
                        }

                        if (retriever_parameters.current_retrieve_uuid !== uuid){
                            break;
                        }

                        cursor = await it.getContinationPageData(cursor);
                        await it.messenger.update_msg(elm_msg_rough_list, `${msg_rough_list} Page: ${i+1}`)
                        await sleep(it.interval)
                    }else{
                        break;
                    }
                }
                it.refresher.update_attr(it.channel_detail)

                it.messenger.close(elm_msg_rough_list);
                it.messenger.success("Rough list is completed", 3000)
            },

            getInitialPageData : async () =>{
                const it = twitchRetriever;

                try{
                    const _response_html = await (await fetch(it.url_channel)).text()
                    it.clientId = _response_html.match(/clientId="([^"]+)"/)[1]
                    it.deviceId = localStorage.getItem('local_copy_unique_id')
                    it.clientSessionId = localStorage.getItem('local_storage_app_session_id')
                    
                    const _response = await fetch(it.api_url, {
                        method: 'POST', // *GET, POST, PUT, DELETE, etc.
                        headers: {
                            'Content-Type': 'application/json',
                            'Client-Id' : it.clientId,
                            'X-Device-Id' : it.deviceId,
                            'Client-Session-Id' : it.clientSessionId
                        },
                        //credentials: 'include',
                        body: JSON.stringify([
                            {
                                "query": "query ChannelAvatar($channelLogin: String!) {\nuser(login: $channelLogin) {\nid\nfollowers {\ntotalCount\n}\nisPartner\nprimaryColorHex\n}\n}",
                                "operationName": "ChannelAvatar",
                                "variables": {
                                    "channelLogin": it.username
                                }
                            },
                            {
                                "query": "query HomeOfflineCarousel(\n$channelLogin: String!\n) {\nuser(login: $channelLogin) {\nid\nlogin\ndisplayName\ndescription\nchannel {\nid\nhome {\nautohostCarouselCard(recommendationsContext: { platform: \"web\" }) {\nchannel {\nid\nowner {\n\n\n\nid\nlogin\ndisplayName\nprofileImageURL(width: 50)\nstream {\nid\nviewersCount\npreviewImageURL(width: 640 height: 360)\ngame {\nid\nname\ndisplayName\n}\n}\n\n\n}\n}\ntrackingID\n}\n}\nschedule {\nid\nnextSegment {\nid\nstartAt\n}\n}\n}\nhosting {\n\n\nid\nlogin\ndisplayName\nprofileImageURL(width: 50)\nstream {\nid\nviewersCount\npreviewImageURL(width: 640 height: 360)\ngame {\nid\nname\ndisplayName\n}\n}\n\n}\nroles {\nisPartner\nisAffiliate\nisStaff\n}\nself {\nisEditor\nfollower {\ndisableNotifications\n}\nsubscriptionBenefit {\nid\n}\n}\n}\n}",
                                "operationName": "HomeOfflineCarousel",
                                "variables": {
                                    "channelLogin": it.username,
                                    "includeTrailerUpsell": false,
                                    "trailerUpsellVideoID": ""
                                }
                            }
                        ])
                    });

                    const _resjson = await _response.json();
                    // console.log(_resjson);

                    for (let block of _resjson){
                        if (block.extensions.operationName == "ChannelAvatar"){
                            it.channel_detail["channel_subscribers"] = block.data.user.followers.totalCount;
                        }else if (block.extensions.operationName == "HomeOfflineCarousel"){
                            it.channel_detail["channel_id"] = block.data.user.id;
                            it.channel_detail["channel_title"] = block.data.user.displayName;
                            it.channel_detail["channel_url"] = it.url_channel;
                            it.channel_detail["channel_description"] = block.data.user.description;
                        }
                    }

                    it.refresher.update_attr(it.channel_detail)
                
                }catch(e){
                    console.error(e);
                    it.messenger.danger(e.toString(), 10000)
                }
            },
            
            getContinationPageData : async (cursor) =>{
                const it = twitchRetriever;

                try{
                    const limit = 30;
                    const _response = await fetch(it.api_url, {
                        method: 'POST', // *GET, POST, PUT, DELETE, etc.
                        headers: {
                            'Content-Type': 'application/json',
                            'Client-Id' : it.clientId,
                            'X-Device-Id' : it.deviceId,
                            'Client-Session-Id' : it.clientSessionId
                        },
                        //credentials: 'include',
                        body: JSON.stringify([
                            {
                                "query": "query FilterableVideoTower_Videos($channelOwnerLogin: String! $limit: Int $cursor: Cursor $broadcastType: BroadcastType $videoSort: VideoSort $options: VideoConnectionOptionsInput) {\nuser(login: $channelOwnerLogin) {\nid\nvideos(first: $limit after: $cursor type: $broadcastType sort: $videoSort options: $options) {\nedges {\n  \ncursor\nnode {\n  \nanimatedPreviewURL\ngame {\nboxArtURL(width: 40 height: 56)\nid\ndisplayName\nname\n}\nid\nlengthSeconds\nowner {\ndisplayName\nid\nlogin\nprofileImageURL(width: 50)\nprimaryColorHex\n}\npreviewThumbnailURL(width: 320 height: 180)\npublishedAt\nself {\nisRestricted\nviewingHistory {\nposition\nupdatedAt\n}\n}\ntitle\nviewCount\nresourceRestriction {\n\n\nid\ntype\nexemptions {\ntype\nactions {\nname\ntitle\n}\n}\noptions\n\n\n}\ncontentTags {\n\n\nid\nisLanguageTag\nlocalizedName\ntagName\n\n\n}\n}  \n  \n}\npageInfo {\nhasNextPage\n}\n}\n}\n}",
                                "operationName": "FilterableVideoTower_Videos",
                                "variables": {
                                    "broadcastType": null,
                                    "channelOwnerLogin": it.username,
                                    "limit": limit,
                                    "videoSort": "TIME",
                                    "cursor": cursor,
                                }
                            },
                        ])
                    });
    
                    const _resjson = await _response.json();
                    // console.log(_resjson);

                    let _cursor = null;

                    for (let item of _resjson[0].data.user.videos.edges){
                        if (("channel_image" in it.channel_detail) == false){
                            it.channel_detail["channel_image"] = item.node.owner.profileImageURL;
                            it.refresher.update_attr(it.channel_detail)
                        }

                        let video_detail = {};
                        video_detail["channel_id"] = it.channel_detail["channel_id"];
                        video_detail["channel_title"] = it.channel_detail["channel_title"];
                        video_detail["channel_url"] = it.channel_detail["channel_url"];
                        video_detail["video_id"] = item.node.id;
                        video_detail["title"] = item.node.title;
                        video_detail["video_url"] = it.url_base + "/videos/" + video_detail["video_id"];
                        video_detail["thumbnail_url"] = item.node.previewThumbnailURL;
                        video_detail["viewCount"] = item.node.viewCount;
                        video_detail["publishDate"] = item.node.publishedAt;
                        video_detail["duration"] = item.node.lengthSeconds;

                        _cursor = item.cursor;

                        const date_mills_of_this_video = (new Date(video_detail["publishDate"])).getTime() + ((new Date(video_detail["publishDate"])).getTimezoneOffset() * 60 * 1000);
                        if ((new Date()).getTime() - retriever_parameters.crawling_term > date_mills_of_this_video){
                            return null;
                        }

                        await it.refresher.append(await it.optimize_item_simple(video_detail))
                    }

                    // console.log(_resjson[0].data.user.videos.edges.length)
                    // console.log(_cursor)
                    if (_resjson[0].data.user.videos.edges.length < limit){
                        return null;
                    }else{
                        return _cursor;
                    }
        
                }catch(e){
                    console.error(e);
                    it.messenger.danger(e.toString(), 10000)
                }
            },

            optimize_item_simple : async (item)=>{
                let new_item = {
                    "channel_id": item.channel_id,
                    "channel_title": item.channel_title,
                    "channel_url": item.channel_url,

                    "video_id": item.video_id,
                    "video_url" : item.video_url.replaceAll(/&.+$/gi, ""),
                    "thumbnail_url" : item.thumbnail_url,
                    "title": item.title,
                    "duration": Number(item.duration),
                    "publishDate": new Date((new Date(item.publishDate)).getTime() + ((new Date(item.publishDate)).getTimezoneOffset() * 60 * 1000)),
                    "category": "",
                    "type": "",
                    "tags": [],
                    "viewCount": Number(item.viewCount),
                    "comments":0,
                    "likes":0,
                    "shortDescription" : "",
                }
                return new_item;
            },
        }
        
        let niconicoRetriever = {
            interval : 200,
            refresher : null,
            messenger : null,
            api_key : "",
            username : "",
            url_channel : "",
            url_base : "",
            channel_detail: {},
            
            i8n_labels : {
            },
            
            initialize : async (url, _refresher_func, _messenger_func) =>{
                const it = niconicoRetriever;

                it.refresher = _refresher_func;
                it.messenger = _messenger_func;
                let url_m = url.match(/^(https:\/\/www.nicovideo.jp)(\/user\/)([0-9]+)(\/|\?|$)/);
                if(url_m != null && url_m.length > 2){
                    it.username = url_m[3];
                    it.url_channel = url_m[1] + url_m[2] + url_m[3];
                    it.url_base = url_m[1];
                    return true;
                }else{
                    return false;
                }
            },
            
            retrieve : async (_retriever_parameters) =>{
                const it = niconicoRetriever;
                const uuid = crypto.randomUUID();
                retriever_parameters.current_retrieve_uuid = uuid;

                await it.getChannelData();

                if(true){
                    // Checking normal video page
                    let msg_rough_list = "Now retrieving Rough list ..."
                    let elm_msg_rough_list = await it.messenger.info(msg_rough_list + " Page: 1")

                    let page = 1;
                    while(page){
                        if (_retriever_parameters.stop_loading == true){
                            it.messenger.warn("Loading has been stopped manually", 3000);
                            break;
                        }

                        if (retriever_parameters.current_retrieve_uuid !== uuid){
                            break;
                        }
                        
                        page = await it.getPageData(page);
                        await it.messenger.update_msg(elm_msg_rough_list, `${msg_rough_list} Page: ${page}`)
                        await sleep(it.interval)
                    }

                    it.messenger.close(elm_msg_rough_list);
                    it.messenger.success("Rough list is completed", 3000)
                }

                if(true){
                    // Checking Live video page
                    let msg_rough_list_live = "Now retrieving Rough list in Live contents ..."
                    let elm_msg_rough_list_live = await it.messenger.info(msg_rough_list_live + " Page: 1")

                    let page = 1;
                    while(page){
                        if (_retriever_parameters.stop_loading == true){
                            it.messenger.warn("Loading has been stopped manually", 3000);
                            break;
                        }

                        if (retriever_parameters.current_retrieve_uuid !== uuid){
                            break;
                        }
                        
                        page = await it.getLivePageData(page);
                        await it.messenger.update_msg(elm_msg_rough_list_live, `${msg_rough_list_live} Page: ${page}`)
                        await sleep(it.interval)
                    }

                    it.messenger.close(elm_msg_rough_list_live);
                    it.messenger.success("Rough list in Live contents is completed", 3000)
                }
            },

            getChannelData : async () =>{
                const it = niconicoRetriever;

                try{
                    const url = it.url_channel + "/video?ref=pc_userpage_menu";
                    const response = await fetch(url);
                    const restext = await response.text();
                    let dom = await (new DOMParser()).parseFromString(restext,"text/html");
                    let json = restext.match(/(\{"@context":.+\})<\/script>/)[1]
                    const context_json = JSON.parse(json);
                    
                    let channel_detail = {};
                    channel_detail["channel_id"] = it.username;
                    channel_detail["channel_title"] = context_json["name"];
                    channel_detail["channel_url"] = context_json["url"];
                    channel_detail["channel_image"] = context_json["image"];
                    channel_detail["channel_description"] = context_json["description"];
                    channel_detail["channel_keywords"] = "";
                    channel_detail["channel_subscribers"] = restext.match(/followerCount&quot;:([0-9]+),/)[1]
                    it.channel_detail = channel_detail
                    it.refresher.update_attr(channel_detail)
                    // console.log(channel_detail)
                }catch(e){
                    console.error(e);
                    it.messenger.danger(e.toString(), 10000)
                }
            },
            
            getPageData : async (page) =>{
                const it = niconicoRetriever;

                try{
                    let pageSize = 100;

                    const url = `https://nvapi.nicovideo.jp/v3/users/${it.username}/videos?sortKey=registeredAt&sortOrder=desc&pageSize=${pageSize}&page=${page}`;
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'X-Frontend-Id': 6,
                            'X-Frontend-Version': 0,
                            'X-Niconico-Language': 'en-us',
                        },
                        credentials: 'include',
                        
                    });
                    const restext = await response.text();
                    // console.log(restext)
                    const ytInitialData_obj = JSON.parse(restext);
                    // console.log(ytInitialData_obj)

                    let _continuation = "";
                    let totalCount = ytInitialData_obj.data.totalCount;

                    for(const item of ytInitialData_obj.data.items){
                        let video_detail = {};
                        video_detail["channel_id"] = it.channel_detail["channel_id"];
                        video_detail["channel_title"] = it.channel_detail["channel_title"];
                        video_detail["channel_url"] = it.channel_detail["channel_url"];

                        video_detail["video_id"] = item.essential.id;
                        video_detail["title"] = item.essential.title;
                        video_detail["type"] = (item.essential.videoLive)? "Streaming": "";
                        video_detail["video_url"] =  it.url_base + "/watch/" + item.essential.id;
                        video_detail["thumbnail_url"] = item.essential.thumbnail.url;
                        video_detail["viewCount"] = item.essential.count.view;
                        video_detail["comments"] = item.essential.count.comment;
                        video_detail["likes"] = item.essential.count.like;
                        video_detail["mylist"] = item.essential.count.mylist;
                        video_detail["publishDate"] = item.essential.registeredAt;
                        video_detail["duration"] = item.essential.duration;
                        video_detail["shortDescription"] = item.essential.shortDescription;

                        const date_mills_of_this_video = (new Date(video_detail["publishDate"])).getTime();
                        if ((new Date()).getTime() - retriever_parameters.crawling_term > date_mills_of_this_video){
                            return null;
                        }

                        // console.log(video_detail)
                        await it.refresher.append(await it.optimize_item_simple(video_detail))
                    }

                    if (ytInitialData_obj.data.items.length < pageSize){
                        return null;
                    }else{
                        return page + 1;
                    }
                }catch(e){
                    console.error(e);
                    it.messenger.danger(e.toString(), 10000)
                }
            },

            
            getLivePageData : async (page) =>{
                const it = niconicoRetriever;
                let temp_output;

                try{
                    let pageSize = 100;

                    const url = `https://live.nicovideo.jp/front/api/v1/user-broadcast-history?providerId=${it.username}&providerType=user&isIncludeNonPublic=false&offset=${page-1}&limit=${pageSize}&withTotalCount=true`
                    const response = await fetch(url, {
                        method: 'GET',
                        credentials: 'include',
                        
                    });
                    const restext = await response.text();
                    // console.log(restext)
                    temp_output = restext;
                    const ytInitialData_obj = JSON.parse(restext);
                    // console.log(ytInitialData_obj)
                    temp_output = ytInitialData_obj;

                    let _continuation = "";
                    let totalCount = ytInitialData_obj.data.totalCount;

                    for(const item of ytInitialData_obj.data.programsList){
                        temp_output = item;
                        let video_detail = {};
                        video_detail["channel_id"] = it.channel_detail["channel_id"];
                        video_detail["channel_title"] = it.channel_detail["channel_title"];
                        video_detail["channel_url"] = it.channel_detail["channel_url"];

                        video_detail["video_id"] = item.id.value;
                        video_detail["title"] = item.program.title;
                        video_detail["type"] = "Streaming";
                        video_detail["category"] = (new JsonPathFinder()).find(item, "//categories/mainList//text");
                        video_detail["video_url"] = "https://live.nicovideo.jp/watch/" + video_detail["video_id"];
                        video_detail["thumbnail_url"] = (new JsonPathFinder()).find(item, "//thumbnail/screenshot/micro", true, "");
                        video_detail["viewCount"] = item.statistics.viewers.value;
                        video_detail["comments"] = item.statistics.comments.value;
                        video_detail["publishDate"] = Number(item.program.schedule.openTime.seconds) * 1000;
                        if (item.program.schedule.beginTime && item.program.schedule.endTime){
                            video_detail["duration"] = (Number(item.program.schedule.endTime.seconds) - Number(item.program.schedule.beginTime.seconds));
                        }
                        video_detail["tags"] = (new JsonPathFinder()).find(item, "//taxonomy/tags//text", true, []);

                        video_detail["shortDescription"] = item.program.description;

                        const date_mills_of_this_video = (new Date(video_detail["publishDate"])).getTime();
                        if ((new Date()).getTime() - retriever_parameters.crawling_term > date_mills_of_this_video){
                            return null;
                        }

                        // console.log(video_detail)
                        await it.refresher.append(await it.optimize_item_simple(video_detail))
                    }

                    if (ytInitialData_obj.data.programsList.length < pageSize){
                        return null;
                    }else{
                        return page + 1;
                    }
                }catch(e){
                    console.error(e);
                    console.error(temp_output);
                    it.messenger.danger(e.toString(), 10000)
                }
            },

            
            optimize_item_simple : async (item)=>{
                let new_item = {
                    "channel_id": item.channel_id,
                    "channel_title": item.channel_title,
                    "channel_url": item.channel_url,

                    "video_id": item.video_id,
                    "video_url" : item.video_url,
                    "thumbnail_url" : item.thumbnail_url,
                    "title": item.title,
                    "duration": item.duration,
                    "publishDate": new Date(item.publishDate),
                    "category": (item.category) ? item.category : "",
                    "type": (item.type) ? item.type : "",
                    "viewCount": Number(item.viewCount),
                    "comments": Number(item.comments),
                    "likes": (item.likes)? Number(item.likes) : 0,
                    "mylistCount":  (item.mylist)? Number(item.mylist): 0,
                    "shortDescription" : item.shortDescription,
                }
                return new_item;
            },
        }

        
        let niconicoChannelRetriever = {
            interval : 500,
            refresher : null,
            messenger : null,
            username : "",
            url_channel : "",
            url_base : "",

            channel_detail : {},
            
            initialize : async (url, _refresher_func, _messenger_func) =>{
                const it = niconicoChannelRetriever;

                it.refresher = _refresher_func;
                it.messenger = _messenger_func;

                let url_m = url.match(/^(https:\/\/ch\.nicovideo\.jp)\/([-A-Za-z0-9_]+)(\/|\?|$)/);
                if(url_m != null && url_m.length > 2){
                    it.username = url_m[2];
                    it.url_channel = url_m[1] + "/"+ url_m[2];
                    it.url_base = url_m[1];

                    return true;
                }else{
                    return false;
                }

            },
            
            retrieve : async (_retriever_parameters) =>{
                const it = niconicoChannelRetriever;
                const uuid = crypto.randomUUID();
                retriever_parameters.current_retrieve_uuid = uuid;

                let msg_rough_list = "Now retrieving Rough list ..."
                let elm_msg_rough_list = await it.messenger.info(msg_rough_list)

                if(true){
                    let page = 1;
                    for (let i=0; i<1000; i++){
                        if (_retriever_parameters.stop_loading == true){
                            it.messenger.warn("Loading has been stopped manually", 3000);
                            break;
                        }
    
                        if (retriever_parameters.current_retrieve_uuid !== uuid){
                            break;
                        }
    
                        if(page != null){
                            page = await it.getContinationPageData(page);
                            await it.messenger.update_msg(elm_msg_rough_list, `${msg_rough_list} Video Page: ${page}`)
                            await sleep(it.interval)
                        }else{
                            break;
                        }
                    }
                }
                
                if(true){
                    let page = 1;
                    for (let i=0; i<1000; i++){
                        if (_retriever_parameters.stop_loading == true){
                            it.messenger.warn("Loading has been stopped manually", 3000);
                            break;
                        }
    
                        if (retriever_parameters.current_retrieve_uuid !== uuid){
                            break;
                        }
    
                        if(page != null){
                            page = await it.getContinationLivePageData(page);
                            await it.messenger.update_msg(elm_msg_rough_list, `${msg_rough_list} Live Video Page: ${page}`)
                            await sleep(it.interval)
                        }else{
                            break;
                        }
                    }
                }

                it.messenger.close(elm_msg_rough_list);
                it.messenger.success("Rough list is completed", 3000)
    
                const msg_detail_list = "Now retrieving Detailed list ..."
                let elm_msg_detail_list = await it.messenger.info(msg_detail_list)

                for (let i=0; i<it.refresher.video_list_raw.length; i++){
                    if (_retriever_parameters.stop_loading == true){
                        it.messenger.warn("Loading has been stopped manually", 3000);
                        break;
                    }

                    if (retriever_parameters.current_retrieve_uuid !== uuid){
                        break;
                    }

                    if (it.refresher.video_list_raw[i].video_id.match(/^lv/)){
                        let a = await it.getLiveVideoPageData(it.refresher.video_list_raw[i][it.refresher.key], clone(it.refresher.video_list_raw[i]))
                        await it.messenger.update_msg(elm_msg_detail_list, `${msg_detail_list} ${i+1} / ${it.refresher.video_list_raw.length}`)
                        if (a != null){
                            let b = await it.optimize_item_detail(a)
                            await it.refresher.update(b)
                            await sleep(it.interval)
                        }
                    }
                }

                it.messenger.close(elm_msg_detail_list);
                it.messenger.success("Detailed list is completed", 3000)
            },

            getContinationPageData : async (_page) =>{
                const it = niconicoChannelRetriever;

                try{
                    let pageSize = 20;
                    const url = `https://ch.nicovideo.jp/${it.username}/video?&mode=&sort=f&order=d&type=&page=${_page}`
                    // console.log(url)
                    const _response = await fetch(url, {
                        method: 'GET', // *GET, POST, PUT, DELETE, etc.
                    });
    
                    const _restext = await _response.text();
                    // console.log(_restext);
                    let dom = await (new DOMParser()).parseFromString(_restext,"text/html");
                    
                    if (_page == 0){
                        it.channel_detail["channel_id"] = it.username;
                        it.channel_detail["channel_title"] = trim($(".//*[@class='channel_name']", dom).textContent);
                        it.channel_detail["channel_url"] = it.url_channel;
                        it.channel_detail["channel_image"] = $(".//*[@id='cp_symbol']//img", dom).getAttribute("src")
                        it.refresher.update_attr(it.channel_detail)
                    }

                    for (let item of $$("//li[@class='item']", dom)){
                        if (item == null) break;
                        let video_detail = {};
                        video_detail["channel_id"] = it.channel_detail["channel_id"];
                        video_detail["channel_title"] = it.channel_detail["channel_title"];
                        video_detail["channel_url"] = it.channel_detail["channel_url"];

                        video_detail["video_id"] = $(".//*[@class='item_left']//a", item).getAttribute("href").match(/[^\/]+$/)[0];
                        video_detail["video_url"] = $(".//*[@class='item_left']//a", item).getAttribute("href");
                        video_detail["thumbnail_url"] = $(".//img", item).getAttribute("src");
                        video_detail["title"] = trim($(".//*[@class='title']/a", item).textContent);
                        video_detail["duration"] = $(".//*[contains(@class, 'length')]", item) ? convertColonTimeToSec(trim($(".//*[contains(@class, 'length')]", item).textContent)) : "";
                        video_detail["publishDate"] = $(".//time/var", item) ? new Date(trim($(".//time/var", item).textContent)) : "";
                        video_detail["type"] = ""
                        video_detail["shortDescription"] = $(".//*[contains(@class, 'description')]", item) ? trim($(".//*[contains(@class, 'description')]", item).textContent) : "";

                        video_detail["viewCount"] = $(".//li[contains(@class, 'view')]/var", item)? $(".//li[contains(@class, 'view')]/var", item).textContent.replace(/[^0-9]/g, "") : "";
                        video_detail["comments"] = $(".//li[contains(@class, 'comment')]/var", item)? $(".//li[contains(@class, 'comment')]/var", item).textContent.replace(/[^0-9]/g, "") : "";
                        video_detail["mylist"] = $(".//li[contains(@class, 'mylist')]/var", item)? $(".//li[contains(@class, 'mylist')]/var", item).textContent.replace(/[^0-9]/g, "") : "";
                        
                        const date_mills_of_this_video = (new Date(video_detail["publishDate"])).getTime() + ((new Date(video_detail["publishDate"])).getTimezoneOffset() * 60 * 1000);
                        if ((new Date()).getTime() - retriever_parameters.crawling_term > date_mills_of_this_video){
                            return null;
                        }

                        await it.refresher.append(await it.optimize_item_simple(video_detail))
                    }

                    if ($$("//li[@class='item']", dom).length < pageSize){
                        return null;
                    }else{
                        return _page + 1;
                    }
        
                }catch(e){
                    console.error(e);
                    it.messenger.danger(e.toString(), 10000)
                }
            },
            
            getContinationLivePageData : async (_page) =>{
                const it = niconicoChannelRetriever;

                try{
                    let pageSize = 10;
                    
                    const url = `https://ch.nicovideo.jp/${it.username}/live?&page=${_page}`
                    // console.log(url)
                    const _response = await fetch(url, {
                        method: 'GET', // *GET, POST, PUT, DELETE, etc.
                    });
    
                    const _restext = await _response.text();
                    // console.log(_restext);
                    let dom = await (new DOMParser()).parseFromString(_restext,"text/html");

                    for (let item of $$("//li[@class='item']", dom)){
                        if (item == null) break;
                        let video_detail = {};
                        video_detail["channel_id"] = it.channel_detail["channel_id"];
                        video_detail["channel_title"] = it.channel_detail["channel_title"];
                        video_detail["channel_url"] = it.channel_detail["channel_url"];

                        video_detail["video_id"] = $(".//*[@class='item_left']//a", item).getAttribute("href").match(/[^\/]+$/)[0];
                        video_detail["video_url"] = $(".//*[@class='item_left']//a", item).getAttribute("href");
                        video_detail["thumbnail_url"] = $(".//*[@class='item_left']//img", item).getAttribute("src");
                        video_detail["title"] = trim($(".//*[@class='title']/a", item).textContent);
                        video_detail["publishDate"] = $(".//*[@class='date']", item) ? new Date(trim($(".//*[@class='date']", item).textContent).replace(/[^0-9 \/:]/g, "")) : "";
                        video_detail["type"] = "Streaming"
                        video_detail["shortDescription"] = $(".//*[contains(@class, 'description')]", item) ? trim($(".//*[contains(@class, 'description')]", item).textContent) : "";

                        const date_mills_of_this_video = (new Date(video_detail["publishDate"])).getTime() + ((new Date(video_detail["publishDate"])).getTimezoneOffset() * 60 * 1000);
                        if ((new Date()).getTime() - retriever_parameters.crawling_term > date_mills_of_this_video){
                            return null;
                        }

                        await it.refresher.append(await it.optimize_item_simple(video_detail))
                    }

                    if ($$("//li[@class='item']", dom).length < pageSize){
                        return null;
                    }else{
                        return _page + 1;
                    }
        
                }catch(e){
                    console.error(e);
                    it.messenger.danger(e.toString(), 10000)
                }
            },
            
            getLiveVideoPageData : async (_video_url, video_detail = {}) =>{
                const it = niconicoChannelRetriever;

                // Get first page of /video
                try{
                    const _response = await fetch(_video_url);
                    const _restext = await _response.text();
                    let dom = await (new DOMParser()).parseFromString(_restext,"text/html");

                    // console.log(_video_url)
                    video_detail["duration"] = $(".//*[contains(@class, 'time-score')]//*[contains(@class, 'max')]", dom) ? convertColonTimeToSec(trim($(".//*[contains(@class, 'time-score')]//*[contains(@class, 'max')]", dom).textContent)): "";
                    video_detail["viewCount"] = $(".//*[contains(@class, 'watch-count-item')]/span", dom)? $(".//*[contains(@class, 'watch-count-item')]/span", dom).getAttribute("data-value") : "";
                    video_detail["comments"] = $(".//*[contains(@class, 'comment-count-item')]/span", dom)? $(".//*[contains(@class, 'comment-count-item')]/span", dom).getAttribute("data-value") : "";
                    
                    video_detail["tags"] = [];
                    for (let k of $$(".//ul[contains(@class, 'tag')]", dom)){
                        if (k == null) break;
                        video_detail["tags"].push($(".//*[contains(@class, 'name-anchor')]", k).textContent)
                    }
                    // console.log(video_detail)

                }catch(e){
                    console.error(e);
                    it.messenger.danger(e.toString(), 10000)
                }
    
                return video_detail;
            },

            optimize_item_simple : async (item)=>{
                let new_item = {
                    "channel_id": item.channel_id,
                    "channel_title": item.channel_title,
                    "channel_url": item.channel_url,

                    "video_id": item.video_id,
                    "video_url" : item.video_url,
                    "thumbnail_url" : item.thumbnail_url,
                    "title": item.title,
                    "duration": Number(item.duration),
                    "publishDate": new Date((new Date(item.publishDate)).getTime() + ((new Date(item.publishDate)).getTimezoneOffset() * 60 * 1000)),
                    "category": isNullOrEmpty(item.category) ? "" : item.category,
                    "type": isNullOrEmpty(item.type) ? "" : item.type,
                    "viewCount": Number(item.viewCount),
                    "comments": Number(item.comments),
                    "likes": (item.likes)? Number(item.likes) : 0,
                    "mylistCount":  (item.mylist)? Number(item.mylist): 0,
                    "tags" : item.tags
                }
                return new_item;
            },

            optimize_item_detail : async (item)=>{
                try{
                    let new_item = {
                        "channel_id": item.channel_id,
                        "channel_title": item.channel_title,
                        "channel_url": item.channel_url,

                        "video_id": item.video_id,
                        "video_url" : item.video_url,
                        "thumbnail_url" : item.thumbnail_url,
                        "title": item.title,
                        "duration": Number(item.duration),
                        "publishDate": new Date((new Date(item.publishDate)).getTime() + ((new Date(item.publishDate)).getTimezoneOffset() * 60 * 1000)),
                        "category": isNullOrEmpty(item.category) ? "" : item.category,
                        "type": isNullOrEmpty(item.type) ? "" : item.type,
                        "viewCount": Number(item.viewCount),
                        "comments": Number(item.comments),
                        "likes": (item.likes)? Number(item.likes) : 0,
                        "mylistCount":  (item.mylist)? Number(item.mylist): 0,
                        "shortDescription": item.shortDescription,
                    }
                    return new_item;
                }catch(e){
                    console.error(e)
                    return null;
                }
            }
        }
        
        let twitcastingRetriever = {
            interval : 500,
            refresher : null,
            messenger : null,
            username : "",
            url_channel : "",
            url_base : "",

            channel_detail : {},
            
            initialize : async (url, _refresher_func, _messenger_func) =>{
                const it = twitcastingRetriever;

                it.refresher = _refresher_func;
                it.messenger = _messenger_func;

                let url_m = url.match(/^(https:\/\/twitcasting\.tv)\/([-A-Za-z0-9_]+)(\/|$)/);
                if(url_m != null && url_m.length > 2){
                    it.username = url_m[2];
                    it.url_channel = url_m[1] + "/"+ url_m[2];
                    it.url_base = url_m[1];

                    return true;
                }else{
                    return false;
                }

            },
            
            retrieve : async (_retriever_parameters) =>{
                const it = twitcastingRetriever;
                const uuid = crypto.randomUUID();
                retriever_parameters.current_retrieve_uuid = uuid;

                let msg_rough_list = "Now retrieving Rough list ..."
                let elm_msg_rough_list = await it.messenger.info(msg_rough_list)

                let next_url = `${it.url_channel}/show/`;
                for (let i=0; i<10000; i++){
                    if (_retriever_parameters.stop_loading == true){
                        it.messenger.warn("Loading has been stopped manually", 3000);
                        break;
                    }

                    if (retriever_parameters.current_retrieve_uuid !== uuid){
                        break;
                    }

                    if(next_url != null){
                        next_url = await it.getContinationPageData(next_url, i);
                        await it.messenger.update_msg(elm_msg_rough_list, `${msg_rough_list} Recorded Page: ${i+1}`)
                        await sleep(it.interval)
                        // if (i==3) break
                    }else{
                        break;
                    }
                }
                
                next_url = `${it.url_channel}/showclips/`;
                for (let i=0; i<10000; i++){
                    if (_retriever_parameters.stop_loading == true){
                        it.messenger.warn("Loading has been stopped manually", 3000);
                        break;
                    }

                    if (retriever_parameters.current_retrieve_uuid !== uuid){
                        break;
                    }
                    
                    if(next_url != null){
                        next_url = await it.getContinationPageData(next_url, i);
                        await it.messenger.update_msg(elm_msg_rough_list, `${msg_rough_list} Clip Page: ${i+1}`)
                        await sleep(it.interval)
                        // if (i==1) break
                    }else{
                        break;
                    }
                }
                it.refresher.update_attr(it.channel_detail)

                it.messenger.close(elm_msg_rough_list);
                it.messenger.success("Rough list is completed", 3000)
    
                const msg_detail_list = "Now retrieving Detailed list ..."
                let elm_msg_detail_list = await it.messenger.info(msg_detail_list)

                if (_retriever_parameters.retrieve_detail == true){
                    for (let i=0; i<it.refresher.video_list_raw.length; i++){
                        if (_retriever_parameters.stop_loading == true){
                            it.messenger.warn("Loading has been stopped manually", 3000);
                            break;
                        }

                        if (retriever_parameters.current_retrieve_uuid !== uuid){
                            break;
                        }

                        let a = await it.getVideoPageData(it.refresher.video_list_raw[i][it.refresher.key], clone(it.refresher.video_list_raw[i]))
                        await it.messenger.update_msg(elm_msg_detail_list, `${msg_detail_list} ${i+1} / ${it.refresher.video_list_raw.length}`)
                        if (a != null){
                            let b = await it.optimize_item_detail(a)
                            await it.refresher.update(b)
                            await sleep(it.interval)
                        }else{
                            break;
                        }
                    }
                }

                it.messenger.close(elm_msg_detail_list);
                it.messenger.success("Detailed list is completed", 3000)
            },

            getContinationPageData : async (_url, _page) =>{
                const it = twitcastingRetriever;

                try{
                    // console.log(_url)
                    const _response = await fetch(_url, {
                        method: 'GET', // *GET, POST, PUT, DELETE, etc.
                    });
    
                    const _restext = await _response.text();
                    // console.log(_restext);
                    let dom = await (new DOMParser()).parseFromString(_restext,"text/html");
                    
                    if (_page == 0){
                        it.channel_detail["channel_subscribers"] = $("//*[@class='tw-user-nav-supporter']/*[@class='tw-user-nav-stat-value']", dom).textContent;
                        it.channel_detail["channel_id"] = $("//*[@class='tw-user-nav-profile']//*[@class='tw-user-nav-screenId']", dom).textContent;
                        it.channel_detail["channel_title"] = trim($("//*[@class='tw-user-nav-profile']/*[@class='tw-user-nav-name']", dom).textContent);
                        it.channel_detail["channel_url"] = it.url_channel;
                        it.channel_detail["channel_image"] = $("//*[@class='tw-user-nav-icon']/img", dom).getAttribute("src")
                        it.refresher.update_attr(it.channel_detail)
                    }

                    for (let item of $$("//*[contains(@class, 'recorded-movie-box')][1]/a", dom)){
                        if (item == null) break;
                        let video_detail = {};
                        video_detail["channel_id"] = it.channel_detail["channel_id"];
                        video_detail["channel_title"] = it.channel_detail["channel_title"];
                        video_detail["channel_url"] = it.channel_detail["channel_url"];
                        if (item.getAttribute("href").includes("clipview")){
                            video_detail["video_id"] = it.url_base + item.getAttribute("href").match(/clip_id=([0-9]+?)/)[1];
                        }else{
                            video_detail["video_id"] = it.url_base + item.getAttribute("href").match(/\/([0-9]+?)$/)[1];
                        }
                        video_detail["video_url"] = it.url_base + item.getAttribute("href");
                        video_detail["thumbnail_url"] = $(".//img[@class='tw-movie-thumbnail-image']", item).getAttribute("src");
                        video_detail["title"] = trim($(".//*[contains(@class, 'tw-movie-thumbnail-title')]", item).textContent);
                        video_detail["badge"] = $(".//*[@class='tw-movie-thumbnail-badge']", item) ? $(".//*[@class='tw-movie-thumbnail-badge']", item).getAttribute("data-status") : "";
                        video_detail["duration"] = $(".//*[@class='tw-movie-thumbnail-duration']", item) ? convertColonTimeToSec(trim($(".//*[@class='tw-movie-thumbnail-duration']", item).textContent)) : "";
                        video_detail["publishDate"] = $(".//time", item) ? customDateConverter(trim($(".//time", item).textContent)) : "";
                        if (video_detail["badge"] == "live"){
                            video_detail["category"] = "Live"
                        }else if(video_detail["badge"] == "recorded"){
                            video_detail["category"] = "Recorded"
                        }
                        video_detail["viewCount"] = $(".//*[@class='tw-movie-thumbnail-view']", item)? $(".//*[@class='tw-movie-thumbnail-view']", item).textContent : "";
                        video_detail["comments"] = $(".//*[@class='tw-movie-thumbnail-comment']", item) ? $(".//*[@class='tw-movie-thumbnail-comment']", item).textContent : "";

                        const date_mills_of_this_video = (new Date(video_detail["publishDate"])).getTime() + ((new Date(video_detail["publishDate"])).getTimezoneOffset() * 60 * 1000);
                        if ((new Date()).getTime() - retriever_parameters.crawling_term > date_mills_of_this_video){
                            return null;
                        }

                        await it.refresher.append(await it.optimize_item_simple(video_detail))
                    }

                    let next_page = null;
                    let next_page_elm = $(`.//*[contains(@class, 'tw-pager') and @data-for='pc']/a[text()='${_page + 2}']`, dom)
                    if (isNullOrEmpty(next_page_elm) == false){
                        next_page = next_page_elm.getAttribute("href");
                    }

                    return next_page;
        
                }catch(e){
                    console.error(e);
                    it.messenger.danger(e.toString(), 10000)
                }
            },
            
            getVideoPageData : async (_video_url, video_detail = {}) =>{
                const it = twitcastingRetriever;

                // Get first page of /video
                try{
                    const _response = await fetch(_video_url);
                    const _restext = await _response.text();
                    let dom = await (new DOMParser()).parseFromString(_restext,"text/html");

                    // console.log(_video_url)
                    video_detail["duration"] = $(".//*[@class='tw-player-duration-time']", dom) ? convertColonTimeToSec(trim($(".//*[@class='tw-player-duration-time']", dom).textContent)): "";
                    video_detail["shortDescription"] = $("/*[@class='comment']", dom) ? trim($("/*[@class='comment']", dom).textContent) : "";
                    video_detail["tags"] = [];
                    for (let k of $$(".//*[contains(@class, 'tag-info')]", dom)){
                        if (k == null) break;
                        video_detail["tags"].push(k.textContent)
                    }
                    // console.log(video_detail)

                }catch(e){
                    console.error(e);
                    it.messenger.danger(e.toString(), 10000)
                }
    
                return video_detail;
            },

            optimize_item_simple : async (item)=>{
                let new_item = {
                    "channel_id": item.channel_id,
                    "channel_title": item.channel_title,
                    "channel_url": item.channel_url,

                    "video_id": item.video_id,
                    "video_url" : item.video_url,
                    "thumbnail_url" : item.thumbnail_url,
                    "title": item.title,
                    "duration": Number(item.duration),
                    "publishDate": new Date((new Date(item.publishDate)).getTime() + ((new Date(item.publishDate)).getTimezoneOffset() * 60 * 1000)),
                    "category": isNullOrEmpty(item.category) ? "" : item.category,
                    "type": isNullOrEmpty(item.type) ? "" : item.type,
                    "viewCount": Number(item.viewCount),
                    "comments": Number(item.comments),
                    "tags" : item.tags
                }
                return new_item;
            },

            optimize_item_detail : async (item)=>{
                try{
                    let new_item = {
                        "channel_id": item.channel_id,
                        "channel_title": item.channel_title,
                        "channel_url": item.channel_url,

                        "video_id": item.video_id,
                        "video_url" : item.video_url,
                        "thumbnail_url" : item.thumbnail_url,
                        "title": item.title,
                        "duration": Number(item.duration),
                        "publishDate": new Date((new Date(item.publishDate)).getTime() + ((new Date(item.publishDate)).getTimezoneOffset() * 60 * 1000)),
                        "category": isNullOrEmpty(item.category) ? "" : item.category,
                        "type": isNullOrEmpty(item.type) ? "" : item.type,
                        "viewCount": Number(item.viewCount),
                        "comments": Number(item.comments),
                        "shortDescription": item.shortDescription,
                        }
                    return new_item;
                }catch(e){
                    console.error(e)
                    return null;
                }
            }
        }

        let twitterRetriever = {

            interval : 4000,
            refresher : null,
            messenger : null,
            username : "",
            url_channel : "",
            url_base : "",
            authorization_bearer : "",

            channel_detail : {},
            
            initialize : async (url, _refresher_func, _messenger_func) =>{
                const it = twitterRetriever;

                it.refresher = _refresher_func;
                it.messenger = _messenger_func;

                let url_m = url.match(/^(https:\/\/twitter\.com)\/([-A-Za-z0-9_]+)(\/|\?|$)/);
                if(url_m != null && url_m.length > 2){
                    it.username = url_m[2];
                    it.url_channel = url_m[1] + "/"+ url_m[2];
                    it.url_base = url_m[1];

                    return true;
                }else{
                    return false;
                }

            },
            
            retrieve : async (_retriever_parameters) =>{
                const it = twitterRetriever;
                const uuid = crypto.randomUUID();
                retriever_parameters.current_retrieve_uuid = uuid;

                let msg_rough_list = "Now retrieving Rough list ..."
                let elm_msg_rough_list = await it.messenger.info(msg_rough_list)

                await it.getInitialPageData();
                let cursor = await it.getContinationPageData(null);
                await sleep(it.interval)
                for (let i=0; i<10000; i++){
                    if (_retriever_parameters.stop_loading == true){
                        it.messenger.warn("Loading has been stopped manually", 3000);
                        break;
                    }

                    if (retriever_parameters.current_retrieve_uuid !== uuid){
                        break;
                    }
                    
                    if(cursor != null){
                        cursor = await it.getContinationPageData(cursor);
                        await it.messenger.update_msg(elm_msg_rough_list, `${msg_rough_list} Page: ${i+1}`)
                        await sleep(it.interval)
                    }else{
                        break;
                    }
                }
                it.refresher.update_attr(it.channel_detail)

                it.messenger.close(elm_msg_rough_list);
                it.messenger.success("Rough list is completed", 3000)
            },

            getInitialPageData : async () =>{
                const it = twitterRetriever;

                try{
                    // Get authorization token
                    const _response_auth = await fetch("https://abs.twimg.com/responsive-web/client-web/main.4944c999.js", {
                        method: 'GET',
                        mode: 'cors'
                    });

                    const _restext = await _response_auth.text();
                    // console.log(_restext);

                    it.authorization_bearer = _restext.match(/s="(AAAAAAAAAAAAAAA.+?)"/)[1]
                    // console.log(it.authorization_bearer)

                    let variables = {
                        "screen_name" : it.username,
                        "withSafetyModeUserFields": true,
                        "withSuperFollowsUserFields": true,
                    }

                    let features = {
                        "verified_phone_label_enabled" : false,
                        "responsive_web_graphql_timeline_navigation_enabled": false,
                    }

                    const url = `https://twitter.com/i/api/graphql/HThKoC4xtXHcuMIok4O0HA/UserByScreenName?variables=${encodeURIComponent(JSON.stringify(variables))}&features=${encodeURIComponent(JSON.stringify(features))}`;
                    const _response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'authorization': "Bearer " + it.authorization_bearer,
                            'content-type': 'application/json',
                            'x-csrf-token': document.cookie.match(/ct0=(.+?);/)[1],
                            'x-twitter-active-user': "yes",
                            'x-twitter-auth-type': 'OAuth2Session',
                            'x-twitter-client-language': "en",
                        },
                        credentials: 'include',
                        
                    });

                    const _resjson = await _response.json();
                    // console.log(_resjson);

                    it.channel_detail["channel_id"] = _resjson.data.user.result.rest_id;
                    it.channel_detail["channel_screenname"] = _resjson.data.user.result.legacy.screen_name;
                    it.channel_detail["channel_title"] = _resjson.data.user.result.legacy.name;
                    it.channel_detail["channel_url"] = it.url_channel;
                    it.channel_detail["channel_description"] = _resjson.data.user.result.legacy.description;
                    it.channel_detail["channel_subscribers"] = _resjson.data.user.result.legacy.followers_count;
                    it.channel_detail["channel_image"] = _resjson.data.user.result.legacy.profile_image_url_https;

                    // console.log(it.channel_detail)
                    it.refresher.update_attr(it.channel_detail)
                
                }catch(e){
                    console.error(e);
                    it.messenger.danger(e.toString(), 10000)
                }
            },
            
            getContinationPageData : async (cursor) =>{
                const it = twitterRetriever;

                try{
                    const limit = 50;
                    let variables = {
                        "userId" : it.channel_detail["channel_id"],
                        "count": limit,
                        "includePromotedContent":false,
                        "withSuperFollowsUserFields":true,
                        "withDownvotePerspective":true,
                        "withReactionsMetadata":false,
                        "withReactionsPerspective":false,
                        "withSuperFollowsTweetFields":true,
                        "withClientEventToken":false,
                        "withBirdwatchNotes":false,
                        "withVoice":true,
                        "withV2Timeline":true,
                    }
                    if (cursor != null){
                        variables["cursor"] = cursor
                    }

                    let features = {
                        "responsive_web_twitter_blue_verified_badge_is_enabled" : true,
                        "verified_phone_label_enabled":false,
                        "responsive_web_graphql_timeline_navigation_enabled":false,
                        "view_counts_public_visibility_enabled": true,
                        "view_counts_everywhere_api_enabled": true,
                        "unified_cards_ad_metadata_container_dynamic_card_content_query_enabled":true,
                        "tweetypie_unmention_optimization_enabled":true,
                        "responsive_web_uc_gql_enabled":true,
                        "vibe_api_enabled":true,
                        "responsive_web_edit_tweet_api_enabled":true,
                        "graphql_is_translatable_rweb_tweet_is_translatable_enabled":true,
                        "standardized_nudges_misinfo":true,
                        "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled":false,
                        "interactive_text_enabled":true,
                        "responsive_web_text_conversations_enabled":false,
                        "responsive_web_enhance_cards_enabled":true,
                    }

                    const url = `https://twitter.com/i/api/graphql/QqRNmKWm3uTs75PCYTGkFw/UserMedia?variables=${encodeURIComponent(JSON.stringify(variables))}&features=${encodeURIComponent(JSON.stringify(features))}`;
                    const _response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'authorization': "Bearer " + it.authorization_bearer,
                            'content-type': 'application/json',
                            'x-csrf-token': document.cookie.match(/ct0=(.+?);/)[1],
                            'x-twitter-active-user': "yes",
                            'x-twitter-auth-type': 'OAuth2Session',
                            'x-twitter-client-language': "en",
                        },
                        credentials: 'include',
                        
                    });
    
                    const _resjson = await _response.json();
                    // console.log(_resjson);

                    let _cursor = null;

                    for (let entry of _resjson.data.user.result.timeline_v2.timeline.instructions[0].entries){
                        if (entry.entryId.match(/tweet/)){
                            let tweet_id = entry.content.itemContent.tweet_results.result.rest_id;
                            const legacy = entry.content.itemContent.tweet_results.result.legacy;

                            if ("retweeted_status_result" in entry || ("extended_entities" in legacy) == false){
                                // If this tweet is retweet
                                continue;
                            }

                            let media_id = 1;
                            for (let media of legacy.extended_entities.media){
                                let video_detail = {};

                                if ("additional_media_info" in media && "source_user" in media.additional_media_info){
                                    // media from externalwebsite
                                    continue;
                                }
                                video_detail["type"] = media.type; //photo, video, animated_gif
                                if (video_detail["type"] == "video"){
                                    video_detail["video_url"] = `${it.url_base}/${it.username}/status/${tweet_id}/video/${media_id}`
                                }else{
                                    video_detail["video_url"] = `${it.url_base}/${it.username}/status/${tweet_id}/photo/${media_id}`
                                }
                                
                                video_detail["parent_id"] = tweet_id;
                                video_detail["video_id"] = media.media_key;
                                video_detail["title"] = legacy.full_text.replaceAll(/https:\/\/t\.co\/[-0-9A-Za-z_]+$/ig, "");
                                
                                const media_url_https = media.media_url_https;
                                const url_without_ext = media_url_https.match(/^(.+)\.([^.]+)$/)[1]
                                const extension = media_url_https.match(/^(.+)\.([^.]+)$/)[2]
                                video_detail["thumbnail_url"] = `${url_without_ext}?format=${extension}&name=360x360`
                                video_detail["viewCount"] = Number((new JsonPathFinder()).find(entry, "//views/count", true, 0));

                                video_detail["favorite_count"] = legacy.favorite_count;
                                video_detail["quote_count"] = legacy.quote_count;
                                video_detail["reply_count"] = legacy.reply_count;
                                video_detail["retweet_count"] = legacy.retweet_count;
                                
                                video_detail["publishDate"] = new Date(legacy.created_at);
                                if ("video_info" in media && "duration_millis" in media.video_info){
                                    video_detail["duration"] = media.video_info.duration_millis;
                                }else{
                                    video_detail["duration"] = -1;
                                }

                                if ("ext_alt_text" in media){
                                    video_detail["shortDescription"] = media.ext_alt_text;
                                }else{
                                    video_detail["shortDescription"] = "";
                                }
                                
                                video_detail["language"] = legacy.lang;
                                video_detail["source"] = legacy.source;  // Source app
                                

                                const date_mills_of_this_video = Number(video_detail["publishDate"]);
                                if ((new Date()).getTime() - retriever_parameters.crawling_term > date_mills_of_this_video){
                                    return null;
                                }

                                await it.refresher.update(await it.optimize_item_simple(video_detail))
                                media_id = media_id + 1;
                            }
                        }else if (entry.entryId.match(/cursor-bottom/)){
                            _cursor = entry.content.value;
                            // console.log(_cursor);
                        }
                    }

                    // console.log(_resjson[0].data.user.videos.edges.length)
                    // console.log(_cursor)
                    if (_resjson.data.user.result.timeline_v2.timeline.instructions[0].entries.length + 2 < limit){
                        return null;
                    }else{
                        return _cursor;
                    }
        
                }catch(e){
                    console.error(e);
                    it.messenger.danger(e.toString(), 10000)
                }
            },

            optimize_item_simple : async (item)=>{
                let new_item = {
                    "channel_id": item.channel_id,
                    "channel_title": item.channel_title,
                    "channel_url": item.channel_url,

                    "parent_id": item.parent_id,
                    "video_id": item.video_id,
                    "video_url" : item.video_url.replaceAll(/&.+$/gi, ""),
                    "thumbnail_url" : item.thumbnail_url,
                    "title": item.title,
                    "duration": Number(item.duration),
                    "publishDate": item.publishDate,
                    "category": "",
                    "type": item.type,
                    "tags": [],
                    "viewCount": item.viewCount,
                    "reply_count": item.reply_count,
                    "favorite_count": item.favorite_count,
                    "retweet_count": item.retweet_count,
                    "quote_count": item.quote_count,
                    "shortDescription" : item.shortDescription,
                }
                return new_item;
            },
        }
        
        let instagramRetriever = {
            interval : 1000,
            refresher : null,
            messenger : null,
            username : "",
            url_channel : "",
            url_base : "",
            iframe_elm_post_id : `${prefix}_iframe_post`.toString(),
            iframe_elm_post : null,
            is_iframe_post_loop_completed : null,
            iframe_elm_reel_id : `${prefix}_iframe_reel`.toString(),
            iframe_elm_reel : null,
            is_iframe_reel_loop_completed : null,

            channel_detail : {},
            
            initialize : async (url, _refresher_func, _messenger_func) =>{
                const it = instagramRetriever;

                it.refresher = _refresher_func;
                it.messenger = _messenger_func;
                let url_m = url.match(/^(https:\/\/www\.instagram\.com)\/([-A-Za-z0-9_.]+)(\/|\?|$)/);
                if(url_m != null && url_m.length > 2){
                    it.username = url_m[2];
                    it.url_channel = url_m[1] + "/"+ url_m[2];
                    it.url_base = url_m[1];

                    return true;
                }else{
                    return false;
                }

            },
            
            retrieve : async (_retriever_parameters) =>{
                const it = instagramRetriever;
                const uuid = crypto.randomUUID();
                retriever_parameters.current_retrieve_uuid = uuid;
                
                await it.getInitialPageData();

                let msg_rough_list = "Now retrieving Posts list ..."
                let elm_msg_rough_list = await it.messenger.info(msg_rough_list)

                let cursor = await it.getContinationPageData(null);
                await sleep(it.interval)
                for (let i=0; i<10000; i++){
                    if (_retriever_parameters.stop_loading == true){
                        it.messenger.warn("Loading has been stopped manually", 3000);
                        break;
                    }

                    if (retriever_parameters.current_retrieve_uuid !== uuid){
                        break;
                    }

                    if(cursor != null){
                        cursor = await it.getContinationPageData(cursor);
                        await it.messenger.update_msg(elm_msg_rough_list, `${msg_rough_list} Page: ${i+1}`)
                        await sleep(it.interval)
                        // break
                    }else{
                        break;
                    }
                }

                it.messenger.close(elm_msg_rough_list);
                it.messenger.success("Posts list is completed", 3000)
                
                let msg_reels_list = "Now retrieving Reels list ..."
                let elm_msg_reels_list = await it.messenger.info(msg_reels_list)

                let cursor2 = await it.getContinationReelsData(null);
                await sleep(it.interval)
                for (let i=0; i<10000; i++){
                    if (_retriever_parameters.stop_loading == true){
                        it.messenger.warn("Loading has been stopped manually", 3000);
                        break;
                    }

                    if (retriever_parameters.current_retrieve_uuid !== uuid){
                        break;
                    }

                    if(cursor2 != null){
                        cursor2 = await it.getContinationReelsData(cursor2);
                        await it.messenger.update_msg(elm_msg_reels_list, `${msg_reels_list} Page: ${i+1}`)
                        await sleep(it.interval)
                        // break
                    }else{
                        break;
                    }
                }

                it.messenger.close(elm_msg_reels_list);
                it.messenger.success("Reels list is completed", 3000)
            },

            getInitialPageData : async () =>{
                const it = instagramRetriever;

                try{
                    const _response = await fetch(`https://i.instagram.com/api/v1/users/web_profile_info/?username=${it.username}`, {
                        method: 'GET', // *GET, POST, PUT, DELETE, etc.
                        headers: {
                            'x-asbd-id': '198387',  // magic number in hardcoding in https://static.cdninstagram.com/rsrc.php/v3i5dD4/yM/l/en_US/Ube3ukfHWY_.js
                            'x-csrftoken': document.cookie.match(/csrftoken=(.+?);/)[1],
                            'x-ig-app-id': document.body.innerHTML.match(/"X-IG-App-ID":"([0-9]+)"/)[1],
                            'x-ig-d': document.body.innerHTML.match(/"X-IG-D":"([0-9A-Za-z]+)"/)[1],
                            'x-ig-www-claim': sessionStorage.getItem('www-claim-v2'),
                            'x-instagram-ajax': document.head.innerHTML.match(/data-btmanifest="([0-9]+)_main"/)[1],
                            'x-requested-with': 'XMLHttpRequest',
                        },
                        credentials: 'include',
                    });

                    const _resjson = await _response.json();
                    // console.log(_resjson);
                    
                    it.channel_detail["channel_id"] = _resjson.data.user.id;
                    it.channel_detail["channel_url"] = it.url_channel;
                    it.channel_detail["channel_title"] = _resjson.data.user.full_name
                    it.channel_detail["channel_subscribers"] = _resjson.data.user.edge_followed_by.count;
                    it.channel_detail["channel_description"] = _resjson.data.user.biography
                    it.channel_detail["channel_image"] = _resjson.data.user.profile_pic_url;
                    
                    it.refresher.update_attr(it.channel_detail);
                    // console.log(it.channel_detail);
                }catch(e){
                    console.error(e);
                    it.messenger.danger(e.toString(), 10000)
                }
            },
            
            getContinationPageData : async (cursor) =>{
                const it = instagramRetriever;
                try{
                    const max_id = (cursor != null)? `&max_id=${cursor}` : "";
                    const _response = await fetch(`https://i.instagram.com/api/v1/feed/user/${it.channel_detail["channel_id"]}/?count=12${max_id}`, {
                        method: 'GET', // *GET, POST, PUT, DELETE, etc.
                        headers: {
                            'x-asbd-id': '198387',  // magic number in hardcoding in https://static.cdninstagram.com/rsrc.php/v3i5dD4/yM/l/en_US/Ube3ukfHWY_.js
                            'x-csrftoken': document.cookie.match(/csrftoken=(.+?);/)[1],
                            'x-ig-app-id': document.body.innerHTML.match(/"X-IG-App-ID":"([0-9]+)"/)[1],
                            'x-ig-d': document.body.innerHTML.match(/"X-IG-D":"([0-9A-Za-z]+)"/)[1],
                            'x-ig-www-claim': sessionStorage.getItem('www-claim-v2'),
                            'x-instagram-ajax': document.head.innerHTML.match(/data-btmanifest="([0-9]+)_main"/)[1],
                            'x-requested-with': 'XMLHttpRequest',
                        },
                        credentials: 'include',
                    });

                    const _resjson = await _response.json();
                    // console.log(_resjson);

                    for (const item of _resjson.items){
                        let video_detail = {};
                        video_detail["video_id"] = item.id;
                        video_detail["title"] = (item.caption) ? item.caption.text : item.accessibility_caption;
                        video_detail["video_url"] = `${it.url_base}/p/${item.code}/`
                        video_detail["thumbnail_url"] = ((_item)=>{
                            if ("carousel_media_count" in _item){
                                return _item.carousel_media[0].image_versions2.candidates[_item.carousel_media[0].image_versions2.candidates.length-1].url;
                            }else{
                                return _item.image_versions2.candidates[_item.image_versions2.candidates.length-1].url;
                            }
                        })(item)
                        video_detail["viewCount"] = (item.view_count) ? item.view_count : 0;
                        video_detail["comments"] = item.comment_count;
                        video_detail["likes"] = item.like_count;
                        video_detail["type"] = (item.media_type == 1) ? "Photo" : "Video";  // 1:Photo, 2:Video
                        video_detail["publishDate"] = new Date(item.taken_at * 1000);
                        video_detail["duration"] = (item.video_duration)? Math.floor(item.video_duration) : 0;

                        const date_mills_of_this_video = Number(video_detail["publishDate"].getTime());
                        if ((new Date()).getTime() - retriever_parameters.crawling_term > date_mills_of_this_video){
                            return null;
                        }
                        
                        // console.log(video_detail)
                        await it.refresher.update(await it.optimize_item_simple(video_detail))
                    }

                    if ("next_max_id" in _resjson){
                        return _resjson.next_max_id;
                    }else{
                        return null;
                    }
        
                }catch(e){
                    console.error(e);
                    it.messenger.danger(e.toString(), 10000)
                }
            },
            
            getContinationReelsData : async (cursor) =>{
                const it = instagramRetriever;
                try{
                    const max_id = (cursor != null)? `&max_id=${cursor}` : "";
                    const formData = new FormData();
                    formData.append('target_user_id', it.channel_detail["channel_id"]);
                    formData.append('page_size', 12);
                    formData.append('include_feed_video', true);

                    const _response = await fetch(`https://i.instagram.com/api/v1/clips/user/`, {
                        method: 'POST', // *GET, POST, PUT, DELETE, etc.
                        headers: {
                            'x-asbd-id': '198387',  // magic number in hardcoding in https://static.cdninstagram.com/rsrc.php/v3i5dD4/yM/l/en_US/Ube3ukfHWY_.js
                            'x-csrftoken': document.cookie.match(/csrftoken=(.+?);/)[1],
                            'x-ig-app-id': document.body.innerHTML.match(/"X-IG-App-ID":"([0-9]+)"/)[1],
                            'x-ig-d': document.body.innerHTML.match(/"X-IG-D":"([0-9A-Za-z]+)"/)[1],
                            'x-ig-www-claim': sessionStorage.getItem('www-claim-v2'),
                            'x-instagram-ajax': document.head.innerHTML.match(/data-btmanifest="([0-9]+)_main"/)[1],
                            'x-requested-with': 'XMLHttpRequest',
                        },
                        body: formData,
                    });

                    const _resjson = await _response.json();

                    for (const item of _resjson.items){
                        let video_detail = {};
                        video_detail["video_id"] = item.media.id;
                        video_detail["title"] = (item.media.caption) ? item.media.caption.text : "";
                        video_detail["video_url"] = `${it.url_base}/reel/${item.media.code}/`
                        video_detail["thumbnail_url"] = ((_item)=>{
                            if ("carousel_media_count" in _item){
                                return _item.media.carousel_media[0].image_versions2.candidates[_item.media.carousel_media[0].image_versions2.candidates.length-1].url;
                            }else{
                                return _item.media.image_versions2.candidates[_item.media.image_versions2.candidates.length-1].url;
                            }
                        })(item)
                        video_detail["viewCount"] = (() => {
                            if(item.media.play_count) {
                                return item.media.play_count;
                            }else if(item.media.view_count){
                                return item.media.view_count;
                            }else{
                                return "";
                            }
                        })()
                        video_detail["comments"] = item.media.comment_count;
                        video_detail["likes"] = item.media.like_count;
                        video_detail["type"] = (item.media.media_type == 1) ? "Photo" : "Video";  // 1:Photo, 2:Video
                        video_detail["publishDate"] = new Date(item.media.taken_at * 1000);
                        video_detail["duration"] = (item.media.video_duration)? Math.floor(item.media.video_duration) : 0;

                        const date_mills_of_this_video = Number(video_detail["publishDate"].getTime());
                        if ((new Date()).getTime() - retriever_parameters.crawling_term > date_mills_of_this_video){
                            return null;
                        }

                        // console.log(video_detail)
                        await it.refresher.update(await it.optimize_item_simple(video_detail))
                    }

                    if ("next_max_id" in _resjson){
                        return _resjson.next_max_id;
                    }else{
                        return null;
                    }
        
                }catch(e){
                    console.error(e);
                    it.messenger.danger(e.toString(), 10000)
                }
            },

            optimize_item_simple : async (item)=>{
                let new_item = {
                    "channel_id": item.channel_id,
                    "channel_title": item.channel_title,
                    "channel_url": item.channel_url,

                    "video_id": item.video_id,
                    "video_url" : item.video_url.replaceAll(/&.+$/gi, ""),
                    "thumbnail_url" : item.thumbnail_url,
                    "title": (item.title)? item.title : "",
                    "duration": Number(item.duration),
                    "publishDate": new Date(item.publishDate),
                    "category": "",
                    "type": item.type,
                    "tags": [],
                    "viewCount": item.viewCount,
                    "comments":item.comments,
                    "likes":item.likes,
                    "shortDescription" : "",
                }
                return new_item;
            },
        }
        
        let tiktokRetriever = {
            interval : 1000,
            refresher : null,
            messenger : null,
            username : "",
            url_channel : "",
            url_base : "",
            iframe_elm_id : `${prefix}_iframe`.toString(),
            iframe_elm : null,
            is_iframe_loop_completed : null,
            is_rough_list_completed : null,
            is_detail_list_completed : null,

            channel_detail : {},
            
            initialize : async (url, _refresher_func, _messenger_func) =>{
                const it = tiktokRetriever;

                it.refresher = _refresher_func;
                it.messenger = _messenger_func;

                let url_m = url.match(/^(https:\/\/www\.tiktok\.com)\/@([-A-Za-z0-9_]+)(\/|\?|$)/);
                if(url_m != null && url_m.length > 2){
                    it.username = url_m[2];
                    it.url_channel = url_m[1] + "/@"+ url_m[2];
                    it.url_base = url_m[1];

                    return true;
                }else{
                    return false;
                }

            },
            
            retrieve : async (_retriever_parameters) =>{
                const it = tiktokRetriever;
                const uuid = crypto.randomUUID();
                retriever_parameters.current_retrieve_uuid = uuid;

                const stop_all = {status: false};
                it.is_iframe_loop_completed = {"status" : false};
                it.is_rough_list_completed = {"status" : false, "item_ids": []};
                it.is_detail_list_completed = {"status" : false, "item_ids": []};

                let msg_rough_list = "Now retrieving Rough list ..."
                let elm_msg_rough_list = await it.messenger.info(msg_rough_list)

                it.iframe_elm = await it.getInitialPageData();
                
                scrollToPageBottom(it.iframe_elm.contentWindow, it.is_iframe_loop_completed, stop_all);    // Dp this as ASYNC intenyionally

                (async () => {
                    for (let i=0; i<1000; i++) {
                        if (_retriever_parameters.stop_loading == true){
                            it.messenger.warn("Loading has been stopped manually", 3000);
                            break;
                        }
                        if (retriever_parameters.current_retrieve_uuid != uuid){
                            break;
                        }
                        if(stop_all.status == true){
                            break;
                        }
                        
                        // console.log(it.is_iframe_loop_completed)
                        it.is_rough_list_completed = await it.getContinationPageData(it.iframe_elm, it.is_rough_list_completed);
                        await it.messenger.update_msg(elm_msg_rough_list, `${msg_rough_list} Total item: ${it.refresher.video_list_raw.length}`)
                        // if (i==8) break;
                        await sleep(it.interval);
                        
                        if(it.is_iframe_loop_completed["status"] == true){
                            break
                        }
                    }
                    it.is_rough_list_completed.status = true;
                    
                    if (document.getElementById(it.iframe_elm_id) != null){
                        document.getElementById(it.iframe_elm_id).remove();
                    }
                })()    // Execute this block as ASYNC

                it.messenger.close(elm_msg_rough_list);
                it.messenger.success("Rough list is completed", 3000)
    
                const msg_detail_list = "Now retrieving Detailed list ..."
                let elm_msg_detail_list = await it.messenger.info(msg_detail_list)

                for (let j=0; j<100000; j++){
                    for (let i=0; i<it.refresher.video_list_raw.length; i++){
                        if (_retriever_parameters.stop_loading == true){
                            it.messenger.warn("Loading has been stopped manually", 3000);
                            break;
                        }
                        if (retriever_parameters.current_retrieve_uuid !== uuid){
                            break;
                        }
                        if(stop_all.status == true){
                            break;
                        }

                        it.is_detail_list_completed = await it.getVideoPageData(
                            it.refresher.video_list_raw[i][it.refresher.key],
                            clone(it.refresher.video_list_raw[i]),
                            it.is_detail_list_completed,
                            stop_all
                        );
                        await it.messenger.update_msg(elm_msg_detail_list, `${msg_detail_list} ${i+1} / ${it.refresher.video_list_raw.length}`)
                        await sleep(it.interval);
                    }
                    
                    if(it.is_rough_list_completed["status"] == true){
                        break
                    }

                    await sleep(it.interval);
                }

                // Delete items if the video_list_raw is not in the is_detail_list_completed.item_ids
                for (let i=(it.refresher.video_list_raw.length-1); i>=0; i--){
                    if (it.is_detail_list_completed.item_ids.includes(it.refresher.video_list_raw[i].video_id) == false){
                        it.refresher.video_list_raw.splice(i, 1);
                    }
                }
                it.refresher.refresh()

                it.messenger.close(elm_msg_detail_list);
                it.messenger.success("Detailed list is completed", 3000)
            },

            getInitialPageData : async () =>{
                const it = tiktokRetriever;

                try{
                    let iframe_elm = await iframeLoad(it.iframe_elm_id, it.url_channel, `visibility: hidden; position: absolute; z-index: 50001; width: 1200px; height: 1000px; top:0;left:0`)
                    // console.log("getInitialPageData")

                    for (let i=0; i<10; i++){
                        if (await $(".//*[@data-e2e='user-title']/text()", iframe_elm.contentWindow.document) != null){
                            break;
                        }else{
                            await sleep(it.interval);
                        }
                    }
                    it.channel_detail["channel_id"] = await $(".//*[@data-e2e='user-title']/text()", iframe_elm.contentWindow.document).textContent;
                    it.channel_detail["channel_url"] = it.url_channel;
                    it.channel_detail["channel_title"] = await $(".//*[@data-e2e='user-subtitle']/text()", iframe_elm.contentWindow.document).textContent;
                    it.channel_detail["channel_subscribers"] = await $(".//*[@data-e2e='followers-count']/text()", iframe_elm.contentWindow.document).textContent;
                    it.channel_detail["channel_description"] = await $(".//*[@data-e2e='user-bio']/text()", iframe_elm.contentWindow.document).textContent;
                    it.channel_detail["channel_image"] = attr(await $(".//*[@data-e2e='user-page']//*[@shape='circle']//img", iframe_elm.contentWindow.document), "src");
                    
                    it.refresher.update_attr(it.channel_detail);
                    // console.log(it.channel_detail);

                    return iframe_elm;
                }catch(e){
                    console.error(e);
                    it.messenger.danger(e.toString(), 10000)
                }
            },
            
            getContinationPageData : async (iframe_elm, param) =>{
                const it = tiktokRetriever;
                try{
                    for (const node of $$("//*[@data-e2e='user-post-item-list']/div", iframe_elm.contentWindow.document)){
                        let video_detail = {};
                        video_detail["video_id"] = attr($(".//*[@data-e2e='user-post-item']//a", node), "href").match(/([0-9]+)$/)[1];
                        video_detail["title"] = attr($(".//*[@data-e2e='user-post-item']//a//img", node), "alt");
                        video_detail["video_url"] = attr($(".//*[@data-e2e='user-post-item']//a", node), "href");
                        video_detail["thumbnail_url"] = attr($(".//*[@data-e2e='user-post-item']//a//img", node), "src");
                        video_detail["viewCount"] = $(".//*[@data-e2e='video-views']", node).textContent;
                        // video_detail["publishDate"] = item.node.publishedAt;
                        // video_detail["duration"] = item.node.lengthSeconds;

                        // console.log(video_detail)
                        if (param.item_ids.includes(video_detail["video_id"])){
                            continue
                        }else{
                            param.item_ids.push(video_detail["video_id"]);
                            await it.refresher.update(await it.optimize_item_simple(video_detail));
                        }
                    }
        
                }catch(e){
                    console.error(e);
                    it.messenger.danger(e.toString(), 10000)
                }

                return param;
            },

            getVideoPageData : async (_video_url, video_detail = {}, param = null, stop_all = null) =>{
                console.log(`getVideoPageData : ${_video_url} ${video_detail.title}`)
                const it = tiktokRetriever;

                // Get first page of /video
                try{
                    if (param.item_ids.includes(video_detail.video_id)){
                        return param;
                    }

                    const iframe_elm_id = it.iframe_elm_id + "_detail"
                    const iframe_elm = await iframeLoad(iframe_elm_id, _video_url, `visibility: hidden; position: absolute; z-index: 50001; width: 1200px; height: 1000px; top:0;left:0`)
                    
                    // console.log(it.iframe_elm.contentWindow.document)
                    
                    for (let i=0;i<100;i++){
                        let _temp_sec = convertColonTimeToSec($(".//*[contains(@class, 'SeekBarTimeContainer')]", iframe_elm.contentWindow.document).textContent.split("/")[1])
                        if (_temp_sec == 0){
                            await sleep(200)
                            continue;
                        }else{
                            video_detail["lengthSeconds"] = _temp_sec;
                            break;
                        }
                    }

                    video_detail["publishDate"] = $(".//*[@data-e2e='browser-nickname']/span[contains(./text(), '-')]", iframe_elm.contentWindow.document).textContent;
                    if(video_detail["publishDate"].match(/[a-z前]/)){
                        video_detail["publishDate"] = customDateConverter(video_detail["publishDate"]);
                    }else if(video_detail["publishDate"].match(/[-]/g).length >= 2){
                        video_detail["publishDate"] = new Date(video_detail["publishDate"])
                    }else if(video_detail["publishDate"].match(/[-]/g).length >= 1){
                        video_detail["publishDate"] = new Date(new Date().getFullYear() + "-" + video_detail["publishDate"])
                    }else{
                        video_detail["publishDate"] = new Date("1900-01-01")
                    }

                    video_detail["comments"] = customNumberConverter($(".//*[@data-e2e='comment-count']", iframe_elm.contentWindow.document).textContent)
                    video_detail["likes"] = customNumberConverter($(".//*[@data-e2e='like-count']", iframe_elm.contentWindow.document).textContent)
                    
                    if (document.getElementById(iframe_elm_id) != null){
                        document.getElementById(iframe_elm_id).remove();
                    }
                    
                    const date_mills_of_this_video = video_detail["publishDate"].getTime();
                    if ((new Date()).getTime() - retriever_parameters.crawling_term > date_mills_of_this_video){
                        console.log(video_detail["publishDate"])
                        param.status = true;
                        if(stop_all != null) stop_all.status = true;
                        return param;
                    }

                    if (param.item_ids.includes(video_detail.video_id) == false){
                        let b = await it.optimize_item_detail(video_detail)
                        await it.refresher.update(b);
                        param.item_ids.push(video_detail.video_id);
                    }

                }catch(e){
                    console.error(e);
                    it.messenger.danger(e.toString(), 10000)
                }
    
                return param;
            },

            optimize_item_simple : async (item)=>{
                let new_item = {
                    "channel_id": item.channel_id,
                    "channel_title": item.channel_title,
                    "channel_url": item.channel_url,

                    "video_id": item.video_id,
                    "video_url" : item.video_url.replaceAll(/&.+$/gi, ""),
                    "thumbnail_url" : item.thumbnail_url,
                    "title": item.title,
                    // "duration": Number(item.duration),
                    // "publishDate": new Date((new Date(item.publishDate)).getTime() + ((new Date(item.publishDate)).getTimezoneOffset() * 60 * 1000)),
                    "category": "",
                    "type": "",
                    "tags": [],
                    "viewCount": customNumberConverter(item.viewCount),
                    "comments":0,
                    "likes":0,
                    "shortDescription" : "",
                }
                return new_item;
            },

            optimize_item_detail : async (item)=>{
                try{
                    let new_item = {
                        "channel_id": item.channel_id,
                        "channel_title": item.channel_title,
                        "channel_url": item.channel_url,

                        "video_id": item.video_id,
                        "video_url" : item.video_url.replaceAll(/&.+$/gi, ""),
                        "thumbnail_url" : item.thumbnail_url,
                        "title": item.title,
                        "duration": Number(item.lengthSeconds),
                        "publishDate": item.publishDate,
                        "category": item.category,
                        "type": "",
                        "tags": isNullOrEmpty(item.tags)? [] : item.tags.map(x => x.toUpperCase()),
                        "viewCount": Number(item.viewCount),
                        "comments": Number(item.comments),
                        "likes": Number(item.likes),
                        "shortDescription" : item.shortDescription,
                    }
                    return new_item;
                }catch(e){
                    console.error(e)
                    return null;
                }
            }
        }
        
        
        let bilibiliRetriever = {
            interval : 200,
            refresher : null,
            messenger : null,
            api_key : "",
            username : "",
            url_channel : "",
            url_base : "",
            channel_detail: {},
            series_ids : [],
            
            i8n_labels : {
            },
            
            initialize : async (url, _refresher_func, _messenger_func) =>{
                const it = bilibiliRetriever;

                it.refresher = _refresher_func;
                it.messenger = _messenger_func;
                let url_m = url.match(/^(https:\/\/space\.bilibili\.com)\/([0-9]+)(\/|$)/);
                console.log(url_m)
                if(url_m != null && url_m.length > 2){
                    it.username = url_m[2];
                    it.url_channel = url_m[1] + "/" + url_m[2];
                    it.url_base = url_m[1];
                    return true;
                }else{
                    return false;
                }
            },
            
            retrieve : async (_retriever_parameters) =>{
                const it = bilibiliRetriever;
                const uuid = crypto.randomUUID();
                retriever_parameters.current_retrieve_uuid = uuid;

                {
                    let msg_rough_list = "Now retrieving Rough list ..."
                    let elm_msg_rough_list = await it.messenger.info(msg_rough_list + " Page: 1")

                    await it.getPageData();
                    await sleep(it.interval)

                    const target_series_ids = [];
                    target_series_ids.push(...it.series_ids);
                    target_series_ids.push(null);

                    for (const target_series_id of target_series_ids){
                        for (let i=1; i<=10000; i++){
                            if (_retriever_parameters.stop_loading == true){
                                it.messenger.warn("Loading has been stopped manually", 3000);
                                break;
                            }
                            
                            if (retriever_parameters.current_retrieve_uuid !== uuid){
                                break;
                            }
    
                            await it.messenger.update_msg(elm_msg_rough_list, `${msg_rough_list} Series-ID: ${(target_series_id)? target_series_id.name : ""}, Page: ${i}`)

                            let to_continue = await it.getVideoList(i, target_series_id);
                            if (to_continue == null || to_continue == undefined || to_continue == false){
                                break;
                            }
                            await sleep(it.interval)
                        }
                    }

                    it.messenger.close(elm_msg_rough_list);
                    it.messenger.success("Rough list is completed", 3000)
                }
            },
            
            getPageData : async () =>{
                const it = bilibiliRetriever;

                try{
                    let channel_detail = {};
                    channel_detail["channel_id"] = it.username;
                    channel_detail["channel_url"] = it.url_channel;

                    if(true){
                        const _response = await fetch(`https://api.bilibili.com/x/space/wbi/acc/info?mid=${it.username}`.toString(), {
                            method: 'GET', // *GET, POST, PUT, DELETE, etc.
                        });
    
                        const _resjson = await _response.json();
                        channel_detail["channel_title"] = (new JsonPathFinder()).find(_resjson, "/data/name")
                        channel_detail["channel_image"] = (new JsonPathFinder()).find(_resjson, "/data/face")
                        channel_detail["channel_description"] = (new JsonPathFinder()).find(_resjson, "/data/sign")
                        channel_detail["channel_keywords"] = (new JsonPathFinder()).find(_resjson, "/data/tags");
                    }
                    
                    if (true){
                        const _response = await fetch(`https://api.bilibili.com/x/relation/stat?vmid=${it.username}`.toString(), {
                            method: 'GET', // *GET, POST, PUT, DELETE, etc.
                        });
    
                        const _resjson = await _response.json();
                        console.log(_response)
                        channel_detail["channel_subscribers"] = (new JsonPathFinder()).find(_resjson, "/data/follower");
                    }
                    it.channel_detail = channel_detail
                    it.refresher.update_attr(channel_detail)
                    // console.log(channel_detail)

                    if (true){
                        const series_ids = []
                        const page_size = 20;
                        for (let i=1; i<10; i++){
                            const _response = await fetch(`https://api.bilibili.com/x/polymer/space/seasons_series_list?mid=${it.username}&page_num=${i}&page_size=${page_size}`.toString(), {
                                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                            });
        
                            const _resjson = await _response.json();
                            for (const _series of (new JsonPathFinder()).find(_resjson, "//series_list", true, [])){
                                series_ids.push({
                                    series_id: _series.meta.series_id,
                                    name: _series.meta.name
                                })
                            }
                            if ((new JsonPathFinder()).find(_resjson, "//page/total", true, 0) < page_size){
                                break;
                            }
                        }
                        it.series_ids = series_ids;
                    }
                }catch(e){
                    console.error(e);
                    it.messenger.danger(e.toString(), 10000)
                }
            },
            
            getVideoList : async (page, series) =>{
                const it = bilibiliRetriever;
                let temp_resjson;

                try{
                    let pageSize = 30;
                    let totalCount = 0;

                    // Get first page of /video
                    let url = "";
                    if (series != null) {
                        url = `https://api.bilibili.com/x/series/archives?mid=${it.username}&series_id=${series.series_id}&sort=desc&pn=${page}&ps=${pageSize}`

                        const _response = await fetch(url, {
                            method: 'GET'
                        });
                        const _resjson = await _response.json();
                        temp_resjson = _resjson;
                        
                        for(const item of (new JsonPathFinder()).find(_resjson, "//archives", true, [])){
                            let video_detail = {};
                            video_detail["channel_id"] = it.channel_detail["channel_id"];
                            video_detail["channel_title"] = it.channel_detail["channel_title"]
                            video_detail["channel_url"] = it.channel_detail["channel_url"]
                            video_detail["video_id"] = item.bvid;
                            video_detail["title"] = item.title;
                            video_detail["type"] = "";
                            video_detail["category"] = series.name;
                            video_detail["video_url"] = `https://www.bilibili.com/video/${item.bvid}`;
                            video_detail["thumbnail_url"] = item.pic;
                            video_detail["viewCount"] = item.stat.view;
                            video_detail["publishDate"] = new Date(Number(item.pubdate) * 1000);
                            video_detail["duration"] = Number(item.duration);
                            // console.log(video_detail)
                            
                            if ((new Date()).getTime() - retriever_parameters.crawling_term > video_detail["publishDate"].getTime()){
                                return false;
                            }
                            
                            await it.refresher.update(await it.optimize_item_simple(video_detail))
                        }

                        let itemCount = (new JsonPathFinder()).find(_resjson, "//archives", true, []).length;
                        // console.log(`${series.name} itemCount ${itemCount} pageSize ${pageSize}`)
                        return (pageSize <= itemCount);

                    }else{
                        url = `https://api.bilibili.com/x/space/wbi/arc/search?mid=${it.username}&ps=${pageSize}&tid=0&keyword=&order=pubdate&pn=${page}`
                        
                        const _response = await fetch(url, {
                            method: 'GET'
                        });
                        const _resjson = await _response.json();
                        temp_resjson = _resjson;

                        let temp_video_list_raw_map = {};
                        for (const _v of video_list_raw){
                            temp_video_list_raw_map[_v["video_id"]] = _v;
                        }
                        
                        for(const item of (new JsonPathFinder()).find(_resjson, "//vlist", true, [])){
                            let video_detail = {};
                            let type = (item.is_live_playback == 1)? "Streaming" : "";
                            video_detail["channel_id"] = it.channel_detail["channel_id"];
                            video_detail["channel_title"] = it.channel_detail["channel_title"]
                            video_detail["channel_url"] = it.channel_detail["channel_url"]
                            video_detail["video_id"] = item.bvid;
                            video_detail["title"] = item.title;
                            video_detail["type"] = type;
                            video_detail["category"] = (video_detail["video_id"] in temp_video_list_raw_map)? temp_video_list_raw_map[video_detail["video_id"]].category : "";
                            video_detail["video_url"] = `https://www.bilibili.com/video/${item.bvid}`;;
                            video_detail["thumbnail_url"] = item.pic;
                            video_detail["viewCount"] = item.play;
                            video_detail["comments"] = item.comment;
                            video_detail["publishDate"] = new Date(Number(item.created) * 1000);
                            video_detail["duration"] = convertColonTimeToSec(item.length);
                            video_detail["isLiveContent"] = type;
                            video_detail["shortDescription"] = item.description;
                            // console.log(video_detail)
                            
                            if ((new Date()).getTime() - retriever_parameters.crawling_term > video_detail["publishDate"].getTime()){
                                return false;
                            }

                            await it.refresher.update(await it.optimize_item_simple(video_detail))
                        }

                        let itemCount = (new JsonPathFinder()).find(_resjson, "//vlist", true, []).length;
                        return (pageSize <= itemCount);
                    }
                }catch(e){
                    console.error(e);
                    console.error(temp_resjson)
                    it.messenger.danger(e.toString(), 10000)
                }
            },
            
            optimize_item_simple : async (item)=>{
                let new_item = {
                    "channel_id": item.channel_id,
                    "channel_title": item.channel_title,
                    "channel_url": item.channel_url,

                    "video_id": item.video_id,
                    "video_url" : item.video_url,
                    "thumbnail_url" : item.thumbnail_url,
                    "title": item.title,
                    "duration": item.duration,
                    "publishDate": new Date(item.publishDate),
                    "category": (item.category)? item.category : "",
                    "type": (item.category)? item.type : "",
                    "viewCount": (item.viewCount && item.comments != "") ? Number(item.viewCount) : 0,
                    "comments": (item.comments && item.comments != "") ? Number(item.comments) : 0,
                    "shortDescription" : item.shortDescription,
                }
                return new_item;
            },

        }


        let renderer = {
            popup_elm_id : `${prefix}_video_list`.toString(),
            popup_bg_elm_id : `${prefix}_video_list_background`.toString(),
            popup_style_id : `${prefix}_video_list_style`.toString(),
            popup_elm_frame : null,
            popup_elm : null,
            header_attr_elm : null,
            table_section_elm : null,
            message_section_elm : null,
            tag_section_elm : null,
            refresher : null,

            columns : [
                {label : " ", key : "thumbnail_url", css_param: "padding: 1px;"},
                {label : "Title", key : "title", css_param: "max-width: 45vw; text-align: left; padding-left: 0.5em;"},
                {label : "Description", key : "shortDescription", css_param: "max-width: 45vw; text-align: left; padding-left: 0.5em;"},
                {label : "Duration", key : "duration", css_param: "text-align: right;"},
                {label : "Posted", key : "publishDate", css_param: "min-width: 8em; text-align: right;"},
                {label : "Category", key : "category", css_param: "text-align: center;"},
                {label : "Type", key : "type", css_param: "text-align: center;"},
                {label : "Views", key : "viewCount", css_param: "text-align: right;"},
                {label : "Comments", key : "comments", css_param: "text-align: right;"},
                {label : "Likes", key : "likes", css_param: "text-align: right;"},
                
                {label : "Replies", key : "reply_count", css_param: "text-align: right;"},
                {label : "Favorites", key : "favorite_count", css_param: "text-align: right;"},
                {label : "Retweets", key : "retweet_count", css_param: "text-align: right;"},
                {label : "Quotes", key : "quote_count", css_param: "text-align: right;"},
            ],

            numeric_columns : default_numeric_columns,

            target_display_columns : default_target_display_columns,
            target_search_columns : default_target_search_columns,

            initialize : async ()=>{
                let it = renderer;

                document.getElementsByTagName("body")[0].style.cssText = document.getElementsByTagName("body")[0].style.cssText + `overflow: hidden;`;

                let style = document.createElement('style');
                style.setAttribute("id", it.popup_style_id);
                const css = `
                    #${prefix}_video_list input[type=text]{
                        z-index: 5000003;
                        padding: 6px;
                        font-size: 1.5em;
                        font-height:1.5;
                        border-radius:5px;
                        border:solid 1.5px #69C;
                    }
                    
                    #${prefix}_video_list input[type=text]:focus{
                        outline : none;
                        border:solid 2.5px #69C;
                    }

                    .${prefix}_video_list_tag {
                        display: inline-block;
                        margin: 2px 4px 0px 4px;
                        background-color: #aa69ff;
                        border-radius: .80rem;
                        font-size : 1.2em;
                        padding: .4em .7em;
                        font-weight : 700;
                        color : #FFF;
                        cursor : pointer;
                    }
                    .${prefix}_video_list_tag_selected {
                        display: inline-block;
                        margin: 2px 4px 0px 4px;
                        background-color: #6647ff;
                        border-radius: .80rem;
                        font-size : 1.2em;
                        padding: .4em .7em;
                        font-weight : 700;
                        color : #FFF;
                        cursor : pointer;
                    }

                    .${prefix}_video_list_button {
                        background-color: #FCFCFC;
                        border: solid 1px #CCC;
                        border-radius: 7px;
                        padding: 0.2em;
                        margin-right: 0.25em;
                        /*margin-bottom: 0.5em;*/
                        cursor: pointer;
                        font-size: 1.6em;
                    }
                    .${prefix}_video_list_button:hover {
                        background-color: #E9E9E9;
                    }

                    .${prefix}_video_list_close_button{
                        font-size: 3em;
                        line-height: 1em;
                        font-weight: 1000;
                        color:#999;
                        cursor: pointer;
                    }
                    .${prefix}_video_list_close_button:hover{
                        color: #444;
                    }

                    .${prefix}_video_list_table{
                        width: 100%;
                        height: 93%;
                    }
                    .${prefix}_video_list_table tr:hover{ background-color: #F7F9F7; }
                    .${prefix}_video_list_table table{
                        border-collapse: collapse;
                        color: #333;
                        width: 98%;
                        font-size: 1.4em;
                        margin: 1em;
                    }
                    .${prefix}_video_list_table th{
                        position: sticky;
                        top: 0;
                        background-color: #FFF;
                        text-align: center;
                    }
                    .${prefix}_video_list_table th,td{
                        border-bottom: solid 1px rgb(222, 226, 230) !important;
                        border-right: dotted 1px rgb(236, 236, 240) !important;
                        padding-right: 6px;
                        vertical-align: middle !important;
                    }
                    
                    .${prefix}_video_list_table table a, a:link, a:visited, a:hover{
                        color: #6c757d;
                    }

                    .${prefix}_video_list_msg {
                        font-size: 1.5em;
                        padding: 1em;
                        margin: 0.5em;
                        border-radius: 1em;
                        position: relative;
                        box-sizing: border-box;
                        display: none;
                    }
                    .${prefix}_video_list_msg_info{
                        color: #41464b;
                        background-color : #fefefe;
                        border: solid 1px #d3d6d8;
                    }
                    .${prefix}_video_list_msg_success{
                        color: #0f5132;
                        background-color : #d1e7dd;
                        border: solid 1px #badbcc;
                    }
                    .${prefix}_video_list_msg_warn{
                        color: #664d03;
                        background-color : #fff3cd;
                        border: solid 1px #ffecb5;
                    }
                    .${prefix}_video_list_msg_danger{
                        color: #842029;
                        background-color : #f8d7da;
                        border: solid 1px #f5c2c7;
                    }
                    .${prefix}_video_list_msg div{
                        display: table-cell;
                        vertical-align: middle;
                    }
                `.toString();
                style.appendChild(document.createTextNode(css));
                document.getElementsByTagName('head')[0].appendChild(style);

                let popup_bg_elm = document.createElement('div');
                document.getElementsByTagName("body")[0].appendChild(popup_bg_elm);
                popup_bg_elm.setAttribute("id", it.popup_bg_elm_id);
                popup_bg_elm.style.cssText  = `
                    position: fixed;
                    opacity : 0.5;
                    transition: opacity .15s linear;
                    top: 0;
                    left: 0;
                    z-index: 5000000;
                    width: 100vw;
                    height: 100vh;
                    background-color : #000;
                `;
                popup_bg_elm.onclick = async function (event){
                    it.hide();
                }

                it.popup_elm_frame = document.createElement('div');
                document.getElementsByTagName("body")[0].appendChild(it.popup_elm_frame);
                it.popup_elm_frame.setAttribute("id", it.popup_elm_id);
                it.popup_elm_frame.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    display: block;
                    z-index: 5000001;
                    font-size: 10px;
                `;

                it.popup_elm = document.createElement('div');
                it.popup_elm.style.cssText = `
                    position: relative;
                    display: block;
                    background-color: #FFF;
                    width: 93%;
                    height: 92%;
                    overflow-y: scroll;
                    margin-top: 1%;
                    margin-left: auto;
                    margin-right: auto;
                    padding-top: 5px;
                    padding-bottom: 15px;
                    z-index: 5000002;
                    border-radius: 10px;
                    font-family : "YakuHanJPs","-apple-system","BlinkMacSystemFont","Segoe UI","Hiragino Sans","Hiragino Kaku Gothic ProN","Meiryo",Roboto, Arial, sans-serif;
                `;
                
                it.popup_elm_frame.onclick = async function (event){
                    it.hide();
                    // const pos = it.popup_elm.getBoundingClientRect();
                    // console.log(`${pos.left} ${pos.right} - ${pos.top} ${pos.bottom}`);
                    // console.log(event.clientX + " " + event.clientY);
                    // if (event.clientX < pos.left || event.clientX > pos.right || event.clientY < pos.top || event.clientY > pos.bottom){
                    //     it.close();
                    // }
                }

                it.popup_elm.onclick = async function (event){
                    event.stopPropagation();
                }

                it.popup_elm_frame.appendChild(it.popup_elm);
                
                const header_section = document.createElement('div');
                header_section.style.cssText = `
                    display: flex;
                    /*
                    position: sticky;
                    top: 0;
                    opacity: 0.9;
                    background-color: #FFF;
                    */
                    flex-wrap: wrap;
                    align-items: center;
                    white-space: nowrap;
                    border-bottom: solid 1px #DDD;
                    padding-left: 20px;
                    padding-right: 10px;
                `;
                it.popup_elm.appendChild(header_section);

                const header_left_block = document.createElement('div');
                header_left_block.style.cssText = `
                    font-size: 1.5em;
                    font-weight: 500;
                    padding-top:12px;
                    padding-bottom:3px;
                `;
                header_section.appendChild(header_left_block);
                
                const header_right_block = document.createElement('div');
                header_right_block.className = "____header_right_block"
                header_right_block.style.cssText = `
                    margin-left: auto;`;
                header_section.appendChild(header_right_block);

                it.header_attr_elm = document.createElement('span');
                it.header_attr_elm.setAttribute("id", "____header_attr_elm");
                header_left_block.appendChild(it.header_attr_elm);


                /* Add Filter Textbox */
                let filter_textbox_form = document.createElement('form');
                filter_textbox_form.style.cssText = `
                    display: inline-block;
                    margin-bottom:2px;
                `;
                let filter_textbox = document.createElement('input');
                filter_textbox.type = 'text';
                filter_textbox.placeholder = 'Filter by text';
                filter_textbox.value = optimize_parameters.filter_text;
                filter_textbox.style.cssText = `width: 20em;margin-right: 0.2em;`;
                filter_textbox.onblur = function (event){
                    optimize_parameters.filter_text = filter_textbox.value;
                    it.refresher.refresh();
                    return;
                }
                filter_textbox_form.onsubmit = function (event){
                    optimize_parameters.filter_text = filter_textbox.value;
                    it.refresher.refresh();

                    event.preventDefault();
                    event.stopPropagation();
                    return;
                }
                filter_textbox_form.appendChild(filter_textbox);
                header_right_block.appendChild(filter_textbox_form);

                const header_right_button_area = document.createElement('div');
                header_right_button_area.style.cssText = `
                    display: inline-block;
                    text-align: right;
                    min-width: 200px;
                `;


                /* Textbox-option section */
                const textbox_option_section_elm = document.createElement('div');
                textbox_option_section_elm.style.cssText = `
                    height: 1.2em;
                    margin: 6px;
                    text-align: right;
                    display: none;
                    font-size: 1.5em;
                `;

                for (const _option of it.target_search_columns){
                    const _option_elm = document.createElement('input');
                    _option_elm.id = prefix + '_checkbox_' + _option;
                    _option_elm.type = "checkbox";
                    _option_elm.name = "target_search_column";
                    _option_elm.value = _option;
                    if (optimize_parameters.filter_text_target_column.includes(_option)) _option_elm.setAttribute("checked", "");
                    _option_elm.onchange = async (event)=>{
                        // console.log(event.target.value + " " + event.target.checked)
                        if (event.target.checked){
                            if (optimize_parameters.filter_text_target_column.includes(event.target.value) == false){
                                optimize_parameters.filter_text_target_column.push(event.target.value);
                            }
                        }else{
                            if (optimize_parameters.filter_text_target_column.includes(event.target.value) == true){
                                optimize_parameters.filter_text_target_column.splice(optimize_parameters.filter_text_target_column.indexOf(event.target.value), 1);
                            }
                        }
                        // console.log(optimize_parameters.filter_text_target_column)
                        it.refresher.refresh();
                    };
                    textbox_option_section_elm.appendChild(_option_elm);

                    const _option_label_elm = document.createElement('label');
                    _option_label_elm.setAttribute("for", _option_elm.id);
                    _option_label_elm.style.cssText = "margin-right: 12px;";
                    _option_label_elm.innerHTML = escapeHTMLPolicy.createHTML(_option);
                    textbox_option_section_elm.appendChild(_option_label_elm);
                }
                it.popup_elm.appendChild(textbox_option_section_elm);

                /* Add textbox-option button */
                const show_textbox_option_button = document.createElement('button');
                show_textbox_option_button.setAttribute("class", `${prefix}_video_list_button`.toString());
                show_textbox_option_button.onclick = async function (event){
                    if (textbox_option_section_elm.style.display == "none"){
                        textbox_option_section_elm.style.display = "block";
                    }else{
                        textbox_option_section_elm.style.display = "none";
                    }
                    return;
                }
                show_textbox_option_button.setAttribute("title", "Option to select the target search field");
                show_textbox_option_button.innerHTML = escapeHTMLPolicy.createHTML("⚙️");
                header_right_button_area.appendChild(show_textbox_option_button);


                /* Add crawling term dropdown */
                let term_dropdown = document.createElement('select');
                term_dropdown.onchange = async function (event){
                    retriever_parameters.crawling_term = Number(term_dropdown.value);
                    video_list_raw.splice(0, video_list_raw.length);
                    video_list_optimized.splice(0, video_list_optimized.length);
                    it.refresher.refresh();
                    retriever_parameters.retriever.retrieve(retriever_parameters);

                }
                term_dropdown.style.cssText = `
                    height: 2.2em;
                    font-size: 12px;
                    margin: 6px;
                    border-radius: 4px;
                    border: solid #AAA 1px;
                `;
                const crawling_term = [
                    {"label": "Past 1 week", "term": 7 * 24 * 60 * 60 * 1000},
                    {"label": "Past 1 month", "term": 31 * 24 * 60 * 60 * 1000},
                    {"label": "Past 3 month", "term": 3 * 31 * 24 * 60 * 60 * 1000},
                    {"label": "Past 1 year", "term": 366 * 24 * 60 * 60 * 1000},
                    {"label": "All", "term": 100 * 365 * 24 * 60 * 60 * 1000},
                ];
                for (const _item of crawling_term){
                    const _option = document.createElement('option');
                    _option.value = _item.term;
                    _option.innerHTML = escapeHTMLPolicy.createHTML(_item.label);
                    term_dropdown.appendChild(_option);
                }
                header_right_button_area.appendChild(term_dropdown);

                /* Add Formatetd button */
                const format_button = document.createElement('button');
                format_button.setAttribute("class", `${prefix}_video_list_button`.toString());
                format_button.onclick = async function (event){
                    optimize_parameters.parseDateViewAndTimeFormat = (optimize_parameters.parseDateViewAndTimeFormat == false)
                    format_button.setAttribute("title", (optimize_parameters.parseDateViewAndTimeFormat ? "Raw text" : "Formatted"));
                    format_button.innerHTML = escapeHTMLPolicy.createHTML("🔤︎");
                    it.refresher.refresh();
                }
                format_button.setAttribute("title", (optimize_parameters.parseDateViewAndTimeFormat ? "Raw text" : "Formatted"));
                format_button.innerHTML = escapeHTMLPolicy.createHTML("🔤︎");
                header_right_button_area.appendChild(format_button);

                /* Add showThumbnail button */
                const show_thumbnail_button = document.createElement('button');
                show_thumbnail_button.setAttribute("class", `${prefix}_video_list_button`.toString());
                show_thumbnail_button.onclick = async function (event){
                    render_parameters.showThubmnail = (render_parameters.showThubmnail == false)
                    show_thumbnail_button.setAttribute("title", (render_parameters.showThubmnail ? "Hide Thubmnail" : "Show Thubmnail"));
                    show_thumbnail_button.innerHTML = escapeHTMLPolicy.createHTML("🖻");
                    it.refresher.refresh();
                }
                show_thumbnail_button.setAttribute("title", (render_parameters.showThubmnail ? "Hide Thubmnail" : "Show Thubmnail"));
                show_thumbnail_button.innerHTML = escapeHTMLPolicy.createHTML("🖻");
                header_right_button_area.appendChild(show_thumbnail_button);
                

                /* Add Copy Table to Clipboard button */
                let copy_table_button = document.createElement('button');
                copy_table_button.setAttribute("class", `${prefix}_video_list_button`.toString());
                copy_table_button.setAttribute("title", "Copy to Clipboard");
                copy_table_button.innerHTML = escapeHTMLPolicy.createHTML("📋");
                header_right_button_area.appendChild(copy_table_button);
                
                /* Add Copy Table to Clipboard button Event handler */
                copy_table_button.onclick = async function (event){
                    let text_to_be_copied = "";
                    // Create TSV header
                    if (it.refresher.video_list_optimized.length > 0){
                        text_to_be_copied = `"${Object.keys(it.refresher.video_list_optimized[0]).join("\",\"")}"\n`;
                    }

                    // Create TSV body
                    let column_keys = new Set();
                    for(const node of it.refresher.video_list_optimized){
                        for(const k in node){
                            column_keys.add(k)
                        }
                    }

                    for(const node of it.refresher.video_list_optimized){
                        let values = [];
                        for (const key of column_keys.values()){
                            node[key] = (node[key] == null)? "" : node[key];
                            if(node[key].toString().match(/^[-0-9., \/:]+$/)){
                                values.push(node[key]);
                            }else{
                                values.push(`"${node[key].toString().replaceAll("\t", "    ")}"`);
                            }
                        }
                        text_to_be_copied = text_to_be_copied + values.join("\t") + "\n";
                    }
                    navigator.clipboard.writeText(text_to_be_copied);
                    it.messenger.success("Copied to clipboard.", 3000)
                }
                
                /* Add Download Table button */
                let download_table_button = document.createElement('button');
                download_table_button.setAttribute("class", `${prefix}_video_list_button`.toString());
                download_table_button.setAttribute("title", "Download as CSV file");
                download_table_button.innerHTML = escapeHTMLPolicy.createHTML("&nbsp; ⭳ &nbsp;");
                header_right_button_area.appendChild(download_table_button);
                
                /* Add Download Table button Event handler */
                download_table_button.onclick = async function (event){
                    let content = "";
                    let filename = "download.csv";
                    let contentType = "text/csv";   //application/octet-stream
                    // Create TSV header
                    if (it.refresher.video_list_optimized.length > 0){
                        content = `"${Object.keys(it.refresher.video_list_optimized[0]).join("\",\"")}"\n`;
                        // console.log(it.refresher.video_list_optimized[0].channel_title)
                        if (isNullOrEmpty(it.refresher.video_list_optimized[0].channel_title) == false){
                            filename = it.refresher.video_list_optimized[0].channel_title + ".csv"
                        }
                    }

                    // Create CSV body
                    let column_keys = new Set();
                    for(const node of it.refresher.video_list_optimized){
                        for(const k in node){
                            column_keys.add(k)
                        }
                    }

                    for(const node of it.refresher.video_list_optimized){
                        let values = [];
                        for (const key of column_keys.values()){
                            node[key] = (node[key] == null)? "" : node[key];
                            if(node[key].toString().match(/^[-0-9.]+$/)){
                                values.push(node[key]);
                            }else{
                                values.push("\"" + node[key].toString().replaceAll("\t", "    ").replaceAll("\"", "\"\"") + "\"");
                            }
                        }
                        content = content + values.join(",") + "\n";
                    }

                    let a = document.createElement('a');
                    let blob = new Blob([content], {'type':contentType});
                    a.href = window.URL.createObjectURL(blob);
                    a.download = filename;
                    a.click();
                    it.messenger.success("Download popup was triggered.", 3000)
                }
                
                /* Save in web-storage button */
                let save_storage_table_button = document.createElement('button');
                save_storage_table_button.setAttribute("class", `${prefix}_video_list_button`.toString());
                save_storage_table_button.setAttribute("title", "Save data on the Web-Storage");
                save_storage_table_button.innerHTML = escapeHTMLPolicy.createHTML("💾");
                header_right_button_area.appendChild(save_storage_table_button);
                save_storage_table_button.onclick = async function (event){
                    if (it.refresher.video_list_raw.length > 0){
                        let dic_to_save = {
                            channel_detail : it.refresher.channel_detail,
                            date : (new Date()).getTime(),
                            video_list_raw : it.refresher.video_list_raw,
                            service_name: retriever_parameters.service_name
                        }

                        if (is_chrome_extension){
                            const _ls = await chrome.storage.local.get(null);
                            if (_ls == null || ("list" in _ls) == false){
                                chrome.storage.local.set({"list": [dic_to_save]});
                            }else{
                                _ls.list.push(dic_to_save);
                                chrome.storage.local.set({"list": _ls.list});
                            }
                            it.messenger.success("Current list is saved to Local-Storage in Chrome Extension", 3000)
                        }else if(localStorage){
                            const _ls = localStorage.getItem(`${prefix}_smtabular`.toString());
                            if (_ls == null){
                                localStorage.setItem(`${prefix}_smtabular`.toString(), JSON.stringify([dic_to_save]));
                            }else{
                                let _saved_list = JSON.parse(_ls);
                                _saved_list.push(dic_to_save);
                                localStorage.setItem(`${prefix}_smtabular`.toString(), JSON.stringify(_saved_list));
                            }
                            it.messenger.success("Current list is saved to Web-Storage (Local area)", 3000)
                        }
                    }
                }
                
                /* Load from web-storage button */
                let load_storage_table_button = document.createElement('button');
                load_storage_table_button.setAttribute("class", `${prefix}_video_list_button`.toString());
                load_storage_table_button.setAttribute("title", "Load data from the Web-Storage");
                load_storage_table_button.innerHTML = escapeHTMLPolicy.createHTML("📂");
                header_right_button_area.appendChild(load_storage_table_button);
                load_storage_table_button.onclick = async function (event){
                    let load_storage_table_popup = document.createElement('div');
                    load_storage_table_popup.setAttribute("tabindex", "0");
                    let close_load_storage_table_popup = async (event)=>{
                        load_storage_table_popup.remove();
                        return;
                    }
                    load_storage_table_popup.addEventListener("blur", close_load_storage_table_popup)

                    let storage_list = [];
                    if(is_chrome_extension){
                        let storage_list_json = await chrome.storage.local.get(null);
                        if (storage_list_json != null && "list" in storage_list_json){
                            storage_list.push(...storage_list_json.list);
                        }
                    }else if(localStorage){
                        let storage_list_text = localStorage.getItem(`${prefix}_smtabular`.toString())
                        if (storage_list_text != null && storage_list_text != ""){
                            storage_list = JSON.parse(storage_list_text);
                        }
                    }

                    for (let row of storage_list){
                        let load_storage_table_popup_item = document.createElement('div');
                        load_storage_table_popup_item.className = "row";
                        load_storage_table_popup_item.style.cssText = `
                            display: flex;
                            align-items: center;
                            padding: 6px;
                            margin: 2px;
                            border-radius: 4px;
                            background-color: #FFF;
                            cursor: pointer;
                        `;

                        let load_storage_table_popup_item_label = document.createElement('div');
                        load_storage_table_popup_item_label.style.cssText = `width: 100%`;
                        load_storage_table_popup_item_label.innerHTML = escapeHTMLPolicy.createHTML(`${row.channel_detail.channel_title} &nbsp;&nbsp; - &nbsp;&nbsp; ${new Date(Number(row.date)).toISOString()}`);
                        load_storage_table_popup_item_label.onmouseover = async (event)=>{
                            load_storage_table_popup_item.style.backgroundColor = "#F8F8FC"
                        }
                        load_storage_table_popup_item_label.onmouseout = async (event)=>{
                            load_storage_table_popup_item.style.backgroundColor = "#FFF"
                        }
                        load_storage_table_popup_item_label.onclick = async (event)=>{
                            let _target_display_columns = video_service_list[row.service_name]["target_display_columns"]
                            if (_target_display_columns == undefined){
                                _target_display_columns = it.default_target_display_columns;
                            }
                            let target_search_columns = video_service_list[row.service_name]["target_search_columns"]
                            if (target_search_columns == undefined){
                                target_search_columns = it.default_target_search_columns;
                            }
                            it.reset_items();

                            video_list_raw = row.video_list_raw;
                            it.refresher.video_list_raw = row.video_list_raw;
                            video_list_optimized = row.video_list_optimized;
                            it.refresher.video_list_optimized = row.video_list_optimized;
                            it.refresher.update_attr(row.channel_detail)
                            it.refresher.refresh();
                            it.messenger.success(`${row.channel_detail.channel_title} &nbsp;&nbsp; - &nbsp;&nbsp; ${new Date(Number(row.date)).toISOString()} is loaded`, 3000)
                            load_storage_table_popup.removeEventListener("blur", close_load_storage_table_popup)
                            load_storage_table_popup.remove();
                        }
                        load_storage_table_popup_item.appendChild(load_storage_table_popup_item_label);

                        let load_storage_table_popup_item_close_button = document.createElement('div');
                        load_storage_table_popup_item_close_button.style.cssText = `
                            font-size: 18px;
                            border: solid 1px #AAA;
                            border-radius: 8px;
                            padding: 0px 6px;`;
                        load_storage_table_popup_item_close_button.innerHTML = escapeHTMLPolicy.createHTML(`×`);
                        load_storage_table_popup_item.appendChild(load_storage_table_popup_item_close_button);
                        load_storage_table_popup_item_close_button.onmouseover = async (event)=>{
                            event.target.style.backgroundColor = "#F8F8FC"
                        }
                        load_storage_table_popup_item_close_button.onmouseout = async (event)=>{
                            event.target.style.backgroundColor = "#FFF"
                        }
                        load_storage_table_popup_item_close_button.onclick = async (event)=>{
                            let i = 0;
                            for (const row of load_storage_table_popup.getElementsByClassName("row")){
                                if(row === load_storage_table_popup_item){
                                    storage_list.splice(i, 1);
                                    if (is_chrome_extension){
                                        chrome.storage.local.set({"list": storage_list});
                                    }else if (localStorage){
                                        localStorage.setItem(`${prefix}_smtabular`.toString(), JSON.stringify(storage_list));
                                    }
                                    row.remove();
                                    break;
                                }
                                i++;
                            }
                        }
                        load_storage_table_popup.appendChild(load_storage_table_popup_item);
                    }
                    
                    load_storage_table_popup.style.cssText = `
                        position: absolute;
                        width: 42%;
                        padding: 3px;
                        border-radius: 12px;
                        background-color: #EFEFEF;
                        font-size: 12px;
                        top : ${load_storage_table_button.getBoundingClientRect().top - it.popup_elm.getBoundingClientRect().top + 40}px;
                        right: ${it.popup_elm.getBoundingClientRect().right - load_storage_table_button.getBoundingClientRect().right}px;`;
                    
                    it.popup_elm.appendChild(load_storage_table_popup);
                    load_storage_table_popup.focus();
                }


                /* Predicted tag section */
                it.tag_section_elm = document.createElement('div');
                it.popup_elm.appendChild(it.tag_section_elm);

                /* Add Predicted tag button */
                let show_tag_button = document.createElement('button');
                show_tag_button.setAttribute("class", `${prefix}_video_list_button`.toString());
                show_tag_button.onclick = async function (event){
                    if (it.tag_section_elm.innerHTML != ""){
                        it.tag_section_elm.innerHTML = escapeHTMLPolicy.createHTML("");
                        return;
                    }
                    
                    const reloadTagsField = (count) =>{
                        it.tag_section_elm.innerHTML = escapeHTMLPolicy.createHTML("");
                        let sentences = it.refresher.video_list_optimized.map(d => d.title);
                        // console.log(sentences)
                        const suggested_tags = (new TagSuggester()).suggest(sentences, count);
                        let tag_section_elm_div = document.createElement('div');
                        tag_section_elm_div.setAttribute("style", "padding: 3px; line-height: 1.2em; user-select: none;");
                        it.tag_section_elm.appendChild(tag_section_elm_div);
                        for (const keyword of suggested_tags.map(d => d.key)){
                            let tag_span_elm = document.createElement('span');
                            tag_span_elm.setAttribute("class", `${prefix}_video_list_tag`.toString());
                            tag_span_elm.innerHTML = escapeHTMLPolicy.createHTML(keyword);
                            tag_span_elm.onclick = async function (event){
                                if (filter_textbox.value != null && filter_textbox.value != ""){
                                    if(filter_textbox.value.match("\"" + keyword + "\"") == null){
                                        filter_textbox.value = filter_textbox.value + " \"" + keyword + "\"";
                                        event.target.setAttribute("class", `${prefix}_video_list_tag_selected`.toString());
                                    }else{
                                        filter_textbox.value = filter_textbox.value.replace(" \"" + keyword + "\"", "")
                                        filter_textbox.value = filter_textbox.value.replace("\"" + keyword + "\"", "")
                                        event.target.setAttribute("class", `${prefix}_video_list_tag`.toString());
                                    }
                                }else{
                                    filter_textbox.value = "\"" + keyword + "\"";
                                    event.target.setAttribute("class", `${prefix}_video_list_tag_selected`.toString());
                                }
    
                                optimize_parameters.filter_text = filter_textbox.value;
                                it.refresher.refresh();
                            }
                            tag_section_elm_div.appendChild(tag_span_elm)
                        }

                        let tag_span_more_elm = document.createElement('span');
                        tag_span_more_elm.setAttribute("class", `${prefix}_video_list_tag`.toString());
                        tag_span_more_elm.style.backgroundColor = "#CF5C0F"
                        tag_span_more_elm.innerHTML = escapeHTMLPolicy.createHTML("Load more tags...");
                        tag_span_more_elm.onclick = async function (event){
                            reloadTagsField(count * 2);
                        }
                        tag_section_elm_div.appendChild(tag_span_more_elm)
                    }

                    reloadTagsField(24);
                }
                show_tag_button.setAttribute("title", "Predict tags");
                show_tag_button.innerHTML = escapeHTMLPolicy.createHTML("🏷️");
                header_right_button_area.appendChild(show_tag_button);

                
                /* Add Stop loading button */
                let stop_loading_table_button = document.createElement('button');
                stop_loading_table_button.setAttribute("class", `${prefix}_video_list_button`.toString());
                stop_loading_table_button.setAttribute("title", "Stop loading");
                stop_loading_table_button.innerHTML = escapeHTMLPolicy.createHTML("⛔");
                stop_loading_table_button.onclick = async (event)=>{
                    retriever_parameters.stop_loading = true;
                }
                header_right_button_area.appendChild(stop_loading_table_button);


                /* Add Close button */
                let close_button = document.createElement('span');
                close_button.setAttribute("class", `${prefix}_video_list_close_button`.toString());
                close_button.onclick = async function (event){
                    it.close();
                }
                close_button.innerHTML = escapeHTMLPolicy.createHTML("×")
                header_right_button_area.appendChild(close_button);
                header_right_block.appendChild(header_right_button_area);

                /* Messaget section */
                it.message_section_elm = document.createElement('div');
                it.message_section_elm.style.cssText = `
                    padding: 2px;
                `;
                it.popup_elm.appendChild(it.message_section_elm);

                /* Main table section */
                it.table_section_elm = document.createElement('div');
                it.table_section_elm.setAttribute("class", `${prefix}_video_list_table`.toString());
                it.popup_elm.appendChild(it.table_section_elm);
                it.reset_items();
            },

            messenger : {
                _msg : async (message, css_class_type, char = "", duration = -1) =>{
                    let it = renderer;

                    let msg = document.createElement('div');
                    msg.setAttribute("class", `${prefix}_video_list_msg ${css_class_type}`);
                    msg.innerHTML = escapeHTMLPolicy.createHTML(`
                        <div>
                            <span style="font-size: 1.2em; font-weight: 1000;">${char}</span>
                            <span style="padding-left: 20px;" class="${prefix}_video_list_msg_content">${message}</span>
                        </div>
                        <div style="position: absolute; top:0px; right:20px;" class="${prefix}_video_list_close_button">×</div>
                    `);
                    msg.getElementsByTagName("div")[1].onclick = async function (event){
                        it.messenger.close(msg);
                    }
                    it.message_section_elm.appendChild(msg);
                    it.fadeIn(msg)
                    if(duration > 0){
                        (async (_elm, _duration)=>{
                            await sleep(_duration);
                            it.fadeOut(_elm);
                            return true;
                        })(msg, duration);
                    }

                    return msg;
                },
                update_msg : async (elm, message) =>{
                    if (elm != null){
                        $(`.//span[@class='${prefix}_video_list_msg_content']`.toString(), elm).innerHTML = escapeHTMLPolicy.createHTML(message);
                    }
                    return elm;
                },
                info : async (message, duration = -1) =>{
                    let it = renderer;

                    return (await it.messenger._msg(message, `${prefix}_video_list_msg_info`.toString(), "ⓘ", duration));
                },
                success : async (message, duration = -1) =>{
                    let it = renderer;

                    return (await it.messenger._msg(message, `${prefix}_video_list_msg_success`.toString(), "✔", duration));
                },
                warn : async (message, duration = -1) =>{
                    let it = renderer;

                    return (await it.messenger._msg(message, `${prefix}_video_list_msg_warn`.toString(), "⚠", duration));
                },
                danger : async (message, duration = -1) =>{
                    let it = renderer;

                    return (await it.messenger._msg(message, `${prefix}_video_list_msg_danger`.toString(), "⚠", duration));
                },
                close : async (elm) =>{
                    let it = renderer;

                    it.fadeOut(elm);
                },
            },

            update_attr : async (dict)=>{
                let it = renderer;
                it.header_attr_elm.innerHTML = escapeHTMLPolicy.createHTML(`
                    <img src="${dict.channel_image}" width="24" style="margin-right: 1em; vertical-align: bottom;" /> 
                    ${dict.channel_title} 
                    <span style="padding-left:3em;">${formatNumberWithComma(dict.channel_subscribers)} Subscribers</span>`)
            },

            render_items : async (item_arr, target_items = null)=>{
                let it = renderer;

                let tbody_elm = it.table_section_elm.getElementsByTagName("tbody")[0];
                if (isNullOrEmpty(target_items) || target_items.length < 1){
                    /* Reset and insert all of data */
                    let new_tbody_innerHTML = "";
                    for (let _row of item_arr){
                        new_tbody_innerHTML += `<tr ${it.refresher.key}="${_row[it.refresher.key]}">`
                        for (let _column of it.columns){
                            const _key = _column.key;
                            if (it.target_display_columns.includes(_key) == false){
                                continue;
                            }

                            if (_key == "thumbnail_url"){
                                if (render_parameters.showThubmnail == true){
                                    new_tbody_innerHTML += `
                                        <td style="${_column.css_param}" data-field="${_key}">
                                            <a href="${_row["video_url"]}" target="_blank">
                                                <img style='width: 4em;' src='${_row[_key]}' />
                                            </a>
                                        </td>`;
                                }
                            }else if(_key == "title"){
                                new_tbody_innerHTML += `
                                    <td style="${_column.css_param}" data-field="${_key}">
                                        <a href="${_row["video_url"]}" target="_blank">${_row[_key]}</a>
                                    </td>`;
                            }else{
                                /* Normal column */
                                new_tbody_innerHTML += `<td style="${_column.css_param}" data-field="${_key}" data-value="${_row["raw_value"][_key]}">${_row[_key]}</td>`;
                            }
                        }
                        new_tbody_innerHTML += "</tr>"
                    }
                    tbody_elm.innerHTML = escapeHTMLPolicy.createHTML(new_tbody_innerHTML);
                }else{
                    /* Update only particular items */
                    for (let _item of target_items){
                        let target_elm = $(`//tr[@${it.refresher.key}='${_item}']`)

                        let _row = null;
                        for (let r of item_arr){
                            if(_item == r[it.refresher.key]){
                                _row = r;
                            }
                        }

                        if(isNullOrEmpty(target_elm) == false){
                            for (const _td_elm of $$(".//td", target_elm)){
                                const _key = _td_elm.getAttribute("data-field");
                                if (_key == "thumbnail_url"){
                                    if (render_parameters.showThubmnail == true){
                                        _td_elm.innerHTML = escapeHTMLPolicy.createHTML(`
                                            <a href="${_row["video_url"]}" target="_blank">
                                                <img style='width: 4em;' src='${_row[_key]}' />
                                            </a>`
                                        );
                                    }
                                }else if(_key == "title"){
                                    _td_elm.innerHTML = escapeHTMLPolicy.createHTML(`
                                        <a href="${_row["video_url"]}" target="_blank">${_row[_key]}</a>`
                                    );
                                }else{
                                    /* Normal column */
                                    _td_elm.setAttribute("data-value", _row["raw_value"][_key]);
                                    _td_elm.innerHTML = escapeHTMLPolicy.createHTML(`${_row[_key]}`);
                                }
                            }
                        }else{
                            new_td_innerHTML = "";
                            for (let _column of it.columns){
                                const _key = _column.key;
                                if (it.target_display_columns.includes(_key) == false){
                                    continue;
                                }

                                if (_key == "thumbnail_url"){
                                    if (render_parameters.showThubmnail == true){
                                        new_td_innerHTML += `
                                            <td style="${_column.css_param}" data-field="${_key}">
                                                <a href="${_row["video_url"]}" target="_blank">
                                                    <img style='width: 4em;' src='${_row[_key]}' />
                                                </a>
                                            </td>`;
                                    }
                                }else if(_key == "title"){
                                    new_td_innerHTML += `
                                        <td style="${_column.css_param}" data-field="${_key}">
                                            <a href="${_row["video_url"]}" target="_blank">${_row[_key]}</a>
                                        </td>`;
                                }else{
                                    /* Normal column */
                                    new_td_innerHTML += `<td style="${_column.css_param}" data-field="${_key}" data-value="${_row["raw_value"][_key]}">${_row[_key]}</td>`;
                                }
                            }
                            let tbody_elm = it.table_section_elm.getElementsByTagName("tbody")[0];
                            new_td_innerHTML = `<tr ${it.refresher.key}="${_row[it.refresher.key]}">` + new_td_innerHTML + "</tr>";
                            tbody_elm.innerHTML = escapeHTMLPolicy.createHTML(tbody_elm.innerHTML + new_td_innerHTML);
                        }
                    }
                }
                return;
            },

            draw_gradient_graph : async ()=>{
                let it = renderer;
                
                /* Calculate maximum of each graphic-column field */
                let _maximum_values = {};
                for (const _c of column_graphical_view){
                    _maximum_values[_c] = 1;
                }

                for(_tr_elm of $$(".//tr", it.table_section_elm.getElementsByTagName("tbody")[0])){
                    for(_td_elm of $$(".//td", _tr_elm)){
                        if (column_graphical_view.includes(_td_elm.getAttribute("data-field"))){
                            if (Number(_td_elm.getAttribute("data-value")) > _maximum_values[_td_elm.getAttribute("data-field")]){
                                _maximum_values[_td_elm.getAttribute("data-field")] = Number(_td_elm.getAttribute("data-value"));
                            }
                        }
                    }
                }

                for(_tr_elm of $$(".//tr", it.table_section_elm.getElementsByTagName("tbody")[0])){
                    for(_td_elm of $$(".//td", _tr_elm)){
                        /* Normal column */
                        let _gradient_css = "";
                        const _key = _td_elm.getAttribute("data-field");
                        const _value = _td_elm.getAttribute("data-value");
                        if (column_graphical_view.includes(_key)){
                            // console.log(`Gradient ${_key}: ${_value}, ${_maximum_values[_key]}`);
                            _gradient_percentage = Math.floor(Number(_value) / _maximum_values[_key] * 100);
                            _td_elm.style.background = `linear-gradient(to right, #dfd ${_gradient_percentage}%, rgba(0,0,0,0) ${_gradient_percentage}% )`;
                        }
                    }
                }
            },

            reset_items : async ()=>{
                let it = renderer;

                let table_innerHTML = `<table><thead><tr>`;
                for (let c of it.columns){
                    if (it.target_display_columns.includes(c.key) == false){
                        continue;
                    }

                    if (c.key == "thumbnail_url" && render_parameters.showThubmnail == false){
                        table_innerHTML += "";
                    }else{
                        table_innerHTML += `
                            <th>
                                ${c.label} 
                                ${(c.key != "thumbnail_url") ? `
                                    <div style="display: inline-block;">
                                        <span style="cursor: pointer; color: ${(sort_parameters.sort_key == c.key && sort_parameters.sort_order == "asc")? "#111" : "#BBB"};" key="${c.key}" sort_order="asc" title="Ascending">▴</span>
                                        <span style="cursor: pointer; color: ${(sort_parameters.sort_key == c.key && sort_parameters.sort_order == "desc")? "#111" : "#BBB"};" key="${c.key}" sort_order="desc" title="Descending">▾</span>
                                        <span style="cursor: pointer; font-size: 0.8em; color: ${(Object.keys(optimize_parameters.column_filter).includes(c.key))? "#111" : "#BBB"};" key="${c.key}" column_filter="${(Object.keys(optimize_parameters.column_filter).includes(c.key))? "disable" : "enable"}" title="Add filter">🖉</span>
                                    </div>
                                `: ""}
                            </th>
                        `;
                    }
                }
                table_innerHTML += `</tr></thead><tbody></tbody></table>`;
                it.table_section_elm.innerHTML = escapeHTMLPolicy.createHTML(table_innerHTML);

                for (let _elm of it.table_section_elm.getElementsByTagName("span")){
                    if (_elm.hasAttribute("sort_order")){
                        _elm.onclick = async (event)=>{
                            it.refresher.sort(_elm.getAttribute("key"), _elm.getAttribute("sort_order"));
                            return;
                        }
                    }else if (_elm.hasAttribute("column_filter")){
                        _elm.onclick = async (event)=>{
                            const _search_elm_id = "__search_" + _elm.getAttribute("key");

                            // console.log(_elm.getBoundingClientRect())
                            let filter_textbox_form = document.createElement('form');
                            filter_textbox_form.id = _search_elm_id;
                            
                            let filter_textbox = document.createElement('input');
                            filter_textbox.type = 'text';
                            filter_textbox.placeholder = '';
                            filter_textbox.value = (optimize_parameters.column_filter[_elm.getAttribute("key")])? optimize_parameters.column_filter[_elm.getAttribute("key")] : '';

                            filter_textbox.style.cssText = `
                                position: absolute;
                                    top : ${_elm.getBoundingClientRect().top - it.popup_elm.getBoundingClientRect().top + 20}px;
                                    left: ${_elm.getBoundingClientRect().left - it.popup_elm.getBoundingClientRect().left - 100}px;`;
                            
                            filter_textbox_form.onsubmit = function (event){
                                if (filter_textbox.value == ""){
                                    if (Object.keys(optimize_parameters.column_filter).includes(_elm.getAttribute("key"))){
                                        delete optimize_parameters.column_filter[_elm.getAttribute("key")];
                                    }
                                }else{
                                    optimize_parameters.column_filter[_elm.getAttribute("key")] = filter_textbox.value;
                                }
                                // console.log(optimize_parameters)

                                event.preventDefault();
                                event.stopPropagation();
                                filter_textbox.blur();
                                return;
                            }
                            filter_textbox_form.onclick = async function (event){
                                // event.preventDefault();
                                event.stopPropagation();
                                return;
                            }

                            filter_textbox.onblur = async function (event){
                                if (filter_textbox.value == ""){
                                    if (Object.keys(optimize_parameters.column_filter).includes(_elm.getAttribute("key"))){
                                        delete optimize_parameters.column_filter[_elm.getAttribute("key")];
                                    }
                                }else{
                                    optimize_parameters.column_filter[_elm.getAttribute("key")] = filter_textbox.value;
                                }
                                // console.log(optimize_parameters)

                                it.refresher.refresh();

                                if (document.getElementById(_search_elm_id) != null){
                                    document.getElementById(_search_elm_id).remove();
                                }
                                return;
                            }
                            filter_textbox_form.appendChild(filter_textbox);
                            it.popup_elm.appendChild(filter_textbox_form);
                            filter_textbox.focus();
                            
                            return;
                        }
                    }
                }

                return;
            },

            hide : async ()=>{
                let it = renderer;
                if (document.getElementById(it.popup_elm_id) != null){
                    document.getElementById(it.popup_elm_id).style.cssText = document.getElementById(it.popup_elm_id).style.cssText + " display: none;";
                }
                if (document.getElementById(it.popup_bg_elm_id) != null){
                    document.getElementById(it.popup_bg_elm_id).style.cssText = document.getElementById(it.popup_bg_elm_id).style.cssText + " display: none;";
                }
                if (document.getElementById(it.popup_style_id) != null){
                    document.getElementById(it.popup_style_id).style.cssText = document.getElementById(it.popup_style_id).style.cssText + " display: none;";
                }

                document.getElementsByTagName("body")[0].style.cssText = document.getElementsByTagName("body")[0].style.cssText.replaceAll("overflow: hidden;", "");
            },

            close : async ()=>{
                let it = renderer;

                if (document.getElementById(it.popup_elm_id) != null){
                    document.getElementById(it.popup_elm_id).remove();
                }
                if (document.getElementById(it.popup_bg_elm_id) != null){
                    document.getElementById(it.popup_bg_elm_id).remove();
                }
                if (document.getElementById(it.popup_style_id) != null){
                    document.getElementById(it.popup_style_id).remove();
                }

                document.getElementsByTagName("body")[0].style.cssText = document.getElementsByTagName("body")[0].style.cssText.replaceAll("overflow: hidden;", "");
                it.popup_elm = null;
                retriever_parameters.stop_loading = true;
            },
            fadeIn : async (elm, duration = 200)=>{
                const interval = 20;
                const repeat_count = (duration / interval) + 1;
                if (isNullOrEmpty(elm.style.opacity)){
                    elm.style.opacity = 0;
                }
                
                elm.style.display = "block";
                for (let i=0; i<repeat_count; i++){
                    elm.style.opacity = Number(elm.style.opacity) + (1/repeat_count);
                    if (elm.style.opacity > 1){
                        break;
                    }else{
                        await sleep(interval);
                    }
                }
            },
            fadeOut : async (elm, duration = 200)=>{
                const interval = 20;
                const repeat_count = (duration / interval) + 1;
                if (isNullOrEmpty(elm.style.opacity)){
                    elm.style.opacity = 1;
                }

                for (let i=0; i<repeat_count; i++){
                    elm.style.opacity = Number(elm.style.opacity) - (1/repeat_count);
                    if (elm.style.opacity < 0){
                        break;
                    }else{
                        await sleep(interval);
                    }
                }
                
                elm.style.display = "none";
            }
        }

        let refresher = {
            key : "video_url",
            video_list_raw : null,
            video_list_optimized : null,
            channel_detail : null,
            renderer : null,
            optimize_parameters : null,

            initialize : async (_video_list_raw, _video_list_optimized, _renderer, _key, _optimize_parameters)=>{
                let it = refresher;

                it.video_list_raw = _video_list_raw;
                it.video_list_optimized = _video_list_optimized;
                it.renderer = _renderer;
                it.key = _key;
                it.optimize_parameters = _optimize_parameters;
            },

            optimize_item: async (item)=>{
                let it = refresher;
                if (isNullOrEmpty(item)){
                    return;
                }

                let new_item = clone(item);
                
                let raw_value = {};
                for (const _c in new_item){
                    if (Object.prototype.toString.call(new_item[_c]).match(/Date/)){
                        raw_value[_c] = new_item[_c].toISOString();
                    }else{
                        raw_value[_c] = new_item[_c];
                    }
                }
                new_item["raw_value"] = raw_value;

                if (isNullOrEmpty(new_item.publishDate) == false){
                    new_item.publishDate = `${(new Date(new_item.publishDate)).toISOString().slice(0,10)}`
                }

                if (it.optimize_parameters.parseDateViewAndTimeFormat){
                    new_item.duration = `${convertSecToColonTime(new_item.duration)}`
                    new_item.viewCount = `${formatNumberWithComma(new_item.viewCount)}`
                    new_item.comments = `${formatNumberWithComma(new_item.comments)}`
                    new_item.likes = `${formatNumberWithComma(new_item.likes)}`
                    new_item.mylistCount = `${formatNumberWithComma(new_item.mylistCount)}`
                }

                return new_item;
            },

            append : async (new_item)=>{
                let it = refresher;
                if (isNullOrEmpty(new_item)){
                    return;
                }

                it.video_list_raw.push(new_item);
                it.video_list_optimized.push(await it.optimize_item(new_item));
                it.renderer.render_items(it.video_list_optimized, [new_item[it.key]]);
            },

            update: async (new_item)=>{
                let it = refresher;
                if (isNullOrEmpty(new_item)){
                    return;
                }

                let is_exists = false;
                for (let i=0; i<it.video_list_raw.length; i++){
                    if(it.video_list_raw[i][it.key] === new_item[it.key]){
                        it.video_list_raw[i] = new_item;
                        is_exists = true;
                    }
                }
                
                if(is_exists){
                    for (let i=0; i<it.video_list_optimized.length; i++){
                        if(it.video_list_optimized[i][it.key] === new_item[it.key]){
                            it.video_list_optimized[i] = await it.optimize_item(new_item);
                        }
                    }
                    
                    it.renderer.render_items(it.video_list_optimized, [new_item[it.key]]);
                }else{
                    await it.append(new_item);
                }
            },

            refresh: async ()=>{
                let it = refresher;

                let temp_cloned_video_list = []
                let temp_saerch_keyword = it.optimize_parameters.filter_text;

                /**** Apply filter condition ****/
                let search_conditions = [];
                /* Parse search text and generate condition list */

                // Check the form like :  "target keyword"
                let _regex = /(^|[ 　])([-]{0,1})([\<\>]{0,1})(["]{1})([^"]+?)(["]{1})/g;
                while((_match = _regex.exec(temp_saerch_keyword)) !== null){
                    if (trim(_match[5]).length == 0){
                        continue;
                    }
                    search_conditions.push({
                        column: optimize_parameters.filter_text_target_column,
                        isNot: (_match[2].length == 0)? false : true,
                        operator: (_match[3].length == 0)? "=" : _match[3],
                        isStrict: (_match[4].length == 0)? false : true,
                        word: _match[5],
                    })
                }
                temp_saerch_keyword = temp_saerch_keyword.replace(/(^|[ 　])([-]{0,1})([\<\>]{0,1})(["]{1})([^"]+?)(["]{1})/g, " ");

                // Check the form like :  publishDate:>2022/2/2
                _regex = /(^|[ 　])([A-Za-z]+):([-]{0,1})([\<\>]{0,1})(["]{0,1})([^ 　"]+)(["]*)/g;
                while((_match = _regex.exec(temp_saerch_keyword)) !== null){
                    if (trim(_match[6]).length == 0){
                        continue;
                    }
                    // console.log(_match)
                    search_conditions.push({
                        column: _match[2],
                        isNot: (_match[3].length == 0)? false : true,
                        operator: (_match[4].length == 0)? "=" : _match[4],
                        isStrict: (_match[5].length == 0)? false : true,
                        word: _match[6],
                    })
                }
                temp_saerch_keyword = temp_saerch_keyword.replace(/(^|[ 　])([A-Za-z]+):([-]{0,1})([\<\>]{0,1})(["]{0,1})([^ 　"]+)(["]*)/g, " ");

                // Check the form like :  "target keyword"
                _regex = /(^|[ 　])([-]{0,1})([\<\>]{0,1})([^ 　]+)/g;
                while((_match = _regex.exec(temp_saerch_keyword)) !== null){
                    if (trim(_match[4]).length == 0){
                        continue;
                    }
                    search_conditions.push({
                        column: optimize_parameters.filter_text_target_column,
                        isNot: (_match[2].length == 0)? false : true,
                        operator: (_match[3].length == 0)? "=" : _match[3],
                        isStrict: false,
                        word: _match[4],
                    })
                }

                // Check the words in the column-level filter
                for (_column in optimize_parameters.column_filter){
                    _regex = /(^|[ 　])([-]{0,1})([\<\>]{0,1})(.+)/g;
                    while((_match = _regex.exec(optimize_parameters.column_filter[_column])) !== null){
                        if (trim(_match[4]).length == 0){
                            continue;
                        }
                        search_conditions.push({
                            column: _column,
                            isNot: (_match[2].length == 0)? false : true,
                            operator: (_match[3].length == 0)? "=" : _match[3],
                            isStrict: false,
                            word: _match[4],
                        })
                    }
                }

                /* Apply the search conditions and generate the filtered video list */
                for (let r of it.video_list_raw){
                    let is_matched_row = true;
                    every_condition : for (_search_condition of search_conditions){
                        let _search_val = _search_condition.word;
                        let search_condition_target_columns = _search_condition.column;
                        if ((typeof search_condition_target_columns) == 'string'){
                            search_condition_target_columns = [search_condition_target_columns]
                        }
                        let is_matched_column = false;
                        either_possible_column : for (const search_condition_target_column of search_condition_target_columns){
                            let _eval_val = r[search_condition_target_column];
                            _eval_val = (_eval_val == null || _eval_val == undefined)? "" : _eval_val;
                            if (search_date_format_field.includes(_search_condition.column)){
                                _search_val = (new SimpleDateFormat("")).parseFormats([
                                    "MM/dd",
                                    "MM-dd",
                                    "yyyy/MM/dd",
                                    "yyyy-MM-dd"
                                ], _search_val);
                            }else if (default_numeric_columns.includes(_search_condition.column)){
                                _search_val = Number(_search_val);
                            }
    
                            // if (!_search_condition.isStrict && !default_numeric_columns.includes(_search_condition.column)){
                            //     _search_val = _search_val.toLowerCase()
                            //     _eval_val = _eval_val.toLowerCase()
                            // }
    
                            let temp_valid_flag = false;
    
                            // console.log(`_search_val ${_search_val.toString()}`)
                            // console.log(`_eval_val  ${_eval_val.toString()}`)
    
                            if (_search_condition.operator == "="){
                                if ((typeof _eval_val) != 'string' && _eval_val instanceof Array){
                                    temp_valid_flag = _eval_val.reduce((accumulator, currentValue) =>{
                                        const _e1 = (new NgramTokenizer()).normalizeJapaneseCharacter(currentValue.toString().toLowerCase());
                                        const _e2 = (new NgramTokenizer()).normalizeJapaneseCharacter(_search_val.toString().toLowerCase());
                                        temp_valid_flag = _e1.includes(_e2);
                                        return (accumulator || _e1.includes(_e2));
                                    }, temp_valid_flag);
                                }else{
                                    const _e1 = (new NgramTokenizer()).normalizeJapaneseCharacter(_eval_val.toString().toLowerCase());
                                    const _e2 = (new NgramTokenizer()).normalizeJapaneseCharacter(_search_val.toString().toLowerCase());
                                    temp_valid_flag = _e1.includes(_e2);
                                }
                            }else if (_search_condition.operator == ">"){
                                temp_valid_flag = (_eval_val > _search_val)
                            }else if (_search_condition.operator == "<"){
                                temp_valid_flag = (_eval_val < _search_val)
                            }
    
                            if(_search_condition.isNot){
                                temp_valid_flag = (temp_valid_flag == false);
                            }

                            if(temp_valid_flag){
                                is_matched_column = true;
                                break either_possible_column;
                            }
                        }

                        if(is_matched_column){
                            continue every_condition;
                        }else{
                            is_matched_row = false;
                            break every_condition;
                        }
                    }

                    if(is_matched_row){
                        let _r = clone(r)
                        if (isNullOrEmpty(_r["publishDate"]) == false){
                            _r["publishDate"] = new Date(r["publishDate"])
                        }
                        temp_cloned_video_list.push(_r);
                    }else{
                        continue;
                    }
                }

                /**** Apply sort condition ****/
                if (it.renderer.numeric_columns.includes(sort_parameters.sort_key)){
                    let _key = sort_parameters.sort_key;
                    /* Numeric sort */
                    if(sort_parameters.sort_order == 'asc'){
                        temp_cloned_video_list.sort((a, b) => { return Number(a[_key]) - Number(b[_key]) });
                    }else{
                        temp_cloned_video_list.sort((a, b) => { return Number(b[_key]) - Number(a[_key]) });
                    }
                }else{
                    /* Text sort */
                    let _key = sort_parameters.sort_key;
                    if(sort_parameters.sort_order == 'asc'){
                        temp_cloned_video_list.sort((a, b) => { 
                            if(a[_key].toUpperCase() > b[_key].toUpperCase()){
                                return 1;
                            }else if(a[_key].toUpperCase() < b[_key].toUpperCase()){
                                return -1;
                            }else{
                                return 0;
                            }
                        });
                    }else{
                        temp_cloned_video_list.sort((a, b) => { 
                            if(a[_key].toUpperCase() < b[_key].toUpperCase()){
                                return 1;
                            }else if(a[_key].toUpperCase() > b[_key].toUpperCase()){
                                return -1;
                            }else{
                                return 0;
                            }
                        });
                    }
                }

                for (let i=0; i<temp_cloned_video_list.length; i++){
                    temp_cloned_video_list[i] = await it.optimize_item(temp_cloned_video_list[i])
                }
                
                it.video_list_optimized = temp_cloned_video_list;

                it.renderer.reset_items();
                it.renderer.render_items(it.video_list_optimized);
                it.renderer.draw_gradient_graph();
            },

            sort: async (_key, _sort_order)=>{
                let it = refresher;

                sort_parameters.sort_key = _key;
                sort_parameters.sort_order = _sort_order;
                it.refresh();
            },

            update_attr: async (dict)=>{
                let it = refresher;
                it.channel_detail = dict;
                await it.renderer.update_attr(dict)
            },
        }


        const video_service_list = {
            "youtube" : {
                "url_regex" : /^https:\/\/(m|www)\.youtube\.com\/channel\/[-0-9A-Za-z_]+.*/gi,
                "retriever" : youtubeRetriever,
                "target_search_columns": ["title", "shortDescription", "topComments", "transcriptions", "chapters"],
            },
            "youtube_channel" : {
                "url_regex" : /^https:\/\/(m|www)\.youtube\.com\/c\/[^\/]+.*/gi,
                "retriever" : youtubeRetriever,
                "target_search_columns": ["title", "shortDescription", "topComments", "transcriptions", "chapters"],
            },
            "youtube_stream" : {
                "url_regex" : /^https:\/\/(m|www)\.youtube\.com\/@[-0-9A-Za-z_]+.*/gi,
                "retriever" : youtubeRetriever,
                "target_search_columns": ["title", "shortDescription", "topComments", "transcriptions", "chapters"],
            },
            "twitch" : {
                "url_regex" : /^https:\/\/(m|www)\.twitch\.tv\/[-0-9A-Za-z_]+/gi,
                "retriever" : twitchRetriever,
                "target_display_columns": ["thumbnail_url", "title", "duration", "publishDate", "viewCount"],
            },
            "niconico" : {
                "url_regex" : /^https:\/\/www\.nicovideo\.jp\/user\/[0-9]+/gi,
                "retriever" : niconicoRetriever,
            },
            "niconico_channel" : {
                "url_regex" : /^https:\/\/ch\.nicovideo\.jp\/[A-Za-z0-9]+/gi,
                "retriever" : niconicoChannelRetriever,
            },
            "twitcasting" : {
                "url_regex" : /^https:\/\/twitcasting\.tv\/[-0-9A-Za-z_]+/gi,
                "retriever" : twitcastingRetriever,
                "target_display_columns": ["thumbnail_url", "title", "duration", "publishDate", "category", "viewCount", "comments"],
            },
            "twitter" : {
                "url_regex" : /^https:\/\/twitter\.com\/[-0-9A-Za-z_]+/gi,
                "retriever" : twitterRetriever,
                "target_display_columns": ["thumbnail_url", "title", "shortDescription", "publishDate", "type", "retweet_count", "favorite_count", "viewCount"],
            },
            "instagram" : {
                "url_regex" : /^https:\/\/www\.instagram\.com\/[-0-9A-Za-z_.]+/gi,
                "retriever" : instagramRetriever,
            },
            "tiktok" : {
                "url_regex" : /^https:\/\/www\.tiktok\.com\/@[-0-9A-Za-z_]+/gi,
                "retriever" : tiktokRetriever,
                "target_display_columns": ["thumbnail_url", "title", "duration", "publishDate", "viewCount", "comments"],
            },
            "bilibili" : {
                "url_regex" : /^https:\/\/space\.bilibili\.com\/[0-9]+/gi,
                "retriever" : bilibiliRetriever,
                "target_display_columns": ["thumbnail_url", "title", "duration", "category", "type", "publishDate", "viewCount", "comments"],
            },
        }
        
        if (document.getElementById(renderer.popup_elm_id) != null){
            if (document.getElementsByTagName("body")[0].style.cssText.includes("overflow: hidden;") == false){
                document.getElementsByTagName("body")[0].style.cssText = document.getElementsByTagName("body")[0].style.cssText + `overflow: hidden;`;
            }

            if (document.getElementById(renderer.popup_elm_id) != null){
                document.getElementById(renderer.popup_elm_id).style.cssText = document.getElementById(renderer.popup_elm_id).style.cssText.replace(" display: none;", "");
            }
            if (document.getElementById(renderer.popup_bg_elm_id) != null){
                document.getElementById(renderer.popup_bg_elm_id).style.cssText = document.getElementById(renderer.popup_bg_elm_id).style.cssText.replace(" display: none;", "");
            }
            if (document.getElementById(renderer.popup_style_id) != null){
                document.getElementById(renderer.popup_style_id).style.cssText = document.getElementById(renderer.popup_style_id).style.cssText.replace(" display: none;", "");
            }

        }else{
            video_list_raw = [];
            video_list_optimized = [];
            let target_service = null;
            for (let key in video_service_list){
                let s = video_service_list[key];
                if (location.href.toString().match(s.url_regex)){
                    target_service = s;
                    retriever_parameters.service_name = key;
                }
            }

            if (target_service != null){
                console.log("Detected media service : " + retriever_parameters.service_name)
            
                if ("target_search_columns" in target_service){
                    renderer.target_search_columns = target_service.target_search_columns;
                }

                await renderer.initialize();
                
                if ("target_display_columns" in target_service){
                    renderer.target_display_columns = target_service.target_display_columns;
                    renderer.reset_items();
                }

                await refresher.initialize(video_list_raw, video_list_optimized, renderer, "video_url", optimize_parameters);
                renderer.refresher = refresher;
    
                retriever_parameters.retriever = target_service.retriever;
                const initialize_result = await target_service.retriever.initialize(location.href, refresher, renderer.messenger);
                if(initialize_result){
                    target_service.retriever.retrieve(retriever_parameters);
                }
            }else{
                await renderer.initialize();
                renderer.messenger.danger("There're no expected media page.", 10000)
            }
        }

        
        async function scrollToPageBottom(_window = window, res = {}, stop_all = null){

            res["status"] = false;

            let previous_scrollHeight = 0;
            const maximum_retry_duration = 5000; //msec
            const retry_interval = 500;
            let temp_retry_duration = 0;

            for (let i=0; i<1000; i++){
                const current_scrollHeight = _window.document.documentElement.scrollHeight;
                console.log("previous_scrollHeight : " + previous_scrollHeight + ", current_scrollHeight : " + current_scrollHeight);
                console.log("stop? " + (previous_scrollHeight < current_scrollHeight));
                if (previous_scrollHeight < current_scrollHeight){
                    previous_scrollHeight = previous_scrollHeight + Math.floor(_window.document.documentElement.clientHeight / 2);
                    _window.scrollTo(0, previous_scrollHeight);
                    await sleep(retry_interval);
                }else{
                    if (temp_retry_duration < maximum_retry_duration){
                        temp_retry_duration = temp_retry_duration + retry_interval
                        await sleep(retry_interval);
                    }else{
                        console.log("quit the loop? " + (previous_scrollHeight < current_scrollHeight));
                        break;
                    }
                }

                if (stop_all != null && stop_all.status == true){
                    break;
                }
            }

            res["status"] = true;
            
            // _window.scrollTo(0, 0);
        }

        function iframeLoad(id, url, css = ""){
            return new Promise(resolve =>{
                if (document.getElementById(id) != null){
                    document.getElementById(id).remove();
                }

                _iframe = document.createElement("iframe");
                _iframe.setAttribute("id", id);
                _iframe.src = url;
                _iframe.style.cssText = css;
                _iframe.onload = function() { resolve(_iframe) };
                document.body.appendChild(_iframe);
            });
        }

        function sleep(time_msec){
            return new Promise(resolve =>{
                setTimeout(()=>{
                    resolve()
                }, time_msec);
            });
        }
        
        function trim(str){
            return str.toString().replaceAll(/^[ 　\t\n\r]+/g, "").replaceAll(/[ 　\t\n\r]+$/g, "");
        }

        function isNullOrEmpty(str){
            if (str == null || str == undefined || str == ""){
                return true;
            }else{
                return false;
            }
        }

        function clone(obj){
            return  JSON.parse(JSON.stringify(obj));
        }
        
        function contains(_arr, _val){
            if (Object.prototype.toString.call(_arr).match(/Array/)){
                for (let i of _arr){
                    if(i == _val){
                        return true;
                    }
                }
            }
            return false;
        }

        function convertColonTimeToSec(s){
            let res = 0;
            try{
                if (s.match(/^[0-9:]+$/)){
                    let arr = s.split(":");
                    if(arr.length > 2){
                        res = res + (Number(arr[0]) * 60 * 60);
                        res = res + (Number(arr[1]) * 60);
                        res = res + (Number(arr[2]));
                    }else{
                        res = res + (Number(arr[0]) * 60);
                        res = res + (Number(arr[1]));
                    }
                }
            }catch(e){
            }
            return res;
        }
        
        function convertSecToColonTime(i){
            if (Number.isInteger(i) == false){
                return null;
            }
            let sec = i % 60;
            let min = Math.floor(i/60) % 60;
            let hour = Math.floor(i/60/60);
            return hour + ":" + zeroFill(min) + ":" + zeroFill(sec);
        }
        
        function zeroFill(n, digit=2, char="0"){
            let s = "" + n;
            let res = s;
            for (let i=0; i< digit - s.length ; i++){
                res = char + res;
            }
            return res;
        }
        
        function formatNumberWithComma(num){
            if (num == null || num == undefined){
                return num;
            }

            if(typeof num !== 'number' || isFinite(num) == false || num < 0){
                return num;
            }

            let temp_num = Number(num);
            let res = [];
            while(temp_num != 0){
                if (Math.floor(temp_num / 1000) < 1){
                    res.push(temp_num % 1000);
                }else{
                    res.push(zeroFill(temp_num % 1000, 3));
                }
                temp_num = Math.floor(temp_num / 1000);
            }
            res.reverse();
            res_str = res.join(",")
            return res_str;
        }

        function println(obj){
            console.log(obj);
        }
        
        // node.src // to get the attribute
        // node.textContent;    // to get the text content
        function $(path, doc = document){
            try{
                return document.evaluate(path, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            }catch (e) {
                console.error(e)
                return "";
            }
        }
        
        function $$(path, doc = document){
            const iterator  = document.evaluate(path, doc, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
            let res = [];
            try {
                var thisNode = iterator.iterateNext();
                res.push(thisNode);
              
                while (thisNode) {
                    thisNode = iterator.iterateNext();
                    if(thisNode !== null){
                        res.push(thisNode);
                    }
                }
            }catch (e) {
                console.error( 'Error: Document tree modified during iteration ' + e );
            }
            return res;
        }

        function attr(node, key){
            if(key in node){
                return node[key];
            }else{
                return null;
            }
        }

        function customDateConverter(value){
            try{
                const match_en = value.match(/([0-9.]+)[ ]*([a-z]+)[ ]*ago$/);
                const match_ja = value.match(/([0-9.]+)[ ]*([秒分時間日週間か月年]+)[ ]*前/);
                if(match_en != null && match_en.length > 1){
                    const now = new Date();
                    let res = new Date();
                    if(match_en[2] != null && match_en[2].includes("second")){
                        res.setTime(now.getTime() - (Number(match_en[1]) * 1000));
                    }else if(match_en[2] != null && match_en[2].includes("minute")){
                        res.setTime(now.getTime() - (Number(match_en[1]) * 60 * 1000));
                    }else if(match_en[2] != null && match_en[2].includes("hour")){
                        res.setTime(now.getTime() - (Number(match_en[1]) * 60 * 60 * 1000));
                    }else if(match_en[2] != null && match_en[2].includes("day")){
                        res.setTime(now.getTime() - (Number(match_en[1]) * 24 * 60 * 60 * 1000));
                    }else if(match_en[2] != null && match_en[2].includes("week")){
                        res.setTime(now.getTime() - (Number(match_en[1]) * 7 * 24 * 60 * 60 * 1000));
                    }else if(match_en[2] != null && match_en[2].includes("month")){
                        res.setTime(now.getTime() - (Number(match_en[1]) * 30 * 24 * 60 * 60 * 1000));
                    }else if(match_en[2] != null && match_en[2].includes("year")){
                        res.setTime(now.getTime() - (Number(match_en[1]) * 365 * 24 * 60 * 60 * 1000));
                    }
                    return res;
                }else if(match_ja != null && match_ja.length > 1){
                    const now = new Date();
                    let res = new Date();
                    if(match_ja[2] != null && match_ja[2].includes("秒")){
                        res.setTime(now.getTime() - (Number(match_ja[1]) * 1000));
                    }else if(match_ja[2] != null && match_ja[2].includes("分")){
                        res.setTime(now.getTime() - (Number(match_ja[1]) * 60 * 1000));
                    }else if(match_ja[2] != null && match_ja[2].includes("時間")){
                        res.setTime(now.getTime() - (Number(match_ja[1]) * 60 * 60 * 1000));
                    }else if(match_ja[2] != null && match_ja[2].includes("日")){
                        res.setTime(now.getTime() - (Number(match_ja[1]) * 24 * 60 * 60 * 1000));
                    }else if(match_ja[2] != null && match_ja[2].includes("週間")){
                        res.setTime(now.getTime() - (Number(match_ja[1]) * 7 * 24 * 60 * 60 * 1000));
                    }else if(match_ja[2] != null && match_ja[2].includes("か月")){
                        res.setTime(now.getTime() - (Number(match_ja[1]) * 30 * 24 * 60 * 60 * 1000));
                    }else if(match_ja[2] != null && match_ja[2].includes("年")){
                        res.setTime(now.getTime() - (Number(match_ja[1]) * 365 * 24 * 60 * 60 * 1000));
                    }
                    return res;
                }else{
                    return new Date(value);
                }
            }catch (e){
                return new Date()
            }
        }

        function customNumberConverter(value){
            if (value == null || value == undefined){
                return value;
            }

            value = trim(value.toString().replaceAll(/[^0-9KMGT百千万億]/g, ""));
            const match_en = value.match(/^([0-9.]+)[ ]*([A-Za-z]{0,1})[ ]*$/);
            const match_ja = value.match(/^([0-9.]+)([百千万億]{0,1})/);
            if(match_en != null && match_en.length > 1){
                if(match_en[2] != ""){
                    let total = Number(match_en[1]) * Number(match_en[2].toUpperCase().replace("K", "1000").replace("M", "1000000").replace("B", "1000000000"));
                    value = Math.round(total);
                }else{
                    value = match_en[1];
                }
            }else if(match_ja != null && match_ja.length > 1){
                if(match_ja[2] != ""){
                    let total = Number(match_ja[1]) * Number(match_ja[2].replace("百", "100").replace("千", "1000").replace("万", "10000").replace("億", "100000000"));
                    value = Math.round(total);
                }else{
                    value = match_ja[1];
                }
            }
            return value;
        }

        function tryNestedObj(rootObj, nestedPathStringArray = [], returnIfError = undefined){
            if ((typeof nestedPathStringArray) == "string"){
                nestedPathStringArray = [nestedPathStringArray];
            }

            for (const str of nestedPathStringArray){
                try{
                    let current_obj = rootObj;
                    for (const it of str.replaceAll(/(\[[0-9]+\])/g, ".$1").split(".")){
                        let key = (it.match(/^\[([0-9]+)\]$/))? Number(it.match(/^\[([0-9]+)\]$/)[1]) : it;
                        current_obj = current_obj[key]
                    }
                    if (current_obj != null && current_obj != undefined){
                        return current_obj;
                    }
                }catch(e){
                    // console.warn(e)
                }
            }
            console.warn(JSON.stringify(nestedPathStringArray) + " was not found in")
            console.warn(rootObj)
            return returnIfError;
        }

        function unescapeEmbeddedJsonString(str){
            let res = str;
            if (typeof str == 'string' && str.match(/^'\\x7b+/)){
                res = decodeURIComponent(str.match(/^[^']*'(.+?)'[^']*$/)[1].replaceAll("%", "%25").replaceAll(/(\\x)([0-9a-z]{2})/g, "%$2")).replaceAll("\\\\", "\\");
            }
            return res;
        }

        async function digestMessage(message, algorithm = "SHA-1") {
            const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
            const hashBuffer = await crypto.subtle.digest(algorithm, msgUint8);           // hash the message
            const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
            const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
            return hashHex;
            // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
        }
    }
)();