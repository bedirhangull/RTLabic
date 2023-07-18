import * as vscode from "vscode";

export function getModifiedText(selected: string) {
  // Create a regular expression that matches the CSS class names that we want to modify. You can add bootstrap classes or other css frameworks.
  const regex = /(mr|pr|ml|pl|left|right|text)-(\d+|auto|left|right)/g;

  // ToDo(move rules to json file)
  const replacements: Record<
    string,
    string | { left: string; default: string }
  > = {
    right: "ltr:left",
    left: "rtl:right",
    textleft: "rtl:text-right",
    textright: "ltr:text-left",
    mlauto: "rtl:mr-auto",
    mrauto: "ltr:ml-auto",
    pl: "rtl:pr",
    pr: "ltr:pl",
    ml: "rtl:mr",
    mr: "ltr:ml",
  };

  return selected.replace(regex, (match, prefix, value) => {
    if (prefix + value == "textright") {
      return prefix + "-" + value + " " + "ltr" + ":" + prefix + "-left";
    } else if (prefix + value == "textleft") {
      return prefix + "-" + value + " " + "rtl" + ":" + prefix + "-right";
    } else {
      const replacement = replacements[prefix] || replacements[prefix + value];
      return prefix + "-" + value + " " + replacement + "-" + value;
    }
  });
}

export function replaceClassNames() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const document = editor.document;
    editor.edit((editBuilder) => {
      editor.selections.forEach((sel) => {
        const range = sel.isEmpty
          ? document.getWordRangeAtPosition(sel.start) || sel
          : sel;
        const selected = document.getText(range);
        const modified = getModifiedText(selected);
        editBuilder.replace(range, modified);
      });
    });
  }
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("rtlabic.generate", replaceClassNames)
  );
}
