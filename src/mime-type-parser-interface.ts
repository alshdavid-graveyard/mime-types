export interface MimeTypesParserInterface {
    /**
     * @description
     * Lookup the content-type associated with a file.
     * @param path 
     * e.g. 'json', '.md', 'file.html', 'folder/file.js'
     */
    lookup(path: string): [contentType: string, found: boolean]
    /**
     * @description 
     * Create a full content-type header given a content-type or extension. 
     * When given an extension, mime.lookup is used to get the matching content-type, 
     * otherwise the given content-type is used. Then if the content-type does not 
     * already have a charset parameter, mime.charset is used to get the default 
     * charset and add to the returned content-type.
     * @param query 
     * e.g. 'markdown', 'file.json', 'text/html', 'text/html; charset=iso-8859-1'
     */
    contentType(query: string): [contentType: string, found: boolean]
    /**
     * @description
     * Get the default extension for a content-type.
     * @param mimeType 
     * e.g. extension('application/octet-stream') -> 'bin'
     */
    extension(mimeType: string): [extension: string, found: boolean]
    /**
     * @description
     * Lookup the implied default charset of a content-type.
     * @param mimeType 
     * e.g. charset('text/markdown') -> 'UTF-8'
     */
    charset(mimeType: string): [charset: string, found: boolean]
}
