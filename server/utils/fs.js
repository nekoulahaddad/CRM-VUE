const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const rimraf = require("rimraf");
const {
    ROOT
} = require('./path')

exports.uploadFilesFromTempToFolder = (pathTemp, pathUploads, filename, userId) => {
    const filePathFrom = path.join(pathTemp, filename)
    const filePathTo = path.join(pathUploads, userId.toString(), filename)
    return new Promise((res, rej) => {
        fs.rename(filePathFrom, filePathTo, err => {
            if (err) rej(err)
            else res(filePathTo)
        })
    })
}

exports.copyFilesFromTempToFolder = (pathTemp, pathUploads, filename, userId) => {
    const filePathFrom = path.join(pathTemp, filename)
    const filePathTo = path.join(pathUploads, userId.toString(), filename)
    return new Promise((res, rej) => {
        fs.copyFile(filePathFrom, filePathTo, err => {
            if (err) rej(err)
            else res(filePathTo)
        })
    })
}

exports.deleteUserUploadedFile = filepath => {
    return new Promise((res, rej) => {
        fs.unlink(filepath, err => {
            if (err && err.code !== 'ENOENT') {
                rej(err)
            } else {
                res(true)
            }
        })
    })
}

exports.makeUserDir = (pathUploads, userId) => {
    const pathToDir = path.join(pathUploads, userId.toString())
    return new Promise((res, rej) => {
        fs.mkdir(pathToDir, { recursive: true }, err => {
            if (err && err.code !== 'EEXIST') rej(err)
            else res(true)
        })
    })
}


exports.removeUserDir = (pathUploads, userId) => {
    const pathToDir = path.join(pathUploads, userId.toString())
    return new Promise((res, rej) => {
        rimraf(pathToDir, function(err) {
            if (err && err.code !== 'EEXIST') console.log(err)
            else res(true)
        });
    })
}

exports.removeDir = (pathUploads) => {
    console.log(path.join(ROOT, pathUploads))
    const pathToDir = path.join(ROOT, pathUploads)
    return new Promise((res, rej) => {
        rimraf(pathToDir, function(err) {
            if (err && err.code !== 'EEXIST') rej(err)
            else res(true)
        });
    })
}

exports.copyFile = (sourcePath, destPath) => {
    return new Promise((res, rej) => {
        fs.copyFile(sourcePath, destPath, err => {
            if (err) rej(err)
            res(true)
        })
    })
}

exports.makeDir = dirPath => {
    return new Promise((res, rej) => {
        fs.mkdir(dirPath, { recursive: true }, err => {
            if (err && err.code !== 'EEXIST') rej(err)
            res(true)
        })
    })
}


exports.readDirWithFoldersCheck = dirPath => {
    return new Promise((res, rej) => {
        fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
            if (err) rej(err)
            res(files)
        })
    })
}

exports.copyFolderRecursively = async(src, dest) => {
    // console.log('[copyFolderRecursively]\nsrc: ', src, '\ndest: ', dest, '\nstarting...\n')
    const fileAndDirList = await this.readDirWithFoldersCheck(src)
    for (const v of fileAndDirList) {
        if (v.isDirectory()) {
            await this.makeDir(path.join(dest, v.name))
            await this.copyFolderRecursively(path.join(src, v.name), path.join(dest, v.name))
        } else {
            await this.copyFile(path.join(src, v.name), path.join(dest, v.name))
        }
    }
}