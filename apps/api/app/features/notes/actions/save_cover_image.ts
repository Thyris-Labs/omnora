import { err, ok, type Result } from '#shared/errors'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import drive from '@adonisjs/drive/services/main'
import { readFile } from 'node:fs/promises'
import sharp from 'sharp'

export type SaveCoverError = 'ERR_INVALID_EXTENSION' | 'ERR_SAVE_COVER_FAILED'

const COVER_HEIGHT = 500
const COVER_WIDTH = 1500
const COVER_QUALITY = 80

export default class SaveAvatarImageAction {
  async execute(file: MultipartFile): Promise<Result<string, SaveCoverError>> {
    const ext = this.#getFileExtension(file)
    if (ext === '')
      return err('ERR_INVALID_EXTENSION', 'No valid extension was found for this file.')

    const baseKey = crypto.randomUUID()
    const ogKey = `${baseKey}_og.${ext}`
    const optimizedKey = `${baseKey}.avif`

    const disk = drive.use('s3')

    try {
      const originalBuffer = await readFile(file.tmpPath!)
      const optimizedBuffer = await sharp(originalBuffer)
        .resize({
          width: COVER_WIDTH,
          height: COVER_HEIGHT,
          fit: 'cover',
          withoutEnlargement: true,
        })
        .avif({ quality: COVER_QUALITY })
        .toBuffer()

      await Promise.all([
        disk.put(ogKey, originalBuffer, { contentType: file.headers['content-type'] }),
        disk.put(optimizedKey, optimizedBuffer, { contentType: 'image/avif' }),
      ])
      const url = await disk.getUrl(optimizedKey)

      return ok(url)
    } catch {
      await Promise.allSettled([disk.delete(ogKey), disk.delete(optimizedKey)])

      return err('ERR_SAVE_COVER_FAILED', "We couldn't save your cover. Please try again.")
    }
  }

  #getFileExtension(file: MultipartFile) {
    return file.extname?.toLowerCase().replace('.', '') ?? ''
  }
}
