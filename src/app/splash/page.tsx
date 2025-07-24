'use client'

const HEADER_SIZE = 512;
const MAGIC = new TextEncoder().encode('SPLASH!!\0');

function encodeRLE24(pixels: Uint8Array, width: number, height: number): Uint8Array {
    const buf: number[] = [];
    for (let y = 0; y < height; y++) {
        const line: number[] = [];
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 3;
            const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
            line.push((r << 16) | (g << 8) | b);
        }
        for (const {count, value} of encodeLine(line)) {
            buf.push(count - 1);
            if (count > 128) {
                const v = value[0];
                buf.push(v & 0xFF, (v >> 8) & 0xFF, (v >> 16) & 0xFF);
            } else {
                for (const v of value) {
                    buf.push(v & 0xFF, (v >> 8) & 0xFF, (v >> 16) & 0xFF);
                }
            }
        }
    }
    return new Uint8Array(buf);
}

function encodeLine(line: number[]): { count: number, value: number[] }[] {
    const out = [];
    let run: number[] = [];
    let count = 1;
    let repeat = line[0] === line[1];

    for (let i = 1; i <= line.length; i++) {
        const same = line[i] === line[i - 1];
        if (repeat) {
            if (same && count < 128) {
                count++;
            } else {
                out.push({count: count + 128, value: [line[i - 1]]});
                count = 1;
                repeat = line[i] === line[i + 1];
            }
        } else {
            if (!same && count < 128) {
                run.push(line[i - 1]);
                count++;
            } else {
                run.push(line[i - 1]);
                out.push({count, value: run});
                count = 1;
                run = [];
                repeat = same;
            }
        }
    }
    return out;
}

function makeHeader(width: number, height: number, compressed: number, bodyLength: number): Uint8Array {
    const header = new Uint8Array(HEADER_SIZE);
    header.set(MAGIC, 0);
    const view = new DataView(header.buffer);
    view.setUint32(8, width, true);
    view.setUint32(12, height, true);
    view.setUint32(16, compressed, true);
    view.setUint32(20, Math.ceil(bodyLength / HEADER_SIZE), true);
    return header;
}

async function makeSplashFromImage(file: File | undefined): Promise<void> {
    if (!file) return;
    const canvas = document.createElement('canvas');
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    await img.decode();
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);

    const {data} = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const rgb = new Uint8Array(canvas.width * canvas.height * 3);
    for (let i = 0, j = 0; i < data.length; i += 4) {
        rgb[j++] = data[i];
        rgb[j++] = data[i + 1];
        rgb[j++] = data[i + 2];
    }

    const body = encodeRLE24(rgb, canvas.width, canvas.height);
    const header = makeHeader(canvas.width, canvas.height, 1, body.length);

    const total = new Uint8Array(4096 + HEADER_SIZE + body.length);
    total.set(header, 4096);
    total.set(body, 4096 + HEADER_SIZE);

    const blob = new Blob([total], {type: 'application/octet-stream'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'splash.img';
    link.click();
}


export default function Home() {
    return (
        <div className="w-screen h-screen p-6 bg-[#E4E7F3] flex flex-col items-center justify-start ">
            <div
                className="w-full h-full  bg-[#5D8BF4] rounded-[2rem] text-white p-10 relative overflow-hidden flex items-center">
                <div className="space-y-6 max-w-xl">
                    <h1 className="text-4xl font-bold leading-tight">
                        Qualcomm Splash.img 生成工具
                    </h1>
                    <p className="text-white/80 text-base">
                        简陋的 Qualcomm splash.img 生成工具，勉强支持 BMP 转 RGB565，仅供定制启动 Logo 和设备维护时凑合用。
                    </p>
                    <input
                        type="file"
                        accept="image/*"
                        className="bg-white text-[#5D8BF4] px-6 py-3 rounded-full font-semibold cursor-pointer"
                        onChange={async e => {
                            const file = e.target.files?.[0];
                            await makeSplashFromImage(file)
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
