import {
  copyEntry,
  getDestDirectoryEntry,
  getFileEntry,
  moveEntry,
  readFileEntry,
  removeFileEntry,
  writeFileEntry
} from './entry'
import type {
  IFileCopyFlags,
  IFileFormat,
  IFileMoveFlags,
  IFileRemoveFlags,
  IFileWriteOptions
} from './types'
import { basename, dirname } from './utils/path'

/**
 * 写入文件
 *
 * @param parent 父文件夹操作对象
 * @param path 路径
 * @param data 数据
 * @param format 格式
 * @returns
 */
export const writeFile = async (
  parent: PlusIoDirectoryEntry,
  path: string,
  data: string,
  options: IFileFormat | IFileWriteOptions = 'text'
) => {
  const flag =
    typeof options === 'string'
      ? {
          create: true
        }
      : options
  const format = typeof options === 'string' ? options : options.format
  const fileEntry = await getFileEntry(parent, path, flag)
  await writeFileEntry(fileEntry, data, format)
  return fileEntry
}

/**
 * 读取文件
 *
 * @param parent 父文件夹操作对象
 * @param path 路径
 * @param format 格式
 * @returns
 */
export const readFile = async (
  parent: PlusIoDirectoryEntry,
  path: string,
  format: IFileFormat = 'text'
) => {
  const fileEntry = await getFileEntry(parent, path)
  return readFileEntry(fileEntry, format)
}

/**
 * 复制文件
 *
 * @param parent 父文件夹操作对象
 * @param src 源路径
 * @param dest 目标路径
 * @param flag 操作配置
 * @returns
 */
export const copyFile = async (
  parent: PlusIoDirectoryEntry,
  src: string,
  dest: string,
  flag?: IFileCopyFlags
) => {
  const srcFileEntry = await getFileEntry(parent, src)
  const destDirName = dirname(dest)
  const destFileName = basename(dest)
  const destDirectoryEntry = await getDestDirectoryEntry(
    parent,
    srcFileEntry,
    destDirName,
    flag
  )
  return copyEntry(srcFileEntry, destDirectoryEntry, destFileName)
}

/**
 * 移动文件
 *
 * @param parent 父文件夹操作对象
 * @param src 源路径
 * @param dest 目标路径
 * @param flag 操作配置
 * @returns
 */
export const moveFile = async (
  parent: PlusIoDirectoryEntry,
  src: string,
  dest: string,
  flag?: IFileMoveFlags
) => {
  const srcFileEntry = await getFileEntry(parent, src)
  const destDirName = dirname(dest)
  const destFileName = basename(dest)
  const destDirectoryEntry = await getDestDirectoryEntry(
    parent,
    srcFileEntry,
    destDirName,
    flag
  )
  return moveEntry(srcFileEntry, destDirectoryEntry, destFileName)
}

/**
 * 删除文件
 *
 * @param parent 父文件夹操作对象
 * @param path 路径
 * @returns
 */
export const removeFile = async (
  parent: PlusIoDirectoryEntry,
  path: string,
  flag: IFileRemoveFlags = {
    force: false
  }
) => {
  let fileEntry: PlusIoFileEntry | undefined
  try {
    fileEntry = await getFileEntry(parent, path)
  } catch (err) {
    if (flag.force) {
      return
    }
    throw err
  }
  return removeFileEntry(fileEntry)
}
