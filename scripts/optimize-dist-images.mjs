import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const distDir = path.resolve('docs/.vitepress/dist')
const supportedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp'])

async function walk(directoryPath) {
	const entries = await readdir(directoryPath, { withFileTypes: true })
	const paths = await Promise.all(
		entries.map(async (entry) => {
			const fullPath = path.join(directoryPath, entry.name)
			if (entry.isDirectory()) {
				return walk(fullPath)
			}
			return fullPath
		})
	)
	return paths.flat()
}

function optimizeByExtension(image, extension) {
	switch (extension) {
		case '.jpg':
		case '.jpeg':
			return image.jpeg({ quality: 82, mozjpeg: true })
		case '.png':
			return image.png({ quality: 85, compressionLevel: 9, palette: true })
		case '.webp':
			return image.webp({ quality: 82 })
		default:
			return image
	}
}

async function optimizeFile(filePath) {
	const extension = path.extname(filePath).toLowerCase()
	if (!supportedExtensions.has(extension)) {
		return { optimized: false, reduced: 0 }
	}

	const originalBuffer = await readFile(filePath)
	const optimizedBuffer = await optimizeByExtension(sharp(originalBuffer), extension).toBuffer()

	if (optimizedBuffer.length >= originalBuffer.length) {
		return { optimized: false, reduced: 0 }
	}

	await writeFile(filePath, optimizedBuffer)
	return { optimized: true, reduced: originalBuffer.length - optimizedBuffer.length }
}

async function run() {
	const distStats = await stat(distDir).catch(() => null)
	if (!distStats || !distStats.isDirectory()) {
		console.log('[image-opt] dist directory not found, skipped')
		return
	}

	const allPaths = await walk(distDir)
	const targetFiles = allPaths.filter((filePath) => supportedExtensions.has(path.extname(filePath).toLowerCase()))

	let optimizedCount = 0
	let reducedTotal = 0

	for (const filePath of targetFiles) {
		const result = await optimizeFile(filePath)
		if (result.optimized) {
			optimizedCount += 1
			reducedTotal += result.reduced
		}
	}

	const reducedKb = (reducedTotal / 1024).toFixed(1)
	console.log(`[image-opt] optimized ${optimizedCount}/${targetFiles.length} files, reduced ${reducedKb} KB`)
}

run().catch((error) => {
	console.error('[image-opt] failed', error)
	process.exitCode = 1
})
