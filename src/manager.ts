import { createDirectory, readDirectory, removeDirectory } from './directory'
import {
  getDirectoryEntry,
  getEntry,
  getFileEntry,
  getFileRootEntry
} from './entry'
import { copyFile, moveFile, readFile, removeFile, writeFile } from './file'
import { copy, move } from './path'
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
     * 获取文件 / 文件夹操作对象
     *
     * @param path 路径
     * @returns
     */
    getEntry: handler(getEntry),
    /**
     * 获取文件操作对象
     *
     * @param path 路径
     * @param flag 操作配置
     * @returns
     */
    getFileEntry: handler(getFileEntry),
    /**
     * 获取文件夹操作对象
     *
     * @param path 路径
     * @param flag 操作配置
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
     * 删除文件
     *
     * @param path 路径
     * @param flag 操作配置
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
     * 删除文件夹
     *
     * @param path 路径
     * @param flag 操作配置
     * @returns
     */
    removeDirectory: handler(removeDirectory),
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
     * 移动路径
     * @param src 源路径
     * @param dest 目标路径
     * @param flag 操作配置
     */
    move: handler(move),
    /**
     * 移动路径
     * @param src 源路径
     * @param dest 目标路径
     * @param flag 操作配置
     */
    copy: handler(copy)
  }
}
