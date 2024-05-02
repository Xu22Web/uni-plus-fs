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
export interface IFileCreateFlags extends PlusIoFlags {
  /**
   * 是否覆盖现有文件或目录
   */
  force?: boolean
}

/**
 * 文件移动标志
 */
export interface IFileMoveFlags extends PlusIoFlags {
  /**
   * 是否覆盖现有文件或目录
   */
  force?: boolean
}

/**
 * 文件复制标志
 */
export interface IFileCopyFlags extends PlusIoFlags {
  /**
   * 是否覆盖现有文件或目录
   */
  force?: boolean
}

/**
 * 文件删除标志
 */
export interface IFileRemoveFlags {
  /**
   * 当为 true 时，如果 path 不存在，则异常将被忽略。默认值：false
   */
  force?: boolean
}

/**
 * 文件夹删除标志
 */
export interface IDirectoryRemoveFlags {
  /**
   * 是否递归删除目录及其所有子目录
   */
  recursive?: boolean
  /**
   * 当为 true 时，如果 path 不存在，则异常将被忽略。默认值：false
   */
  force?: boolean
}

/**
 * 文件写入标志
 */
export interface IFileWriteOptions extends PlusIoFlags {
  format?: IFileFormat
}
