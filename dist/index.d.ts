import pako from 'pako';
import { S as Source, a as SourceReader, b as StreamResults } from './utils-dbe382cb.js';
export { R as Request, S as Source, h as SourceReadable, a as SourceReader, i as StreamResult, b as StreamResults, c as appendRequestQuery, f as concatChunks, g as getSurt, j as jsonToQueryParams, d as jsonToQueryString, m as mfdToQueryParams, e as mfdToQueryString, p as postToGetUrl, s as splitChunk } from './utils-dbe382cb.js';
import { WritableStreamBuffer } from 'stream-buffers';

declare class NoConcatInflator<T extends BaseAsyncIterReader> extends pako.Inflate {
    reader: T;
    ended: boolean;
    chunks: Uint8Array[];
    constructor(options: pako.InflateOptions, reader: T);
    onEnd(status: pako.ReturnCodes): void;
}
declare abstract class BaseAsyncIterReader {
    static readFully(iter: AsyncIterable<Uint8Array>): Promise<Uint8Array>;
    abstract [Symbol.asyncIterator](): AsyncIterator<Uint8Array>;
    getReadableStream(): ReadableStream<any>;
    readFully(): Promise<Uint8Array>;
    abstract readlineRaw(maxLength?: number): Promise<Uint8Array | null>;
    readline(maxLength?: number): Promise<string>;
    iterLines(maxLength?: number): AsyncGenerator<string, void, unknown>;
}
type AsyncIterReaderOpts = {
    raw: boolean;
};
declare class AsyncIterReader extends BaseAsyncIterReader {
    compressed: string | null;
    opts: AsyncIterReaderOpts;
    inflator: NoConcatInflator<this> | null;
    _sourceIter: AsyncIterator<Uint8Array | null>;
    lastValue: Uint8Array | null;
    errored: boolean;
    _savedChunk: Uint8Array | null;
    _rawOffset: number;
    _readOffset: number;
    numChunks: number;
    constructor(streamOrIter: Source, compressed?: string | null, dechunk?: boolean);
    _loadNext(): Promise<Uint8Array | null>;
    dechunk(source: AsyncIterable<Uint8Array>): AsyncIterator<Uint8Array | null>;
    unread(chunk: Uint8Array): void;
    _next(): Promise<Uint8Array | null>;
    _push(value: Uint8Array): void;
    _getNextChunk(original?: Uint8Array): Uint8Array | null | undefined;
    [Symbol.asyncIterator](): AsyncGenerator<Uint8Array, void, unknown>;
    readlineRaw(maxLength?: number): Promise<Uint8Array | null>;
    readFully(): Promise<Uint8Array>;
    readSize(sizeLimit: number): Promise<Uint8Array>;
    skipSize(sizeLimit: number): Promise<number>;
    _readOrSkip(sizeLimit?: number, skip?: boolean): Promise<readonly [number, Uint8Array]>;
    getReadOffset(): number;
    getRawOffset(): number;
    getRawLength(prevOffset: number): number;
    static fromReadable<Readable extends SourceReader>(source: Readable): {
        [Symbol.asyncIterator](): AsyncGenerator<Uint8Array, void, unknown>;
    };
    static fromIter(source: Iterable<Uint8Array>): {
        [Symbol.asyncIterator](): AsyncGenerator<Uint8Array, void, unknown>;
    };
}
declare class LimitReader extends BaseAsyncIterReader {
    sourceIter: AsyncIterReader;
    length: number;
    limit: number;
    skip: number;
    constructor(streamIter: AsyncIterReader, limit: number, skip?: number);
    setLimitSkip(limit: number, skip?: number): void;
    [Symbol.asyncIterator](): AsyncGenerator<Uint8Array, void, unknown>;
    readlineRaw(maxLength?: number): Promise<Uint8Array | null>;
    skipFully(): Promise<number>;
}

