import { GlobalConfig } from 'payload/types'
import { isAdmin } from '../access/isAdmin'

const Settings: GlobalConfig = {
	slug: 'settings',
	label: 'Settings',
	access: {
		read: () => true,
		readVersions: isAdmin,
		update: isAdmin,
	},
	fields: [
		{
			type: 'group',
			name: 'pageSettings',
			interfaceName: 'PageSettings',
			fields: [
				{
					name: 'newsPage',
					type: 'relationship',
					relationTo: 'pages',
					label: 'News page',
				},
				{
					name: 'projectsPage',
					type: 'relationship',
					relationTo: 'pages',
					label: 'Projects page',
				},
			],
		},
	],
}

export default Settings
