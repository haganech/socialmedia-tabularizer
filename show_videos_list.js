javascript:(
    function(){
        let parseDateViewAndTimeFormat = false;
        let sort_key = "Posted";
        let sort_order = "desc";
        const iter_target_xpath = '//*[@id="contents"]//ytd-grid-video-renderer';
        let label_xpaths = {
            "Title" : './/a[@id="video-title"]/@title',
            "href" : './/a[@id="video-title"]/@href',
            "Time" : './/ytd-thumbnail-overlay-time-status-renderer/span',
            "Views" : './/*[@id="metadata-line"]/span[1]',
            "Posted" : './/*[@id="metadata-line"]/span[2]',
            "Streamed" : './/*[@id="metadata-line"]/span[2]',
            "Closed Caption" : './/*[@id="video-badges"]//span[contains(text(), "CC") or contains(text(), "字幕")]',
        }

        let retrieved_list = retrieve(iter_target_xpath, label_xpaths);
        render(retrieved_list, label_xpaths, parseDateViewAndTimeFormat, sort_key, sort_order);


        function render(list, label_xpaths, _parseDateViewAndTimeFormat, sort_key, sort_order){
            const body = document.getElementsByTagName("body")[0];

            if (document.getElementById('temp_video_list') != null){
                document.getElementById('temp_video_list').remove();
            }
    
            let textarea = document.createElement('div');
            textarea.setAttribute("id", "temp_video_list");
            textarea.style.cssText  = `
                z-index: 5000;
                font-size: 12px;
                position:absolute;
                top:70px;
                left:100px;
                background-color: rgb(250,250,245);
                border-radius:0.5em; 
                opacity:95%;
                border: solid 0.2em #888;
                padding: 0.5em;
                z-index: 5000;
            `;
    
            let close_button = document.createElement('button');
            close_button.onclick = function (event){
                document.getElementById('temp_video_list').remove();
            }
            close_button.innerHTML = "Close"
            textarea.appendChild(close_button);
            
            if (_parseDateViewAndTimeFormat == false){
                let parse_number_button = document.createElement('button');
                parse_number_button.onclick = function (event){
                    render(list, label_xpaths, true, sort_key, sort_order);
                }
                parse_number_button.innerHTML = "Parse number and date"
                textarea.appendChild(parse_number_button);
            }else{
                let parse_number_button = document.createElement('button');
                parse_number_button.onclick = function (event){
                    render(list, label_xpaths, false, sort_key, sort_order);
                }
                parse_number_button.innerHTML = "Raw text"
                textarea.appendChild(parse_number_button);
            }
    
            let table = document.createElement('table');
            table.style.cssText  = `
                border-collapse: collapse;
                color: #111;
            `;

            let tr_header = document.createElement('tr');
            for (const x in label_xpaths){
                let th = document.createElement('th');
                th.innerHTML = `${x} `;

                let span_sort_asc = document.createElement('span');
                span_sort_asc.style.cssText  = `
                    cursor: pointer;
                    color: ${(sort_key == x && sort_order == "asc")? "#111" : "#BBB"};
                `;
                span_sort_asc.innerHTML = `▴`;
                span_sort_asc.onclick = function(){
                    apply_sort(list, x, "asc");
                    render(list, label_xpaths, _parseDateViewAndTimeFormat, x, "asc");
                }
                th.appendChild(span_sort_asc);

                let span_sort_desc = document.createElement('span');
                span_sort_desc.style.cssText  = `
                    cursor: pointer;
                    color: ${(sort_key == x && sort_order == "desc")? "#111" : "#BBB"};
                `;
                span_sort_desc.innerHTML = `▾`;
                span_sort_desc.onclick = function(){
                    apply_sort(list, x, "desc");
                    render(list, label_xpaths, _parseDateViewAndTimeFormat, x, "desc");
                }
                th.appendChild(span_sort_desc);

                tr_header.appendChild(th);
            }
            table.appendChild(tr_header)
    
            for(const node of list){
                let tr = document.createElement('tr');
                for (const key in label_xpaths){
                    let value = "";
                    if (key === "href"){
                        value = `<a href="${node["url"]}" target="_blank">${node["url"]}</a>`;
                    }else if(key == "Streamed"){
                        if(node["Streamed"] == "LIVE"){
                            value = "<b style='color: #E55;'>LIVE</b>";
                        }else{
                            value = node[key];
                        }
                    }else{
                        if (_parseDateViewAndTimeFormat == true && ((key + "-sort") in node) ) {
                            value = node[key + "-sort"];
                        }else{
                            value = node[key];
                        }
                    }
                    
                    tr.innerHTML += `<td>${value}</td>`;
                }
                table.appendChild(tr);
            }

            textarea.appendChild(table);
            body.appendChild(textarea);
    
            /***  Adjusting look and feel by CSS  ***/
            // Table header
            for(const elm of document.querySelectorAll('#temp_video_list th')){
                elm.style.cssText  = `
                    padding: 3px;
                    background-color: rgb(250,250,245);
                `;
            }
    
            // Table rows
            let row = 0;
            for(const elm of document.querySelectorAll('#temp_video_list tr')){
                elm.style.cssText  = `
                    background-color:${ (row % 2 == 1)? "rgb(240,240,220);" : "rgb(220,220,200);"};
                `;
                row = row + 1;
            }
            for(const elm of document.querySelectorAll('#temp_video_list td')){
                elm.style.cssText  = `
                    border-style: solid dotted;
                    border-width: 1px;
                    border-color: #888;
                    padding: 4px;
                    max-width: 600px;
                `;
            }
        }
        

        function retrieve(iter_target_xpath, label_xpaths){
            let res_array = [];
            let index = 0;
            for(const node of $$(iter_target_xpath)){
                let row_map = {};
                row_map["index-sort"] = index;
                for (const key in label_xpaths){
                    let value = $(label_xpaths[key], node);
                    if (key === "href"){
                        // Get absolute path
                        row_map["url"] = (new URL($(label_xpaths[key], node), location.href)).href;
                    }else if(key == "Streamed"){
                        if($(label_xpaths["Views"], node).match(/(watching|視聴中)/)){
                            value = "<b style='color: #E55;'>LIVE</b>";
                        }else{
                            value = (value.match(/(Streamed|配信済み)/))? "Yes" : "";
                        }
                    }else if(key == "Closed Caption"){
                        if(value != ''){
                            value = "Yes";
                        }
                    }
    
                    row_map[key] = value;

                    /*** Add converted value for sorting ***/
                    if(key == "Time"){
                        if (value.match(/(LIVE|ライブ)/)){
                            value = "LIVE";
                        }else{
                            let a = value.split(':')
                            let total = 0;
                            for (let c = 0 ; c < a.length; c++ ){
                                total += Number(a[c]) * (60 ** (a.length - 1 - c));
                            }
                            row_map[key + "-sort"] = total;
                        }
                    }else if (key == "Views"){
                        const match_en = value.match(/^([0-9.]+)([A-Z]{0,1}) (views|watching)$/);
                        const match_ja = value.match(/^([0-9.]+)([万億]{0,1}) (回視聴|人が視聴中)$/);
                        if(match_en != null && match_en.length > 1){
                            if(match_en[2] != ""){
                                let total = match_en[1] * match_en[2].replace("K", "1000").replace("M", "1000000").replace("B", "1000000000");
                                value = total;
                            }else{
                                value = match_en[1];
                            }
                        }else if(match_ja != null && match_ja.length > 1){
                            if(match_ja[2] != ""){
                                let total = match_ja[1] * match_ja[2].replace("万", "10000").replace("億", "100000000");
                                value = total;
                            }else{
                                value = match_ja[1];
                            }
                        }
                        row_map[key + "-sort"] = value;

                    }else if (key == "Posted"){
                        const match_en = value.match(/([0-9.]+) ([a-z]+) ago$/);
                        const match_ja = value.match(/([0-9.]+) ([秒分時間日週間か月年]+)前/);
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
                            value = res.toISOString();
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
                            value = res.toISOString();
                        }
                        
                        row_map[key + "-sort"] = value;
                    }
                }
                res_array.push(row_map);
                index = index + 1;
            }

            return res_array;
        }

        function apply_sort(list, key, order='asc'){
            if (key == "Posted"){
                key = "index";
                order = (order == "asc")? "desc": "asc";
            }
            if (list.length > 0 && (key + "-sort") in list[0]){
                key = key + "-sort";
            }

            if(key.includes("Time") || key.includes("Views") || key.includes("index")){
                /* Number format sorting */
                if(order == 'asc'){
                    list.sort((a, b) => { return Number(a[key]) - Number(b[key]) });
                }else{
                    list.sort((a, b) => { return Number(b[key]) - Number(a[key]) });
                }
            }else{
                /* String format sorting */
                if(order == 'asc'){
                    list.sort((a, b) => { 
                        if(a[key].toUpperCase() > b[key].toUpperCase()){
                            return 1;
                        }else if(a[key].toUpperCase() < b[key].toUpperCase()){
                            return -1;
                        }else{
                            return 0;
                        }
                    });
                }else{
                    list.sort((a, b) => { 
                        if(a[key].toUpperCase() < b[key].toUpperCase()){
                            return 1;
                        }else if(a[key].toUpperCase() > b[key].toUpperCase()){
                            return -1;
                        }else{
                            return 0;
                        }
                    });
                }
            }
        }

        function $(path, doc = document){
            try{
                return document.evaluate(path, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;
            }catch (e) {
                // console.log(e)
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
                    // alert( thisNode.textContent );
                    // console.log( thisNode.textContent );
                    if(thisNode !== null){
                        res.push(thisNode);
                    }
                }
            }catch (e) {
                console.log( 'Error: Document tree modified during iteration ' + e );
            }
            return res;
        }
    }
)();