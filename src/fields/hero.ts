import type { Field } from 'payload/types'

import linkGroup from './linkGroup'
import richText from './richText'
import label from './richText/label'
import largeBody from './richText/largeBody'

export const hero: Field = {
	name: 'hero',
	label: false,
	type: 'group',
	interfaceName: 'Hero',
	fields: [
		{
			type: 'select',
			name: 'type',
			label: 'Type',
			required: true,
			defaultValue: 'highImpact',
			options: [
				{
					label: 'None',
					value: 'none',
				},
				{
					label: 'High Impact',
					value: 'highImpact',
				},
				{
					label: 'Medium Impact',
					value: 'mediumImpact',
				},
				{
					label: 'Low Impact',
					value: 'lowImpact',
				},
			],
		},
		richText(),
		linkGroup({
			overrides: {
				maxRows: 2,
			},
		}),
		{
			name: 'media',
			type: 'upload',
			relationTo: 'media',
			required: true,
			admin: {
				condition: (_, { type } = {}) =>
					['highImpact', 'mediumImpact'].includes(type),
			},
		},
	],
}

export default hero
