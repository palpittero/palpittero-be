import * as Magic from '@magic-sdk/admin'

const magic = new Magic.Magic(process.env.WEDDING_QUIZ_MAGIC_PUBLISHABLE_KEY)

export default magic
