// @ts-nocheck
import EditorJS, { type OutputData } from '@editorjs/editorjs'
import Underline from '@editorjs/underline'
import Strikethrough from '@sotaproject/strikethrough'
import ChangeCase from 'editorjs-change-case'
import FontSize from 'editorjs-inline-font-size-tool'

export function createEditor(editorId: string, data?: OutputData | null) {
	const editor = new EditorJS({
		holder: editorId,
		tools: {
			underline: Underline,
			strikethrough: Strikethrough,
			changeCase: ChangeCase,
			fontSize: FontSize,
		},
		inlineToolbar: ['bold', 'italic', 'underline', 'strikethrough', 'changeCase', 'fontSize'],
		autofocus: true,
		data,
	})

	return editor
}
