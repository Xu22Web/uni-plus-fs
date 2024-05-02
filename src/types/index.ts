/**
 * 文件根目录类型
 */
export enum IFileRootType {
  PRIVATE_WWW = 1,
  PRIVATE_DOC,
  PUBLIC_DOCUMENTS,
  PUBLIC_DOWNLOADS
}

/**
 * 文件格式
 */
export type IFileFormat = 'text' | 'base64'

/**
 * 文件根目录路径配置
 */
export interface IFileRootOptionsPath {
  path: string
}

/**
 * 文件根目录类型配置
 */
export interface IFileRootOptionsType {
  type: IFileRootType
}

/**
 * 文件根目录配置
 */
export type IFileRootOptions = IFileRootOptionsPath | IFileRootOptionsType

/**
 * 文件创建标志
 */
export interface IFileFlags extends PlusIoFlags {
  /**
   * 是否覆盖现有文件或目录
   */
  force?: boolean
}

/**
 * 文件写入标志
 */
export interface IFileWriteOptions extends PlusIoFlags {
  format?: IFileFormat
}
