/*
Copyright 2022 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { IMyDevice } from "matrix-js-sdk/src/matrix";

export type DeviceWithVerification = IMyDevice & { isVerified: boolean | null };
export type ExtendedDeviceInfo = {
    clientName?: string;
    clientVersion?: string;
    url?: string;
};
export type ExtendedDevice = DeviceWithVerification & ExtendedDeviceInfo;
export type DevicesDictionary = Record<DeviceWithVerification['device_id'], ExtendedDevice>;

export enum DeviceSecurityVariation {
    Verified = 'Verified',
    Unverified = 'Unverified',
    Inactive = 'Inactive',
}
