<template>
    <view class="content">
        <view class="item">
            <input class="input" type="text" v-model.trim="text" placeholder="请输入文件内容" />
            <button class="btn" @click="writeFile">上传文件</button>
        </view>
        <view class="item">
            <button class="btn" @click="createFile">创建测试文件</button>
            <button class="btn" @click="moveFile">移动文件</button>
            <button class="btn" @click="copyFile">复制文件</button>
        </view>
        <view class="item">
            <image class="img" :src="image" />
            <input class="input" type="text" v-model.trim="name" placeholder="请输入文件名" />
            <button class="btn" @click="writeImage">上传图片</button>
        </view>
        <view class="item">
            <input class="input" type="text" v-model.trim="dir" placeholder="请输入文件夹名称" />
            <button class="btn" @click="createDirectory">新建文件夹</button>
        </view>
        <view>
            <view class="dir-list">
                <button class="dir-btn" @click="handleDir(dirList.length - 2)" v-if="dirList.length">返回上一级</button>
                <view class="dir">
                    <view class="dir-item" @click="handleDir(-1)">
                        <view>全部文件</view>
                        <view>/</view>
                    </view>
                    <view class="dir-item" v-for="(item, index) in dirList" :key="index" @click="handleDir(index)">
                        <view>{{ item }}</view>
                        <view>/</view>
                    </view>
                </view>
            </view>
            <view class="file-list" v-if="fileList.length">
                <view class="file" v-for="(item, index) in fileList" :key="index" @click="handlePreview(item)">
                    <view class="tag">{{ item.isDir ? '目录' : '文件' }}</view>
                    <view class="name">{{ item.name }}</view>
                    <view class="size">{{ item.isDir ? '-' : formatFileSize(item.size) }}</view>
                    <button class="btn" @click.stop.capture="handleDelete(item)">删除</button>
                </view>
            </view>
            <view class="file-none" v-else>当前文件夹无文件</view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { IFileRootType, createFileSystemManager, getDirectoryEntryInfo, getFileEntryInfo, getLocalEntry, readFileEntry, removeDirectoryEntry, removeFileEntry } from 'uni-plus-fs';
import { computed, reactive, ref, watch } from 'vue';

const base = 'test'
const text = ref('hello world')
const dir = ref('测试文件夹')
const image = ref('static/logo.png')
const name = ref('测试图片')
const dirList = ref<string[]>([])
const fileList = ref<{ isDir: boolean, name: string, size: number, entry: PlusIoFileEntry | PlusIoDirectoryEntry }[]>([])
const currentDir = computed(() => dirList.value.join('/') ? `/${dirList.value.join('/')}/` : '/')
const fullDir = computed(() => `${base}${currentDir.value}`)

/**
 * 格式化大小
 * 
 * @param size 
 */
const formatFileSize = (size: number) => {
    if (size < 1024) {
        return `${size} B`
    }
    if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(2)} KB`
    }
    if (size < 1024 * 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(2)} MB`
    }
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

/**
 * 写入文件
 */
const writeFile = async () => {
    if (!text.value) {
        uni.showToast({
            title: '请输入文件内容',
            icon: 'none',
        })
        return
    }
    const fs = await createFileSystemManager({ type: IFileRootType.PRIVATE_DOC })
    try {
        await fs.writeFile(`${fullDir.value}测试文件.txt`, text.value)
        uni.showToast({
            title: '文件写入成功',
            icon: 'none',
        })
        getFileList()
    } catch (err: any) {
        uni.showToast({
            title: `文件写入失败 ${err.message} `,
            icon: 'none',
        })
    }
}

/**
 * 创建文件
 */
const createFile = async () => {
    const fs = await createFileSystemManager({ type: IFileRootType.PRIVATE_DOC })
    try {
        await fs.writeFile(`${fullDir.value}测试文件.txt`, 'test666')
        uni.showToast({
            title: '文件创建成功',
            icon: 'none',
        })
        getFileList()
    } catch (err: any) {
        uni.showToast({
            title: `文件创建失败 ${err.message} `,
            icon: 'none',
        })
    }
}


