import * as React from "react";
import { render } from "react-dom";
import "zenn-content-css";
import {
  loadScript,
  loadStylesheet,
} from "zenn-init-embed/lib/utils/load-external-source";
import pEvent from "p-event";
import Worker from "worker-loader!./worker";
import markdownToHtml from "zenn-markdown-html";
import { useProvider } from "../src/hooks";
import "../css/editor.css";
import { Editor } from "../src";
import markdown from "./markdown.txt";

loadStylesheet({
  id: "katex-css",
  href: "https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css",
});

const Main = () => {
  const [emit, Provider] = useProvider();
  const [value, setValue] = React.useState(markdown);
  const worker = React.useMemo(() => {
    const w = new Worker();
    return w;
  }, []);
  const handleValueChange = React.useCallback((newValue: string) => {
    setValue(newValue);
  }, []);
  const handleYouTubeClick = React.useCallback(() => {
    emit({
      type: "insert",
      text: "@[youtube](ApXoWvfEYVU)",
    });
  }, []);
  const handleTwitterClick = React.useCallback(() => {
    emit({
      type: "insert",
      text:
        "@[tweet](https://twitter.com/catnose99/status/1309382877272879110)",
    });
  }, []);
  const handleImageUpload = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const uploadingMsg = "![](now uploading...)";
      emit({
        type: "insert",
        text: uploadingMsg,
      });
      await new Promise((resolve) => {
        setTimeout(() => resolve(), 1000);
      });
      emit({
        type: "replace",
        targetText: uploadingMsg,
        text: "![](https://source.unsplash.com/1600x900/?nature,water)",
      });
    },
    []
  );

  const handleMarkdown = async (str: string) => {
    worker.postMessage(str);
    const e = await pEvent(worker, "message");
    return e.data;
  };

  // const handleMarkdown = async (str: string) => {
  //   return markdownToHtml(str);
  // };

  return (
    <Provider>
      <div className="tool">
        <button type="button" onClick={handleYouTubeClick}>
          YouTube挿入
        </button>
        <button type="button" onClick={handleTwitterClick}>
          Twitter挿入
        </button>
        <input type="file" onChange={handleImageUpload} />
      </div>
      <div className="demo">
        <Editor
          previewClassName="znc"
          previewCallback={{
            onBeforeNodeDiscarded(node: any) {
              if (
                node.closest &&
                !node.classList.contains("embed-tweet") &&
                node.closest(".embed-tweet")
              ) {
                if (
                  node.tagName === "IFRAME" ||
                  node.classList.contains("twitter-tweet")
                ) {
                  return false;
                }
              }
              return true;
            },
            onNodeAdded(node: any) {
              if (node.classList && node.classList.contains("embed-tweet")) {
                loadScript({
                  src: "https://platform.twitter.com/widgets.js",
                  id: "embed-tweet",
                  refreshIfExist: true,
                }).then(() => {
                  const znc = node.closest(".znc");
                  if (znc) {
                    const extraTweets = znc.querySelectorAll(
                      ".twitter-tweet + .twitter-tweet"
                    );
                    extraTweets.forEach((tweet) => tweet.remove());
                  }
                });
              }
            },
          }}
          value={value}
          onChange={handleValueChange}
          parser={handleMarkdown}
        />
      </div>
    </Provider>
  );
};

render(<Main />, document.getElementById("main"));
