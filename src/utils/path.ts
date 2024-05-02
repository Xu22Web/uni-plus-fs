/**
 * 路径拼接
 *
 * @param paths 路径列表
 * @returns
 * @example
 * ```js
 * path.join('a', 'b', 'c');
 * // 'a/b/c'
 *
 * path.join('a/b', 'c/d');
 * // 'a/b/c/d'
 * ```
 */
export const join = (...paths: string[]) => {
  return paths.reduce((pre, cur) => {
    const previous = pre.trim().replace(/\/$/, '')
    const current = cur.trim().replace(/^\//, '')
    return `${previous}/${current}`
  })
}

/**
 * 获取路径目录
 *
 * @param path 路径
 * @returns
 * @example
 * ```js
 * path.dirname('a/b/c');
 * // 'a/b'
 *
 * path.dirname('a/b/c/');
 * // 'a/b/c'
 *
 * path.dirname('a/b/c/d');
 * // 'a/b/c'
 * ```
 */
export const dirname = (path: string) => {
  return path.replace(/\/[^\/]*$/, '')
}

/**
 * 获取扩展名
 *
 * @param path
 * @returns
 * @example
 * ```js
 * path.extname('index.html');
 * // '.html'
 *
 * path.extname('index.coffee.md');
 * // '.md'
 *
 * path.extname('index.');
 * // '.'
 *
 * path.extname('index');
 * // ''
 *
 * path.extname('.index');
 * // ''
 *
 * path.extname('.index.md');
 * // '.md'
 * ```
 */
export const extname = (path: string) => {
  const matched = path.match(/\/?(?:[^\/]+\/)*[^\/]+(\.[^\/]*)$/)
  return matched ? matched[1] : ''
}

/**
 * 标准化路径
 *
 * @param path
 * @returns
 * @example
 * ```js
 * path.normalize('a/b/c/');
 * // 'a/b/c'
 *
 * path.normalize('a/b/c/..');
 * // 'a/b'
 *
 * path.normalize('a/b/c/../d');
 * // 'a/b/d'
 *
 * path.normalize('a/b/c/../../d');
 * // 'd'
 *
 * path.normalize('a/b/c/../../../d');
 * // '../d'
 *
 * path.normalize('a/b/c/../../../d/');
 * // '../d/'
 * ```
 */
export const normalize = (path: string) => {
  const parts = path.replace(/\/+/g, '/').split('/')
  const partRes = parts.reduce((pre, cur) => {
    if (cur === '..' && pre[pre.length - 1] !== '..') {
      pre.pop()
      if (!pre.length) {
        pre.push(cur)
      }
    } else if (cur !== '.') {
      pre.push(cur)
    }
    return pre
  }, <string[]>[])
  return partRes.join('/')
}

/**
 * 路径基本名称
 *
 * @param path
 * @param extname
 * @returns
 * @example
 * ```js
 * path.basename('a/b/c/index.html');
 * // 'index.html'
 *
 * path.basename('a/b/c/index.html', '.html');
 * // 'index'
 * ```
 */
export const basename = (path: string, extname?: string) => {
  const base = path.split('/').pop() || ''
  if (extname) {
    return base.replace(new RegExp(`\\.${extname}$`), '')
  }
  return base
}

export default {
  join,
  dirname,
  extname,
  normalize,
  basename
}
