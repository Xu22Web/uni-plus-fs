import {
  copyDirectory,
  createDirectory,
  moveDirectory,
  readDirectory,
  removeDirectory
} from './directory'
import { getDirectoryEntry, getFileEntry, getFileRootEntry } from './entry'
import { copyFile, moveFile, readFile, removeFile, writeFile } from './file'
import type { IFileRootOptions } from './types'

/**
 * 创建文件系统管理器
 *
 * @param options 配置
 * @returns
 */
export const createFileSystemManager = async (options: IFileRootOptions) => {
  const root = await getFileRootEntry(options)
  const handler =
    <T, K extends any[]>(
      callback: (parent: PlusIoDirectoryEntry, ...args: K) => T
    ) =>
    (...args: K) =>
      callback(root, ...args)
  return {
    /**
     * 获取文件操作对象
     *
     * @param path — 路径
     * @param flag — 操作配置
     * @returns
     */
    getFileEntry: handler(getFileEntry),
    /**
     * 获取文件夹操作对象
     *
     * @param path — 路径
     * @param flag — 操作配置
     * @returns
     */
    getDirectoryEntry: handler(getDirectoryEntry),
    /**
     * 读取文件
     *
     * @param path 路径
     * @param format 格式
     * @returns
     */
    readFile: handler(readFile),
    /**
     * 移动文件
     *
     * @param src 源路径
     * @param dest 目标路径
     * @param flag 操作配置
     * @returns
     */
    moveFile: handler(moveFile),
    /**
     * 移动文件
     *
     * @param src 源路径
     * @param dest 目标路径
     * @param flag 操作配置
     * @returns
     */
    copyFile: handler(copyFile),
    /**
     * 删除文件
     *
     * @param path 路径
     * @returns
     */
    removeFile: handler(removeFile),
    /**
     * 写入文件
     *
     * @param path 路径
     * @param data 数据
     * @param options 配置
     * @returns
     */
    writeFile: handler(writeFile),
    /**
     * 创建文件夹
     *
     * @param path 路径
     * @returns
     */
    createDirectory: handler(createDirectory),
    /**
     * 创建文件夹
     *
     * @param path 路径
     * @returns
     */
    readDirectory: handler(readDirectory),
    /**
     * 移动文件夹
     *
     * @param src 源路径
     * @param dest 目标路径
     * @param flag 操作配置
     * @returns
     */
    moveDirectory: handler(moveDirectory),
    /**
     * 移动文件夹
     *
     * @param src 源路径
     * @param dest 目标路径
     * @param flag 操作配置
     * @returns
     */
    copyDirectory: handler(copyDirectory),
    /**
     * 删除文件夹
     *
     * @param path 路径
     * @param recursive 递归
     * @returns
     */
    removeDirectory: handler(removeDirectory)
  }
}
