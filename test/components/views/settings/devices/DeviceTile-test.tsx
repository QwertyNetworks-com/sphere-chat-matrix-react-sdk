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

import React from "react";
import { render } from "@testing-library/react";
import { IMyDevice } from "matrix-js-sdk/src/matrix";

import DeviceTile from "../../../../../src/components/views/settings/devices/DeviceTile";

describe("<DeviceTile />", () => {
    const defaultProps = {
        device: {
            device_id: "123",
            isVerified: false,
        },
    };
    const getComponent = (props = {}) => (
        <DeviceTile {...defaultProps} {...props} />
    );
    // 14.03.2022 16:15
    const now = 1647270879403;

    jest.useFakeTimers();

    beforeEach(() => {
        jest.setSystemTime(now);
    });

    it("renders a device with no metadata", () => {
        const { container } = render(getComponent());
        expect(container).toMatchSnapshot();
    });

    it("renders a verified device with no metadata", () => {
        const { container } = render(getComponent());
        expect(container).toMatchSnapshot();
    });

    it("renders display name with a tooltip", () => {
        const device: IMyDevice = {
            device_id: "123",
            display_name: "My device",
        };
        const { container } = render(getComponent({ device }));
        expect(container).toMatchSnapshot();
    });

    it("renders last seen ip metadata", () => {
        const device: IMyDevice = {
            device_id: "123",
            display_name: "My device",
            last_seen_ip: "1.2.3.4",
        };
        const { getByTestId } = render(getComponent({ device }));
        expect(getByTestId("device-metadata-lastSeenIp").textContent).toEqual(device.last_seen_ip);
    });

    it("separates metadata with a dot", () => {
        const device: IMyDevice = {
            device_id: "123",
            last_seen_ip: "1.2.3.4",
            last_seen_ts: now - 60000,
        };
        const { container } = render(getComponent({ device }));
        expect(container).toMatchSnapshot();
    });

    describe("Last activity", () => {
        const MS_DAY = 24 * 60 * 60 * 1000;
        it("renders with day of week and time when last activity is less than 6 days ago", () => {
            const device: IMyDevice = {
                device_id: "123",
                last_seen_ip: "1.2.3.4",
                last_seen_ts: now - (MS_DAY * 3),
            };
            const { getByTestId } = render(getComponent({ device }));
            expect(getByTestId("device-metadata-lastActivity").textContent).toEqual("Last activity Fri 15:14");
        });

        it("renders with month and date when last activity is more than 6 days ago", () => {
            const device: IMyDevice = {
                device_id: "123",
                last_seen_ip: "1.2.3.4",
                last_seen_ts: now - (MS_DAY * 8),
            };
            const { getByTestId } = render(getComponent({ device }));
            expect(getByTestId("device-metadata-lastActivity").textContent).toEqual("Last activity Mar 6");
        });

        it("renders with month, date, year when activity is in a different calendar year", () => {
            const device: IMyDevice = {
                device_id: "123",
                last_seen_ip: "1.2.3.4",
                last_seen_ts: new Date("2021-12-29").getTime(),
            };
            const { getByTestId } = render(getComponent({ device }));
            expect(getByTestId("device-metadata-lastActivity").textContent).toEqual("Last activity Dec 29, 2021");
        });

        it("renders with inactive notice when last activity was more than 90 days ago", () => {
            const device: IMyDevice = {
                device_id: "123",
                last_seen_ip: "1.2.3.4",
                last_seen_ts: now - (MS_DAY * 100),
            };
            const { getByTestId, queryByTestId } = render(getComponent({ device }));
            expect(getByTestId("device-metadata-inactive").textContent).toEqual("Inactive for 90+ days (Dec 4, 2021)");
            // last activity and verification not shown when inactive
            expect(queryByTestId("device-metadata-lastActivity")).toBeFalsy();
            expect(queryByTestId("device-metadata-verificationStatus")).toBeFalsy();
        });
    });
});
