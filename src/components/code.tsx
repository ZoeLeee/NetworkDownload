import React, { useEffect, useState } from "react";
import { TResource } from "../types";

import { Button } from "primereact/button";

import AceEditor from "react-ace";
import ace from "ace-builds/src-noconflict/ace";
import beautify from "ace-builds/src-noconflict/ext-beautify";

// 导入 Ace 编辑器的样式
import "ace-builds/src-noconflict/theme-monokai"; // 根据需要选择合适的主题
import "ace-builds/src-noconflict/mode-javascript"; // 根据需要选择合适的语言模式
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/ext-beautify";
import "ace-builds/src-noconflict/ext-searchbox";

type Props = {
  item: TResource;
};

const UNIQUE_ID_OF_EDITOR = "1";

export const Code = ({ item }: Props) => {
  const [code, setCode] = useState("");

  const formatCode = () => {
    let editor = ace.edit(UNIQUE_ID_OF_EDITOR); // 替换为你实际的 Ace Editor 实例的 ID

    beautify.beautify(editor.session);
  };

  useEffect(() => {
    fetch(item.url)
      .then((res) => res.text())
      .then((text) => {
        setCode(text);
      });
  }, [item.url]);

  return (
    <div className="w-full h-full relative">
      <AceEditor
        mode={item.resourceType} // 设置语言模式
        theme="monokai" // 设置主题
        name={UNIQUE_ID_OF_EDITOR} // 设置编辑器的唯一 ID
        //   editorProps={{ $blockScrolling: true }}
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={code}
        commands={beautify.commands}
        setOptions={{
          useWorker: false, // 禁用代码语法检查
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
        onChange={(newValue) => {
          //   console.log("Change:", newValue);
        }}
        style={{ width: "100%", height: "100%" }} // 设置编辑器的样式
      />
      <Button
        icon="pi pi-code"
        text
        rounded
        className="absolute bottom-2 left-2 z-[111]"
        onClick={formatCode}
      />
    </div>
  );
};
