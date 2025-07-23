import fs from 'fs';
import path from 'path';
import {v4 as uuidv4} from "uuid";
import {Readable} from "stream";
import {ReadableStream} from "stream/web";
import {pipeline} from "stream/promises";

export async function POST(request: Request) {
    const formData = await request.formData()
    const file = formData.get('file') as unknown as File;
    const mapping = uuidv4();
    const mappingPath = path.resolve('./uploads', `${mapping}.txt`)
    await fs.promises.mkdir(path.dirname(mappingPath), {recursive: true})

    const source = Readable.fromWeb(file.stream() as ReadableStream);
    const destination = fs.createWriteStream(mappingPath)
    await pipeline(source, destination)

    return Response.json({url: mapping})
}