import { copyEntry, getDestDirectoryEntry, getEntry, moveEntry } from './entry'
import type { IFileMoveFlags } from './types'

/**
 * 移动路径
 *
 * @param parent 父文件夹操作对象
 * @param src 源路径
 * @param dest 目标路径
 * @param flag 操作配置
 * @returns
 */
export const move = async (
  parent: PlusIoDirectoryEntry,
  src: string,
  dest: string,
  flag?: IFileMoveFlags
) => {
  const srcEntry = await getEntry(parent, src)
  const destDirectoryEntry = await getDestDirectoryEntry(
    parent,
    srcEntry,
    dest,
    flag
  )
  return moveEntry(srcEntry, destDirectoryEntry)
}

/**
 * 复制路径
 *
 * @param parent 父文件夹操作对象
 * @param src 源路径
 * @param dest 目标路径
 * @param flag 操作配置
 * @returns
 */
export const copy = async (
  parent: PlusIoDirectoryEntry,
  src: string,
  dest: string,
  flag?: IFileMoveFlags
) => {
  const srcEntry = await getEntry(parent, src)
  const destDirectoryEntry = await getDestDirectoryEntry(
    parent,
    srcEntry,
    dest,
    flag
  )
  return copyEntry(srcEntry, destDirectoryEntry)
}