/**
 * 移动文件
 */
const moveFile = async () => {
    const fs = await createFileSystemManager({ type: IFileRootType.PRIVATE_DOC })
    try {
        await fs.getFileEntry(`${fullDir.value}测试文件.txt`)
        try {
            await fs.moveFile(`${fullDir.value}测试文件.txt`, `${fullDir.value}move`, { create: true, force: true })
            uni.showToast({
                title: `文件移动成功 ${currentDir.value}测试文件.txt -> ${currentDir.value}move`,
                icon: 'none',
            })
            getFileList()
        } catch (err: any) {
            uni.showToast({
                title: `文件移动失败 ${err.message} `,
                icon: 'none',
            })
        }
    } catch (err: any) {
        uni.showToast({
            title: `测试文件不存在 ${err.message} `,
            icon: 'none',
        })
    }
}

/**
 * 复制文件
 */
const copyFile = async () => {
    const fs = await createFileSystemManager({ type: IFileRootType.PRIVATE_DOC })
    try {
        await fs.getFileEntry(`${fullDir.value}测试文件.txt`)
        try {
            await fs.copyFile(`${fullDir.value}测试文件.txt`, `${fullDir.value}copy`, { create: true, force: true })
            uni.showToast({
                title: `文件复制成功 ${currentDir.value}测试文件.txt -> ${currentDir.value}copy`,
                icon: 'none',
            })
            getFileList()
        } catch (err: any) {
            uni.showToast({
                title: `文件复制失败 ${err.message} `,
                icon: 'none',
            })
        }
    } catch (err: any) {
        uni.showToast({
            title: `测试文件不存在 ${err.message} `,
            icon: 'none',
        })
    }
}


/**
 * 写入图片
 */
const writeImage = async () => {
    if (!name.value) {
        uni.showToast({
            title: '请输入图片名',
            icon: 'none',
        })
        return
    }
    const res = await uni.chooseImage({
        count: 1,
        sourceType: ['album', 'camera']
    })
    const filePath = res.tempFilePaths[0]
    const suffix = filePath.split('.').pop() || 'png'
    const entry = await getLocalEntry<PlusIoFileEntry>(filePath)
    const base64 = await readFileEntry(entry, 'base64')
    const fs = await createFileSystemManager({ type: IFileRootType.PRIVATE_DOC })
    try {
        const entry = await fs.writeFile(`${fullDir.value}${name.value}.${suffix}`, base64, 'base64')
        image.value = await readFileEntry(entry, 'base64')
        uni.showToast({
            title: '图片写入成功',
            icon: 'none',
        })
        getFileList()
    } catch (err: any) {
        uni.showToast({
            title: `图片写入失败 ${err.message} `,
            icon: 'none',
        })
    }
}

/**
 * 创建文件夹
 */
const createDirectory = async () => {
    if (!dir.value) {
        uni.showToast({
            title: '请输入文件夹名称',
            icon: 'none',
        })
        return
    }
    const fs = await createFileSystemManager({ type: IFileRootType.PRIVATE_DOC })
    try {
        await fs.createDirectory(`${fullDir.value}${dir.value} `)
        uni.showToast({
            title: '文件夹创建成功',
            icon: 'none',
        })
        getFileList()
    } catch (err: any) {
        uni.showToast({
            title: `文件夹创建失败 ${err.message} `,
            icon: 'none',
        })
    }
}

/**
 * 获取文件列表
 */
const getFileList = async () => {
    const fs = await createFileSystemManager({ type: IFileRootType.PRIVATE_DOC })
    const entries = await fs.readDirectory(fullDir.value)
    fileList.value = entries.map(item => {
        const isDir = !!item.isDirectory
        const data = reactive({
            isDir,
            name: item.name!,
            size: 0,
            entry: item
        })
        if (isDir) {
            getDirectoryEntryInfo(<PlusIoDirectoryEntry>item).then(info => {
                data.size = info.size!
            })
        } else {
            getFileEntryInfo(<PlusIoFileEntry>item).then(info => {
                data.size = info.size!
            })
        }
        return data
    }).sort((a, b) => {
        if (a.isDir && !b.isDir) {
            return -1
        }
        if (!a.isDir && b.isDir) {
            return 1
        }
        return 0
    })
}

