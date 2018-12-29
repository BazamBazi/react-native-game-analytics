declare module gameanalytics {
    enum EGAErrorSeverity {
        Undefined = 0,
        Debug = 1,
        Info = 2,
        Warning = 3,
        Error = 4,
        Critical = 5
    }
    enum EGAGender {
        Undefined = 0,
        Male = 1,
        Female = 2
    }
    enum EGAProgressionStatus {
        Undefined = 0,
        Start = 1,
        Complete = 2,
        Fail = 3
    }
    enum EGAResourceFlowType {
        Undefined = 0,
        Source = 1,
        Sink = 2
    }
    module http {
        enum EGASdkErrorType {
            Undefined = 0,
            Rejected = 1
        }
        enum EGAHTTPApiResponse {
            NoResponse = 0,
            BadResponse = 1,
            RequestTimeout = 2,
            JsonEncodeFailed = 3,
            JsonDecodeFailed = 4,
            InternalServerError = 5,
            BadRequest = 6,
            Unauthorized = 7,
            UnknownResponseCode = 8,
            Ok = 9
        }
    }
}
declare var EGAErrorSeverity: typeof gameanalytics.EGAErrorSeverity;
declare var EGAGender: typeof gameanalytics.EGAGender;
declare var EGAProgressionStatus: typeof gameanalytics.EGAProgressionStatus;
declare var EGAResourceFlowType: typeof gameanalytics.EGAResourceFlowType;
declare module gameanalytics {
    module logging {
        class GALogger {
            private static readonly instance;
            private infoLogEnabled;
            private infoLogVerboseEnabled;
            private static debugEnabled;
            private static readonly Tag;
            private constructor();
            static setInfoLog(value: boolean): void;
            static setVerboseLog(value: boolean): void;
            static i(format: string): void;
            static w(format: string): void;
            static e(format: string): void;
            static ii(format: string): void;
            static d(format: string): void;
            private sendNotificationMessage;
        }
    }
}
declare module gameanalytics {
    module utilities {
        class GAUtilities {
            static getHmac(key: string, data: string): string;
            static stringMatch(s: string, pattern: RegExp): boolean;
            static joinStringArray(v: Array<string>, delimiter: string): string;
            static stringArrayContainsString(array: Array<string>, search: string): boolean;
            private static readonly keyStr;
            static encode64(input: string): string;
            static decode64(input: string): string;
            static timeIntervalSince1970(): number;
            static createGuid(): string;
            private static s4;
        }
    }
}
declare module gameanalytics {
    module validators {
        import EGASdkErrorType = gameanalytics.http.EGASdkErrorType;
        class GAValidator {
            static validateBusinessEvent(currency: string, amount: number, cartType: string, itemType: string, itemId: string): boolean;
            static validateResourceEvent(flowType: EGAResourceFlowType, currency: string, amount: number, itemType: string, itemId: string, availableCurrencies: Array<string>, availableItemTypes: Array<string>): boolean;
            static validateProgressionEvent(progressionStatus: EGAProgressionStatus, progression01: string, progression02: string, progression03: string): boolean;
            static validateDesignEvent(eventId: string, value: number): boolean;
            static validateErrorEvent(severity: EGAErrorSeverity, message: string): boolean;
            static validateSdkErrorEvent(gameKey: string, gameSecret: string, type: EGASdkErrorType): boolean;
            static validateKeys(gameKey: string, gameSecret: string): boolean;
            static validateCurrency(currency: string): boolean;
            static validateEventPartLength(eventPart: string, allowNull: boolean): boolean;
            static validateEventPartCharacters(eventPart: string): boolean;
            static validateEventIdLength(eventId: string): boolean;
            static validateEventIdCharacters(eventId: string): boolean;
            static validateAndCleanInitRequestResponse(initResponse: {
                [key: string]: any;
            }): {
                [key: string]: any;
            };
            static validateBuild(build: string): boolean;
            static validateSdkWrapperVersion(wrapperVersion: string): boolean;
            static validateEngineVersion(engineVersion: string): boolean;
            static validateUserId(uId: string): boolean;
            static validateShortString(shortString: string, canBeEmpty: boolean): boolean;
            static validateString(s: string, canBeEmpty: boolean): boolean;
            static validateLongString(longString: string, canBeEmpty: boolean): boolean;
            static validateConnectionType(connectionType: string): boolean;
            static validateCustomDimensions(customDimensions: Array<string>): boolean;
            static validateResourceCurrencies(resourceCurrencies: Array<string>): boolean;
            static validateResourceItemTypes(resourceItemTypes: Array<string>): boolean;
            static validateDimension01(dimension01: string, availableDimensions: Array<string>): boolean;
            static validateDimension02(dimension02: string, availableDimensions: Array<string>): boolean;
            static validateDimension03(dimension03: string, availableDimensions: Array<string>): boolean;
            static validateArrayOfStrings(maxCount: number, maxStringLength: number, allowNoValues: boolean, logTag: string, arrayOfStrings: Array<string>): boolean;
            static validateFacebookId(facebookId: string): boolean;
            static validateGender(gender: any): boolean;
            static validateBirthyear(birthYear: number): boolean;
            static validateClientTs(clientTs: number): boolean;
        }
    }
}
declare module gameanalytics {
    module device {
        class NameValueVersion {
            name: string;
            value: string;
            version: string;
            constructor(name: string, value: string, version: string);
        }
        class NameVersion {
            name: string;
            version: string;
            constructor(name: string, version: string);
        }
        class GADevice {
            private static readonly sdkWrapperVersion;
            private static readonly osVersionPair;
            static readonly buildPlatform: string;
            static readonly deviceModel: string;
            static readonly deviceManufacturer: string;
            static readonly osVersion: string;
            static readonly browserVersion: string;
            static sdkGameEngineVersion: string;
            static gameEngineVersion: string;
            private static connectionType;
            private static maxSafeInteger;
            static touch(): void;
            static getRelevantSdkVersion(): string;
            static getConnectionType(): string;
            static updateConnectionType(): void;
            private static getOSVersionString;
            private static runtimePlatformToString;
            private static getBrowserVersionString;
            private static getDeviceModel;
            private static getDeviceManufacturer;
            private static matchItem;
        }
    }
}
declare module gameanalytics {
    module threading {
        class TimedBlock {
            readonly deadline: Date;
            block: () => void;
            readonly id: number;
            ignore: boolean;
            async: boolean;
            running: boolean;
            private static idCounter;
            constructor(deadline: Date);
        }
    }
}
declare module gameanalytics {
    module threading {
        interface IComparer<T> {
            compare(x: T, y: T): number;
        }
        class PriorityQueue<TItem> {
            _subQueues: {
                [key: number]: Array<TItem>;
            };
            _sortedKeys: Array<number>;
            private comparer;
            constructor(priorityComparer: IComparer<number>);
            enqueue(priority: number, item: TItem): void;
            private addQueueOfPriority;
            peek(): TItem;
            hasItems(): boolean;
            dequeue(): TItem;
            private dequeueFromHighPriorityQueue;
        }
    }
}
declare module gameanalytics {
    module store {
        enum EGAStoreArgsOperator {
            Equal = 0,
            LessOrEqual = 1,
            NotEqual = 2
        }
        enum EGAStore {
            Events = 0,
            Sessions = 1,
            Progression = 2
        }
        class GAStore {
            private static readonly instance;
            private static storageAvailable;
            private static readonly MaxNumberOfEntries;
            private eventsStore;
            private sessionsStore;
            private progressionStore;
            private storeItems;
            private static readonly KeyPrefix;
            private static readonly EventsStoreKey;
            private static readonly SessionsStoreKey;
            private static readonly ProgressionStoreKey;
            private static readonly ItemsStoreKey;
            private constructor();
            static isStorageAvailable(): boolean;
            static isStoreTooLargeForEvents(): boolean;
            static select(store: EGAStore, args?: Array<[string, EGAStoreArgsOperator, any]>, sort?: boolean, maxCount?: number): Array<{
                [key: string]: any;
            }>;
            static update(store: EGAStore, setArgs: Array<[string, any]>, whereArgs?: Array<[string, EGAStoreArgsOperator, any]>): boolean;
            static delete(store: EGAStore, args: Array<[string, EGAStoreArgsOperator, any]>): void;
            static insert(store: EGAStore, newEntry: {
                [key: string]: any;
            }, replace?: boolean, replaceKey?: string): void;
            static save(): void;
            static load(): void;
            static setItem(key: string, value: string): void;
            static getItem(key: string): string;
            private static getStore;
        }
    }
}
declare module gameanalytics {
    module state {
        class GAState {
            private static readonly CategorySdkError;
            private static readonly MAX_CUSTOM_FIELDS_COUNT;
            private static readonly MAX_CUSTOM_FIELDS_KEY_LENGTH;
            private static readonly MAX_CUSTOM_FIELDS_VALUE_STRING_LENGTH;
            static readonly instance: GAState;
            private constructor();
            private userId;
            static setUserId(userId: string): void;
            private identifier;
            static getIdentifier(): string;
            private initialized;
            static isInitialized(): boolean;
            static setInitialized(value: boolean): void;
            sessionStart: number;
            static getSessionStart(): number;
            private sessionNum;
            static getSessionNum(): number;
            private transactionNum;
            static getTransactionNum(): number;
            sessionId: string;
            static getSessionId(): string;
            private currentCustomDimension01;
            static getCurrentCustomDimension01(): string;
            private currentCustomDimension02;
            static getCurrentCustomDimension02(): string;
            private currentCustomDimension03;
            static getCurrentCustomDimension03(): string;
            private gameKey;
            static getGameKey(): string;
            private gameSecret;
            static getGameSecret(): string;
            private availableCustomDimensions01;
            static getAvailableCustomDimensions01(): Array<string>;
            static setAvailableCustomDimensions01(value: Array<string>): void;
            private availableCustomDimensions02;
            static getAvailableCustomDimensions02(): Array<string>;
            static setAvailableCustomDimensions02(value: Array<string>): void;
            private availableCustomDimensions03;
            static getAvailableCustomDimensions03(): Array<string>;
            static setAvailableCustomDimensions03(value: Array<string>): void;
            private availableResourceCurrencies;
            static getAvailableResourceCurrencies(): Array<string>;
            static setAvailableResourceCurrencies(value: Array<string>): void;
            private availableResourceItemTypes;
            static getAvailableResourceItemTypes(): Array<string>;
            static setAvailableResourceItemTypes(value: Array<string>): void;
            private build;
            static getBuild(): string;
            static setBuild(value: string): void;
            private useManualSessionHandling;
            static getUseManualSessionHandling(): boolean;
            private facebookId;
            private gender;
            private birthYear;
            sdkConfigCached: {
                [key: string]: any;
            };
            private configurations;
            private commandCenterIsReady;
            private commandCenterListeners;
            initAuthorized: boolean;
            clientServerTimeOffset: number;
            private defaultUserId;
            private setDefaultId;
            static getDefaultId(): string;
            sdkConfigDefault: {
                [key: string]: string;
            };
            sdkConfig: {
                [key: string]: any;
            };
            static getSdkConfig(): {
                [key: string]: any;
            };
            private progressionTries;
            static readonly DefaultUserIdKey: string;
            static readonly SessionNumKey: string;
            static readonly TransactionNumKey: string;
            private static readonly FacebookIdKey;
            private static readonly GenderKey;
            private static readonly BirthYearKey;
            private static readonly Dimension01Key;
            private static readonly Dimension02Key;
            private static readonly Dimension03Key;
            static readonly SdkConfigCachedKey: string;
            static isEnabled(): boolean;
            static setCustomDimension01(dimension: string): void;
            static setCustomDimension02(dimension: string): void;
            static setCustomDimension03(dimension: string): void;
            static setFacebookId(facebookId: string): void;
            static setGender(gender: EGAGender): void;
            static setBirthYear(birthYear: number): void;
            static incrementSessionNum(): void;
            static incrementTransactionNum(): void;
            static incrementProgressionTries(progression: string): void;
            static getProgressionTries(progression: string): number;
            static clearProgressionTries(progression: string): void;
            static setKeys(gameKey: string, gameSecret: string): void;
            static setManualSessionHandling(flag: boolean): void;
            static getEventAnnotations(): {
                [key: string]: any;
            };
            static getSdkErrorEventAnnotations(): {
                [key: string]: any;
            };
            static getInitAnnotations(): {
                [key: string]: any;
            };
            static getClientTsAdjusted(): number;
            static sessionIsStarted(): boolean;
            private static cacheIdentifier;
            static ensurePersistedStates(): void;
            static calculateServerTimeOffset(serverTs: number): number;
            static validateAndCleanCustomFields(fields: {
                [id: string]: any;
            }): {
                [id: string]: any;
            };
            static validateAndFixCurrentDimensions(): void;
            static getConfigurationStringValue(key: string, defaultValue: string): string;
            static isCommandCenterReady(): boolean;
            static addCommandCenterListener(listener: {
                onCommandCenterUpdated: () => void;
            }): void;
            static removeCommandCenterListener(listener: {
                onCommandCenterUpdated: () => void;
            }): void;
            static getConfigurationsContentAsString(): string;
            static populateConfigurations(sdkConfig: {
                [key: string]: any;
            }): void;
        }
    }
}
declare module gameanalytics {
    module tasks {
        import EGASdkErrorType = gameanalytics.http.EGASdkErrorType;
        class SdkErrorTask {
            private static readonly MaxCount;
            private static readonly countMap;
            static execute(url: string, type: EGASdkErrorType, payloadData: string, secretKey: string): void;
        }
    }
}
declare module gameanalytics {
    module http {
        class GAHTTPApi {
            static readonly instance: GAHTTPApi;
            private protocol;
            private hostName;
            private version;
            private baseUrl;
            private initializeUrlPath;
            private eventsUrlPath;
            private useGzip;
            private constructor();
            requestInit(callback: (response: EGAHTTPApiResponse, json: {
                [key: string]: any;
            }) => void): void;
            sendEventsInArray(eventArray: Array<{
                [key: string]: any;
            }>, requestId: string, callback: (response: EGAHTTPApiResponse, json: {
                [key: string]: any;
            }, requestId: string, eventCount: number) => void): void;
            sendSdkErrorEvent(type: EGASdkErrorType): void;
            private static sendEventInArrayRequestCallback;
            private static sendRequest;
            private static initRequestCallback;
            private createPayloadData;
            private processRequestResponse;
            private static sdkErrorTypeToString;
        }
    }
}
declare module gameanalytics {
    module events {
        class GAEvents {
            private static readonly instance;
            private static readonly CategorySessionStart;
            private static readonly CategorySessionEnd;
            private static readonly CategoryDesign;
            private static readonly CategoryBusiness;
            private static readonly CategoryProgression;
            private static readonly CategoryResource;
            private static readonly CategoryError;
            private static readonly MaxEventCount;
            private constructor();
            static addSessionStartEvent(): void;
            static addSessionEndEvent(): void;
            static addBusinessEvent(currency: string, amount: number, itemType: string, itemId: string, cartType: string, fields: {
                [id: string]: any;
            }): void;
            static addResourceEvent(flowType: EGAResourceFlowType, currency: string, amount: number, itemType: string, itemId: string, fields: {
                [id: string]: any;
            }): void;
            static addProgressionEvent(progressionStatus: EGAProgressionStatus, progression01: string, progression02: string, progression03: string, score: number, sendScore: boolean, fields: {
                [id: string]: any;
            }): void;
            static addDesignEvent(eventId: string, value: number, sendValue: boolean, fields: {
                [id: string]: any;
            }): void;
            static addErrorEvent(severity: EGAErrorSeverity, message: string, fields: {
                [id: string]: any;
            }): void;
            static processEvents(category: string, performCleanUp: boolean): void;
            private static processEventsCallback;
            private static cleanupEvents;
            private static fixMissingSessionEndEvents;
            private static addEventToStore;
            private static updateSessionStore;
            private static addDimensionsToEvent;
            private static addFieldsToEvent;
            private static resourceFlowTypeToString;
            private static progressionStatusToString;
            private static errorSeverityToString;
        }
    }
}
declare module gameanalytics {
    module threading {
        class GAThreading {
            private static readonly instance;
            readonly blocks: PriorityQueue<TimedBlock>;
            private readonly id2TimedBlockMap;
            private static runTimeoutId;
            private static readonly ThreadWaitTimeInMs;
            private static ProcessEventsIntervalInSeconds;
            private keepRunning;
            private isRunning;
            private constructor();
            static createTimedBlock(delayInSeconds?: number): TimedBlock;
            static performTaskOnGAThread(taskBlock: () => void, delayInSeconds?: number): void;
            static performTimedBlockOnGAThread(timedBlock: TimedBlock): void;
            static scheduleTimer(interval: number, callback: () => void): number;
            static getTimedBlockById(blockIdentifier: number): TimedBlock;
            static ensureEventQueueIsRunning(): void;
            static endSessionAndStopQueue(): void;
            static stopEventQueue(): void;
            static ignoreTimer(blockIdentifier: number): void;
            static setEventProcessInterval(interval: number): void;
            private addTimedBlock;
            private static run;
            private static startThread;
            private static getNextBlock;
            private static processEventQueue;
        }
    }
}
declare module gameanalytics {
    class GameAnalytics {
        private static initTimedBlockId;
        static methodMap: {
            [id: string]: (...args: any[]) => void;
        };
        static init(): void;
        static gaCommand(...args: any[]): void;
        static configureAvailableCustomDimensions01(customDimensions?: Array<string>): void;
        static configureAvailableCustomDimensions02(customDimensions?: Array<string>): void;
        static configureAvailableCustomDimensions03(customDimensions?: Array<string>): void;
        static configureAvailableResourceCurrencies(resourceCurrencies?: Array<string>): void;
        static configureAvailableResourceItemTypes(resourceItemTypes?: Array<string>): void;
        static configureBuild(build?: string): void;
        static configureSdkGameEngineVersion(sdkGameEngineVersion?: string): void;
        static configureGameEngineVersion(gameEngineVersion?: string): void;
        static configureUserId(uId?: string): void;
        static initialize(gameKey?: string, gameSecret?: string): void;
        static addBusinessEvent(currency?: string, amount?: number, itemType?: string, itemId?: string, cartType?: string): void;
        static addResourceEvent(flowType?: EGAResourceFlowType, currency?: string, amount?: number, itemType?: string, itemId?: string): void;
        static addProgressionEvent(progressionStatus?: EGAProgressionStatus, progression01?: string, progression02?: string, progression03?: string, score?: any): void;
        static addDesignEvent(eventId: string, value?: any): void;
        static addErrorEvent(severity?: EGAErrorSeverity, message?: string): void;
        static setEnabledInfoLog(flag?: boolean): void;
        static setEnabledVerboseLog(flag?: boolean): void;
        static setEnabledManualSessionHandling(flag?: boolean): void;
        static setCustomDimension01(dimension?: string): void;
        static setCustomDimension02(dimension?: string): void;
        static setCustomDimension03(dimension?: string): void;
        static setFacebookId(facebookId?: string): void;
        static setGender(gender?: EGAGender): void;
        static setBirthYear(birthYear?: number): void;
        static setEventProcessInterval(intervalInSeconds: number): void;
        static startSession(): void;
        static endSession(): void;
        static onStop(): void;
        static onResume(): void;
        static getCommandCenterValueAsString(key: string, defaultValue?: string): string;
        static isCommandCenterReady(): boolean;
        static addCommandCenterListener(listener: {
            onCommandCenterUpdated: () => void;
        }): void;
        static removeCommandCenterListener(listener: {
            onCommandCenterUpdated: () => void;
        }): void;
        static getConfigurationsContentAsString(): string;
        private static internalInitialize;
        private static newSession;
        private static startNewSessionCallback;
        private static resumeSessionAndStartQueue;
        private static isSdkReady;
    }
}
declare var GameAnalytics: typeof gameanalytics.GameAnalytics.gaCommand;
