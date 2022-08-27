import { join } from 'path'
import { execSync } from 'child_process'
const xclipFile = join(__dirname, '../bin/linux/xclip');
const xclipGetTextCommand = `${xclipFile} -selection clipboard  -o`;
const xclipGetImageCommand = `${xclipFile} -selection clipboard -t image/png -o`;
interface ClipboardContent {
    type: 'image' | 'text' | 'error',
    content: string | boolean
}

/**
 * @description gets image from clipboard using x11 methodology
 * @returns string or false on fail
 */
function getx11ImageFromClipboard(): string | boolean {
    try{
        let result = execSync(xclipGetImageCommand).toString('utf-8');
        return result;
    } catch (error) {
        return false;
    }
}

/**
 * @description gets text from clipboard using x11 methodology
 * @returns string or false on fail
 */
function getx11TextFromClipboard(): string | boolean {
    try {
        let result = execSync(xclipGetTextCommand).toString('utf-8');
        return result;
    } catch (error) {
        return false;
    }
}

/**
 * @description gets image from clipboard
 * @returns string or false on fail
 */
function getImageFromClipboard(): string | boolean{
    //will need to write conditional for wayland too
    return getx11ImageFromClipboard();
}

/**
 * @description gets text from clipboard
 * @returns string or false on fail
 */
function getTextFromClipboard(): string | boolean {
    return getx11TextFromClipboard();
}


/**
 * @description gets clipboard content, image or clipboard
 */
export function getClipboardContent(): ClipboardContent {
    let errorMessage: ClipboardContent = {
        type: 'error',
        content: 'there was an error'
    };

    let textContent = getTextFromClipboard();
    if( textContent === false ) return errorMessage;
    if( textContent === '' ) {
        let imageContent = getImageFromClipboard();
        if(imageContent === false ) return errorMessage;
        return {
            type: "image",
            content: imageContent
        };
    }
    return {
        type: 'text',
        content: textContent
    }
}