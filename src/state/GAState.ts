module gameanalytics
{
    export module state
    {
        import GAValidator = gameanalytics.validators.GAValidator;
        import GAUtilities = gameanalytics.utilities.GAUtilities;
        import GALogger = gameanalytics.logging.GALogger;
        import GAStore = gameanalytics.store.GAStore;
        import GADevice = gameanalytics.device.GADevice;
        import EGAStore = gameanalytics.store.EGAStore;
        import EGAStoreArgsOperator = gameanalytics.store.EGAStoreArgsOperator;

        export class GAState
        {
            private static readonly CategorySdkError:string = "sdk_error";
            private static readonly MAX_CUSTOM_FIELDS_COUNT:number = 50;
            private static readonly MAX_CUSTOM_FIELDS_KEY_LENGTH:number = 64;
            private static readonly MAX_CUSTOM_FIELDS_VALUE_STRING_LENGTH:number = 256;

            public static readonly instance:GAState = new GAState();

            private constructor()
            {
            }

            private userId:string;
            public static setUserId(userId:string): void
            {
                GAState.instance.userId = userId;
                GAState.cacheIdentifier();
            }

            private identifier:string;
            public static getIdentifier(): string
            {
                return GAState.instance.identifier;
            }

            private initialized:boolean;
            public static isInitialized(): boolean
            {
                return GAState.instance.initialized;
            }
            public static setInitialized(value:boolean): void
            {
                GAState.instance.initialized = value;
            }

            public sessionStart:number;
            public static getSessionStart(): number
            {
                return GAState.instance.sessionStart;
            }

            private sessionNum:number;
            public static getSessionNum(): number
            {
                return GAState.instance.sessionNum;
            }

            private transactionNum:number;
            public static getTransactionNum(): number
            {
                return GAState.instance.transactionNum;
            }

            public sessionId:string;
            public static getSessionId(): string
            {
                return GAState.instance.sessionId;
            }

            private currentCustomDimension01:string;
            public static getCurrentCustomDimension01(): string
            {
                return GAState.instance.currentCustomDimension01;
            }

            private currentCustomDimension02:string;
            public static getCurrentCustomDimension02(): string
            {
                return GAState.instance.currentCustomDimension02;
            }

            private currentCustomDimension03:string;
            public static getCurrentCustomDimension03(): string
            {
                return GAState.instance.currentCustomDimension03;
            }

            private gameKey:string;
            public static getGameKey(): string
            {
                return GAState.instance.gameKey;
            }

            private gameSecret:string;
            public static getGameSecret(): string
            {
                return GAState.instance.gameSecret;
            }

            private availableCustomDimensions01:Array<string> = [];
            public static getAvailableCustomDimensions01(): Array<string>
            {
                return GAState.instance.availableCustomDimensions01;
            }
            public static setAvailableCustomDimensions01(value:Array<string>): void
            {
                // Validate
                if(!GAValidator.validateCustomDimensions(value))
                {
                    return;
                }
                GAState.instance.availableCustomDimensions01 = value;

                // validate current dimension values
                GAState.validateAndFixCurrentDimensions();

                GALogger.i("Set available custom01 dimension values: (" + GAUtilities.joinStringArray(value, ", ") + ")");
            }

            private availableCustomDimensions02:Array<string> = [];
            public static getAvailableCustomDimensions02(): Array<string>
            {
                return GAState.instance.availableCustomDimensions02;
            }
            public static setAvailableCustomDimensions02(value:Array<string>): void
            {
                // Validate
                if(!GAValidator.validateCustomDimensions(value))
                {
                    return;
                }
                GAState.instance.availableCustomDimensions02 = value;

                // validate current dimension values
                GAState.validateAndFixCurrentDimensions();

                GALogger.i("Set available custom02 dimension values: (" + GAUtilities.joinStringArray(value, ", ") + ")");
            }

            private availableCustomDimensions03:Array<string> = [];
            public static getAvailableCustomDimensions03(): Array<string>
            {
                return GAState.instance.availableCustomDimensions03;
            }
            public static setAvailableCustomDimensions03(value:Array<string>): void
            {
                // Validate
                if(!GAValidator.validateCustomDimensions(value))
                {
                    return;
                }
                GAState.instance.availableCustomDimensions03 = value;

                // validate current dimension values
                GAState.validateAndFixCurrentDimensions();

                GALogger.i("Set available custom03 dimension values: (" + GAUtilities.joinStringArray(value, ", ") + ")");
            }

            private availableResourceCurrencies:Array<string> = [];
            public static getAvailableResourceCurrencies(): Array<string>
            {
                return GAState.instance.availableResourceCurrencies;
            }
            public static setAvailableResourceCurrencies(value:Array<string>): void
            {
                // Validate
                if(!GAValidator.validateResourceCurrencies(value))
                {
                    return;
                }
                GAState.instance.availableResourceCurrencies = value;

                GALogger.i("Set available resource currencies: (" + GAUtilities.joinStringArray(value, ", ") + ")");
            }

            private availableResourceItemTypes:Array<string> = [];
            public static getAvailableResourceItemTypes(): Array<string>
            {
                return GAState.instance.availableResourceItemTypes;
            }
            public static setAvailableResourceItemTypes(value:Array<string>): void
            {
                // Validate
                if(!GAValidator.validateResourceItemTypes(value))
                {
                    return;
                }
                GAState.instance.availableResourceItemTypes = value;

                GALogger.i("Set available resource item types: (" + GAUtilities.joinStringArray(value, ", ") + ")");
            }

            private build:string;
            public static getBuild(): string
            {
                return GAState.instance.build;
            }
            public static setBuild(value:string): void
            {
                GAState.instance.build = value;
                GALogger.i("Set build version: " + value);
            }

            private useManualSessionHandling:boolean;
            public static getUseManualSessionHandling(): boolean
            {
                return GAState.instance.useManualSessionHandling;
            }

            private facebookId:string;
            private gender:string;
            private birthYear:number;
            public sdkConfigCached:{[key:string]: any};
            private configurations:{[key:string]: any} = {};
            private commandCenterIsReady:boolean;
            private commandCenterListeners:Array<{ onCommandCenterUpdated:() => void }> = [];
            public initAuthorized:boolean;
            public clientServerTimeOffset:number;

            private defaultUserId:string;
            private setDefaultId(value:string): void
            {
                this.defaultUserId = !value ? "" : value;
                GAState.cacheIdentifier();
            }
            public static getDefaultId(): string
            {
                return GAState.instance.defaultUserId;
            }

            public sdkConfigDefault:{[key:string]: string} = {};

            public sdkConfig:{[key:string]: any} = {};
            public static getSdkConfig(): {[key:string]: any}
            {
                {
                    var first;
                    var count:number = 0;
                    for(let json in GAState.instance.sdkConfig)
                    {
                        if(count === 0)
                        {
                            first = json;
                        }
                        ++count;
                    }

                    if(first && count > 0)
                    {
                        return GAState.instance.sdkConfig;
                    }
                }
                {
                    var first;
                    var count:number = 0;
                    for(let json in GAState.instance.sdkConfigCached)
                    {
                        if(count === 0)
                        {
                            first = json;
                        }
                        ++count;
                    }

                    if(first && count > 0)
                    {
                        return GAState.instance.sdkConfigCached;
                    }
                }

                return GAState.instance.sdkConfigDefault;
            }

            private progressionTries:{[key:string]: number} = {};
            public static readonly DefaultUserIdKey:string = "default_user_id";
            public static readonly SessionNumKey:string = "session_num";
            public static readonly TransactionNumKey:string = "transaction_num";
            private static readonly FacebookIdKey:string = "facebook_id";
            private static readonly GenderKey:string = "gender";
            private static readonly BirthYearKey:string = "birth_year";
            private static readonly Dimension01Key:string = "dimension01";
            private static readonly Dimension02Key:string = "dimension02";
            private static readonly Dimension03Key:string = "dimension03";
            public static readonly SdkConfigCachedKey:string = "sdk_config_cached";

            public static isEnabled(): boolean
            {
                var currentSdkConfig:{[key:string]: any} = GAState.getSdkConfig();

                if (currentSdkConfig["enabled"] && currentSdkConfig["enabled"] == "false")
                {
                    return false;
                }
                else if (!GAState.instance.initAuthorized)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }

            public static setCustomDimension01(dimension:string): void
            {
                GAState.instance.currentCustomDimension01 = dimension;
                GAStore.setItem(GAState.Dimension01Key, dimension);
                GALogger.i("Set custom01 dimension value: " + dimension);
            }

            public static setCustomDimension02(dimension:string): void
            {
                GAState.instance.currentCustomDimension02 = dimension;
                GAStore.setItem(GAState.Dimension02Key, dimension);
                GALogger.i("Set custom02 dimension value: " + dimension);
            }

            public static setCustomDimension03(dimension:string): void
            {
                GAState.instance.currentCustomDimension03 = dimension;
                GAStore.setItem(GAState.Dimension03Key, dimension);
                GALogger.i("Set custom03 dimension value: " + dimension);
            }

            public static setFacebookId(facebookId:string): void
            {
                GAState.instance.facebookId = facebookId;
                GAStore.setItem(GAState.FacebookIdKey, facebookId);
                GALogger.i("Set facebook id: " + facebookId);
            }

            public static setGender(gender:EGAGender): void
            {
                GAState.instance.gender = isNaN(Number(EGAGender[gender])) ? EGAGender[gender].toString().toLowerCase() : EGAGender[EGAGender[gender]].toString().toLowerCase();
                GAStore.setItem(GAState.GenderKey, GAState.instance.gender);
                GALogger.i("Set gender: " + GAState.instance.gender);
            }

            public static setBirthYear(birthYear:number): void
            {
                GAState.instance.birthYear = birthYear;
                GAStore.setItem(GAState.BirthYearKey, birthYear.toString());
                GALogger.i("Set birth year: " + birthYear);
            }

            public static incrementSessionNum(): void
            {
                var sessionNumInt:number = GAState.getSessionNum() + 1;
                GAState.instance.sessionNum = sessionNumInt;
            }

            public static incrementTransactionNum(): void
            {
                var transactionNumInt:number = GAState.getTransactionNum() + 1;
                GAState.instance.transactionNum = transactionNumInt;
            }

            public static incrementProgressionTries(progression:string): void
            {
                var tries:number = GAState.getProgressionTries(progression) + 1;
                GAState.instance.progressionTries[progression] = tries;

                // Persist
                var values:{[key:string]: any} = {};
                values["progression"] = progression;
                values["tries"] = tries;
                GAStore.insert(EGAStore.Progression, values, true, "progression");
            }

            public static getProgressionTries(progression:string): number
            {
                if(progression in GAState.instance.progressionTries)
                {
                    return GAState.instance.progressionTries[progression];
                }
                else
                {
                    return 0;
                }
            }

            public static clearProgressionTries(progression:string): void
            {
                if(progression in GAState.instance.progressionTries)
                {
                    delete GAState.instance.progressionTries[progression];
                }

                // Delete
                var parms:Array<[string, EGAStoreArgsOperator, string]> = [];
                parms.push(["progression", EGAStoreArgsOperator.Equal, progression]);
                GAStore.delete(EGAStore.Progression, parms);
            }

            public static setKeys(gameKey:string, gameSecret:string): void
            {
                GAState.instance.gameKey = gameKey;
                GAState.instance.gameSecret = gameSecret;
            }

            public static setManualSessionHandling(flag:boolean): void
            {
                GAState.instance.useManualSessionHandling = flag;
                GALogger.i("Use manual session handling: " + flag);
            }

            public static getEventAnnotations(): {[key:string]: any}
            {
                var annotations:{[key:string]: any} = {};

                // ---- REQUIRED ---- //

                // collector event API version
                annotations["v"] = 2;
                // User identifier
                annotations["user_id"] = GAState.instance.identifier;

                // Client Timestamp (the adjusted timestamp)
                annotations["client_ts"] = GAState.getClientTsAdjusted();
                // SDK version
                annotations["sdk_version"] = GADevice.getRelevantSdkVersion();
                // Operation system version
                annotations["os_version"] = GADevice.osVersion;
                // Device make (hardcoded to apple)
                annotations["manufacturer"] = GADevice.deviceManufacturer;
                // Device version
                annotations["device"] = GADevice.deviceModel;
                // Browser version
                annotations["browser_version"] = GADevice.browserVersion;
                // Platform (operating system)
                annotations["platform"] = GADevice.buildPlatform;
                // Session identifier
                annotations["session_id"] = GAState.instance.sessionId;
                // Session number
                annotations[GAState.SessionNumKey] = GAState.instance.sessionNum;

                // type of connection the user is currently on (add if valid)
                var connection_type:string = GADevice.getConnectionType();
                if (GAValidator.validateConnectionType(connection_type))
                {
                    annotations["connection_type"] = connection_type;
                }

                if (GADevice.gameEngineVersion)
                {
                    annotations["engine_version"] = GADevice.gameEngineVersion;
                }

                // ---- CONDITIONAL ---- //

                // App build version (use if not nil)
                if (GAState.instance.build)
                {
                    annotations["build"] = GAState.instance.build;
                }

                // ---- OPTIONAL cross-session ---- //

                // facebook id (optional)
                if (GAState.instance.facebookId)
                {
                    annotations[GAState.FacebookIdKey] = GAState.instance.facebookId;
                }
                // gender (optional)
                if (GAState.instance.gender)
                {
                    annotations[GAState.GenderKey] = GAState.instance.gender;
                }
                // birth_year (optional)
                if (GAState.instance.birthYear != 0)
                {
                    annotations[GAState.BirthYearKey] = GAState.instance.birthYear;
                }

                return annotations;
            }

            public static getSdkErrorEventAnnotations(): {[key:string]: any}
            {
                var annotations:{[key:string]: any} = {};

                // ---- REQUIRED ---- //

                // collector event API version
                annotations["v"] = 2;

                // Category
                annotations["category"] = GAState.CategorySdkError;
                // SDK version
                annotations["sdk_version"] = GADevice.getRelevantSdkVersion();
                // Operation system version
                annotations["os_version"] = GADevice.osVersion;
                // Device make (hardcoded to apple)
                annotations["manufacturer"] = GADevice.deviceManufacturer;
                // Device version
                annotations["device"] = GADevice.deviceModel;
                // Platform (operating system)
                annotations["platform"] = GADevice.buildPlatform;

                // type of connection the user is currently on (add if valid)
                var connection_type:string = GADevice.getConnectionType();
                if (GAValidator.validateConnectionType(connection_type))
                {
                    annotations["connection_type"] = connection_type;
                }

                if (GADevice.gameEngineVersion)
                {
                    annotations["engine_version"] = GADevice.gameEngineVersion;
                }

                return annotations;
            }

            public static getInitAnnotations(): {[key:string]: any}
            {
                var initAnnotations:{[key:string]: any} = {};

                initAnnotations["user_id"] = GAState.getIdentifier();

                // SDK version
                initAnnotations["sdk_version"] = GADevice.getRelevantSdkVersion();
                // Operation system version
                initAnnotations["os_version"] = GADevice.osVersion;

                // Platform (operating system)
                initAnnotations["platform"] = GADevice.buildPlatform;

                return initAnnotations;
            }

            public static getClientTsAdjusted(): number
            {
                var clientTs:number = GAUtilities.timeIntervalSince1970();
                var clientTsAdjustedInteger:number = clientTs + GAState.instance.clientServerTimeOffset;

                if(GAValidator.validateClientTs(clientTsAdjustedInteger))
                {
                    return clientTsAdjustedInteger;
                }
                else
                {
                    return clientTs;
                }
            }

            public static sessionIsStarted(): boolean
            {
                return GAState.instance.sessionStart != 0;
            }

            private static cacheIdentifier(): void
            {
                if(GAState.instance.userId)
                {
                    GAState.instance.identifier = GAState.instance.userId;
                }
                else if(GAState.instance.defaultUserId)
                {
                    GAState.instance.identifier = GAState.instance.defaultUserId;
                }

                GALogger.d("identifier, {clean:" + GAState.instance.identifier + "}");
            }

            public static ensurePersistedStates(): void
            {
                // get and extract stored states
                if(GAStore.isStorageAvailable())
                {
                    GAStore.load();
                }

                // insert into GAState instance
                var instance:GAState = GAState.instance;

                instance.setDefaultId(GAStore.getItem(GAState.DefaultUserIdKey) != null ? GAStore.getItem(GAState.DefaultUserIdKey) : GAUtilities.createGuid());

                instance.sessionNum = GAStore.getItem(GAState.SessionNumKey) != null ? Number(GAStore.getItem(GAState.SessionNumKey)) : 0.0;

                instance.transactionNum = GAStore.getItem(GAState.TransactionNumKey) != null ? Number(GAStore.getItem(GAState.TransactionNumKey)) : 0.0;

                // restore cross session user values
                if(instance.facebookId)
                {
                    GAStore.setItem(GAState.FacebookIdKey, instance.facebookId);
                }
                else
                {
                    instance.facebookId = GAStore.getItem(GAState.FacebookIdKey) != null ? GAStore.getItem(GAState.FacebookIdKey) : "";
                    if(instance.facebookId)
                    {
                        GALogger.d("facebookid found in DB: " + instance.facebookId);
                    }
                }

                if(instance.gender)
                {
                    GAStore.setItem(GAState.GenderKey, instance.gender);
                }
                else
                {
                    instance.gender = GAStore.getItem(GAState.GenderKey) != null ? GAStore.getItem(GAState.GenderKey) : "";
                    if(instance.gender)
                    {
                        GALogger.d("gender found in DB: " + instance.gender);
                    }
                }

                if(instance.birthYear && instance.birthYear != 0)
                {
                    GAStore.setItem(GAState.BirthYearKey, instance.birthYear.toString());
                }
                else
                {
                    instance.birthYear = GAStore.getItem(GAState.BirthYearKey) != null ? Number(GAStore.getItem(GAState.BirthYearKey)) : 0;
                    if(instance.birthYear != 0)
                    {
                        GALogger.d("birthYear found in DB: " + instance.birthYear);
                    }
                }

                // restore dimension settings
                if(instance.currentCustomDimension01)
                {
                    GAStore.setItem(GAState.Dimension01Key, instance.currentCustomDimension01);
                }
                else
                {
                    instance.currentCustomDimension01 = GAStore.getItem(GAState.Dimension01Key) != null ? GAStore.getItem(GAState.Dimension01Key) : "";
                    if(instance.currentCustomDimension01)
                    {
                        GALogger.d("Dimension01 found in cache: " + instance.currentCustomDimension01);
                    }
                }

                if(instance.currentCustomDimension02)
                {
                    GAStore.setItem(GAState.Dimension02Key, instance.currentCustomDimension02);
                }
                else
                {
                    instance.currentCustomDimension02 = GAStore.getItem(GAState.Dimension02Key) != null ? GAStore.getItem(GAState.Dimension02Key) : "";
                    if(instance.currentCustomDimension02)
                    {
                        GALogger.d("Dimension02 found in cache: " + instance.currentCustomDimension02);
                    }
                }

                if(instance.currentCustomDimension03)
                {
                    GAStore.setItem(GAState.Dimension03Key, instance.currentCustomDimension03);
                }
                else
                {
                    instance.currentCustomDimension03 = GAStore.getItem(GAState.Dimension03Key) != null ? GAStore.getItem(GAState.Dimension03Key) : "";
                    if(instance.currentCustomDimension03)
                    {
                        GALogger.d("Dimension03 found in cache: " + instance.currentCustomDimension03);
                    }
                }

                // get cached init call values
                var sdkConfigCachedString:string = GAStore.getItem(GAState.SdkConfigCachedKey) != null ? GAStore.getItem(GAState.SdkConfigCachedKey) : "";
                if (sdkConfigCachedString)
                {
                    // decode JSON
                    var sdkConfigCached = JSON.parse(GAUtilities.decode64(sdkConfigCachedString));
                    if (sdkConfigCached)
                    {
                        instance.sdkConfigCached = sdkConfigCached;
                    }
                }

                var results_ga_progression:Array<{[key:string]: any}> = GAStore.select(EGAStore.Progression);

                if (results_ga_progression)
                {
                    for (let i = 0; i < results_ga_progression.length; ++i)
                    {
                        var result:{[key:string]: any} = results_ga_progression[i];
                        if (result)
                        {
                            instance.progressionTries[result["progression"] as string] = result["tries"] as number;
                        }
                    }
                }
            }

            public static calculateServerTimeOffset(serverTs:number): number
            {
                var clientTs:number = GAUtilities.timeIntervalSince1970();
                return serverTs - clientTs;
            }

            public static validateAndCleanCustomFields(fields:{[id:string]: any}): {[id:string]: any}
            {
                var result:{[id:string]: any} = {};

                if(fields)
                {
                    var count:number = 0;

                    for(var key in fields)
                    {
                        var value:any = fields[key];

                        if(!key || !value)
                        {
                            GALogger.w("validateAndCleanCustomFields: entry with key=" + key + ", value=" + value + " has been omitted because its key or value is null");
                        }
                        else if(count < GAState.MAX_CUSTOM_FIELDS_COUNT)
                        {
                            var regex = new RegExp("^[a-zA-Z0-9_]{1," + GAState.MAX_CUSTOM_FIELDS_KEY_LENGTH + "}$");
                            if(GAUtilities.stringMatch(key, regex))
                            {
                                var type = typeof value;
                                if(type === "string" || value instanceof String)
                                {
                                    var valueAsString:string = value as string;

                                    if(valueAsString.length <= GAState.MAX_CUSTOM_FIELDS_VALUE_STRING_LENGTH && valueAsString.length > 0)
                                    {
                                        result[key] = valueAsString;
                                        ++count;
                                    }
                                    else
                                    {
                                        GALogger.w("validateAndCleanCustomFields: entry with key=" + key + ", value=" + value + " has been omitted because its value is an empty string or exceeds the max number of characters (" + GAState.MAX_CUSTOM_FIELDS_VALUE_STRING_LENGTH + ")");
                                    }
                                }
                                else if(type === "number" || value instanceof Number)
                                {
                                    var valueAsNumber:number = value as number;

                                    result[key] = valueAsNumber;
                                    ++count;
                                }
                                else
                                {
                                    GALogger.w("validateAndCleanCustomFields: entry with key=" + key + ", value=" + value + " has been omitted because its value is not a string or number");
                                }
                            }
                            else
                            {
                                GALogger.w("validateAndCleanCustomFields: entry with key=" + key + ", value=" + value + " has been omitted because its key contains illegal character, is empty or exceeds the max number of characters (" + GAState.MAX_CUSTOM_FIELDS_KEY_LENGTH + ")");
                            }
                        }
                        else
                        {
                            GALogger.w("validateAndCleanCustomFields: entry with key=" + key + ", value=" + value + " has been omitted because it exceeds the max number of custom fields (" + GAState.MAX_CUSTOM_FIELDS_COUNT + ")");
                        }
                    }
                }

                return result;
            }

            public static validateAndFixCurrentDimensions(): void
            {
                // validate that there are no current dimension01 not in list
                if (!GAValidator.validateDimension01(GAState.getCurrentCustomDimension01(), GAState.getAvailableCustomDimensions01()))
                {
                    GALogger.d("Invalid dimension01 found in variable. Setting to nil. Invalid dimension: " + GAState.getCurrentCustomDimension01());
                    GAState.setCustomDimension01("");
                }
                // validate that there are no current dimension02 not in list
                if (!GAValidator.validateDimension02(GAState.getCurrentCustomDimension02(), GAState.getAvailableCustomDimensions02()))
                {
                    GALogger.d("Invalid dimension02 found in variable. Setting to nil. Invalid dimension: " + GAState.getCurrentCustomDimension02());
                    GAState.setCustomDimension02("");
                }
                // validate that there are no current dimension03 not in list
                if (!GAValidator.validateDimension03(GAState.getCurrentCustomDimension03(), GAState.getAvailableCustomDimensions03()))
                {
                    GALogger.d("Invalid dimension03 found in variable. Setting to nil. Invalid dimension: " + GAState.getCurrentCustomDimension03());
                    GAState.setCustomDimension03("");
                }
            }

            public static getConfigurationStringValue(key:string, defaultValue:string):string
            {
                if(GAState.instance.configurations[key])
                {
                    return GAState.instance.configurations[key].toString();
                }
                else
                {
                    return defaultValue;
                }
            }

            public static isCommandCenterReady():boolean
            {
                return GAState.instance.commandCenterIsReady;
            }

            public static addCommandCenterListener(listener:{ onCommandCenterUpdated:() => void }):void
            {
                var index = GAState.instance.commandCenterListeners.indexOf(listener);
                if(GAState.instance.commandCenterListeners.indexOf(listener) < 0)
                {
                    GAState.instance.commandCenterListeners.push(listener);
                }
            }

            public static removeCommandCenterListener(listener:{ onCommandCenterUpdated:() => void }):void
            {
                var index = GAState.instance.commandCenterListeners.indexOf(listener);
                if(index > -1)
                {
                    GAState.instance.commandCenterListeners.splice(index, 1);
                }
            }

            public static getConfigurationsContentAsString():string
            {
                return JSON.stringify(GAState.instance.configurations);
            }

            public static populateConfigurations(sdkConfig:{[key:string]: any}):void
            {
                var configurations:any[] = sdkConfig["configurations"];
                
                if(configurations)
                {
                    for(let i = 0; i < configurations.length; ++i)
                    {
                        var configuration:{[key:string]: any} = configurations[i];

                        if(configuration)
                        {
                            var key:string = configuration["key"];
                            var value:any = configuration["value"];
                            var start_ts:number = configuration["start"] ? configuration["start"] : Number.MIN_VALUE;
                            var end_ts:number = configuration["end"] ? configuration["end"] : Number.MAX_VALUE;

                            var client_ts_adjusted:number = GAState.getClientTsAdjusted();

                            if(key && value && client_ts_adjusted > start_ts && client_ts_adjusted < end_ts)
                            {
                                GAState.instance.configurations[key] = value;
                                GALogger.d("configuration added: " + JSON.stringify(configuration));
                            }
                        }
                    }
                }
                GAState.instance.commandCenterIsReady = true;

                var listeners:Array<{ onCommandCenterUpdated:() => void }> = GAState.instance.commandCenterListeners;

                for(let i = 0; i < listeners.length; ++i)
                {
                    if(listeners[i])
                    {
                        listeners[i].onCommandCenterUpdated();
                    }
                }
            }
        }
    }
}
