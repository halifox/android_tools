'use client'
import {downloadFile, selectFile} from "@/app/utils/common";
import {makeBootAnimation} from "@/app/utils/bootanimation";

export default function Home() {
    const make = async () => {
        const file = await selectFile()
        const zipBlob = await makeBootAnimation(file)
        await downloadFile(zipBlob, 'bootanimation.zip')
    }
    return (
        <div className="w-screen h-screen p-6 bg-[#E4E7F3] flex flex-col items-center justify-start ">
            <div
                className="w-full h-full  bg-[#5D8BF4] rounded-[2rem] text-white p-10 relative overflow-hidden flex items-center">
                <div className="space-y-6 max-w-1/2">
                    <h1 className="text-4xl font-bold leading-tight">
                        Android bootanimation.zip 生成工具
                    </h1>
                    <p className="text-white/80 text-base">
                        简陋的 bootanimation.zip 生成工具，仅支持上传一张图片，将其封装为单帧开机动画的 bootanimation.zip
                        文件。
                    </p>
                    <button className="bg-white text-[#5D8BF4] px-6 py-3 rounded-full font-semibold cursor-pointer"
                            onClick={make}>
                        上传图片
                    </button>
                </div>
            </div>
        </div>
    )
}
