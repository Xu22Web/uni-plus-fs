import { getDirectoryEntry, removeDirectoryEntry } from './entry'
import type { IDirectoryRemoveFlags, IFileRemoveFlags } from './types'

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
 * 删除文件夹
 *
 * @param parent 父文件夹操作对象
 * @param path 路径
 * @param flag 操作配置
 * @returns
 */
export const removeDirectory = async (
  parent: PlusIoDirectoryEntry,
  path: string,
  flag: IDirectoryRemoveFlags = {
    recursive: false,
    force: false
  }
) => {
  let directoryEntry: PlusIoDirectoryEntry | undefined
  try {
    directoryEntry = await getDirectoryEntry(parent, path)
  } catch (err: any) {
    if (flag.force) {
      return
    }
    throw err
  }
  return removeDirectoryEntry(directoryEntry, flag.recursive)
}
