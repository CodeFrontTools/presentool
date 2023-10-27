// @ts-nocheck
import EditorJS, { type OutputData } from '@editorjs/editorjs'
import NestedList from '@editorjs/nested-list'
import Underline from '@editorjs/underline'
import Strikethrough from '@sotaproject/strikethrough'
import ChangeCase from 'editorjs-change-case'

export function createEditor(editorId: string, data?: OutputData | null) {
	const editor = new EditorJS({
		holder: editorId,
		tools: {
			list: {
				class: NestedList,
				inlineToolbar: true,
				config: {
					defaultStyle: 'unordered',
				},
			},
			underline: Underline,
			strikethrough: Strikethrough,
			changeCase: ChangeCase,
		},
		inlineToolbar: ['bold', 'italic', 'underline', 'strikethrough', 'changeCase'],
		autofocus: true,
		data,
	})

	return editor
}
