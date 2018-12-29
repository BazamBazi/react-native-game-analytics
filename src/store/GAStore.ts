import { AsyncStorage } from 'react-native';

module gameanalytics
{
    export module store
    {
        import GALogger = gameanalytics.logging.GALogger;

        export enum EGAStoreArgsOperator
        {
            Equal,
            LessOrEqual,
            NotEqual
        }

        export enum EGAStore
        {
            Events = 0,
            Sessions = 1,
            Progression = 2
        }

		export class SyncStorage {
			private static data = {};
			private static loading = true;

			constructor()
            {
				AsyncStorage.getAllKeys().then((keys) => {
					const filteredKeys = keys.filter(k => k.includes(GAStore.KeyPrefix));
					AsyncStorage.multiGet(filteredKeys).then((data) => {
						data.forEach(SyncStorage.saveItem.bind(this));
					})
				});	
            }
            
            private static handleError(func, param) {
				let message;
				if (!param) {
					  message = func;
				}
				else {
					  message = `${func}() requires at least ${param} as its first parameter.`;
				}
				console.warn(message);
			}

			public getItem(key) {
				return SyncStorage.data[key];
			}

			public setItem(key, value)  {
				if (!key) return SyncStorage.handleError('set', 'a key');

				SyncStorage.data[key] =value;
				return AsyncStorage.setItem(key, JSON.stringify(value));
			}

			public removeItem(key) {
				if (!key) return SyncStorage.handleError('remove', 'a key');

				delete SyncStorage.data[key];
				return AsyncStorage.removeItem(key);
			}

			private static saveItem(item): void {
				let value;

				try {
					value = JSON.parse(item[1]);
				}
				catch (e) {
					[, value] = item;
				}

				SyncStorage.data[item[0]] = value;
				SyncStorage.loading = false;
			}

			public getAllKeys() {
				return Array(Object.keys(SyncStorage.data));
			}
		}

        export class GAStore
        {
            private static readonly instance:GAStore = new GAStore();
            private static readonly SyncStorage:SyncStorage = new store.SyncStorage();
            private static storageAvailable:boolean;
            private static readonly MaxNumberOfEntries:number = 2000;
            private eventsStore:Array<{[key:string]: any}> = [];
            private sessionsStore:Array<{[key:string]: any}> = [];
            private progressionStore:Array<{[key:string]: any}> = [];
            private storeItems:{[key:string]: any} = {};
            public static readonly KeyPrefix:string = "GA::";
            private static readonly EventsStoreKey:string = "ga_event";
            private static readonly SessionsStoreKey:string = "ga_session";
            private static readonly ProgressionStoreKey:string = "ga_progression";
            private static readonly ItemsStoreKey:string = "ga_items";

            private constructor()
            {
                try
                {
                    if (typeof AsyncStorage === 'object')
                    {
                        GAStore.SyncStorage.setItem('testingAsyncStorage', 'yes');
                        GAStore.SyncStorage.removeItem('testingAsyncStorage');
                        GAStore.storageAvailable = true;
                    }
                    else
                    {
                        GAStore.storageAvailable = false;
                    }
                }
                catch (e)
                {
                }

                GALogger.d("Storage is available?: " + GAStore.storageAvailable);
            }

            public static isStorageAvailable():boolean
            {
                return GAStore.storageAvailable;
            }

            public static isStoreTooLargeForEvents():boolean
            {
                return GAStore.instance.eventsStore.length + GAStore.instance.sessionsStore.length > GAStore.MaxNumberOfEntries;
            }

            public static select(store:EGAStore, args:Array<[string, EGAStoreArgsOperator, any]> = [], sort:boolean = false, maxCount:number = 0): Array<{[key:string]: any}>
            {
                var currentStore:Array<{[key:string]: any}> = GAStore.getStore(store);

                if(!currentStore)
                {
                    return null;
                }

                var result:Array<{[key:string]: any}> = [];

                for(let i = 0; i < currentStore.length; ++i)
                {
                    var entry:{[key:string]: any} = currentStore[i];

                    var add:boolean = true;
                    for(let j = 0; j < args.length; ++j)
                    {
                        var argsEntry:[string, EGAStoreArgsOperator, any] = args[j];

                        if(entry[argsEntry[0]])
                        {
                            switch(argsEntry[1])
                            {
                                case EGAStoreArgsOperator.Equal:
                                {
                                    add = entry[argsEntry[0]] == argsEntry[2];
                                }
                                break;

                                case EGAStoreArgsOperator.LessOrEqual:
                                {
                                    add = entry[argsEntry[0]] <= argsEntry[2];
                                }
                                break;

                                case EGAStoreArgsOperator.NotEqual:
                                {
                                    add = entry[argsEntry[0]] != argsEntry[2];
                                }
                                break;

                                default:
                                {
                                    add = false;
                                }
                                break;
                            }
                        }
                        else
                        {
                            add = false;
                        }

                        if(!add)
                        {
                            break;
                        }
                    }

                    if(add)
                    {
                        result.push(entry);
                    }
                }

                if(sort)
                {
                    result.sort((a:{[key:string]: any}, b:{[key:string]: any}) => {
                        return (a["client_ts"] as number) - (b["client_ts"] as number)
                    });
                }

                if(maxCount > 0 && result.length > maxCount)
                {
                    result = result.slice(0, maxCount + 1)
                }

                return result;
            }

