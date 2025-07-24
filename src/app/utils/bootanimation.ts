import JSZip from "jszip";

export const makeBootAnimation = async (file: File) => {
    const canvas = document.createElement('canvas');
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    await img.decode();
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);

    const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(blob => {
            blob ? resolve(blob) : reject();
        }, 'image/png');
    });

    const buffer = await blob.arrayBuffer();

    const zip = new JSZip();
    zip.folder('part0')!.file('00001.png', buffer);
    zip.folder('part1')!.file('00001.png', buffer);
    zip.file('desc.txt', `${img.width} ${img.height} 30\np 1 0 part0\np 0 0 part1\n`);
    return zip.generateAsync({type: 'blob', compression: 'STORE'})
}

