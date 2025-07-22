'use server'
import fs from 'fs'
import path from 'path'
import {v4 as uuidv4} from 'uuid'
import {pipeline} from 'stream/promises'
import {Readable} from 'stream'
import {ReadableStream} from 'stream/web'
import {exec} from 'child_process';

export async function uploadMapping(formData: FormData) {
    const file = formData.get('file') as File

    const mapping = uuidv4();
    const mappingPath = path.resolve('./uploads', `${mapping}.txt`)
    await fs.promises.mkdir(path.dirname(mappingPath), {recursive: true})

    const source = Readable.fromWeb(file.stream() as ReadableStream);
    const destination = fs.createWriteStream(mappingPath)
    await pipeline(source, destination)

    return mapping
}

export async function retrace(mapping: string, obfuscated: string) {
    const mappingPath = path.resolve('./uploads', `${mapping}.txt`);
    const obfuscatedPath = path.resolve('./uploads', `${uuidv4()}.txt`);
    const deobfuscatedPath = path.resolve('./uploads', `${uuidv4()}.txt`);

    await new Promise((resolve, reject) => {
        fs.writeFile(obfuscatedPath, obfuscated, {encoding: 'utf-8'}, (err) => {
            if (err) return reject(err);
            resolve(null);
        });
    })

    await new Promise((resolve, reject) => {
        exec(`retrace ${mappingPath} ${obfuscatedPath} > ${deobfuscatedPath}`, (err) => {
            if (err) return reject(err);
            resolve(null);
        })
    })
    return await new Promise<string>((resolve, reject) => {
        fs.readFile(deobfuscatedPath, 'utf-8', (err, data) => {
            if (err) return reject(err);
            resolve(data);
        })
    })
}