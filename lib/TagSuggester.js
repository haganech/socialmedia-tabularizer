import { CosignSimilarity, NgramTokenizer } from './CosignSimilarity.js';

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

export { TagSuggester };

// import * as fs from "node:fs";
// let text = fs.readFileSync("./test/test.txt", 'utf8');
// const res = (new TagSuggester()).suggest(text.replaceAll("\r", "").split("\n"))
// res.map(a => {console.log(a.key + " " + a.score); });
// console.log(res);