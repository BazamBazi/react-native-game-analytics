import { Platfrom, NetInfo } from 'react-native';
import DeviceInfo from 'react-native-device-info';

module gameanalytics
{

    export module device
    {
        import GALogger = gameanalytics.logging.GALogger;

        export class NameValueVersion
        {
            public name:string;
            public value:string;
            public version:string;

            public constructor(name:string, value:string, version:string)
            {
                this.name = name;
                this.value = value;
                this.version = version;
            }
        }

        export class NameVersion
        {
            public name:string;
            public version:string;

            public constructor(name:string, version:string)
            {
                this.name = name;
                this.version = version;
            }
        }

        export class GADevice
        {
            private static readonly sdkWrapperVersion:string = "react-native 1.0.0";

            public static readonly buildPlatform:string = GADevice.runtimePlatformToString();
            public static readonly deviceModel:string = GADevice.getDeviceModel();
            public static readonly deviceManufacturer:string = GADevice.getDeviceManufacturer();
            public static readonly osVersion:string = GADevice.getOSVersionString();
            public static readonly browserVersion:string = GADevice.getBrowserVersionString();

            public static sdkGameEngineVersion:string;
            public static gameEngineVersion:string;
            private static connectionType:string;
            private static maxSafeInteger:number = Math.pow(2, 53) - 1;

            public static touch(): void
            {
            }

            public static getRelevantSdkVersion(): string
            {
                if(GADevice.sdkGameEngineVersion)
                {
                    return GADevice.sdkGameEngineVersion;
                }
                return GADevice.sdkWrapperVersion;
            }

            public static getConnectionType(): string
            {
                return GADevice.connectionType;
            }

            public static updateConnectionType(): void
            {
                GADevice.connectionType = "unknown";

                NetInfo.getConnectionInfo()
                    .then((connectionInfo) => {
                        GADevice.connectionType = connectionInfo.type
                    });                
            }

            private static getOSVersionString(): string
            {
                return `${Platfrom.OS} ${DeviceInfo.getSystemVersion()}`;
            }

            private static runtimePlatformToString(): string
            {
                return Platfrom.OS;
            }

            private static getBrowserVersionString(): string
            {
                var result:string = "unknown";
                return result;
            }

            private static getDeviceModel():string
            {
                var result:string = DeviceInfo.getModel();

                return result;
            }

            private static getDeviceManufacturer():string
            {
                var result:string = DeviceInfo.getBrand();

                return result;
            }
        }
    }
}
