import type {MaybeConsumable, ReadableStream} from "@yume-chan/stream-extra";
import {
    AdbDaemonWebUsbConnection,
    AdbDaemonWebUsbDevice,
    AdbDaemonWebUsbDeviceManager
} from "@yume-chan/adb-daemon-webusb";
import AdbWebCredentialStore from "@yume-chan/adb-credential-web";
import {Adb, AdbDaemonTransport} from "@yume-chan/adb";
import {AdbSyncWriteOptions} from "@yume-chan/adb/src/commands/sync/sync";


export const connect = async () => {
    try {
        const manager = AdbDaemonWebUsbDeviceManager.BROWSER
        if (!manager) {
            return alert("在此浏览器中不支持WebUSB")
        }
        const device = await manager.requestDevice()
        if (!device) return
        const connection: AdbDaemonWebUsbConnection = await device.connect()
        const CredentialStore: AdbWebCredentialStore = new AdbWebCredentialStore()
        const transport: AdbDaemonTransport = await AdbDaemonTransport.authenticate({
            serial: device.serial,
            connection: connection,
            credentialStore: CredentialStore,
        })
        return new Adb(transport)
    } catch (e) {
        if (e instanceof AdbDaemonWebUsbDevice.DeviceBusyError) {
            alert("另一个程序已经在使用该设备。请关闭程序，然后重试。",)
            return
        }
        if (e instanceof Error) {
            alert(e.message)
            return
        }
        throw e
    }

}

export const disconnect = async (adb: Adb) => {
    await adb?.close()
}

export const remount = async (adb: Adb) => {
    const resp = await adb.createSocketAndWait("remount:");
    if (resp != "remount succeeded") {
        alert("无法重新挂载 /system：权限被拒绝\n你应该尝试执行以下命令:\nadb disable-verity\nadb reboot")
        throw new Error()
    }
}

export const push = async (adb: Adb, options: AdbSyncWriteOptions) => {
    const adbSync = await adb.sync()
    await adbSync.write(options)
    await adbSync.dispose()
}

export const pushEasy = async (adb: Adb, file: File, filename: string) => {
    const adbSync = await adb.sync()
    await adbSync.write({
        filename: filename,
        file: file.stream() as ReadableStream<MaybeConsumable<Uint8Array>>,
    })
    await adbSync.dispose()
}
