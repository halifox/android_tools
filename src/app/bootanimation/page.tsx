'use client'
import '@ant-design/v5-patch-for-react-19';
import JSZip from "jszip";


async function makeBootAnimationFromImage(file: File | undefined): Promise<void> {
    if (!file) return;
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

    const zipBlob = await zip.generateAsync({type: 'blob', compression: 'STORE'});

    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = 'bootanimation.zip';
    link.click();
}

export default function Home() {
    return (
        <div className="w-screen h-screen p-6 bg-[#E4E7F3] flex flex-col items-center justify-start ">
            <div
                className="w-full h-full  bg-[#5D8BF4] rounded-[2rem] text-white p-10 relative overflow-hidden flex items-center">
                <div className="space-y-6 max-w-1/3">
                    <h1 className="text-4xl font-bold leading-tight">
                        Android bootanimation.zip 生成工具
                    </h1>
                    <p className="text-white/80 text-base">
                        简陋的 bootanimation.zip 生成工具，仅支持上传一张图片，将其封装为单帧开机动画的 bootanimation.zip
                        文件。
                    </p>
                    <input
                        type="file"
                        accept="image/*"
                        className="bg-white text-[#5D8BF4] px-6 py-3 rounded-full font-semibold cursor-pointer"
                        onChange={async (e) => {
                            const file = e.target.files?.[0]
                            await makeBootAnimationFromImage(file)
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