            public static update(store:EGAStore, setArgs:Array<[string, any]>, whereArgs:Array<[string, EGAStoreArgsOperator, any]> = []): boolean
            {
                var currentStore:Array<{[key:string]: any}> = GAStore.getStore(store);

                if(!currentStore)
                {
                    return false;
                }

                for(let i = 0; i < currentStore.length; ++i)
                {
                    var entry:{[key:string]: any} = currentStore[i];

                    var update:boolean = true;
                    for(let j = 0; j < whereArgs.length; ++j)
                    {
                        var argsEntry:[string, EGAStoreArgsOperator, any] = whereArgs[j];

                        if(entry[argsEntry[0]])
                        {
                            switch(argsEntry[1])
                            {
                                case EGAStoreArgsOperator.Equal:
                                {
                                    update = entry[argsEntry[0]] == argsEntry[2];
                                }
                                break;

                                case EGAStoreArgsOperator.LessOrEqual:
                                {
                                    update = entry[argsEntry[0]] <= argsEntry[2];
                                }
                                break;

                                case EGAStoreArgsOperator.NotEqual:
                                {
                                    update = entry[argsEntry[0]] != argsEntry[2];
                                }
                                break;

                                default:
                                {
                                    update = false;
                                }
                                break;
                            }
                        }
                        else
                        {
                            update = false;
                        }

                        if(!update)
                        {
                            break;
                        }
                    }

                    if(update)
                    {
                        for(let j = 0; j < setArgs.length; ++j)
                        {
                            var setArgsEntry:[string, any] = setArgs[j];
                            entry[setArgsEntry[0]] = setArgsEntry[1];
                        }
                    }
                }

                return true;
            }

            public static delete(store:EGAStore, args:Array<[string, EGAStoreArgsOperator, any]>): void
            {
                var currentStore:Array<{[key:string]: any}> = GAStore.getStore(store);

                if(!currentStore)
                {
                    return;
                }

                for(let i = 0; i < currentStore.length; ++i)
                {
                    var entry:{[key:string]: any} = currentStore[i];

                    var del:boolean = true;
                    for(let j = 0; j < args.length; ++j)
                    {
                        var argsEntry:[string, EGAStoreArgsOperator, any] = args[j];

                        if(entry[argsEntry[0]])
                        {
                            switch(argsEntry[1])
                            {
                                case EGAStoreArgsOperator.Equal:
                                {
                                    del = entry[argsEntry[0]] == argsEntry[2];
                                }
                                break;

                                case EGAStoreArgsOperator.LessOrEqual:
                                {
                                    del = entry[argsEntry[0]] <= argsEntry[2];
                                }
                                break;

                                case EGAStoreArgsOperator.NotEqual:
                                {
                                    del = entry[argsEntry[0]] != argsEntry[2];
                                }
                                break;

                                default:
                                {
                                    del = false;
                                }
                                break;
                            }
                        }
                        else
                        {
                            del = false;
                        }

                        if(!del)
                        {
                            break;
                        }
                    }

                    if(del)
                    {
                        currentStore.splice(i, 1);
                        --i;
                    }
                }
            }

            public static insert(store:EGAStore, newEntry:{[key:string]: any}, replace:boolean = false, replaceKey:string = null): void
            {
                var currentStore:Array<{[key:string]: any}> = GAStore.getStore(store);

                if(!currentStore)
                {
                    return;
                }

                if(replace)
                {
                    if(!replaceKey)
                    {
                        return;
                    }

                    var replaced:boolean = false;

                    for(let i = 0; i < currentStore.length; ++i)
                    {
                        var entry:{[key:string]: any} = currentStore[i];

                        if(entry[replaceKey] == newEntry[replaceKey])
                        {
                            for(let s in newEntry)
                            {
                                entry[s] = newEntry[s];
                            }
                            replaced = true;
                            break;
                        }
                    }

                    if(!replaced)
                    {
                        currentStore.push(newEntry);
                    }
                }
                else
                {
                    currentStore.push(newEntry);
                }
            }