declare class StatusAndHeaders {
    statusline: string;
    headers: Map<string, string> | Headers;
    constructor({ statusline, headers, }: {
        statusline: string;
        headers: Map<string, string> | Headers;
    });
    toString(): string;
    iterSerialize(encoder: TextEncoder): AsyncGenerator<Uint8Array, void, unknown>;
    _protocol: string;
    _statusCode: number | string;
    _statusText: string;
    _parseResponseStatusLine(): void;
    get statusCode(): string | number;
    get protocol(): string;
    get statusText(): string;
    _method: string;
    _requestPath: string;
    _parseRequestStatusLine(): void;
    get method(): string;
    get requestPath(): string;
}
declare class StatusAndHeadersParser {
    parse(reader: AsyncIterReader, { headersClass, firstLine, }?: {
        firstLine?: string;
        headersClass: typeof Map | typeof Headers;
    }): Promise<StatusAndHeaders | null>;
}

declare const WARC_1_1 = "WARC/1.1";
declare const WARC_1_0 = "WARC/1.0";
type WARCType = "warcinfo" | "response" | "resource" | "request" | "metadata" | "revisit" | "conversion" | "continuation";
type WARCRecordOpts = {
    url?: string;
    date?: string;
    type?: WARCType;
    warcHeaders?: any;
    filename?: string;
    httpHeaders?: Record<string, string>;
    statusline?: string;
    warcVersion?: typeof WARC_1_0 | typeof WARC_1_1;
    keepHeadersCase?: boolean;
    refersToUrl?: string;
    refersToDate?: string;
};
declare class WARCRecord extends BaseAsyncIterReader {
    static create({ url, date, type, warcHeaders, filename, httpHeaders, statusline, warcVersion, keepHeadersCase, refersToUrl, refersToDate, }?: WARCRecordOpts, reader?: AsyncIterable<Uint8Array>): WARCRecord;
    static createWARCInfo(opts: WARCRecordOpts | undefined, info: Record<string, string>): WARCRecord;
    warcHeaders: StatusAndHeaders;
    _reader: AsyncIterable<Uint8Array>;
    _contentReader: BaseAsyncIterReader | null;
    payload: Uint8Array | null;
    httpHeaders: StatusAndHeaders | null;
    consumed: "content" | "raw" | "skipped" | "";
    _offset: number;
    _length: number;
    method: string;
    requestBody: string;
    _urlkey: string;
    constructor({ warcHeaders, reader, }: {
        warcHeaders: StatusAndHeaders;
        reader: AsyncIterable<Uint8Array>;
    });
    getResponseInfo(): {
        headers: Map<string, string> | Headers;
        status: string | number;
        statusText: string;
    } | null;
    fixUp(): void;
    readFully(isContent?: boolean): Promise<Uint8Array>;
    get reader(): AsyncIterable<Uint8Array>;
    get contentReader(): AsyncIterable<Uint8Array>;
    _createDecodingReader(source: Source): AsyncIterReader;
    readlineRaw(maxLength?: number): Promise<Uint8Array | null>;
    contentText(): Promise<string>;
    [Symbol.asyncIterator](): AsyncGenerator<Uint8Array, void, unknown>;
    skipFully(): Promise<number | undefined>;
    warcHeader(name: string): string | null | undefined;
    get warcType(): string | null | undefined;
    get warcTargetURI(): string | null | undefined;
    get warcDate(): string | null | undefined;
    get warcRefersToTargetURI(): string | null | undefined;
    get warcRefersToDate(): string | null | undefined;
    get warcPayloadDigest(): string | null | undefined;
    get warcBlockDigest(): string | null | undefined;
    get warcContentType(): string | null | undefined;
    get warcContentLength(): number;
}

type WARCParserOpts = {
    keepHeadersCase?: boolean;
    parseHttp?: boolean;
};
declare class WARCParser {
    static parse(source: Source, options?: WARCParserOpts): Promise<WARCRecord | null>;
    static iterRecords(source: Source, options?: WARCParserOpts): AsyncGenerator<WARCRecord, void, unknown>;
    _offset: number;
    _warcHeadersLength: number;
    _headersClass: typeof Map | typeof Headers;
    _parseHttp: boolean;
    _atRecordBoundary: boolean;
    _reader: AsyncIterReader;
    _record: WARCRecord | null;
    constructor(source: Source, { keepHeadersCase, parseHttp }?: WARCParserOpts);
    readToNextRecord(): Promise<string>;
    _initRecordReader(warcHeaders: StatusAndHeaders): LimitReader;
    parse(): Promise<WARCRecord | null>;
    get offset(): number;
    get recordLength(): number;
    [Symbol.asyncIterator](): AsyncGenerator<WARCRecord, void, unknown>;
    _addHttpHeaders(record: WARCRecord, headersParser: StatusAndHeadersParser): Promise<void>;
}

