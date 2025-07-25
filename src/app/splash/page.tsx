'use client'
import {downloadFile, selectFile} from "@/app/utils/common";
import {makeSplashFromImage} from "@/app/utils/splash";

export default function Home() {
    const make = async () => {
        const file = await selectFile()
        const zipBlob = await makeSplashFromImage(file)
        await downloadFile(zipBlob, 'splash.img')
    }
    return (
        <div className="w-screen h-screen p-6 bg-[#E4E7F3] flex flex-col items-center justify-start ">
            <div
                className="w-full h-full  bg-[#5D8BF4] rounded-[2rem] text-white p-10 relative overflow-hidden flex items-center">
                <div className="space-y-6 max-w-1/2">
                    <h1 className="text-4xl font-bold leading-tight">
                        Qualcomm Splash.img 生成工具
                    </h1>
                    <p className="text-white/80 text-base">
                        简陋的 Qualcomm splash.img 生成工具，勉强支持 BMP 转 RGB565，仅供定制启动 Logo 和设备维护时凑合用。
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
