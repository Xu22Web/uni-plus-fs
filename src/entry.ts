import type {
  IFileFlags,
  IFileFormat,
  IFileRootOptions,
  IFileRootType
} from './types'

/**
 * 获取文件系统对象
 *
 * @param type 文件根目录类型
 * @returns
 */
export const getFileSystemEntry = (type: IFileRootType) => {
  return new Promise<PlusIoDirectoryEntry>((resolve, reject) => {
    plus.io.requestFileSystem(
      type,
      (fs) => {
        if (!fs.root) {
          reject(new Error('get file system failed: root error'))
          return
        }
        resolve(fs.root)
      },
      (err) => reject(new Error(`get file root failed: ${err.message}`))
    )
  })
}

/**
 * 获取本地文件 / 文件夹操作对象
 *
 * @param path 路径
 * @returns
 */
export const getLocalEntry = async <
  T extends PlusIoFileEntry | PlusIoDirectoryEntry
>(
  path: string
) => {
  return new Promise<T>((resolve, reject) => {
    plus.io.resolveLocalFileSystemURL(
      path,
      (entry) => resolve(<T>entry),
      (err) => reject(new Error(`get local entry failed: ${err.message}`))
    )
  })
}

/**
 * 获取文件根目录操作对象
 *
 * @param options 配置
 * @returns
 */
export const getFileRootEntry = async (options: IFileRootOptions) => {
  if ('path' in options && options.path) {
    const entry = await getLocalEntry<PlusIoDirectoryEntry>(options.path)
    if (entry.isFile || !entry.isDirectory) {
      throw new Error(
        `get file root failed: ${options.path} is not a directory`
      )
    }
    return entry
  }
  if ('type' in options && options.type) {
    return getFileSystemEntry(options.type)
  }
  throw new Error(`get file root failed: type or path is required`)
}

/**
 * 获取父文件夹操作对象
 *
 * @param entry 文件 / 文件夹操作对象
 * @returns
 */
export const getParentEntry = async (
  entry: PlusIoFileEntry | PlusIoDirectoryEntry
) => {
  return new Promise<PlusIoDirectoryEntry>((resolve, reject) => {
    entry.getParent(resolve, (err) =>
      reject(new Error(`get parent entry failed: ${err.message}`))
    )
  })
}

/**
 * 获取文件操作对象信息
 *
 * @param entry 文件操作对象
 * @returns
 */
export const getFileEntryInfo = async (entry: PlusIoFileEntry) => {
  return new Promise<PlusIoMetadata>((resolve, reject) => {
    entry.getMetadata(resolve, (err) =>
      reject(new Error(`get entry info failed: ${err.message}`))
    )
  })
}

/**
 * 获取文件夹操作对象信息
 *
 * @param entry 文件夹操作对象
 * @param recursive 递归
 * @returns
 */
export const getDirectoryEntryInfo = async (
  entry: PlusIoDirectoryEntry,
  recursive?: boolean
) => {
  return new Promise<PlusIoMetadata>((resolve, reject) => {
    entry.getMetadata(
      resolve,
      (err) => reject(new Error(`get entry info failed: ${err.message}`)),
      recursive
    )
  })
}

/**
 * 读取文件操作对象
 *
 * @param fileEntry 文件操作对象
 * @param format 格式
 * @returns
 */
export const readFileEntry = async (
  fileEntry: PlusIoFileEntry,
  format: IFileFormat = 'text'
) => {
  const file = await getFile(fileEntry)
  return new Promise<string>((resolve, reject) => {
    const fileReader = new plus.io.FileReader()
    fileReader.onload = async () => {
      const data = fileReader.result
      if (!data) {
        reject(
          new Error('read file entry failed: fileReader.result is undefined')
        )
        return
      }
      resolve(data)
    }
    fileReader.onerror = () => {
      reject(new Error('read file entry failed: read error'))
    }
    if (format === 'text') {
      fileReader.readAsText(file)
      return
    }
    if (format === 'base64') {
      fileReader.readAsDataURL(file)
      return
    }
    reject(new Error('read file entry failed: unknown format'))
  })
}

/**
 * 写入文件操作对象
 *
 * @param fileEntry 文件操作对象
 * @param data 数据
 * @param format 格式
 * @returns
 */
export const writeFileEntry = async (
  fileEntry: PlusIoFileEntry,
  data: string,
  format: IFileFormat = 'text'
) => {
  return new Promise<void>((resolve, reject) => {
    fileEntry.createWriter(
      (writer) => {
        writer.onwrite = () => {
          resolve()
        }
        writer.onerror = () => {
          reject(new Error('write file entry failed: write error'))
        }
        if (format === 'text') {
          writer.write(data)
          return
        }
        if (format === 'base64') {
          const base64 = data.replace(/^data:.*;base64,/, '')
          writer.writeAsBinary(base64)
          return
        }
        reject(new Error('read file entry failed: unknown format'))
      },
      (err) => {
        reject(new Error(`write file entry failed: ${err.message}`))
      }
    )
  })
}

