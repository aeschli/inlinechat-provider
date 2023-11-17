// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "inlinechat-provider" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('inlinechat-provider.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from inlinechat-provider!');
	});

	context.subscriptions.push(disposable);
}

export class TestInteractiveEditorSessionProvider implements vscode.InteractiveEditorSessionProvider<TestInteractiveEditorSession, TestInteractiveEditorResponse>{
	prepareInteractiveEditorSession(context: vscode.TextDocumentContext, token: vscode.CancellationToken): vscode.ProviderResult<TestInteractiveEditorSession> {
		return new TestInteractiveEditorSession();
	}
	async provideInteractiveEditorResponse(session: TestInteractiveEditorSession, request: vscode.InteractiveEditorRequest, progress: vscode.Progress<vscode.InteractiveEditorProgressItem>, token: vscode.CancellationToken): Promise<TestInteractiveEditorResponse> {

		const text = [
		`The system message helps set the behavior of the assistant.`,
		`For example, you can modify the personality of the assistant`, 
		`or provide specific instructions about how it should behave throughout the conversation.`,
		`However note that the system message is optional and the model’s behavior without a system`,
		`message is likely to be similar to using a generic message such as "You are a helpful assistant.`,
		``,
		'```bash',
		'npm install -g @microsoft/botframework-cli',
		'```',
		`The user messages provide requests or comments for the assistant to respond to.`,
		`Assistant messages store previous assistant responses, but can also be written by you to give examples of desired behavior.`
		];
		await new Promise<void>((resolve, reject) => {
			let line = 0;
			const timer = setInterval(() => {
				progress.report({ content: text[line++] + '\n' });
				if (line >= text.length) {
					clearInterval(timer);
					resolve();
				}
			}, 1000);
		});
		return new TestInteractiveEditorResponse(new vscode.MarkdownString(text.join('\n')));
	}
	async provideFollowups?(session: TestInteractiveEditorSession, response: TestInteractiveEditorResponse, token: vscode.CancellationToken): Promise<vscode.InteractiveEditorReplyFollowup[] | undefined> {
		return undefined;
	}
}

vscode.interactive.registerInteractiveEditorSessionProvider(new TestInteractiveEditorSessionProvider());

export class TestInteractiveEditorSession implements vscode.InteractiveEditorSession {
	readonly placeholder = 'Hello there';
}

export class TestInteractiveEditorResponse implements vscode.InteractiveEditorMessageResponse {
	constructor(public readonly contents: vscode.MarkdownString) {

	}
}

// This method is called when your extension is deactivated
export function deactivate() {}