type WARCSerializerOpts = {
    gzip?: boolean;
    digest?: {
        algo?: AlgorithmIdentifier;
        prefix?: string;
        base32?: boolean;
    };
};
declare class WARCSerializer extends BaseAsyncIterReader {
    static serialize(record: WARCRecord, opts?: WARCSerializerOpts): Promise<Uint8Array>;
    static base16(hashBuffer: ArrayBuffer): string;
    record: WARCRecord;
    gzip: boolean;
    digestAlgo: AlgorithmIdentifier;
    digestAlgoPrefix: string;
    digestBase32: boolean;
    constructor(record: WARCRecord, opts?: WARCSerializerOpts);
    [Symbol.asyncIterator](): AsyncGenerator<any, void, unknown>;
    readlineRaw(maxLength?: number): Promise<Uint8Array | null>;
    pakoCompress(): AsyncGenerator<any, void, unknown>;
    streamCompress(cs: CompressionStream): AsyncGenerator<any, void, unknown>;
    digestMessage(chunk: BufferSource): Promise<string>;
    generateRecord(): AsyncGenerator<Uint8Array, void, unknown>;
}

type IndexCommandArgs = any;
type CdxIndexCommandArgs = any;

declare abstract class BaseIndexer {
    opts: Partial<IndexCommandArgs>;
    out: WritableStreamBuffer | NodeJS.WriteStream;
    fields: string[];
    parseHttp: boolean;
    constructor(out: WritableStreamBuffer | NodeJS.WriteStream, opts?: Partial<IndexCommandArgs>);
    serialize(result: Record<string, any>): string;
    write(result: Record<string, any>): void;
    run(files: StreamResults): Promise<void>;
    iterIndex(files: StreamResults): AsyncGenerator<Record<string, any>, void, unknown>;
    iterRecords(parser: WARCParser, filename: string): AsyncGenerator<Record<string, any>, void, unknown>;
    filterRecord?(record: WARCRecord): boolean;
    indexRecord(record: WARCRecord, parser: WARCParser, filename: string): Record<string, any> | null;
    setField(field: string, record: WARCRecord, result: Record<string, any>): void;
    getField(field: string, record: WARCRecord): string | number | null | undefined;
}
declare class Indexer extends BaseIndexer {
    constructor(out: WritableStreamBuffer | NodeJS.WriteStream, opts?: Partial<IndexCommandArgs>);
}
declare class CDXIndexer extends Indexer {
    includeAll: boolean;
    noSurt: boolean;
    _lastRecord: WARCRecord | null;
    constructor(out: WritableStreamBuffer | NodeJS.WriteStream, opts?: Partial<CdxIndexCommandArgs>);
    iterRecords(parser: WARCParser, filename: string): AsyncGenerator<Record<string, any>, void, unknown>;
    filterRecord(record: WARCRecord): boolean;
    indexRecord(record: WARCRecord | null, parser: WARCParser, filename: string): Record<string, any> | null;
    indexRecordPair(record: WARCRecord, reqRecord: WARCRecord | null, parser: WARCParser, filename: string): Record<string, any> | null;
    serializeCDXJ(result: Record<string, any>): string;
    serializeCDX11(result: Record<string, any>): string;
    getField(field: string, record: WARCRecord): string | number | null | undefined;
}

export { AsyncIterReader, AsyncIterReaderOpts, BaseAsyncIterReader, CDXIndexer, Indexer, LimitReader, NoConcatInflator, StatusAndHeaders, StatusAndHeadersParser, WARCParser, WARCParserOpts, WARCRecord, WARCRecordOpts, WARCSerializer, WARCSerializerOpts, WARCType, WARC_1_0, WARC_1_1 };