/**
 * 预览文件 / 文件夹
 * 
 * @param item 
 */
const handlePreview = async (item: { isDir: boolean, name: string, size: number, entry: PlusIoFileEntry | PlusIoDirectoryEntry }) => {
    if (item.isDir) {
        dirList.value.push(item.name)
        return
    }
    if (item.name.endsWith('.png') || item.name.endsWith('.jpg')) {
        const filePath = item.entry.toLocalURL()
        uni.previewImage({
            urls: [filePath],
            current: 0
        })
        return
    }
    const filePath = await readFileEntry(<PlusIoFileEntry>item.entry, 'text')
    uni.showToast({
        title: `文件内容: ${filePath} `,
        icon: 'none',
    })
}

/**
 * 文件夹跳转
 * 
 * @param index 
 */
const handleDir = (index: number) => {
    dirList.value = dirList.value.slice(0, index + 1)
}

/**
 * 删除文件 / 文件夹
 * 
 * @param item 
 */
const handleDelete = async (item: { isDir: boolean, name: string, size: number, entry: PlusIoFileEntry | PlusIoDirectoryEntry }) => {
    const res = await uni.showModal({
        title: '提示',
        content: `是否删除 ${item.name} `,
    })
    if (!res.confirm) {
        return
    }
    if (item.isDir) {
        try {
            await removeDirectoryEntry(<PlusIoDirectoryEntry>item.entry, true)
            uni.showToast({
                title: '文件夹删除成功',
                icon: 'none',
            })
            getFileList()
        } catch (err: any) {
            uni.showToast({
                title: `文件夹删除失败 ${err.message} `,
                icon: 'none',
            })
        }
        return
    }
    try {
        await removeFileEntry(<PlusIoFileEntry>item.entry)
        uni.showToast({
            title: '文件删除成功',
            icon: 'none',
        })
        getFileList()
    } catch (err: any) {
        uni.showToast({
            title: `文件删除失败 ${err.message} `,
            icon: 'none',
        })
    }
    return

}

watch(() => dirList.value, () => getFileList(), { immediate: true, deep: true })


</script>

<style>
.content {
    padding: 40rpx 20rpx;
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.item {
    display: flex;
    align-items: center;
    gap: 20rpx;
}

.input {
    padding: 20rpx 30rpx;
    background: #f6f6f6;
    border-radius: 10rpx;
    flex: 1 1 0;
}

.btn {
    background: #fff;
    padding: 10rpx 20rpx;
    margin: 0;
    font-size: 24rpx;
    border: 1rpx solid #ccc;
    line-height: normal;
    border-radius: 10rpx;
}

.btn::after {
    content: none;
}

.img {
    width: 200rpx;
    height: 200rpx;
    border-radius: 20rpx;
    margin: 0 auto;
}

.dir-list {
    display: flex;
    gap: 10rpx;
}

.dir-btn {
    background: #fff;
    padding: 0 20rpx;
    margin: 0;
    font-size: 24rpx;
    border-right: 1rpx solid #ccc;
    line-height: normal;
    border-radius: 0;
}

.dir-btn::after {
    content: none;
}

.dir {
    display: flex;
    align-items: center;
    gap: 10rpx;
    padding: 0 10rpx;
}

.dir-item {
    display: flex;
    align-items: center;
    gap: 10rpx;
    color: #ccc;
    font-size: 24rpx;

}

.dir-item:first-child {
    color: #007aff
}

.file-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    padding: 20rpx 0;
}

.file {
    display: flex;
    align-items: center;
    gap: 20rpx;
}

.tag {
    font-size: 24rpx;
    border-radius: 10rpx;
    border: 1rpx solid #999;
    padding: 2rpx 10rpx;
    color: #999;
}

.name {
    font-size: 24rpx;
    flex: 1 1 0;
}

.size {
    font-size: 24rpx;
    color: #ccc;
}

.file-none {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 200rpx 0;
    color: #ccc;
    font-size: 30rpx;
}
</style>
