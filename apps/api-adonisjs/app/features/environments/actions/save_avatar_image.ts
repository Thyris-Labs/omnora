import { err, ok, type Result } from '#shared/errors'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import drive from '@adonisjs/drive/services/main'
import { readFile } from 'node:fs/promises'
import sharp from 'sharp'

export type SaveAvatarError = 'ERR_INVALID_EXTENSION' | 'ERR_SAVE_AVATAR_FAILED'

const AVATAR_SIZE = 512
const AVATAR_QUALITY = 80

export default class SaveAvatarImageAction {
  async execute(file: MultipartFile): Promise<Result<string, SaveAvatarError>> {
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
          width: AVATAR_SIZE,
          height: AVATAR_SIZE,
          fit: 'cover',
          withoutEnlargement: true,
        })
        .avif({ quality: AVATAR_QUALITY })
        .toBuffer()

      await Promise.all([
        disk.put(ogKey, originalBuffer, { contentType: file.headers['content-type'] }),
        disk.put(optimizedKey, optimizedBuffer, { contentType: 'image/avif' }),
      ])
      const url = await disk.getUrl(optimizedKey)

      return ok(url)
    } catch {
      await Promise.allSettled([disk.delete(ogKey), disk.delete(optimizedKey)])

      return err('ERR_SAVE_AVATAR_FAILED', "We couldn't save your avatar. Please try again.")
    }
  }

  #getFileExtension(file: MultipartFile) {
    return file.extname?.toLowerCase().replace('.', '') ?? ''
  }
}
