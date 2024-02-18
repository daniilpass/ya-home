const readFile = (file: Blob, outFromat: 'dataUrl' | 'text'): Promise<string> => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onerror = () => reject(`Ошибка чтения файла`);
        fileReader.onabort = () => reject(`Чтение файла было прервано`);

        switch(outFromat) {
            case 'dataUrl': {
                fileReader.onload = (e) => resolve(e.target?.result as string);
                fileReader.readAsDataURL(file);
                break;
            }
            case 'text': {
                fileReader.onload = (e) => resolve(e.target?.result as string);
                fileReader.readAsText(file);
                break;
            }
        }
    });  
}

export const readFileAsDataURL = (file: File): Promise<string> => {  
    return readFile(file, 'dataUrl');   
}

export const readFileAsText= (file: File): Promise<string> => {   
    return readFile(file, 'text');     
}

export const saveFile = (data: any, filename: string, type: string) => {
    const file = new Blob([data], {type: type});
    const a = document.createElement('a');
    a.href= URL.createObjectURL(file);
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 0);
};

export const imageUrlToDataURL = async (url: string): Promise<string> => {
    const data = await fetch(url);
    const blob = await data.blob();
    return readFile(blob, 'dataUrl');  
};
