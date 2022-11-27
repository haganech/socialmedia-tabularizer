
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

export { CosignSimilarity, NgramTokenizer };

// let ngramTokenizer = new NgramTokenizer([...Array(1).keys()].map(i => ++i), []);
// let s = [
//     "The match() method retrieves the result ",
//     "of matching a string against a regular expression."
// ]
// ngramTokenizer.initialize(s)
// console.log((new CosignSimilarity()).compare("ライヴラリ", "ライヴラ", 2))

// let s1 = "test"
// let s2 = "testaaa    "
// let s3 = "abcdtttttttttttttttttt    "
// ngramTokenizer.initialize([s1, s2])
// console.log(ngramTokenizer.embed(s3))
// let c = new CosignSimilarity();
// console.log(c.cosign(ngramTokenizer.embed(s1), ngramTokenizer.embed(s2)))