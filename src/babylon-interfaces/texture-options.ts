import { ITextureCreationOptions } from '@babylonjs/core'

export type TextureOptions = Partial<Pick<ITextureCreationOptions,
  'noMipmap' |
  'invertY' |
  'samplingMode' |
  'format' |
  'loaderOptions' |
  'creationFlags' |
  'useSRGBBuffer' |
  'internalTexture' |
  'gammaSpace'
>>
