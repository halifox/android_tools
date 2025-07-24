export const selectFile = async () => {
    return await new Promise<File>((resolve, reject) => {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = "image/*"
        input.onchange = async () => {
            const file = input.files?.[0]
            file ? resolve(file) : reject()
        }
        input.click()
    })
}
export const downloadFile = async (blob: Blob, filename: string) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}


