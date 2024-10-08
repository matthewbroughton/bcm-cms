import type { AfterReadHook } from 'payload/dist/collections/config/types'

import { isAdmin } from '../access/isAdmin'
import { isAdminsOrPublished } from '../access/isAdminsOrPublished'

export const populateArchiveBlock: AfterReadHook = async ({
	doc,
	context,
	req,
}) => {
	// pre-populate the archive block if `populateBy` is `collection`
	// then hydrate it on your front-end
	const payload = req.payload
	const adminOrPublishedResult = await isAdminsOrPublished({ req: req })
	const adminOrPublishedQuery = adminOrPublishedResult

	const layoutWithArchive = await Promise.all(
		doc.layout.map(async (block) => {
			if (block.blockType === 'archive') {
				const archiveBlock = block as Extract<
					Page['layout'][0],
					{ blockType: 'archive' }
				> & {
					populatedDocs: Array<{
						relationTo: 'pages' | 'posts'
						value: string
					}>
				}

				if (
					archiveBlock.populateBy === 'collection' &&
					!context.isPopulatingArchiveBlock
				) {
					const res: { totalDocs: number; docs: Post[] } = await payload.find({
						collection: archiveBlock.relationTo,
						limit: archiveBlock.limit || 10,
						context: {
							isPopulatingArchiveBlock: true,
						},
						where: {
							...(archiveBlock?.categories?.length > 0
								? {
										categories: {
											in: archiveBlock.categories
												.map((cat) => {
													if (
														typeof cat === 'string' ||
														typeof cat === 'number'
													)
														return cat
													return cat.id
												})
												.join(','),
										},
									}
								: {}),
							...(typeof adminOrPublishedQuery === 'boolean'
								? {}
								: adminOrPublishedQuery),
						},
						sort: '-publishedAt',
					})

					return {
						...block,
						populatedDocsTotal: res.totalDocs,
						populatedDocs: res.docs.map((thisDoc: Post) => ({
							relationTo: archiveBlock.relationTo,
							value: thisDoc.id,
						})),
					}
				}
			}

			return block
		})
	)

	return {
		...doc,
		layout: layoutWithArchive,
	}
}
