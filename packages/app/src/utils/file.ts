export const readFileAsDataURL = (file: File): Promise<string> => {   
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onerror = () => reject(`Ошибка чтения файла: ${file.name}`);
        fileReader.onabort = () => reject(`Чтение файла было прервано: ${file.name}`);
        fileReader.onload = (e) => resolve(e.target?.result as string);
        fileReader.readAsDataURL(file);
    });    
}