/**
 * 移动文件 / 文件夹操作对象
 *
 * @param srcEntry 源文件 / 文件夹操作对象
 * @param destEntry 目标文件 / 文件夹操作对象
 * @returns
 */
export const moveEntry = async (
  srcEntry: PlusIoFileEntry | PlusIoDirectoryEntry,
  destEntry: PlusIoDirectoryEntry
) => {
  return new Promise<void>((resolve, reject) => {
    srcEntry.moveTo(
      destEntry,
      undefined,
      () => resolve(),
      (err) => reject(new Error(`move entry failed: ${err.message}`))
    )
  })
}

/**
 * 复制文件 / 文件夹操作对象
 *
 * @param srcEntry 源文件 / 文件夹操作对象
 * @param destEntry 目标文件 / 文件夹操作对象
 * @returns
 */
export const copyEntry = async (
  srcEntry: PlusIoFileEntry | PlusIoDirectoryEntry,
  destEntry: PlusIoDirectoryEntry
) => {
  return new Promise<void>((resolve, reject) => {
    srcEntry.copyTo(
      destEntry,
      undefined,
      () => resolve(),
      (err) => reject(new Error(`copy entry failed: ${err.message}`))
    )
  })
}

/**
 * 删除文件操作对象
 *
 * @param entry 文件 / 文件夹操作对象
 * @returns
 */
export const removeFileEntry = async (entry: PlusIoFileEntry) => {
  return new Promise<void>((resolve, reject) => {
    entry.remove(
      () => resolve(),
      (err) => reject(new Error(`remove file entry failed: ${err.message}`))
    )
  })
}

/**
 * 递归删除文件夹操作对象
 *
 * @param directoryEntry 文件夹操作对象
 * @param recursive 递归
 * @returns
 */
export const removeDirectoryEntry = async (
  directoryEntry: PlusIoDirectoryEntry,
  recursive?: boolean
) => {
  return new Promise<void>((resolve, reject) => {
    if (recursive) {
      directoryEntry.removeRecursively(
        () => resolve(),
        (err) =>
          reject(new Error(`remove directory entry failed: ${err.message}`))
      )
      return
    }
    directoryEntry.remove(
      () => resolve(),
      (err) =>
        reject(new Error(`remove directory entry failed: ${err.message}`))
    )
  })
}

/**
 * 获取文件操作对象
 *
 * @param parent 父文件夹操作对象
 * @param path 路径
 * @param flag 操作配置
 * @returns
 */
export const getFileEntry = async (
  parent: PlusIoDirectoryEntry,
  path: string,
  flag: PlusIoFlags = { create: false, exclusive: false }
) => {
  return new Promise<PlusIoFileEntry>((resolve, reject) => {
    parent.getFile(path, flag, resolve, (err) =>
      reject(new Error(`get file entry failed: ${err.message}`))
    )
  })
}

/**
 * 获取文件夹操作对象
 *
 * @param parent 父文件夹操作对象
 * @param path 路径
 * @param flag 操作配置
 * @returns
 */
export const getDirectoryEntry = async (
  parent: PlusIoDirectoryEntry,
  path: string,
  flag: PlusIoFlags = { create: false, exclusive: false }
) => {
  return new Promise<PlusIoDirectoryEntry>((resolve, reject) => {
    parent.getDirectory(path, flag, resolve, (err) =>
      reject(new Error(`get directory entry failed: ${err.message}`))
    )
  })
}

/**
 * 获取文件
 *
 * @param fileEntry 文件操作对象
 * @returns
 */
export const getFile = async (fileEntry: PlusIoFileEntry) => {
  return new Promise<PlusIoFile>((resolve, reject) => {
    fileEntry.file(resolve, (err) =>
      reject(new Error(`get file failed: ${err.message}`))
    )
  })
}

/**
 * 获取目的操作对象
 *
 * @param parent 父文件夹操作对象
 * @param src 源路径
 * @param dest 目标路径
 * @param flag 操作配置
 */
export const getDestDirectoryEntry = async (
  parent: PlusIoDirectoryEntry,
  srcEntry: PlusIoFileEntry | PlusIoDirectoryEntry,
  dest: string,
  flag: IFileFlags = { create: false, exclusive: false, force: false }
) => {
  const destDirectoryEntry = await getDirectoryEntry(parent, dest, flag)
  // 未强制
  if (!flag.force) {
    return destDirectoryEntry
  }
  const destDirectory = destDirectoryEntry.toLocalURL()
  const destPath = `${destDirectory}${srcEntry.name}`
  let destEntry: PlusIoDirectoryEntry | PlusIoFileEntry | null = null
  try {
    destEntry = await getLocalEntry(destPath)
  } catch (err) {}
  // 不存在同名文件
  if (!destEntry) {
    return destDirectoryEntry
  }
  if (destEntry.isDirectory || !destEntry.isFile) {
    await removeDirectoryEntry(<PlusIoDirectoryEntry>destEntry, true)
  } else if (destEntry.isFile || !destEntry.isDirectory) {
    await removeFileEntry(<PlusIoFileEntry>destEntry)
  }
  return destDirectoryEntry
}
