import * as assert from 'assert';
import * as vscode from 'vscode';
import * as myExtension from '../../extension'; 

suite('Extension Test', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('getModifiedText test func', () => {
    const selected = 'text-left mr-auto';
    const expected = 'text-left rtl:text-right-left mr-auto ltr:ml-auto';
    const actual = myExtension.getModifiedText(selected);
    assert.strictEqual(actual, expected);
  });

  test('replaceClassNames test func', async () => {
	const document = await vscode.workspace.openTextDocument({
	  content: 'ltr:text-right rtl:mr-auto',
	});
	const editor = await vscode.window.showTextDocument(document);
	await vscode.commands.executeCommand('workbench.action.focusActiveEditorGroup');
	const selection = editor.selection;
	await vscode.commands.executeCommand('rtlabic.helloWorld');
	const modifiedText = document.getText();
	const expected = 'ltr:text-right rtl:mr-auto';
  	assert.strictEqual(modifiedText, expected);
  });
});