            public static save(): void
            {
                if(!GAStore.isStorageAvailable())
                {
                    GALogger.w("Storage is not available, cannot save.");
                    return;
                }

                GAStore.SyncStorage.setItem(GAStore.KeyPrefix + GAStore.EventsStoreKey, JSON.stringify(GAStore.instance.eventsStore));
                GAStore.SyncStorage.setItem(GAStore.KeyPrefix + GAStore.SessionsStoreKey, JSON.stringify(GAStore.instance.sessionsStore));
                GAStore.SyncStorage.setItem(GAStore.KeyPrefix + GAStore.ProgressionStoreKey, JSON.stringify(GAStore.instance.progressionStore));
                GAStore.SyncStorage.setItem(GAStore.KeyPrefix + GAStore.ItemsStoreKey, JSON.stringify(GAStore.instance.storeItems));
            }

            public static load(): void
            {
                if(!GAStore.isStorageAvailable())
                {
                    GALogger.w("Storage is not available, cannot load.");
                    return;
                }

                try
                {
                    GAStore.instance.eventsStore = JSON.parse(GAStore.SyncStorage.getItem(GAStore.KeyPrefix + GAStore.EventsStoreKey));

                    if(!GAStore.instance.eventsStore)
                    {
                        GAStore.instance.eventsStore = [];
                    }
                }
                catch(e)
                {
                    GALogger.w("Load failed for 'events' store. Using empty store.");
                    GAStore.instance.eventsStore = [];
                }

                try
                {
                    GAStore.instance.sessionsStore = JSON.parse(GAStore.SyncStorage.getItem(GAStore.KeyPrefix + GAStore.SessionsStoreKey));

                    if(!GAStore.instance.sessionsStore)
                    {
                        GAStore.instance.sessionsStore = [];
                    }
                }
                catch(e)
                {
                    GALogger.w("Load failed for 'sessions' store. Using empty store.");
                    GAStore.instance.sessionsStore = [];
                }

                try
                {
                    GAStore.instance.progressionStore = JSON.parse(GAStore.SyncStorage.getItem(GAStore.KeyPrefix + GAStore.ProgressionStoreKey));

                    if(!GAStore.instance.progressionStore)
                    {
                        GAStore.instance.progressionStore = [];
                    }
                }
                catch(e)
                {
                    GALogger.w("Load failed for 'progression' store. Using empty store.");
                    GAStore.instance.progressionStore = [];
                }

                try
                {
                    GAStore.instance.storeItems = JSON.parse(GAStore.SyncStorage.getItem(GAStore.KeyPrefix + GAStore.ItemsStoreKey));

                    if(!GAStore.instance.storeItems)
                    {
                        GAStore.instance.storeItems = {};
                    }
                }
                catch(e)
                {
                    GALogger.w("Load failed for 'items' store. Using empty store.");
                    GAStore.instance.progressionStore = [];
                }
            }

            public static setItem(key:string, value:string): void
            {
                var keyWithPrefix:string = GAStore.KeyPrefix + key;

                if(!value)
                {
                    if(keyWithPrefix in GAStore.instance.storeItems)
                    {
                        delete GAStore.instance.storeItems[keyWithPrefix];
                    }
                }
                else
                {
                    GAStore.instance.storeItems[keyWithPrefix] = value;
                }
            }

            public static getItem(key:string): string
            {
                var keyWithPrefix:string = GAStore.KeyPrefix + key;
                if(keyWithPrefix in GAStore.instance.storeItems)
                {
                    return GAStore.instance.storeItems[keyWithPrefix] as string;
                }
                else
                {
                    return null;
                }
            }

            private static getStore(store:EGAStore): Array<{[key:string]: any}>
            {
                switch(store)
                {
                    case EGAStore.Events:
                    {
                        return GAStore.instance.eventsStore;
                    }

                    case EGAStore.Sessions:
                    {
                        return GAStore.instance.sessionsStore;
                    }

                    case EGAStore.Progression:
                    {
                        return GAStore.instance.progressionStore;
                    }

                    default:
                    {
                        GALogger.w("GAStore.getStore(): Cannot find store: " + store);
                        return null;
                    }
                }
            }
        }
    }
}
