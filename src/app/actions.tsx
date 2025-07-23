'use server'
import fs from 'fs'
import path from 'path'
import {v4 as uuidv4} from 'uuid'
import {exec} from 'child_process';

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