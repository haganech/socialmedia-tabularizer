# Social Media Tabularizer
Youtube等動画サイトのチャンネルのメディア一覧を、下のように簡素に一覧・ソートできるようにするブックマークレットです。  
![screenshot1.png](./img/screenshot1.png)
自分以外のYouTubeチャンネルで、下のようなことをしたいとき、効率が良くなります。

- 動画タイトル、再生数、Like数、コメント数等でフィルタ＆ソート
- 長いタイトルを省略せず一覧表示
- Ctrl+Fで全件を検索

多くのソーシャルメディアサイトでは、独善的なレコメンドエンジンに順序・一覧が制限され、チャンネル内検索すらできないことが多いため、可視性と検索性を高めるために一覧化ツールを作りました。

## 導入方法
[このページ](https://haganech.github.io/socialmedia-tabularizer/) のブックマークレットボタンを、お使いのブラウザのブックマークにドラッグアンドドロップします。

## 使い方
- 動画一覧を表示したいチャンネルのページをブラウザで表示する。
- ブックマークに登録したブックマークレットをクリックする。
- 一覧が表示されるまでしばらく待つ。

具体的な操作は、のちほど [こちら](https://www.youtube.com/@haganc) にアップされる動画を参照ください。

## 注意
- 英語と日本語以外の言語ページではテストしていません。
- 投稿日・再生回数は、一覧ページ上では概数のため、正確な値ではありません。

## カスタマイズ方法
このリポジトリ内の show_videos_list_api.js のコードをカスタマイズしたのち、[Closure Compiler Service](https://closure-compiler.appspot.com/) 等を使い、minified な表現にする必要があります。  
"<", ">", "&", ダブルクォーテーション の4つを、HTML内に記載するためのHTMLエスケープにかければ、ブラウザで直接起動可能なワンライナースクリプトになります。  
NodeJSで実行可能な、このリポジトリ内の convert_to_bookmarklet.js を参照のこと。

## 参考にさせて頂いた情報
- [Bookmarkletを作ろう(準備編） - Qiita](https://qiita.com/kanaxx/items/63debe502aacd73c3cb8)
- [Introduction to using XPath in JavaScript - XPath | MDN](https://developer.mozilla.org/en-US/docs/Web/XPath/Introduction_to_using_XPath_in_JavaScript)