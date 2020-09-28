import { escapeHtml } from "./md-base";
// containers
// ref: https://github.com/markdown-it/markdown-it-container

// ::: details Detail
//   summary comes here
// :::
export const mdContainerDetails = {
  validate(params: string) {
    return params.trim().match(/^details\s+(.*)$/);
  },
  render(tokens: any[], idx: number) {
    const m = tokens[idx].info.trim().match(/^details\s+(.*)$/);
    if (tokens[idx].nesting === 1) {
      // opening tag
      return `<details><summary>${escapeHtml(
        m[1]
      )}</summary><div class="details-content">`;
    }
    // closing tag
    return "</div></details>\n";
  },
};
// ::: message alert
//   text
// :::
export const mdContainerMessage = {
  validate(params: string) {
    return params.trim().match(/^message\s*(.*)$/);
  },
  render(tokens: any[], idx: number) {
    const m = tokens[idx].info.trim().match(/^message\s*(.*)$/);
    if (tokens[idx].nesting === 1) {
      // opening tag
      return `<div class="msg ${escapeHtml(m[1])}">`;
    }
    // closing tag
    return "</div>\n";
  },
};
