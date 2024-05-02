import {
  copyEntry,
  getDestDirectoryEntry,
  getDirectoryEntry,
  moveEntry,
  removeDirectoryEntry
} from './entry'
import type { IFileFlags } from './types'

/**
 * 创建文件夹
 *
 * @param parent 父文件夹操作对象
 * @param path 路径
 */
export const createDirectory = (parent: PlusIoDirectoryEntry, path: string) => {
  return getDirectoryEntry(parent, path, { create: true })
}

/**
 * 读取文件夹中的所有文件和子目录
 *
 * @param parent 父文件夹操作对象
 * @param path 路径
 * @returns
 */
export const readDirectory = async (
  parent: PlusIoDirectoryEntry,
  path: string
) => {
  const directoryEntry = await getDirectoryEntry(parent, path)
  const directoryReader = directoryEntry.createReader()
  return new Promise<(PlusIoFileEntry | PlusIoDirectoryEntry)[]>(
    (resolve, reject) => {
      directoryReader.readEntries(
        (entries: any) => {
          resolve(entries)
        },
        (err) => {
          reject(new Error(`read directory failed: ${err.message}`))
        }
      )
    }
  )
}

/**
 * 移动文件夹
 *
 * @param parent 父文件夹操作对象
 * @param src 源路径
 * @param dest 目标路径
 * @param flag 操作配置
 * @returns
 */
export const moveDirectory = async (
  parent: PlusIoDirectoryEntry,
  src: string,
  dest: string,
  flag: IFileFlags
) => {
  const srcDirectoryEntry = await getDirectoryEntry(parent, src)
  const destDirectoryEntry = await getDestDirectoryEntry(
    parent,
    srcDirectoryEntry,
    dest,
    flag
  )
  return moveEntry(srcDirectoryEntry, destDirectoryEntry)
}

/**
 * 复制文件夹
 *
 * @param parent 父文件夹操作对象
 * @param src 源路径
 * @param dest 目标路径
 * @param flag 操作配置
 * @returns
 */
export const copyDirectory = async (
  parent: PlusIoDirectoryEntry,
  src: string,
  dest: string,
  flag: IFileFlags
) => {
  const srcDirectoryEntry = await getDirectoryEntry(parent, src)
  const destDirectoryEntry = await getDestDirectoryEntry(
    parent,
    srcDirectoryEntry,
    dest,
    flag
  )
  return copyEntry(srcDirectoryEntry, destDirectoryEntry)
}

/**
 * 删除文件夹
 *
 * @param parent 父文件夹操作对象
 * @param path 路径
 * @param recursive 递归
 * @returns
 */
export const removeDirectory = async (
  parent: PlusIoDirectoryEntry,
  path: string,
  recursive?: boolean
) => {
  const directoryEntry = await getDirectoryEntry(parent, path)
  return removeDirectoryEntry(directoryEntry, recursive)
}
