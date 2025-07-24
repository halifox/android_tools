'use client'
import {useRouter} from "next/navigation";

export default function Home() {
    const router = useRouter();
    return (
        <div className="w-screen h-screen p-6 bg-[#E4E7F3] flex flex-col items-center justify-start ">
            <div
                className="w-full h-full  bg-[#5D8BF4] rounded-[2rem] text-white p-10 relative overflow-hidden flex items-center">
                <div className="space-y-6 max-w-1/3">
                    <h1 className="text-4xl font-bold leading-tight">
                        Android 在线工具箱
                    </h1>
                    <p className="text-white/80 text-base">
                        简陋的在线工具
                    </p>
                    <button
                        className="bg-white text-[#5D8BF4] px-6 py-3 rounded-full font-semibold cursor-pointer m-1"
                        onClick={() => {
                            router.push("proguard")
                        }}
                    >
                        ProGuard 反混淆
                    </button>
                    <button
                        className="bg-white text-[#5D8BF4] px-6 py-3 rounded-full font-semibold cursor-pointer m-1"
                        onClick={() => {
                            router.push("splash")
                        }}
                    >
                        Splash.img
                    </button>
                    <button
                        className="bg-white text-[#5D8BF4] px-6 py-3 rounded-full font-semibold cursor-pointer m-1"
                        onClick={() => {
                            router.push("bootanimation")
                        }}
                    >
                        Boot Animation
                    </button>
                </div>
            </div>
        </div>
    );
}
